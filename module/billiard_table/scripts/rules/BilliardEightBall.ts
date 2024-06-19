import { Vec3, view } from "cc";
import { yy } from "../../../../../../../yy";
import { eRuleType, eOutcomeType, BilliardConst } from "../../../../config/BilliardConst";
import { BilliardManager } from "../../../../scripts/BilliardManager";
import { Outcome } from "../Outcome";
import { IBilliardRules } from "./IBilliardRules";
import { BilliardData } from "../../../../data/BilliardData";
import { Ball } from "../Ball";
import { BilliardTools } from "../../../../scripts/BilliardTools";
import { BilliardAI } from "../BilliardAI";
import { table } from "console";


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
        // else if (Outcome.isFirstCushion(outcome)) {// 先撞库
        //     yy.log.w("先撞库");

        //     freeBall();
        // }
        else if (Outcome.firstCollision(outcome) === undefined) {// 没有撞球
            yy.log.w("没有撞球");
            freeBall();
        }
        else if (Outcome.isCollisionNoCushion(outcome) && Outcome.potCount(outcome) ===0) { // 撞球后没有撞库  先撞库在撞自己球后不碰库算犯规
            yy.log.w("撞球后没有撞库");
            freeBall();
        }

        if (!result) {
            let o = (Outcome.firstCollision(outcome)) 
            if (o) {
                if (this.isSureBall()) { //定色后为首次击打自己颜色则犯规
                    let balls = BilliardManager.instance.getTable().getOnTableBalls();
                    if (this.hasBallType(balls, BilliardData.instance.getHitBallType()) && this.getBallType(o.ballB) !== BilliardData.instance.getHitBallType()){
                        freeBall();
                    }
                }
                else {
                    // 定色前为首次击打8球则犯规
                    if (this.getBallType(o.ballB) === eBallType.EightBall) {
                        freeBall();
                    }
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
                let potBalls = Outcome.pots(outcome);
                if (potBalls.length === 0) { // 没有进球则对方球权
                    resultType.type = eOutcomeType.Turn;
                }
                else if (Outcome.is8BallPotted(outcome)) { // 最后一杆打进入8球
                    // 最后杆打进8球， 可以同时打进对方球但不能打进己方球
                    if(!Outcome.isIncludeValidPotted(outcome, BilliardData.instance.getHitBalls()) && this.getShowBalls(BilliardData.instance.getHitBallType()).length === 0) {
                        resultType.type = eOutcomeType.Win;
                        result = true;
                    }
                    else {
                        resultType.type = eOutcomeType.Failed;
                        result = true;
                    }
                }
                else if(Outcome.isIncludeValidPotted(outcome, BilliardData.instance.getHitBalls())){
                        resultType.type = eOutcomeType.Continue;
                }
                else {
                    resultType.type = eOutcomeType.Turn;
                }
            }
            else {// 未定色
                let potBalls = Outcome.pots(outcome);
                if (potBalls.length > 0) {
                    if (this.round === 1) {// 开球进球不定色   且开球必定进不了黑8
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
                                    let view = BilliardManager.instance.getView();
                                    view.gameTips.showMyBallTips();
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
    nextTurn(type: number, actionUid: number, round: number) {
        let view = BilliardManager.instance.getView();
        let puid = BilliardData.instance.getActionUid()
        this.round = round;
        yy.log.w(`nextTurn round: ${round}`);
        switch(type) {
            case 0:
                if (puid === actionUid) {
                    // view.gameTips.startTips();
                    // yy.toast.addNow("继续击球");
                }
                else {
                    // yy.toast.addNow("正常击球，交换击球权");
                    BilliardData.instance.setActionUid(actionUid)
                    view.gameTips.turnTips();
                }
                break;
            case 1:
                break;
            case 2:
                // yy.toast.addNow("击球犯规，下家放置自由球");
                BilliardData.instance.setActionUid(actionUid)
                let table = BilliardManager.instance.getTable();
                if (Outcome.isCueBallPotted(BilliardManager.instance.getCueBall(), table.outcome)) {// 打进母球
                    view.gameTips.cueInPocketTips();
                    view.gameTips.freeBallTips();
                }
                else {
                    view.gameTips.foulTips();
                    view.gameTips.freeBallTips();
                }


                if (this.round === 2) {// 开局犯规后对方 限定发球区域摆球
                    view.freeBall.setStartAreaShow();
                    table.cueBall.updatePosImmediately(BilliardConst.startPos);
                }
                else {
                    table.cueBall.updatePosImmediately(Vec3.ZERO);
                }


                view.freeBall.node.active = true;
                view.freeBall.nodeForbid.active = !table.isValidFreeBall();
                view.onFreeBall();
                view.onFreeBallMove(!table.isValidFreeBall(), false);
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

        if (this.isSureBall()) {
            let table = BilliardManager.instance.getTable();
            let tBalls = table.getOnTableBalls();
            let hitType = BilliardData.instance.getHitBallType();
            for (let i = 1; i < tBalls.length; i++) {
                if (this.getBallType(tBalls[i]) === hitType) {
                    tBalls[i].showTips();
                }
            }
        }

        yy.log.w("当前行动玩家", BilliardData.instance.getActionUid());
        // throw new Error("Method not implemented.");
    }

    startTurn() {
        let table = BilliardManager.instance.getTable();
        let view = BilliardManager.instance.getView();
        this.round = 1; // 回合数 + 1
        let ball = table.recentlyBall();
        if (ball) {
            view.autoShotAt(ball.node);
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

        view.gameTips.startTips();
    }

    onShotBall(): Ball {
        let table = BilliardManager.instance.getTable();
        
        if (this.isSureBall()) {
            let balls = table.getOnTableBalls();
            let lengths = [];
            for (let i = 1; i < balls.length; i++) {
                if (this.getBallType(balls[i]) === BilliardData.instance.getHitBallType()) {
                    lengths.push({ squared: table.cueBall.pos.distanceToSquared(balls[i].pos), ball: balls[i] });
                }
            }
            if (lengths.length > 0) {
              lengths.sort((a, b) => a.squared - b.squared);
              return lengths[0].ball;
            }
            else {
              let eightBall = table.balls.filter(ball=>ball.id === 8);
              if (eightBall.length > 0) {
                  return eightBall[0];
              }
            }
        }
        else {
            return table.recentlyBall();
        }

    }

    getShowBalls(type: eBallType) {
        const table = BilliardManager.instance.getTable();
        const balls = table.getOnTableBalls();
        const showBalls = balls.filter(ball => this.getBallType(ball) === type);
        const sBalls = [];
        for (let i = 0; i < showBalls.length; ++i) {
            sBalls.push(showBalls[i].id);
        }

        return sBalls;
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
        else {
            return eBallType.EightBall;
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


