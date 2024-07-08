import { _decorator, Camera, Component, director, find, game, instantiate, macro, Node, Prefab, Vec3, UITransform, Canvas, geometry } from 'cc';
import { Ball } from './Ball';
import { Cue } from './Cue';
import { Collision } from '../../../scripts/physics/collision';
import { TableGeometry } from './TableGeometry';
import { yy } from '../../../../../../yy';
import { Cushion } from './Cushion';
import { bounceHanBlend, cueToSpin } from '../../../scripts/physics/physics';
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
    cushionModel = bounceHanBlend
    cueBall:Ball = null;

    readonly fixedTimeStep = 1.0 / 512.0;// 物理模拟的固定时间步长


    public register_event(): void {
      // 注册指定的监听方法，格式如下
      this.event_func_map = {
          [yy.Event_Name.billiard_hit]: "hit",
      };
      super.register_event();
    }

    public on_init(): void {
      BilliardManager.instance.setTable(this);
    }

    protected start(): void {
      yy.event.emit(yy.Event_Name.billiard_table_init, this.node.getChildByName("Plane"));
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
  prepareBalls(startPos: Vec3) { 
    let iBalls = BilliardData.instance.getStartBalls(); // 8球，球的总数量 16个
    for(let i = 0; i < iBalls.length; ++i) {
        let ball = instantiate(this.prefabBall).getComponent(Ball);
        let data = iBalls[i];
        this.nodeBalls.addChild(ball.node);

        if (data.val === 0) {
          ball.getComponent(RaySphereCollision).destroy();
        }
        ball.updatePosImmediately(new Vec3(data.position.x/BilliardConst.multiple, data.position.y/BilliardConst.multiple, 0));
        let ration = {
          x:  Math.round(ball.ballMesh.node.rotation.x * BilliardConst.multiple),
          y:  Math.round(ball.ballMesh.node.rotation.y * BilliardConst.multiple),
          z:  Math.round(ball.ballMesh.node.rotation.z * BilliardConst.multiple),
          w:  Math.round(ball.ballMesh.node.rotation.w * BilliardConst.multiple),
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

  setBallsRotation(balls: protoBilliard.IBall[]) {
    const rotations = {x: 70711, y: 0, z: 0, w: 70711};
    balls.forEach(b => {
      let ball = this.balls[b.val];
      if (ball.onTable()) {
        if (b.rotation.x === 0 && b.rotation.y === 0 && b.rotation.z === 0 && b.rotation.w === 0){
          ball.setRotation(rotations.x/BilliardConst.multiple, rotations.y/BilliardConst.multiple, rotations.z/BilliardConst.multiple, rotations.w/BilliardConst.multiple);
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

}


