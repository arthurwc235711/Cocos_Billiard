import { yy } from "../../../../../yy";
import { BilliardNineBall } from "./BilliardNineBall";

export class BilliardNineBallRecord extends BilliardNineBall {
    nextTurn(type: number, actionUid: number, round: number): void {
        yy.log.w("BilliardNineBallRecord nextTurn");
    }
}


