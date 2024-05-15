import { _decorator, Component, director, game, instantiate, macro, Node, Prefab, Vec3 } from 'cc';
import { Ball } from './Ball';
import { Cue } from './Cue';
import { Collision } from '../../../scripts/physics/collision';
import { TableGeometry } from './TableGeometry';
import { yy } from '../../../../../../yy';
import { Cushion } from './Cushion';
import { bounceHanBlend } from '../../../scripts/physics/physics';
import { BilliardData } from '../../../data/BilliardData';
import { R } from '../../../scripts/physics/constants';
const { ccclass, property } = _decorator;

interface Pair {
    a: Ball
    b: Ball
  }

@ccclass('Table')
export class Table extends Component {
    @property(Cue)
    cue: Cue = null;
    @property(Node)
    nodeBalls: Node = null;
    @property(Prefab)
    prefabBall: Prefab = null;

    balls:Ball[];
    pairs: Pair[]; // 球对
    cushionModel = bounceHanBlend
    cueBall:Ball = null;

    readonly fixedTimeStep = 1.0 / 512.0;// 物理模拟的固定时间步长

    protected onLoad(): void {
       this.prepareBalls();
       this.initTable();
    }

    initTable() {
      this.initialiseBalls(director.getScene().getChildByName("NodeBalls").getComponentsInChildren(Ball));
      this.cueBall = this.balls.find(ball => ball.node.name === "CueBall");

      yy.log.w("initialiseBalls", this.balls, this.cueBall, this.balls[0].node.name)
      this.schedule(this.loopUpdate, 0); 
    }

    // fixedUpdate 会在所有update之后调用

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
    //   this.outcome.push(Outcome.collision(a, b, incidentSpeed))
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
    //   this.outcome.push(Outcome.cushion(a, incidentSpeed))
      return false
    }

    // const k = Knuckle.findBouncing(a, t)
    // if (k) {
    //   const knuckleIncidentSpeed = k.bounce(a)
    //   this.outcome.push(Outcome.cushion(a, knuckleIncidentSpeed))
    //   return false
    // }
    // const p = Pocket.findPocket(PocketGeometry.pocketCenters, a, t)
    // if (p) {
    //   const pocketIncidentSpeed = p.fall(a, t)
    //   this.outcome.push(Outcome.pot(a, pocketIncidentSpeed))
    //   return false
    // }

    return true
  }

    hit() {
        this.cue.hit(this.cueBall);
        
        // this.cueBall.pos.addScaledVector(new Vec3(3, 0, 0), 0.2);
        // this.balls.forEach(ball => {
            
        // })
    }


    prepareBalls() {
      let ballNums = BilliardData.instance.getBallNums();
      let row = 1;
      let cNum = 0;
      let lNum = 0;
      let x = TableGeometry.tableX;
      for( let i = 0; i < ballNums; i++ ) {
        let ball = instantiate(this.prefabBall).getComponent(Ball);
        this.nodeBalls.addChild(ball.node);
        if (row === 1) {
          ball.pos = new Vec3(x/2, 0, 0);
        }
        else {
          let space = R / 4;
          let y = (lNum+1)%2 === 0 ?  (R + space/2) +  (2*R + space) * (Math.ceil((lNum+1)/2)-1) : (2*R + space) * (Math.ceil((lNum+1)/2)-1);
          ball.pos = new Vec3(x/2 + (2 * R + space) * (row - 1), -y + (2 * R + space) * (lNum - cNum), 0);
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


