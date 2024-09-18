import { yy } from "../../../../../yy";
import { BilliardEightBall } from "./BilliardEightBall";

export class BilliardEightBallRecord extends BilliardEightBall {
    nextTurn(type: number, actionUid: number, round: number): void {
        yy.log.w("BilliardEightBallRecord nextTurn");
    }

}


