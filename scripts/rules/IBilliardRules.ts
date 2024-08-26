import { eOutcomeType, eRuleType } from "../../config/BilliardConst";
import { Ball } from "../../../../../games/casual_games/billiard/scripts/Ball";
import { Outcome } from "../physics/Outcome";

export interface IBilliardRules  {
    ruleType: eRuleType
    ruleName: string;
    round: number;
    uidTimeOut: number;


    isFoul(outcome: Outcome[]): boolean;
    placeBalls(isStart: boolean);
    isGameEnd(outcome: Outcome[], reslut:{ type: eOutcomeType }): boolean;
    nextTurn(type: number, actionUid: number, round: number);
    startTurn();
    onShotBall(): Ball;
    getShowBalls(type: any): number[];
}


