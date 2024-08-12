import { _decorator, Camera, Component, director, find, game, instantiate, macro, Node, Prefab, Vec3, UITransform, Canvas, geometry, quat, Quat, screen } from 'cc';
import { Ball } from './Ball';
import { Collision } from '../../../scripts/physics/collision';
import { TableGeometry } from './TableGeometry';
import { yy } from '../../../../../../yy';
import { Cushion } from './Cushion';
import { bounceHan, bounceHanBlend, cueToSpin } from '../../../scripts/physics/physics';
import { BilliardData } from '../../../data/BilliardData';
import { R } from '../../../scripts/physics/constants';
import { Outcome } from './Outcome';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { Knuckle } from '../../../scripts/physics/knuckle';
import { Pocket } from '../../../scripts/physics/pocket';
import { PocketGeometry } from '../../../scripts/pocketgeometry';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { RaySphereCollision } from '../../../scripts/physics/component/RaySphereCollision';
import { track } from '../../../scripts/physics/track';
import { BilliardConst } from '../../../config/BilliardConst';
import { unitAtAngle } from '../../../scripts/utils';

const { ccclass, property } = _decorator;

interface Pair {
    a: Ball
    b: Ball
  }

@ccclass('Table')
export class Table extends BaseCommonScript {
    @property(Node)
    nodeBalls: Node = null;
    @property(Prefab)
    prefabBall: Prefab = null;

    balls:Ball[];
    pairs: Pair[]; // 球对
    outcome: Outcome[] = [];
    cushionModel = bounceHan
    cueBall:Ball = null;

    shotBall: Ball = null;

    readonly fixedTimeStep = 1.0 / 256.0;// 物理模拟的固定时间步长


    public register_event(): void {
      // 注册指定的监听方法，格式如下
      this.event_func_map = {
          [yy.Event_Name.billiard_hit]: "hit",
          [yy.System_Event.Screen_Size_Changed]: "onScreenSizeChanged",
      };
      super.register_event();
    }

    public on_init(): void {
      BilliardManager.instance.setTable(this);

      this.onScreenSizeChanged();
    }


    initTable() {
      this.initialiseBalls(director.getScene().getChildByPath("p_billiard_3d/NodeBalls").getComponentsInChildren(Ball));
      this.cueBall = this.balls[0];//this.balls.find(ball => ball.node.name === "CueBall");

      this.unschedule(this.loopUpdate);
      this.schedule(this.loopUpdate, 0); 
    }


    decimal: number = 0;
    // loopUpdate  fixedUpdate 会在所有update之后调用
    loopUpdate(dt: number) {
      let tmp = dt/this.fixedTimeStep + this.decimal;
      let loopTimes = Math.floor(tmp)
      this.decimal = tmp - loopTimes;
      // this.records[loopTimes]++;
      // yy.log.w("loopUpdate", this.records);
      for (let i = 0; i < loopTimes; i++) {
        this.fixedUpdate(dt);
      }

  
    }
    // 模拟物理
    fixedUpdate(dt: number) {
      this.advance(dt);
    }

    initialiseBalls(balls: Ball[]) {
        this.balls = balls
        this.pairs = []
        for (let a = 0; a < balls.length; a++) {
          for (let b = 0; b < balls.length; b++) {
            if (a < b) {
              this.pairs.push({ a: balls[a], b: balls[b] })
            }
          }
        }
    }

    advance(dt: number) {
        let depth = 0
        while (!this.prepareAdvanceAll(this.fixedTimeStep)) {
          if (depth++ > 100) {
            throw new Error("Depth exceeded resolving collisions")
          }
        }
        this.balls.forEach((a) => {
          a.fixedUpdate(this.fixedTimeStep, dt)
        })
    }
  /**
   * Returns true if all balls can advance by t without collision
   *
   */
  prepareAdvanceAll(t: number) {
    return (
      this.pairs.every((pair) => this.prepareAdvancePair(pair.a, pair.b, t)) &&
      this.balls.every((ball) => this.prepareAdvanceToCushions(ball, t))
    )
  }

  /**
   * Returns true if a pair of balls can advance by t without any collision.
   * If there is a collision, adjust velocity appropriately.
   *
   */
  private prepareAdvancePair(a: Ball, b: Ball, t: number) {
    if (Collision.willCollide(a, b, t)) {
      const incidentSpeed = Collision.collide(a, b)
      this.outcome.push(Outcome.collision(a, b, incidentSpeed))
      BilliardTools.instance.playSoundBallCollision();
      return false
    }
    return true
  }

  /**
   * Returns true if ball can advance by t without hitting cushion, knuckle or pocket.
   * If there is a collision, adjust velocity appropriately.
   *
   */
  private prepareAdvanceToCushions(a: Ball, t: number): boolean {
    if (!a.onTable()) {
      return true
    }
    const futurePosition = a.futurePosition(t)
    if (
      Math.abs(futurePosition.y) < TableGeometry.tableY &&
      Math.abs(futurePosition.x) < TableGeometry.tableX
    ) {
      return true
    }

    const incidentSpeed = Cushion.bounceAny(
      a,
      t,
      TableGeometry.hasPockets,
      this.cushionModel
    )
    if (incidentSpeed) {
      this.outcome.push(Outcome.cushion(a, incidentSpeed))
      return false
    }

    const k = Knuckle.findBouncing(a, t)
    if (k) {
      const knuckleIncidentSpeed = k.bounce(a)
      this.outcome.push(Outcome.cushion(a, knuckleIncidentSpeed))
      return false
    }
    const p = Pocket.findPocket(PocketGeometry.pocketCenters, a, t)
    if (p) {
      const pocketIncidentSpeed = p.fall(a, t)
      this.outcome.push(Outcome.pot(a, pocketIncidentSpeed))
      BilliardTools.instance.playSoundBallInPocket();
      BilliardManager.instance.getView().spinePockets[p.id].active = true;
      return false
    }

    return true
  }

  allStationary() {
    return this.balls.every((b) => !b.inMotion())
  }
  
  allMotingNotTuring() {
    return this.balls.every((b) => !b.inMotingNotTuring())
  }

  inPockets(): number {
    return this.balls.reduce((acc, b) => (b.onTable() ? acc : acc + 1), 0)
  }

  recentlyBall() {
    let lengths = [];
    let balls = this.getOnTableBalls();
    for (let i = 1; i < balls.length; i++) {
      lengths.push({ squared: this.cueBall.pos.distanceToSquared(balls[i].pos), ball: balls[i] });
    }
    if (lengths.length > 0) {
      lengths.sort((a, b) => a.squared - b.squared);
      return lengths[0].ball;
    }
    else {
      return null;
    }
  }

  getOnTableBalls() {
    return this.balls.filter((b) => b.onTable());
  }

  getInPocketBalls() {
    return this.balls.filter((b) => !b.onTable());
  }

  hit() {
    this.outcome = [
      Outcome.hit(this.cueBall, BilliardData.instance.getPower())
    ];

    let billiardData = BilliardData.instance;
    this.cueBall.setSliding();
    this.cueBall.vel.copy(unitAtAngle(billiardData.getAngle()).multiplyScalar(billiardData.getPower()));
    this.cueBall.rvel.copy(cueToSpin(billiardData.getOffset(), this.cueBall.vel));
    if (billiardData.getPower() < 40) {
        BilliardTools.instance.playSoundHitWeak()
    }   
    else {
        BilliardTools.instance.playSoundHitStrong();
    }
  }

  // 8球三角摆法
  prepareBalls(startPos: Vec3, isStart: boolean = true) { 
    let iBalls = BilliardData.instance.getStartBalls(); // 8球，球的总数量 16个
    for(let i = 0; i < iBalls.length; ++i) {
        let ball = instantiate(this.prefabBall).getComponent(Ball);
        let data = iBalls[i];
        this.nodeBalls.addChild(ball.node);

        if (data.val === 0) {
          ball.getComponent(RaySphereCollision).destroy();
        }
        ball.updatePosImmediately(new Vec3(data.position.x/BilliardConst.multiple, data.position.y/BilliardConst.multiple, 0));
        // yy.log.w(ball.name, data.rotation.x/BilliardConst.multiple, data.rotation.y/BilliardConst.multiple, data.rotation.z/BilliardConst.multiple, data.rotation.w/BilliardConst.multiple)
        if (isStart) {
          const quaternion = ball.ballMesh.node.getRotation();
          // 生成随机的旋转轴
          const axis = new Vec3( data.rotation.x/BilliardConst.multiple,  data.rotation.y/BilliardConst.multiple, data.rotation.z/BilliardConst.multiple).normalize();//new Vec3(Math.random(), Math.random(), Math.random()).normalize();//
          // 生成随机的旋转角度（弧度）
          const angle = data.rotation.w/BilliardConst.multiple * Math.PI * 2; //Math.random() * Math.PI * 2;//
          // 根据旋转轴和角度创建四元数
          Quat.fromAxisAngle(quaternion, axis, angle);
          // 将四元数应用到节点的旋转
          ball.ballMesh.node.rotation = quaternion;
        }
    }
  }

  protected update(dt: number): void {
    track.updateInTrack(dt);
  }


  isValidFreeBall() {
    let length = 4 * R * R;
    for(let i = 1; i < this.balls.length; i++){
      if((this.cueBall.pos.distanceToSquared(this.balls[i].pos) < length)) {
        return false;
      }
    }
    return true
  }


  onSetServiceData(result: protoBilliard.IResult) {
    result.balls.forEach((b, i)=> {
      let ball = this.balls[b.val];
      ball.setStationaryByService();
      ball.updatePosImmediately(new Vec3(b.position.x/BilliardConst.multiple, b.position.y/BilliardConst.multiple, 0));
      ball.setRotation(b.rotation.x/BilliardConst.multiple, b.rotation.y/BilliardConst.multiple, b.rotation.z/BilliardConst.multiple, b.rotation.w/BilliardConst.multiple);
    });

    result.potBalls.forEach((val, i)=> {
      let ball = this.balls[val];
      if (ball.onTable()) {
          track.setInTrack(ball);
      }
    });
  }

  setBallsRotation(balls: protoBilliard.IBall[], type: number) {
    const rotations = {x: 70711, y: 0, z: 0, w: 70711};
    balls.forEach(b => {
      let ball = this.balls[b.val];
      if (ball.onTable()) {
        if (type === 1){ // 开球初始数据通过服务器随机4元素设置旋转
          const quaternion = ball.ballMesh.node.getRotation();
          const axis = new Vec3(b.rotation.x/BilliardConst.multiple,  b.rotation.y/BilliardConst.multiple, b.rotation.z/BilliardConst.multiple).normalize();
          const angle = b.rotation.w/BilliardConst.multiple * Math.PI * 2; //Math.random() * Math.PI * 2;//
          Quat.fromAxisAngle(quaternion, axis, angle);
          ball.ballMesh.node.rotation = quaternion;
        }
        else {
          ball.setRotation(b.rotation.x/BilliardConst.multiple, b.rotation.y/BilliardConst.multiple, b.rotation.z/BilliardConst.multiple, b.rotation.w/BilliardConst.multiple);
        }

      }
    });
  }


  clearData() {
    this.nodeBalls.removeAllChildren();
    track.clear();
  }

  // 适配小于16:9 时屏幕尺寸
  onScreenSizeChanged() {
    const camera3d = BilliardManager.instance.camera3d;
    const ratio = 16/9;
    const aspectRatio = screen.windowSize.width / screen.windowSize.height;
    const oHeight = 1.05; // 原有16:9时尺寸
    const rHeight = screen.windowSize.width / ratio;
    // yy.log.w("onScreenSizeChange", screen.windowSize,  camera3d.orthoHeight, rHeight);
    const xs = screen.windowSize.height / rHeight;
    if (ratio > aspectRatio) {
      camera3d.orthoHeight = xs * oHeight;
    }
    else {
      camera3d.orthoHeight = oHeight;
    }
}

}


