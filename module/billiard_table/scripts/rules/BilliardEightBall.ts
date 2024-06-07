import { Vec3 } from "cc";
import { yy } from "../../../../../../../yy";
import { eRuleType, eOutcomeType, BilliardConst } from "../../../../config/BilliardConst";
import { BilliardManager } from "../../../../scripts/BilliardManager";
import { Outcome } from "../Outcome";
import { IBilliardRules } from "./IBilliardRules";
import { BilliardData } from "../../../../data/BilliardData";
import { Ball } from "../Ball";


enum eBallType {
    CueBall,
    SolidBall,
    StripedBall,
    EightBall,
}

export class BilliardEightBall implements IBilliardRules {
    ruleType: eRuleType;
    ruleName: string = "8球";
    round: number = 0;

    isFoul(outcome: Outcome[]): boolean {
        let result = false;
        let freeBall = function() {
            // 
            result = true;

        }
        // 母球进洞
        if (Outcome.isCueBallPotted(BilliardManager.instance.getCueBall(), outcome)) {
            yy.log.w("打进母球");
            freeBall();
        }
        else if (Outcome.isFirstCushion(outcome)) {// 先撞库
            yy.log.w("先撞库");
            freeBall();
        }
        else if (Outcome.firstCollision(outcome) === undefined) {// 没有撞球
            yy.log.w("没有撞球");
            freeBall();
        }
        else if (Outcome.isCollisionNoCushion(outcome) && Outcome.potCount(outcome) ===0) { // 撞球后没有撞库
            yy.log.w("撞球后没有撞库");
            freeBall();
        }

        if (!result && this.isSureBall()) {
            let o = (Outcome.firstCollision(outcome)) 
            if (o) {
                let balls = BilliardManager.instance.getTable().getOnTableBalls();
                if (this.hasBallType(balls, BilliardData.instance.getHitBallType()) && this.getBallType(o.ballB) !== BilliardData.instance.getHitBallType()){
                    freeBall();
                }
            }
        }

        return result;
    }
    placeBalls() {
        let table = BilliardManager.instance.getTable();
        table.prepareBalls(BilliardConst.startPos);
        table.initTable();
        // throw new Error("Method not implemented.");
    }
    isGameEnd(outcome: Outcome[], resultType: { type: eOutcomeType; }): boolean {
        let result = false;
        if (resultType.type === eOutcomeType.FreeBall) {
            if (Outcome.is8BallPotted(outcome)) {
                // 犯规 且打入8号球 
                resultType.type = eOutcomeType.Failed;
                result = true;
            }
        }
        else {
            if(this.isSureBall()) {// 定色
                if (Outcome.isIncludeValidPotted(outcome, BilliardData.instance.getHitBalls())) {
                    resultType.type = eOutcomeType.Continue;
                }
                else {
                    if(Outcome.is8BallPotted(outcome)) { // 最后击打进入8球
                        resultType.type = eOutcomeType.Win;
                        result = true;
                    }
                    else {
                        resultType.type = eOutcomeType.Turn;
                    }
                }
            }
            else {// 未定色
                let potBalls = Outcome.pots(outcome);
                if (potBalls.length > 0) {
                    if (this.round === 1) {// 开球进球不定色
                        resultType.type = eOutcomeType.Continue;
                        yy.log.w("开球进球不定色");
                    }
                    else {
                        if (Outcome.is8BallPotted(outcome)) {
                            resultType.type = eOutcomeType.Failed;
                            result = true;
                        }
                        else {
                            let o = (Outcome.firstCollision(outcome)) 
                            if(o) {
                                let t = this.getBallType(o.ballB);
                                if (this.hasBallType(potBalls, t)) {
                                    BilliardData.instance.setHitBallType(t);
                                    resultType.type = eOutcomeType.Continue;
                                    yy.log.w(`定色成功${t}`);
                                }
                                else {//击打球色和打球色不相同不算定色，交换击球权
                                    resultType.type = eOutcomeType.Turn;
                                }
                            }
                        }
                    }
                }
                else {
                    resultType.type = eOutcomeType.Turn;
                }
            }
        }


        return result;
    }
    nextTurn(type: eOutcomeType) {
        ++ this.round
        switch(type) {
            case eOutcomeType.Continue:
                yy.toast.addNow("继续击球");
                break;
            case eOutcomeType.Turn:
                yy.toast.addNow("正常击球，交换击球权");
                let uid = BilliardData.instance.getActionUid() === 1 ? 2 : 1;
                BilliardData.instance.setActionUid(uid)
                break;
            case eOutcomeType.FreeBall:
                yy.toast.addNow("击球犯规，下家放置自由球");
                uid = BilliardData.instance.getActionUid() === 1 ? 2 : 1;
                BilliardData.instance.setActionUid(uid)

                let view = BilliardManager.instance.getView();
                let table = BilliardManager.instance.getTable();
                if (this.round === 2) {// 开局犯规后对方 限定发球区域摆球
                    view.freeBall.setStartAreaShow();
                    table.cueBall.updatePosImmediately(BilliardConst.startPos);
                }
                else {
                    table.cueBall.updatePosImmediately(Vec3.ZERO);
                }

                view.freeBall.node.active = true;
                view.onFreeBall();
                view.onFreeBallMove(!table.isValidFreeBall());
                break;
            default:
                yy.log.e("未处理类型eOutcomeType", type);
        }

        yy.log.w("当前行动玩家", BilliardData.instance.getActionUid());
        // throw new Error("Method not implemented.");
    }

    startTurn() {
        let table = BilliardManager.instance.getTable();
        let view = BilliardManager.instance.getView();
        ++ this.round; // 回合数 + 1
        let ball = table.recentlyBall();
        if (ball) {
            view.autoShotAt(ball.node);
            view.onFreeBall();
        }

        BilliardData.instance.setActionUid( Math.random() < 0.5 ? 1 : 2 );
        yy.log.w("当前行动玩家", BilliardData.instance.getActionUid());
    }

    isSureBall() {
        return BilliardData.instance.getHitBallType() !== 0;
    }
    
    setMyBall(hitType: number) {
        BilliardData.instance.setHitBallType(hitType);
    }

    getBallType(ball: Ball) {
        if(ball.id > 8) {
            return eBallType.StripedBall;
        }
        else if (ball.id === 0) {
            return eBallType.CueBall;
        }
        else if (ball.id < 8) {
            return eBallType.SolidBall;
        }
    }

    hasBallType(balls: Ball[], type: eBallType){
        for (let i = 0; i < balls.length; ++i) {
            if (this.getBallType(balls[i]) === type) {
                return true;
            }
        }
        return false;
    }
}


