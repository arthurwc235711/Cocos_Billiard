import { Vec3 } from "cc";
import { Ball } from "../../../../../games/casual_games/billiard/scripts/Ball";
import { g, R } from "./constants";
import { forceRoll } from "./physics";

export class track {
    static readonly startPos = new Vec3(-1.5, 0.74, -0.5);
    static readonly endPos = new Vec3(-1.74, -0.77, -0.5);

    static inPocketBalls: Ball[] = [];
    static inTrackBalls: Ball[] = [];
//
    static updateInTrack(t: number) {
        if (this.inPocketBalls.length === 0) return;
        
        this.inPocketBalls.forEach((ball, i)=>{
            const x = ball.pos.x;
            const y = ball.pos.y;
            let vx = 0, vy = 0;
            if (x >= -1.67) { // 向左速度
                vx = -R * t * g;
            }
            else if (x > -1.74 && y < 0.741) { // 向左速度衰减 并拥有向下速度
                vy = R * t * 0.1 * g;
                // 碰撞后X速度为0则再给左移动速度  否则有概率碰撞会卡住
                if (ball.vel.x === 0) { 
                    vx = -R * t * g * 0.7;
                }
            }
            else { // 只有向下速度
                if (y > this.endPos.y) {
                    vy = -R * t * g;
                }
            }

            if (i < this.inPocketBalls.length && i !== 0) {
                if (this.isCollison(ball, this.inPocketBalls[i-1])) {
                    let tmpBall = this.inPocketBalls[i-1]
                    if (tmpBall.pos.x >= -1.67) { // 向左速度
                        vx = ball.vel.x;
                    }
                    else if (tmpBall.pos.x > -1.74 && tmpBall.pos.y < 0.741) { // 向左速度衰减 并拥有向下速度
                        vy = ball.vel.y;
                    }
                    else { // 只有向下速度
                        if (tmpBall.pos.y > this.endPos.y) {
                            vy = ball.vel.y;
                        }
                    }
                    tmpBall.vel.addScaledVector(Vec3.RIGHT, vx);
                    tmpBall.vel.addScaledVector(Vec3.UP, vy);

                    ball.vel.setX(0).setY(0);
                    vx = 0;
                    vy = 0;
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
        this.inPocketBalls.length = 0;
        this.inTrackBalls.length = 0;
    }


    static setInTrack(ball: Ball) {
        ball.setStationaryByService();
        ball.setTrack();
        this.inPocketBalls.push(ball);
    }

    static froceUpdateTrack(ball: Ball) {
        let v3 = Vec3.ZERO.clone();
        ball.setStationaryByService();
        ball.setTrack();
        ball.vel.copy(Vec3.ZERO)
        ball.rvel.copy(Vec3.ZERO)
        ball.updatePosImmediately(v3.setX(this.endPos.x).setY(this.endPos.y + this.inTrackBalls.length * 2* R));
        this.inTrackBalls.push(ball);
    }

    static isCollison(a: Ball, b: Ball) :boolean {
        return a.pos.distanceToSquared(b.pos) < 2*R * 2*R;
    }
}


