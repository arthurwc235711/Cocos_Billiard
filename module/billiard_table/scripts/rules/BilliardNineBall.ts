import { eRuleType, eOutcomeType } from "../../../../config/BilliardConst";
import { Ball } from "../Ball";
import { Outcome } from "../Outcome";
import { IBilliardRules } from "./IBilliardRules";

export class BilliardNineBall implements IBilliardRules {
    ruleType: eRuleType;
    ruleName: string = "9 Balls";
    round: number;
    isFoul(outcome: Outcome[]): boolean {
        throw new Error("Method not implemented.");
    }
    placeBalls(isStart: boolean) {
        throw new Error("Method not implemented.");
    }
    isGameEnd(outcome: Outcome[], reslut: { type: eOutcomeType; }): boolean {
        throw new Error("Method not implemented.");
    }
    nextTurn(type: number, actionUid: number, round: number) {
        throw new Error("Method not implemented.");
    }
    startTurn() {
        throw new Error("Method not implemented.");
    }
    onShotBall(): Ball {
        throw new Error("Method not implemented.");
    }
    getShowBalls(type: any): number[] {
        throw new Error("Method not implemented.");
    }

}


