import { _decorator, Component, director, macro, Node, Vec3 } from 'cc';
import { yy } from '../../../../../../yy';
import { forceRoll, rollingFull, sliding, surfaceVelocityFull } from '../../../scripts/physics/physics';
import { passesThroughZero } from '../../../scripts/utils';
const { ccclass, property } = _decorator;


export enum State {
    Stationary = "Stationary",
    Rolling = "Rolling",
    Sliding = "Sliding",
    Falling = "Falling",
    InPocket = "InPocket",
  }

@ccclass('Ball')
export class Ball extends Component {
    pos: Vec3;
    readonly vel: Vec3 = Vec3.ZERO.clone();
    readonly rvel: Vec3 = Vec3.ZERO.clone();
    readonly futurePos: Vec3 = Vec3.ZERO.clone();
    state: State = State.Stationary

    private static id = 0;
    readonly nId = Ball.id++;
    static readonly transition = 0.05;


    protected onLoad(): void {
        this.pos = this.node.position;
    }

    fixedUpdate(dt: number) {
      this.updatePosition(dt);
      if (this.state == State.Falling) {
          // this.pocket.updateFall(this, t)
        } else {
          this.updateVelocity(dt)
        }
    }

    private updatePosition(t: number) {
        this.pos.addScaledVector(this.vel, t)
        this.node.position = this.pos;
        // yy.log.w("updatePosition ball:", t, this.pos, this.vel);
    }

    private updateVelocity(t: number) {
        if (this.inMotion()) {
          if (this.isRolling()) {
            this.state = State.Rolling
            forceRoll(this.vel, this.rvel)
            this.addDelta(t, rollingFull(this.rvel))
            // yy.log.w("isRolling", t);
          } else {
            this.state = State.Sliding
            this.addDelta(t, sliding(this.vel, this.rvel))
            // yy.log.w("isSliding", t);
          }
        }
    }

    private addDelta(t, delta) {
        delta.v.multiplyScalar(t)
        delta.w.multiplyScalar(t)
        if (!this.passesZero(delta)) {
          this.vel.add(delta.v)
          this.rvel.add(delta.w)
        }
    }

    private passesZero(delta) {
        const vz = passesThroughZero(this.vel, delta.v)
        const wz = passesThroughZero(this.rvel, delta.w)
        const halts = this.state === State.Rolling ? vz || wz : vz && wz
        if (halts && Math.abs(this.rvel.z) < 0.01) {
          this.setStationary()
          return true
        }
        return false
    }
    setStationary() {
        this.vel.copy(Vec3.ZERO)
        this.rvel.copy(Vec3.ZERO)
        this.state = State.Stationary
    }
    setSliding() {
        this.state = State.Sliding
    }

    inMotion() {
        return (
          this.state === State.Rolling ||
          this.state === State.Sliding ||
          this.isFalling()
        )
    }
    isFalling() {
        return this.state === State.Falling
    }

    isRolling() {
        return (
          this.vel.lengthSqr() !== 0 &&
          this.rvel.lengthSqr() !== 0 &&
          surfaceVelocityFull(this.vel, this.rvel).length() < Ball.transition
        )
    }
    onTable() {
        return this.state !== State.Falling && this.state !== State.InPocket
    }

    futurePosition(t) {
        this.futurePos.copy(this.pos).addScaledVector(this.vel, t)
        return this.futurePos
    }
}


