import { Camera, director, find, Vec3, Node } from "cc";
import { BaseCommonInstance } from "../../../../main/base/BaseCommonScript";
import { yy } from "../../../../yy";
import { BilliardUIView } from "../module/billiard_table/scripts/BilliardUIView";
import { Outcome } from "../module/billiard_table/scripts/Outcome";
import { Table } from "../module/billiard_table/scripts/Table";
import { Ball } from "../module/billiard_table/scripts/Ball";
import { BilliardData } from "../data/BilliardData";
import { track } from "./physics/track";
import { IBilliardRules } from "../module/billiard_table/scripts/rules/IBilliardRules";
import { BilliardConst, eOutcomeType, eRuleType } from "../config/BilliardConst";
import { BilliardEightBall } from "../module/billiard_table/scripts/rules/BilliardEightBall";
import { BilliardService } from "../net/BilliardService";
import { BilliardTools } from "./BilliardTools";
import { BilliardNineBall } from "../module/billiard_table/scripts/rules/BilliardNineBall";
import { ClientConfig } from "../../../../main/data/ClientConfig";

export class BilliardManager extends BaseCommonInstance{
    private static __instance__: BilliardManager;
    static get instance(): BilliardManager {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardManager();
        }
        return this.__instance__;
    }

    delete(){
        delete BilliardManager.__instance__
    }

    private _camera3d: Camera
    get camera3d(): Camera {
        if (!this._camera3d) {
            this._camera3d = find("p_billiard_3d/Main Camera").getComponent(Camera);
        }
        return this._camera3d;
    }
    private _camera2d: Camera
    get camera2d(): Camera {
        if (!this._camera2d) {
            this._camera2d = find("Canvas/Camera").getComponent(Camera);
        }
        return this._camera2d;
    }

    private _table: Table;
    private _view: BilliardUIView;
    private _rules: IBilliardRules;

    setTable(table: Table) {
        this._table = table;
    }
    getTable(): Table {
        return this._table;
    }

    setView(view: BilliardUIView) {
        this._view = view;
    }
    getView(): BilliardUIView {
        return this._view;
    }

    getCueBall(): Ball {
        return this.getTable().cueBall;
    }

    setRules() {
        switch (BilliardData.instance.getGameType()) {
            case 8:
                this._rules = new BilliardEightBall();
                break;
            case 9:
                this._rules = new BilliardNineBall();
                break;
            default: 
                yy.log.e("error eRuleType:", BilliardData.instance.getGameType());
        }
    }

    getRules() {        
        return this._rules;
    }


    register_event() {
        this.event_func_map = {
            [yy.Event_Name.CasualCommonQuit]: "onQuit",
            [yy.System_Event.Application_Pause]: 'onPause',
            [yy.System_Event.Application_Resume]: 'onResume',

            [yy.Event_Name.billiard_table_init]: "onInitGame",
            [yy.Event_Name.billiard_allStationary] : 'onAllStationary',
            [yy.Event_Name.billiard_hit_cd_stop]: "onHitCdStop",

            [yy.Event_Name.billiard_notify_entergame]: "onEnterGame",
            [yy.Event_Name.billiard_notify_start]: "onStart",
            [yy.Event_Name.billiard_notify_result]: "onServiceResult",
            [yy.Event_Name.billiard_notify_action]: "onAction",
            [yy.Event_Name.billiard_notify_wins]: "onWins",

            [yy.Event_Name.billiard_clear_game_data]: "clearGameData",


            [yy.Event_Name.billiard_rematch]: "onRematch",
            [yy.Event_Name.billiard_reconnect]: "onReconnect",
            [yy.Event_Name.billiard_notify_offline]: "onOffline",
            [yy.Event_Name.billiard_notify_timeout]: "onActionTimeOut",
            [yy.Event_Name.billiard_notify_foulstimes]: "onFoulsTimes",
            [yy.Event_Name.billiard_notify_leave]: "onLeave",
        }

        super.register_event();
    }

    reset_data () {
        this.delete();
        BilliardData.instance.delete();
        track.clear();
    }

    onInitGame() {
        let table = this.getTable();
        let view = this.getView();
        let rules = this.getRules();

        // rules.placeBalls();
        view.scheduleOnce(()=>{
            view.initBtnTable(table.node.getChildByName("Plane"));
            // view.setPlayerInfo();
            // rules.startTurn();

            // view.setPlayerCountDown(20);
        }, 0);

        BilliardService.instance.sendStart()// 单机测试用
    }


    onAllStationary() {
        // let view = this.getView();
        // // let table = this.getTable();
        // let rules = this.getRules();
        this.onResult();
        // this.getView().onAllStationary();
        // let ball = rules.onShotBall();
        // if (ball) {
        //     view.autoShotAt(ball.node);
        // }
    }

    onResult() {
        let table = this.getTable();
        let rules = this.getRules();
        let view = this.getView();
        let result: { type: eOutcomeType } = { type: eOutcomeType.None };
        if (rules.isFoul(table.outcome)) {
            result.type = eOutcomeType.FreeBall;
            if (rules.isGameEnd(table.outcome, result)) {
                yy.log.w("Game End");
                BilliardService.instance.sendResult(result.type);
                BilliardService.instance.sendResultReq(result.type);
                return;
            }
        }
        else if (rules.isGameEnd(table.outcome, result)) {
            yy.log.w("Game End");
            BilliardService.instance.sendResult(result.type);
            BilliardService.instance.sendResultReq(result.type);
            return;
        } 

        BilliardService.instance.sendResult(result.type);
        BilliardService.instance.sendResultReq(result.type);

    }

    onHitCdStop() {
        let view = this.getView();
        view.stopCountDown();
    }


    setSureBalls() {
        const table = this.getTable();
        const view = this.getView();
        const rules = this.getRules();
        const players = BilliardData.instance.getAllPlayers();
        players.forEach(p=>{
            // yy.log.w("getHitBalls", p, p.uid);          

            view.billiardTop.setPlayerBalls(rules.getShowBalls(p.hitType), p.uid);
        });
    }



    onStart() {
        let view = this.getView();
        let rules = this.getRules();

        rules.placeBalls(true);
        view.scheduleOnce(()=>{
            view.setPlayerInfo();
            view.initUIShow();
            rules.startTurn();
            view.onAllStationary();

            // view.setPlayerCountDown(20);
        }, 0);
    }


    onServiceResult (result: protoBilliard.IResult) {
        let table = this.getTable();
        let view = this.getView();
        let rules = this.getRules();
        let uid = BilliardData.instance.getActionUid();
        switch(result.type) {
            case eOutcomeType.Continue:
                table.onSetServiceData(result);
                BilliardService.instance.sendAction(uid, 6, 0);
                break;
            case eOutcomeType.Turn:
                table.onSetServiceData(result);
                // BilliardService.instance.sendAction(uid === 1 ? 2 : 1, 10, 0);
                BilliardService.instance.sendAction(1, 6, 0);
                break;
            case eOutcomeType.FreeBall:
                table.onSetServiceData(result);
                // BilliardService.instance.sendAction(uid === 1 ? 2 : 1, 10, 2);
                BilliardService.instance.sendAction(1, 6, 2);
                break;
            case eOutcomeType.Failed:

                break;
            case eOutcomeType.Win:

                break;
            default:
                yy.log.e("onServiceResult error:", result);
        }
    }

    onAction(action: protoBilliard.IAction) {
        let table = this.getTable();
        let view = this.getView();
        let rules = this.getRules();
        view.resetData();
        rules.nextTurn(action.type, action.uid, action.round);
        this.setSureBalls();
        view.onAllStationary();
    }


    onEnterGame() {
        let view = this.getView();
        view.setPlayerInfo();
        view.initUIShow();
        this.setRules();
    }


    onWins(notify: protoBilliard.BroadcastGameResult) {
        let view = this.getView();
        view.controlHide();
        view.stopCountDown()
        if (notify.winnerid === yy.user.getUid()) {
            view.gameTips.showWinTips();
        }
        else {
            view.gameTips.showLoseTips(notify.winnerid);
        }

        view.scheduleOnce(()=>{
            BilliardTools.instance.openWinsView(notify);
        }, 2);


        // this.clearGameData();
    }


    clearGameData() {
        let view = this.getView();
        let table = this.getTable();
        view.clearData();
        table.clearData();
        BilliardData.instance.resetData();
    }

    onRematch() {
        BilliardService.instance.sendEnterGame();
        let view = this.getView();
        let table = this.getTable();
        view.clearData();
        table.clearData();
        BilliardData.instance.clearData();
    }

    onReconnect(msg: protoBilliard.GameStatus) {
        let view = this.getView();
        let table = this.getTable();
        let rules =this.getRules();
        view.clearData();
        table.clearData();

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



        // 动态重连
        if (BilliardData.instance.getPower() !== 0) { 
            yy.event.emit(yy.Event_Name.billiard_hit);
            view.controlHide();
        }
        else { 

            // 自由球处理
            if (msg.action.type !== 0) {
                if (msg.action.type === 1) {
                    view.freeBall.setStartAreaShow();
                    // table.cueBall.updatePosImmediately(BilliardConst.startPos); 使用服务器数据不强制赋值
                }
                else if (msg.action.round === 2 && BilliardData.instance.is8Ball()) {
                    view.freeBall.setStartAreaShow();
                }
                else {
                    view.freeBall.setStartAreaHide();
                    // table.cueBall.updatePosImmediately(Vec3.ZERO);  使用服务器数据不强制赋值
                }

                view.freeBall.node.active = true;
                view.freeBall.nodeForbid.active = !table.isValidFreeBall();
                table.scheduleOnce(()=>{ // 强制延迟一针处理不然坐标更新有概率有异常
                    view.onFreeBall();
                    view.onFreeBallMove(!table.isValidFreeBall(), false, false);
                }, 0);

            }
            else {
                // 指向处理
                if (msg.cueAngle.curScreenPos.x === 0) { // 没有移动角度默认 指向最近目标
                    let ball = rules.onShotBall();
                    if (ball) {
                        view.autoShotAt(ball.node);
                    }
                }
                else {
                    yy.event.emit(yy.Event_Name.billiard_notify_cueangle, msg.cueAngle);
                }
            }


            // 8球 定色球重连 提示添加
            if(rules instanceof BilliardEightBall) {
                if (rules.isSureBall()) {
                    let table = BilliardManager.instance.getTable();
                    let tBalls = table.getOnTableBalls();
                    let hitType = BilliardData.instance.getHitBallType();
                    for (let i = 1; i < tBalls.length; i++) {
                        if (rules.getBallType(tBalls[i]) === hitType) {
                            tBalls[i].showTips();
                        }
                    }
                }
            }
            else if(rules instanceof BilliardNineBall) {
                let ball= rules.onShotBall();
                if(rules.isValidBall(ball)) {
                    ball.showTips();
                }
            }

        }



        this.setSureBalls();
    }


    onQuit() {
        if ( BilliardData.instance.is8Ball() ) {
            yy.user.setLobbyOpenGameLevel({ gameKey: "billiard8ball" });
        }
        else {
            yy.user.setLobbyOpenGameLevel({ gameKey: "billiard9ball" });
        }
        yy.audio.stopMusic()
        yy.audio.stopSound()
        yy.scene.change_bundle_scene('app_lobby', 'lobby_scene', () => {
            yy.loader.releaseBundle(BilliardConst.bundleName);
            yy.loader.releaseBundle('app_casual_common');
        });

        // 历史记录
        ClientConfig.instance()?.setPlayGame(BilliardData.instance.gid);
    }

    onPause() {
        yy.log.w("onPause");
        BilliardService.instance.sendForeBackstageReq(1);
    }

    onResume() {
        yy.log.w("onResume");
        BilliardService.instance.sendForeBackstageReq(0);
    }

    onOffline(notify: protoBilliard.NotifyUserNetStatus) {
        if (notify.status === 1) {
            let view = this.getView();
            BilliardTools.instance.openWaitView(notify.timer);
            view.billiardTop.pauseCountDown();
        }
    }

    onActionTimeOut(notify: protoBilliard.IHitTimeOut) {
        this.getRules().uidTimeOut = notify.uid;
        // this.getView().gameTips.timeOutTips(notify.uid);

    }

    onFoulsTimes(notify: protoBilliard.NotifyFoulAction) {

    }


    onLeave(reason: number = 0) {
        if (reason !== 0) {// 强制退出  不为0 代表玩家异常ready前异常中断
            yy.dialog.show(
                {
                    title: "Tip",
                    content: `Other players quit the game`,
                    isCancelEnable: false,
                    isConfirmEnable: true,
                    confirmText: "OK",
                    confirmCallback: () => {
                        yy.event.emit(yy.Event_Name.CasualCommonQuit)
                    },
                    closeCallback: () => {
                        yy.event.emit(yy.Event_Name.CasualCommonQuit)
                    },
                    fontSize: 50,
                    lineHeight: 60,
            });
        }
    }
}


