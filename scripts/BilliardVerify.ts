/*
    校验备用，纯算法台球运算
*/
import { BaseCommonInstance } from '../../../../main/base/BaseCommonScript';
import { yy } from '../../../../yy';
import { Table } from './Table';
import { IBilliardRules } from './rules/IBilliardRules';
import { BilliardData } from '../data/BilliardData';
import { BilliardService } from '../net/BilliardService';
import { eOutcomeType } from '../config/BilliardConst';
import { track } from './physics/track';
import { Ball } from './Ball';
import { BilliardEightBallVerify } from './rules/BilliardEightBallVerify';
import { BilliardNineBallVerify } from './rules/BilliardNineBallVerify';

export class BilliardVerify extends BaseCommonInstance {
    private static __instance__: BilliardVerify;
    static get instance(): BilliardVerify {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardVerify();
        }
        return this.__instance__;
    }

    delete(){
        delete BilliardVerify.__instance__
    }

    private table: Table
    private rules: IBilliardRules;

    constructor(name: string = 'base_instance') {
        super(name);

        this.table = new Table();
    }

    getCueBall(): Ball {
        return this.table.cueBall;
    }

    getTable(): Table {
        return this.table;
    }

    getRules(): IBilliardRules {
        return this.rules;
    }

    setRules(type) {
        switch (BilliardData.instance.getGameType()) {
            case 8:
                this.rules = new BilliardEightBallVerify();
                break;
            case 9:
                this.rules = new BilliardNineBallVerify();
                break;
            default: 
                yy.log.e("error eRuleType:", BilliardData.instance.getGameType());
        }
    }


    register_event() {
        this.event_func_map = {

            [yy.Event_Name.billiard_table_init]: "onInitGame",
            [yy.Event_Name.billiard_notify_entergame]: "onEnterGame",
            [yy.Event_Name.billiard_notify_start]: "onStart",
            [yy.Event_Name.billiard_allStationary] : 'onAllStationary',
            [yy.Event_Name.billiard_notify_result]: "onServiceResult",
            [yy.Event_Name.billiard_notify_action]: "onAction",


            [yy.Event_Name.billiard_reconnect]: "onReconnect",
        }

        super.register_event();
    }

    onInitGame() {
        const table = this.table;
        const rules = this.rules;

        this.setRules(BilliardData.instance.getGameType());

        BilliardService.instance.sendStart()// 单机测试用
    }


    onStart() {
        const rules = this.rules;

        rules.placeBalls(true);
        rules.startTurn();
    }
    onAllStationary() {
        this.onResult();
    }

    onResult() {
        const table = this.table;
        const rules = this.rules;
        let result: { type: eOutcomeType } = { type: eOutcomeType.None };
        if (rules.isFoul(table.outcome)) {
            result.type = eOutcomeType.FreeBall;
            if (rules.isGameEnd(table.outcome, result)) {
                yy.log.w("Game End");
                BilliardService.instance.sendResult(result.type, table);
                BilliardService.instance.sendResultReq(result.type, table, rules.round);
                return;
            }
        }
        else if (rules.isGameEnd(table.outcome, result)) {
            yy.log.w("Game End");
            BilliardService.instance.sendResult(result.type, table);
            BilliardService.instance.sendResultReq(result.type, table, rules.round);
            return;
        } 

        BilliardService.instance.sendResult(result.type, table);
        BilliardService.instance.sendResultReq(result.type, table, rules.round);

    }
    
    onServiceResult (result: protoBilliard.IResult) {
        const table = this.table;
        switch(result.type) {
            case eOutcomeType.Continue:
                table.onSetServiceData(result);
                break;
            case eOutcomeType.Turn:
                table.onSetServiceData(result);
                break;
            case eOutcomeType.FreeBall:
                table.onSetServiceData(result);
                break;
            case eOutcomeType.Failed:
                break;
            case eOutcomeType.Win:
                break;
            case eOutcomeType.StartPot8:
                table.onSetServiceData(result, true);
                track.clear();
                break;
            default:
                yy.log.e("onServiceResult error:", result);
        }
        yy.log.w("onServiceResult:", result);
    }

    onAction(action: protoBilliard.IAction) {
        const rules = this.rules;
        rules.nextTurn(action.type, action.uid, action.round);
    }


    onReconnect(msg: protoBilliard.GameStatus) {
        const table = this.table;
        const rules =this.rules;
        table.clearData();

        rules.round = msg.action.round;// 同步回合数据
        // 球摆法处理
        rules.placeBalls(false);
        for (let i = 0; i < msg.validResult.potBalls.length; i++) {
            for(let j = 0; j < table.balls.length; j++) {
                if (msg.validResult.potBalls[i] === table.balls[j].id) {
                    track.froceUpdateTrack(table.balls[j]);
                    break;
                }
            }
        }
        table.setBallsRotation(msg.validResult.balls, msg.action.type);


        // if(rules instanceof BilliardNineBall) {
        //     let ball= rules.onShotBall(); // 9球有效球判断
        //     rules.disBallId = ball.id;
        // }
        // 动态重连
        if (BilliardData.instance.getPower() !== 0) { 
            yy.event.emit(yy.Event_Name.billiard_hit);
        }
        else { 
            // 8球 定色球重连 提示添加
            if(rules instanceof BilliardEightBallVerify) {
                if (rules.isSureBall()) {
                    const tBalls = table.getOnTableBalls();
                    const hitType = BilliardData.instance.getHitBallType();
                    for (let i = 1; i < tBalls.length; i++) {
                        if (rules.getBallType(tBalls[i]) === hitType) {
                            if (tBalls[i].ui) tBalls[i].ui.showTips();
                        }
                    }
                }
            }
            // else if(rules instanceof BilliardNineBall) {
            //     const ball= rules.onShotBall();
            //     if(rules.isValidBall(ball) && ball.ui) {
            //         ball.ui.showTips();
            //     }
            // }
        }
    }
}


