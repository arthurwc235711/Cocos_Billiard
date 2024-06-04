import { Vec3 } from "cc";
import { Ball } from "../../module/billiard_table/scripts/Ball";
import { g, R } from "./constants";
import { yy } from "../../../../../yy";
import { forceRoll } from "./physics";

export class track {
    static readonly startPos = new Vec3(-1.5, 0.74, -0.5);
    static readonly endPos = new Vec3(-1.74, -0.77, -0.5);

    static inPocketBalls: Ball[] = [];
    static inTrackBalls: Ball[] = [];
//
    static updateInTrack(t: number) {
        if (this.inPocketBalls.length === 0) return;
        
        this.inPocketBalls.forEach(ball=>{
            const x = ball.pos.x;
            const y = ball.pos.y;
            let vx = 0, vy = 0;
            if (x >= -1.67) { // 向左速度
                vx = -R * t * g;
            }
            else if (x > -1.74) { // 向左速度衰减 并拥有向下速度
                vy = R * t * 0.1 * g;
            }
            else { // 只有向下速度
                if (y > this.endPos.y) {
                    vy = -R * t * g;
                }
            }
            
            ball.vel.addScaledVector(Vec3.RIGHT, vx);
            ball.vel.addScaledVector(Vec3.UP, vy);
            forceRoll(ball.vel, ball.rvel)

            // yy.log.w(Vec3.UP, Vec3.RIGHT, ball.vel);
    
            let endPos = this.endPos.y + this.inTrackBalls.length * 2* R;
            if (x < this.endPos.x) {
                ball.pos.setX(this.endPos.x);
            }
            if (y < endPos ) {
                ball.pos.setY(endPos);
                ball.vel.copy(Vec3.ZERO)
                ball.rvel.copy(Vec3.ZERO)
                this.inTrackBalls.push(ball);
            }
        });

        this.inTrackBalls.forEach(ball=>{
            this.inPocketBalls = this.inPocketBalls.filter(b=>b!==ball);
        })
    }

    static clear() {
        this.inPocketBalls = [];
        this.inTrackBalls = [];
    }
}


