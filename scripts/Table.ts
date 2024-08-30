import { _decorator, Camera, Component, director, find, game, instantiate, macro, Node, Prefab, Vec3, UITransform, Canvas, geometry, quat, Quat, screen } from 'cc';
import { Collision } from '../../../../games/casual_games/billiard/scripts/physics/collision';
import { yy } from '../../../../yy';
import { Cushion } from '../../../../games/casual_games/billiard/scripts/physics/Cushion';
import { bounceHan, bounceHanBlend, cueToSpin } from '../../../../games/casual_games/billiard/scripts/physics/physics';
import { BilliardData } from '../../../../games/casual_games/billiard/data/BilliardData';
import { R } from '../../../../games/casual_games/billiard/scripts/physics/constants';
import { Outcome } from '../../../../games/casual_games/billiard/scripts/physics/Outcome';
import { BaseCommonInstance, BaseCommonScript } from '../../../../main/base/BaseCommonScript';
import { Knuckle } from '../../../../games/casual_games/billiard/scripts/physics/knuckle';
import { Pocket } from '../../../../games/casual_games/billiard/scripts/physics/pocket';
import { BilliardManager } from './BilliardManager';
import { RaySphereCollision } from '../../../../games/casual_games/billiard/scripts/physics/component/RaySphereCollision';
import { track } from '../../../../games/casual_games/billiard/scripts/physics/track';
import { BilliardConst } from '../../../../games/casual_games/billiard/config/BilliardConst';
import { unitAtAngle } from './utils';
import { TableGeometry } from '../../../../games/casual_games/billiard/scripts/physics/TableGeometry';
import { PocketGeometry } from '../../../../games/casual_games/billiard/scripts/physics/pocketgeometry';
import { BilliardBall } from '../../../../games/casual_games/billiard/module/billiard_table/scripts/BilliardBall';
import { Ball } from './Ball';
import { BilliardTools } from './BilliardTools';

interface Pair {
    a: Ball
    b: Ball
  }

export class Table extends BaseCommonInstance {
    balls:Ball[] = [];
    pairs: Pair[]; // 球对
    outcome: Outcome[] = [];
    cushionModel = bounceHanBlend
    cueBall:Ball = null;

    shotBall: BilliardBall = null;

    readonly fixedTimeStep = 1.0 / 256.0;// 物理模拟的固定时间步长

    ui: any;


    setUI(ui) {
      // BilliardManager.instance.setAlogVersion(BilliardData.instance.getAlgoVersion());
      this.ui = ui;
    }


    public register_event(): void {
      // 注册指定的监听方法，格式如下
      this.event_func_map = {
          [yy.Event_Name.billiard_hit]: "hit",
      };
      super.register_event();
    }

    public on_init(): void {
      BilliardManager.instance.setTable(this);

      this.onScreenSizeChanged();
    }


    initTable() {
      this.initialiseBalls();
      this.cueBall = this.balls[0];//this.balls.find(ball => ball.node.name === "CueBall");

      if (this.ui) {
        this.ui.unscheduleAllCallbacks();
        this.ui.schedule(this.loopUpdate.bind(this), 0); 
      }
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

      // if (!this.allStationary()) {
      //   const start = performance.now();
      //   while(!this.allStationary()) {
      //     this.advance(0);
      //   }
      //   const end = performance.now();
      //   yy.log.w(`执行时间：${(end - start).toFixed(0)} 毫秒`);
      // }
    }
    // 模拟物理
    fixedUpdate(dt: number) {
      this.advance(dt);
    }

    initialiseBalls() {
        const balls = this.balls;
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
          if (depth++ > Number.MAX_SAFE_INTEGER) {
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
   * Returns true if a pair of balls can advance by t without any collision.o
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
    this.balls = [];
    for(let i = 0; i < iBalls.length; ++i) {
        let ball = new Ball()// instantiate(this.prefabBall).getComponent(Ball);
        let data = iBalls[i];
        if (this.ui) {
          let bUI = instantiate(this.ui.prefabBall).getComponent(BilliardBall);
          if(this.ui) this.ui.nodeBalls.addChild(bUI.node);
          bUI.initBall(ball);
          if (ball.id === 0) {
            bUI.getComponent(RaySphereCollision).destroy();
          }
        }

      

        ball.updatePosImmediately(new Vec3(data.position.x/BilliardConst.multiple, data.position.y/BilliardConst.multiple, 0));
        // yy.log.w(ball.name, data.rotation.x/BilliardConst.multiple, data.rotation.y/BilliardConst.multiple, data.rotation.z/BilliardConst.multiple, data.rotation.w/BilliardConst.multiple)
        if (isStart && ball.ui) {
          const quaternion = ball.ui.ballMesh.node.getRotation();
          // 生成随机的旋转轴
          const axis = new Vec3( data.rotation.x/BilliardConst.multiple,  data.rotation.y/BilliardConst.multiple, data.rotation.z/BilliardConst.multiple).normalize();//new Vec3(Math.random(), Math.random(), Math.random()).normalize();//
          // 生成随机的旋转角度（弧度）
          const angle = data.rotation.w/BilliardConst.multiple * Math.PI * 2; //Math.random() * Math.PI * 2;//
          // 根据旋转轴和角度创建四元数
          Quat.fromAxisAngle(quaternion, axis, angle);
          // 将四元数应用到节点的旋转
          ball.ui.ballMesh.node.rotation = quaternion;
        }

        this.balls.push(ball);
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


  onSetServiceData(result: protoBilliard.IResult, isStart: boolean = false) {
    if (isStart) {
      result.balls.forEach((b, i)=> {
        let ball = this.balls[b.val];
        ball.setStationaryByService();
        ball.updatePosImmediately(new Vec3(b.position.x/BilliardConst.multiple, b.position.y/BilliardConst.multiple, 0));
        if (isStart && ball.ui) {
          const quaternion = ball.ui.ballMesh.node.getRotation();
          // 生成随机的旋转轴
          const axis = new Vec3( b.rotation.x/BilliardConst.multiple,  b.rotation.y/BilliardConst.multiple, b.rotation.z/BilliardConst.multiple).normalize();//new Vec3(Math.random(), Math.random(), Math.random()).normalize();//
          // 生成随机的旋转角度（弧度）
          const angle = b.rotation.w/BilliardConst.multiple * Math.PI * 2; //Math.random() * Math.PI * 2;//
          // 根据旋转轴和角度创建四元数
          Quat.fromAxisAngle(quaternion, axis, angle);
          // 将四元数应用到节点的旋转
          ball.ui.ballMesh.node.rotation = quaternion;
        }
      });
  
      result.potBalls.forEach((val, i)=> {
        let ball = this.balls[val];
        if (ball.onTable()) {
            track.setInTrack(ball);
        }
      });
    }
    else {
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
  }

  setBallsRotation(balls: protoBilliard.IBall[], type: number) {
    const rotations = {x: 70711, y: 0, z: 0, w: 70711};
    balls.forEach(b => {
      let ball = this.balls[b.val];
      if (ball.onTable()) {
        if (type === 1){ // 开球初始数据通过服务器随机4元素设置旋转
          const quaternion = ball.ui.ballMesh.node.getRotation();
          const axis = new Vec3(b.rotation.x/BilliardConst.multiple,  b.rotation.y/BilliardConst.multiple, b.rotation.z/BilliardConst.multiple).normalize();
          const angle = b.rotation.w/BilliardConst.multiple * Math.PI * 2; //Math.random() * Math.PI * 2;//
          Quat.fromAxisAngle(quaternion, axis, angle);
          ball.ui.ballMesh.node.rotation = quaternion;
        }
        else {
          ball.setRotation(b.rotation.x/BilliardConst.multiple, b.rotation.y/BilliardConst.multiple, b.rotation.z/BilliardConst.multiple, b.rotation.w/BilliardConst.multiple);
        }

      }
    });
  }


  clearData() {
    if(this.ui) this.ui.nodeBalls.removeAllChildren();
    track.clear();
  }



}


