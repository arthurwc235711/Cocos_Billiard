import { eOutcomeType, eRuleType } from "../../../../config/BilliardConst";
import { Ball } from "../Ball";
import { Outcome } from "../Outcome";

export interface IBilliardRules  {
    ruleType: eRuleType
    ruleName: string;
    round: number;


    isFoul(outcome: Outcome[]): boolean;
    placeBalls();
    isGameEnd(outcome: Outcome[], reslut:{ type: eOutcomeType }): boolean;
    nextTurn(type: eOutcomeType);
    startTurn();
    onShotBall(): Ball;
    getShowBalls(type: any): number[];
}


