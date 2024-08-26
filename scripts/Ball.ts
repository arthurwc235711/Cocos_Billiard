import { _decorator, Component, director, macro, Material, Mesh, MeshRenderer, misc, Node, Prefab, quat, Quat, Vec3 } from 'cc';
import { yy } from '../../../../yy';
import { forceRoll, rollingFull, sliding, surfaceVelocityFull } from '../../../../games/casual_games/billiard/scripts/physics/physics';
import { Pocket } from '../../../../games/casual_games/billiard/scripts/physics/pocket';
import { passesThroughZero } from './utils';
import { BilliardData } from '../../../../games/casual_games/billiard/data/BilliardData';
import { BilliardTools } from './BilliardTools';
import { BilliardManager } from './BilliardManager';



export enum State {
    Stationary = "Stationary",
    Rolling = "Rolling",
    Sliding = "Sliding",
    Falling = "Falling",
    InPocket = "InPocket",
    Turning = "Turning",
    // InTrack = "InTrack",
  }

export class Ball {

    readonly pos: Vec3 = new Vec3();
    readonly vel: Vec3 = new Vec3();
    readonly rvel: Vec3 = new Vec3();
    readonly futurePos: Vec3 = new Vec3();
    state: State = State.Stationary;
    pocket: Pocket;


    id: number; 

    ui: any;
    
    static readonly transition = 0.05;


    constructor() {
      this.id = BilliardData.ballId++;
    }

    setUI(ui) {
      this.ui = ui;
    }

    delateTime: number = 0;
    fixedUpdate(ft: number, dt: number) {
      this.delateTime = dt;
      this.updatePosition(ft);
      if (this.state === State.Falling) {
          this.pocket.updateFall(this, ft)
      }
      else {
        this.updateVelocity(ft)
      }
    }



    updatePosImmediately(pos: Vec3) {
      this.pos.x = BilliardTools.instance.roundToFiveDecimalPlaces(pos.x);
      this.pos.y = BilliardTools.instance.roundToFiveDecimalPlaces(pos.y);
      this.pos.z = BilliardTools.instance.roundToFiveDecimalPlaces(pos.z);
      // yy.log.w("updatePosImmediately", this.pos);
      if (this.ui) this.ui.node.position = this.pos;
    }

    private updatePosition(t: number) {
        this.pos.addScaledVector(this.vel, t)
        // this.node.position = this.pos;
        // yy.log.w("updatePosition ball:", t, this.pos, this.vel);
    }

    setRotation(x: number, y: number, z: number, w: number) {
      if (this.ui) this.ui.ballMesh.node.setRotation(x, y, z, w);
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
            this.addDelta(t, sliding(this.vel, this.rvel), true)
            // yy.log.e("isSliding", t);
          }
        }
    }

    private addDelta(t, delta, isSliding = false) {
        delta.v.multiplyScalar(t)
        delta.w.multiplyScalar(t)
        if (!this.passesZero(delta)) {
          if (isSliding ) {
            if (this.id !== 0) {
              this.vel.add(delta.v.multiplyScalar(2));
              this.rvel.add(delta.w.multiplyScalar(4));
            }
            else {
              this.vel.add(delta.v)
              this.rvel.add(delta.w)
            }

            if(this.vel.lengthSqr() === 0){
              this.vel.add(delta.v.multiplyScalar(-1));
            }
            if (this.rvel.lengthSqr() === 0) { // 补丁，递减值如果滑动时为0则球无法转为滚动则不能停止
              this.rvel.add(delta.w.multiplyScalar(-1));
            }
          }
          else {
            this.vel.add(delta.v)
            this.rvel.add(delta.w)
          }

        }
    }

    private passesZero(delta) {
        const vz = passesThroughZero(this.vel, delta.v)
        const wz = passesThroughZero(this.rvel, delta.w)
        const halts = this.state === State.Rolling ? vz || wz : vz && wz
        if (halts) {
          if (Math.abs(this.rvel.z) < 0.01) {
            this.setStationary()
            return true
          }

          this.state = State.Turning;
          this.vel.copy(Vec3.ZERO)
          if (BilliardManager.instance.getTable().allMotingNotTuring()) {// 所有球停止移动则强制停止旋转
            this.setStationary();
            return true;
          }
        }

        return false
    }
    setStationary() {
        this.vel.copy(Vec3.ZERO)
        this.rvel.copy(Vec3.ZERO)
        this.state = State.Stationary

        if (BilliardManager.instance.getTable().allStationary()) {
          yy.event.emit(yy.Event_Name.billiard_allStationary);
        }
    }

    setInPocket() {
      this.vel.copy(Vec3.ZERO)
      this.rvel.copy(Vec3.ZERO)
      this.state = State.InPocket

      if (BilliardManager.instance.getTable().allStationary()) {
        yy.event.emit(yy.Event_Name.billiard_allStationary);
      }
    }

    setStationaryByService() {
      this.vel.copy(Vec3.ZERO)
      this.rvel.copy(Vec3.ZERO)
      this.state = State.Stationary
    }
    isStationary() {
        return this.state === State.Stationary;
    }

    setSliding() {
        this.state = State.Sliding
    }

    inMotingNotTuring() {
      return (
        this.state === State.Rolling ||
        this.state === State.Sliding ||
        // this.state === State.Turning ||
        this.isFalling()
      )
    }

    inMotion() {// 单纯旋转不算 移动
        return (
          this.state === State.Rolling ||
          this.state === State.Sliding ||
          this.state === State.Turning ||
          this.isFalling()
        )
    }
    isFalling() {
        return this.state === State.Falling
    }
    isTurning() {
        return this.state === State.Turning
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

    setTrack() {
      this.state = State.InPocket;
      this.pos.set(-1.5, 0.74, -0.5);
      if(this.ui) this.ui.node.getChildByName("SpriteRenderer").active = false;
    }

}



