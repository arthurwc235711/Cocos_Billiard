import { Canvas, director, macro, tween, Vec3 } from "cc";
import { BilliardData } from "../../../data/BilliardData";
import { unitAtAngle } from "../../../scripts/utils";
import { BilliardManager } from "../../../scripts/BilliardManager";
import { cueToSpin } from "../../../scripts/physics/physics";
import { R, R2d } from "../../../scripts/physics/constants";
import { yy } from "../../../../../../yy";
import { Outcome } from "./Outcome";

export class BilliardAI  {
    private static __instance__: BilliardAI;
    static get instance(): BilliardAI {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardAI();
        }
        return this.__instance__;
    }

    isUsed = true;

    freeball() {
        if (this.isUsed) {
            let table = BilliardManager.instance.getTable();
            if (table.isValidFreeBall()) {
                this.hitBall();
            }
        }
    }

    hitBall() {
        if (this.isUsed) {
            yy.log.w("hitBall")
            this.thinkTime(()=>{
                yy.log.w("thinkTime,hitBall")
                let billiardData = BilliardData.instance;
                let table = BilliardManager.instance.getTable();
                let view = BilliardManager.instance.getView();
                let ball = table.cueBall;
                table.outcome = [
                    Outcome.hit(ball, 150 * R),
                ];
                tween(view.nodeCue)
                .to(0.5, {position: new Vec3(-R2d*2 * 6, -15, 0)})
                .to(0.5, {position: new Vec3(-R2d*2, -15, 0)}, {easing: "quintIn"})
                .call(()=>{
                    view.nodeCueArrow.active = false;
                    ball.setSliding();
                    ball.vel.copy(unitAtAngle(billiardData.getAngle()).multiplyScalar(150 * R));
                    ball.rvel.copy(cueToSpin(Vec3.ZERO, ball.vel));
                })
                .start()
                BilliardManager.instance.getView().controlHide(true);

                yy.event.emit(yy.Event_Name.billiard_hit_cd_stop);
            })
        }
    }

    thinkTime(f: Function) {
        let canvas = director.getScene().getChildByName("Canvas").getComponent(Canvas);
        canvas.scheduleOnce(()=>{
            f();
        }, 3);
    }

    MoveStartCueBall() {
        let table = BilliardManager.instance.getTable();
        let view = BilliardManager.instance.getView();
        let canvas = director.getScene().getChildByName("Canvas").getComponent(Canvas);
        let cueball = table.cueBall;
        let onUpdate = (dt) => {
            if (cueball.pos.x > -0.85) {
                cueball.pos.setX(cueball.pos.x - dt * 0.1);
                view.onFreeBall()
                view.onFreeBallMove(false);
            }
            else {
                cueball.pos.setX(-0.85);
                view.onFreeBall()
                view.onFreeBallMove(false);
                canvas.unschedule(onUpdate);
                let billiardData = BilliardData.instance;
                let ball = table.cueBall;
                table.outcome = [
                    Outcome.hit(ball, 150 * R),
                ];
                BilliardManager.instance.getView().controlHide();
                ball.setSliding();
                ball.vel.copy(unitAtAngle(billiardData.getAngle()).multiplyScalar(150 * R));
                ball.rvel.copy(cueToSpin(Vec3.ZERO, ball.vel));
            }
        };
        canvas.schedule(onUpdate, 0);
    }

}


