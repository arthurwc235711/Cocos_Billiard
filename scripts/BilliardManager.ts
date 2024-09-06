import { Camera, director, find, Vec3, Node } from "cc";
import { BaseCommonInstance } from "../../../../main/base/BaseCommonScript";
import { yy } from "../../../../yy";
import { BilliardUIView } from "../../../../games/casual_games/billiard/module/billiard_table/scripts/BilliardUIView";
import { Outcome } from "../../../../games/casual_games/billiard/scripts/physics/Outcome";
import { Table } from "./Table";
import { Ball } from "./Ball";
import { BilliardData } from "../../../../games/casual_games/billiard/data/BilliardData";
import { track } from "../../../../games/casual_games/billiard/scripts/physics/track";
import { IBilliardRules } from "../../../../games/casual_games/billiard/scripts/rules/IBilliardRules";
import { BilliardConst, eOutcomeType, eReportEventId, eRuleType } from "../../../../games/casual_games/billiard/config/BilliardConst";
import { BilliardEightBall } from "../../../../games/casual_games/billiard/scripts/rules/BilliardEightBall";
import { BilliardService } from "../../../../games/casual_games/billiard/net/BilliardService";

import { BilliardNineBall } from "../../../../games/casual_games/billiard/scripts/rules/BilliardNineBall";
import { ClientConfig } from "../../../../main/data/ClientConfig";
import { BilliardGuideRules } from "../../../../games/casual_games/billiard/scripts/rules/BilliardGuideRules";
import { BilliardScene } from "../../../../games/casual_games/billiard/scene/BilliardScene";
import { HttpReport, HttpReportTypeEnum } from "../../../../main/utils/HttpReport";
import { BilliardWaitView } from "../../../../games/casual_games/billiard/module/billiard_wait/scripts/BilliardWaitView";
import { BilliardBall } from "../../../../games/casual_games/billiard/module/billiard_table/scripts/BilliardBall";
import { BilliardTools } from "./BilliardTools";
import { bounceHan1, bounceHanBlend } from "./physics/physics";
import { sete, setm, setmu, setmuC, setmuS } from "./physics/constants";


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

    private _scene: BilliardScene;
    private _table: Table;
    private _view: BilliardUIView;
    private _rules: IBilliardRules;
    private _delayTime: number = 0; // 结算界面延时打开
    private static _waitTime: number = 0; // Ready等待时间
    private _isOtherLeaveTips: boolean = false; // 是否是对方离开提示

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
    setScene(scene: BilliardScene) {
        this._scene = scene;
    }
    getScene(): BilliardScene {
        return this._scene;
    }

    getCueBall(): Ball {
        return this.getTable().cueBall;
    }

    getCueBallUI(): BilliardBall {
        return this.getTable().cueBall.ui;
    }

    setRules() {
        switch (BilliardData.instance.getGameType()) {
            case 0:
                this._rules = new BilliardGuideRules();
                break;
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

            [yy.Event_Name.billiard_wait_enter_settime]: "delayShowWaitView",
        }

        super.register_event();
    }

    release() {
        super.release();
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
            if(table.ui) {
                view.initBtnTable(table.ui.node.getChildByName("Plane"), table.ui.node.getChildByName("PocketPosition").children);
            } 
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
        this.unScheduleOpenWaitEnterView(); // 取消开始监听事件
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
                BilliardService.instance.sendAction(uid, 6, 3); // 3 用于新手引导不显示，控制条
                break;
            case eOutcomeType.Turn:
                table.onSetServiceData(result);
                // BilliardService.instance.sendAction(uid === 1 ? 2 : 1, 10, 0);
                BilliardService.instance.sendAction(1, 6, 3); // 3 用于新手引导不显示，控制条
                break;
            case eOutcomeType.FreeBall:
                table.onSetServiceData(result);
                // BilliardService.instance.sendAction(uid === 1 ? 2 : 1, 10, 2);
                BilliardService.instance.sendAction(1, 6, 2);
                break;
            case eOutcomeType.Failed:
                break;
            case eOutcomeType.Win:
                // break;
                let hitCount = BilliardData.instance.getHitCount() + 1;// 
                if (hitCount > 2) {
                    view.gameTips.comboTips(hitCount)
                    this._delayTime = 2;
                }
                else this._delayTime = 0;
                break;
            case eOutcomeType.StartPot8:
                table.onSetServiceData(result, true);
                track.clear();
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

        if (BilliardTools.instance.isMyAction()) {
            const p = BilliardManager.instance.getScene().get_scene_layer_popup().getChildByName("p_billiard_wait");
            if (p) p.destroy();
        }
        else { // 非自己行动回合才显示 离线提示
            if (BilliardData.instance.getMarkOfflineTime() > 0) {
                BilliardTools.instance.openWaitView(BilliardData.instance.getMarkOfflineTime());
            }
        }
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

        if (notify.settleType === 3) {
            view.gameTips.letfTips();
            this._delayTime = 2;
        }

        view.scheduleOnce(()=>{
            BilliardTools.instance.openWinsView(notify);
        }, 2 + this._delayTime);
    }


    clearGameData() {
        let view = this.getView();
        let table = this.getTable();
        view.clearData();
        table.clearData();
        BilliardData.instance.resetData();
    }

    onRematch() {
        // BilliardService.instance.sendEnterByTable();
        BilliardService.instance.sendReady();
        let view = this.getView();
        let table = this.getTable();
        view.clearData();
        table.clearData();
        // BilliardData.instance.clearData();
    }

    onReconnect(msg: protoBilliard.GameStatus) {
        let view = this.getView();
        let table = this.getTable();
        let rules =this.getRules();
        view.clearData();
        table.clearData();

        view.stopHitTween();// 如果有击球数据暂停击球动画，否则会有双次击球导致画面不同步异常

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
        view.setPlayerCountDown(BilliardData.instance.getActionTimes());


        if(rules instanceof BilliardNineBall) {
            let ball= rules.onShotBall(); // 9球有效球判断
            rules.disBallId = ball.id;
        }
        // 动态重连
        if (BilliardData.instance.getPower() !== 0) { 
            yy.event.emit(yy.Event_Name.billiard_hit);
            view.controlHide();
        }
        else { 
            view.setCueFrame();
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
                if (table.ui) {
                    table.ui.scheduleOnce(()=>{ // 强制延迟一针处理不然坐标更新有概率有异常
                        view.onFreeBall();
                        view.onFreeBallMove(!table.isValidFreeBall(), false, false);
                    }, 0);
                }
            }
            else {
                // 指向处理
                if (msg.cueAngle.curScreenPos.x === 0) { // 没有移动角度默认 指向最近目标
                    let ball = rules.onShotBall();
                    if (ball && ball.ui) {
                        view.autoShotAt(ball.ui.node);
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
                            if (tBalls[i].ui) tBalls[i].ui.showTips();
                        }
                    }
                }
            }
            else if(rules instanceof BilliardNineBall) {
                let ball= rules.onShotBall();
                // rules.disBallId = ball.id;
                if(rules.isValidBall(ball) && ball.ui) {
                    ball.ui.showTips();
                }
            }

        }



        this.setSureBalls();

        let lockTime = 0;
        // 锁屏判断
        msg.users.forEach(player=>{
            if (player.status === 4) {
                lockTime = player.offlineTimer;
            }
        });
        if(lockTime > 0) {
            const p = BilliardManager.instance.getScene().get_scene_layer_popup().getChildByName("p_billiard_wait");
            if (BilliardTools.instance.isMyAction()) {// 自己行动回合不显示对方离线，只标记对方
                if(p) p.destroy();
                BilliardData.instance.setMarkOfflineTime(lockTime*1000 + performance.now());
            }
            else {
                if (p) p.getComponent(BilliardWaitView).setWaitTime(lockTime*1000 + performance.now());
                else  BilliardTools.instance.openWaitView(lockTime*1000 + performance.now());
            }
        }
        else {
            BilliardData.instance.setMarkOfflineTime(0);
        }
    }


    onQuit() {
        if ( BilliardData.instance.is8Ball() ) {
            yy.user.setLobbyOpenGameLevel({ gameKey: "billiard8ball" });
            HttpReport.reportClickEvent({eventId: eReportEventId.e8BallGoBack}, HttpReportTypeEnum.CLICK_EVENT);
        }
        else if ( BilliardData.instance.is9Ball() ) {
            yy.user.setLobbyOpenGameLevel({ gameKey: "billiard9ball" });
            HttpReport.reportClickEvent({eventId: eReportEventId.e9BallGoBack}, HttpReportTypeEnum.CLICK_EVENT);
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
        let pb = new protoAccount.OnlineStatusReq();
        yy.socket.send('AccountService.OnlineStatus', pb);
        // BilliardService.instance.sendForeBackstageReq(0);
    }

    onOffline(notify: protoBilliard.NotifyUserNetStatus) {
        if (notify.status === 1) {
            let view = this.getView();
            if (BilliardData.instance.isOldVersion()) {
                BilliardTools.instance.openWaitView(notify.timer);
                view.billiardTop.pauseCountDown();
            }
            else {
                if (BilliardTools.instance.isMyAction()) {// 自己行动回合不显示对方离线，只标记对方
                    BilliardData.instance.setMarkOfflineTime(notify.timer*1000 + performance.now());
                }
                else {
                    BilliardTools.instance.openWaitView(notify.timer*1000 + performance.now());
                }
            }
        }
    }

    onActionTimeOut(notify: protoBilliard.IHitTimeOut) {
        this.getRules().uidTimeOut = notify.uid;
        // this.getView().gameTips.timeOutTips(notify.uid);

    }

    onFoulsTimes(notify: protoBilliard.NotifyFoulAction) {

    }


    onLeave(reason: number = 0) {
        if (reason !== 0 && reason !== 2) {// 强制退出  不为0 代表玩家异常ready前异常中断
            this.unScheduleOpenWaitEnterView(); // 取消开始监听事件
            this._isOtherLeaveTips = true;
            yy.dialog.show(
                {
                    title: "Tip",
                    content: `Other players quit the game`,
                    isCancelEnable: false,
                    isConfirmEnable: true,
                    confirmText: "OK",
                    confirmCallback: () => {
                        BilliardService.instance.sendExit();
                        yy.event.emit(yy.Event_Name.CasualCommonQuit)
                    },
                    closeCallback: () => {
                        BilliardService.instance.sendExit();
                        yy.event.emit(yy.Event_Name.CasualCommonQuit)
                    },
                    fontSize: 50,
                    lineHeight: 60,
            });
        }
    }



    showWaitEnterView(time: number) {
        BilliardTools.instance.openWaitEnterView(BilliardManager._waitTime - 3);
    }

    delayShowWaitView(time: number) {
        const scene = director.getScene().getComponentInChildren(BilliardScene);
        if(!this._isOtherLeaveTips && scene && scene.get_scene_layer_popup().getChildByName("p_billiard_wins") == null) {
            BilliardManager._waitTime = time;
            let table = this.getTable();
            if (table.ui) table.ui.scheduleOnce(this.showWaitEnterView, 3);
        }
    }

    unScheduleOpenWaitEnterView() {
        let table = this.getTable();
        if (table.ui) table.ui.unschedule(this.showWaitEnterView);
    }


    setAlogVersion(ver: number) {
        const table = BilliardManager.instance.getTable();
        if (table) {
            yy.log.w("setAlogVersion:", ver)
            switch(ver) {
                case 0: // 默认旧版算法版本
                table.cushionModel = bounceHanBlend;
                    setmu(0.00985);
                    setmuS(0.15);
                    setmuC(0.8);
                    setm(0.23);
                    sete(0.86);
                    break;
                case 1:
                    yy.log.w("setAlogVersion", "1")
                    table.cushionModel = bounceHan1;
                    setmu(0.00985 * 1.35);
                    setmuS(0.2);
                    setmuC(1);
                    setm(0.156);
                    sete(0.92);
                    break;
                default: // 默认旧版算法版本
                table.cushionModel = bounceHanBlend;
                setmu(0.00985);
                setmuS(0.15);
                setmuC(0.8);
                setm(0.23);
                sete(0.86);
            } 
        }

    }

}


