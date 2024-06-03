import { Vec3 } from "cc";
import { Ball } from "../../module/billiard_table/scripts/Ball";
import { R } from "./constants";

export class track {
    readonly startPos = new Vec3(-1.5, 0.74, -0.5);
    readonly endPos = new Vec3(-1.74, -0.77, -0.5);



//
    updateInTrack(ball:Ball, t: number) {
        ball.vel.addScaledVector(Vec3.RIGHT, -R * t);
        const x = ball.pos.x;

        

        if (x >= -1.67) { // 向左速度

        }
        else if (x < -1.74) { // 向右速度

        }
        else { // 向下速度

        }

        if ( ) { // 向下速度

        }

    }

}


