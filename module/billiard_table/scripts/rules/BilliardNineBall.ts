import { MATH_FLOAT_ARRAY, Vec3 } from "cc";
import { yy } from "../../../../../../../yy";
import { eRuleType, eOutcomeType, BilliardConst } from "../../../../config/BilliardConst";
import { BilliardData } from "../../../../data/BilliardData";
import { BilliardManager } from "../../../../scripts/BilliardManager";
import { BilliardTools } from "../../../../scripts/BilliardTools";
import { Ball } from "../Ball";
import { BilliardAI } from "../BilliardAI";
import { Outcome } from "../Outcome";
import { IBilliardRules } from "./IBilliardRules";

export class BilliardNineBall implements IBilliardRules {
    ruleType: eRuleType;
    ruleName: string = "9 Balls";
    round: number;
    shotCount: number = 1;
    isFoul(outcome: Outcome[]): boolean {
        let result = false;
        let freeBall = function() {
            result = true;
        }
        // 母球进洞
        if (Outcome.isCueBallPotted(BilliardManager.instance.getCueBall(), outcome)) {
            yy.log.w("打进母球");
            freeBall();
        }
        else {
            let firstCollision = Outcome.firstCollision(outcome);
            if (firstCollision === undefined) {//没有撞球
                yy.log.w("没有撞球");
                freeBall();
            }
            else if(!this.isValidBall(firstCollision.ballB)) { // 没有撞到有效球
                yy.log.w("没有撞到有效球");
                freeBall();
            }
        }

        if (!result) {
            if (this.round === 1) {
                const outs = Outcome.getCushions(outcome);
                const Max = 4
                const cushions: number[] = [];
                for(let i = 0; i < outs.length; i++) {
                    if (outs[i].ballA.id !== 0 && !cushions.includes(outs[i].ballA.id)) {
                        cushions.push(outs[i].ballA.id);
                    }
                }
                //最少要有4个子球碰到库边 或者 有球进袋
                if (cushions.length < Max && Outcome.potCount(outcome) === 0) {
                    freeBall();
                }
            }
            else {
                if (Outcome.isCollisionNoCushion(outcome) && Outcome.potCount(outcome) === 0) { // 撞球后没有撞库  先撞库在撞自己球后不碰库算犯规
                    yy.log.w("撞球后没有撞库");
                    freeBall();
                }
            }
        }
        
        return result;
    }
    placeBalls(isStart: boolean) {
        let table = BilliardManager.instance.getTable();
        table.prepareBalls(BilliardConst.startPos, isStart);
        table.initTable();
    }
    isGameEnd(outcome: Outcome[], resultType: { type: eOutcomeType; }): boolean {
        let result = false;
        if (resultType.type === eOutcomeType.FreeBall) {
            if (Outcome.is9BallPotted(outcome)) {
                //9号球打进且白球掉袋或犯规对手直接获胜
                resultType.type = eOutcomeType.Failed;
                result = true;
            }
        }
        else {
            let potBalls = Outcome.pots(outcome);
            if (potBalls.length === 0) { // 没有进球则对方球权
                resultType.type = eOutcomeType.Turn;
            }
            else if (Outcome.is9BallPotted(outcome)) {
                resultType.type = eOutcomeType.Win;
                result = true;
            }
            else {
                resultType.type = eOutcomeType.Continue;
            }
        }

        return result;
    }
    nextTurn(type: number, actionUid: number, round: number) {
        let view = BilliardManager.instance.getView();
        let puid = BilliardData.instance.getActionUid()
        this.round = round;
        yy.log.w(`nextTurn round: ${round}`);

        switch (type) {
            case 0:
                if (puid === actionUid) {
                    this.shotCount ++;
                    if (this.shotCount >= 3) {
                        BilliardTools.instance.playSoundApplause();
                    }
                }
                else {
                    this.shotCount = 1;
                    BilliardTools.instance.PlaySoundTurn();
                    BilliardData.instance.setActionUid(actionUid)
                    view.gameTips.turnTips();
                }
                let ball = this.onShotBall();
                if (ball) {
                    view.autoShotAt(ball.node);
                }
                break;
            case 1:
                break;
            case 2:
                BilliardTools.instance.PlaySoundTurn();
                this.shotCount = 1;
                // yy.toast.addNow("击球犯规，下家放置自由球");
                BilliardData.instance.setActionUid(actionUid)
                let table = BilliardManager.instance.getTable();
                if (Outcome.isCueBallPotted(BilliardManager.instance.getCueBall(), table.outcome)) {// 打进母球
                    view.gameTips.cueInPocketTips();
                    view.gameTips.freeBallTips();
                }
                else if(Outcome.isCollisionNoCushion(table.outcome)) { // 没有撞库
                    view.gameTips.cushionTips();
                    view.gameTips.freeBallTips();
                }
                else {
                    view.gameTips.foulTips();
                    view.gameTips.freeBallTips();
                }

                view.freeBall.setStartAreaHide();
                table.cueBall.updatePosImmediately(Vec3.ZERO);


                view.freeBall.node.active = true;
                view.freeBall.nodeForbid.active = !table.isValidFreeBall();
                view.onFreeBall();
                view.onFreeBallMove(!table.isValidFreeBall(), false, false);
                break;
        }

        if (type === 2) {
            if (!BilliardTools.instance.isMyAction()) {
                BilliardAI.instance.freeball();
            }
        }
        else {
            if (!BilliardTools.instance.isMyAction()) {
                BilliardAI.instance.hitBall();
            }
        }
        view.setPlayerCountDown(BilliardData.instance.getActionTimes());
        yy.log.w("当前行动玩家", BilliardData.instance.getActionUid());
    }
    startTurn() {
        let table = BilliardManager.instance.getTable();
        let view = BilliardManager.instance.getView();
        this.round = 1; // 回合数 + 1
        let ball = table.recentlyBall();
        if (ball) {
            // view.autoShotAt(ball.node);
            view.onFreeBall();
        }

        // BilliardData.instance.setActionUid(1)//(Math.random() < 0.5 ? 1 : 2 );
        view.setPlayerCountDown(BilliardData.instance.getActionTimes());
        yy.log.w("当前行动玩家", BilliardData.instance.getActionUid());


        if (!BilliardTools.instance.isMyAction()) {
            BilliardAI.instance.MoveStartCueBall();
        }
        else {
            view.controlShow();
        }

        view.freeBall.setStartAreaShow();
        view.gameTips.startTips();
    }
    onShotBall(): Ball {
        let table = BilliardManager.instance.getTable();
        let balls = table.getOnTableBalls();
        balls.sort((a, b)=> a.id - b.id);
        return balls[1]; // 从1 开始排除 0
    }
    getShowBalls(type: any): number[] {
        const table = BilliardManager.instance.getTable();
        const balls = table.getOnTableBalls();
        const sBalls = [];
        balls.forEach(b=> {
            if (b.id !== 0)
                sBalls.push(b.id)
        });
        return sBalls;
    }



    isValidBall(ball: Ball) {
        return true;
    }

}


