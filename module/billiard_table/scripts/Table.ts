import { _decorator, Camera, Component, director, find, game, instantiate, macro, Node, Prefab, Vec3, UITransform, Canvas, geometry } from 'cc';
import { Ball } from './Ball';
import { Cue } from './Cue';
import { Collision } from '../../../scripts/physics/collision';
import { TableGeometry } from './TableGeometry';
import { yy } from '../../../../../../yy';
import { Cushion } from './Cushion';
import { bounceHanBlend } from '../../../scripts/physics/physics';
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

const { ccclass, property } = _decorator;

interface Pair {
    a: Ball
    b: Ball
  }

@ccclass('Table')
export class Table extends BaseCommonScript {
    @property(Cue)
    cue: Cue = null;
    @property(Node)
    nodeBalls: Node = null;
    @property(Prefab)
    prefabBall: Prefab = null;

    balls:Ball[];
    pairs: Pair[]; // 球对
    outcome: Outcome[] = [];
    cushionModel = bounceHanBlend
    cueBall:Ball = null;

    readonly fixedTimeStep = 1.0 / 256.0;// 物理模拟的固定时间步长


    public register_event(): void {
      // 注册指定的监听方法，格式如下
      this.event_func_map = {
          [yy.Event_Name.billiard_hit]: "hit",
      };
      super.register_event();
    }

    public on_init(): void {
      BilliardManager.instance.setTable(this);
      this.prepareBalls();
      this.initTable();
    }

    protected start(): void {
      // yy.log.w("cueBall worldPosition", this.cueBall.node.worldPosition)
      // BilliardTools.instance.camera3DToCamera2DWPos(this.cueBall.node.worldPosition.clone().add3f(R,0,0));
      // yy.event.emit(yy.Event_Name.billiard_table_init, this.cueBall.node.worldPosition.clone().add3f(R,0,0));
      yy.event.emit(yy.Event_Name.billiard_table_init, this.node.getChildByName("Plane"));
    }

    initTable() {
      this.initialiseBalls(director.getScene().getChildByPath("p_billiard_3d/NodeBalls").getComponentsInChildren(Ball));
      this.cueBall = this.balls[0];//this.balls.find(ball => ball.node.name === "CueBall");
      // yy.log.w("initialiseBalls", this.balls, this.cueBall, this.balls[0].node.name)
      // yy.log.w("balls:", this.cueBall.node.worldPosition, this.cueBall.node.position);
      // yy.log.w("nodeBalls", this.nodeBalls.worldPosition, this.nodeBalls.position);
      this.schedule(this.loopUpdate, 0); 
    }


    // loopUpdate  fixedUpdate 会在所有update之后调用
    loopUpdate(dt: number) {
      let loopTimes = dt/this.fixedTimeStep;
      for (let i = 0; i < loopTimes; i++) {
        this.fixedUpdate(this.fixedTimeStep);
      }
    }
    // 模拟物理
    fixedUpdate(dt: number) {
      let loopTimes = dt/this.fixedTimeStep;
      for (let i = 0; i < loopTimes; i++) {
        this.advance(this.fixedTimeStep);
      }
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

    advance(t: number) {
        let depth = 0
        while (!this.prepareAdvanceAll(t)) {
          if (depth++ > 100) {
            throw new Error("Depth exceeded resolving collisions")
          }
        }
        this.balls.forEach((a) => {
          a.fixedUpdate(t)
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
    for (let i = 1; i < this.balls.length; i++) {
      lengths.push({ squared: this.cueBall.pos.distanceToSquared(this.balls[i].pos), index: i });
    }
    if (lengths.length > 0) {
      lengths.sort((a, b) => a.squared - b.squared);
      return this.balls[lengths[0].index];
    }
    else {
      return null;
    }
  }

  hit() {
    this.outcome = [
      Outcome.hit(this.cueBall, BilliardData.instance.getPower())
    ];
    this.cue.hit(this.cueBall);
  }


  prepareBalls() {
    let ballNums = BilliardData.instance.getBallNums();
    let row = 1;
    let cNum = 0;
    let lNum = 0;
    let x = TableGeometry.tableX;
    let r = R //* 1.4;
    let acos25 = Math.acos(22.5 * Math.PI / 180 );


    for( let i = 0; i < ballNums; i++ ) {
      let ball = instantiate(this.prefabBall).getComponent(Ball);
      this.nodeBalls.addChild(ball.node);
      if (i === 0) {// 母球
        ball.pos = new Vec3(-0.85, 0, 0);
        ball.getComponent(RaySphereCollision).destroy();
      }
      else {
        if (row === 1) {
          ball.pos = new Vec3(x/2, 0, 0);
        }
        else {
          let space = 0//0.001 ;
          let y = (lNum+1)%2 === 0 ?  (r + space/2) +  (2*r + space) * (Math.ceil((lNum+1)/2)-1) : (2*r + space) * (Math.ceil((lNum+1)/2)-1);
          ball.pos = new Vec3(x/2 + (2 * r / acos25  +  0.001) * (row - 1), -y + (2 * r + space) * (lNum - cNum), 0);
        }
  
        cNum += 1;
        if (cNum - lNum === 1) {
          row += 1;
          lNum = cNum;
          cNum = 0;
        }
      }


    }
  }

  protected update(dt: number): void {
    track.updateInTrack(dt);
  }

}


