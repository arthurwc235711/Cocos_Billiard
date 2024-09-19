
import { ProtoHelper } from '../../../../../framework/socket/ProtoHelper';
import { StackListenerNew } from '../../../../main/data/GameMessageStack';
import { ISubGameTableInfoItemData } from '../../../../main/data/SubGameData';
import { WalletErrorMgr } from '../../../../main/data/WalletErrorMgr';
import { GameIsolateUtils } from '../../../../main/isolate/GameIsolateUtils';
import { yy } from '../../../../yy';
import { BilliardConst } from '../config/BilliardConst';
import { BilliardData } from '../data/BilliardData';
import { BilliardManager } from '../scripts/BilliardManager';
import { BilliardTools } from '../scripts/BilliardTools';
import { BilliardSimulateService } from './BilliardSimulateService';

interface ServiceName {
    enterMatching: string;
    leaveMatching: string;
    exit: string;
    enterByTable: string;
    ready: string;
    clientEvent: string;
    foreBackStageEvent: string;
}

class ServiceName8Ball implements ServiceName {
    enterMatching = "BilliardAllocService.EnterMatching";
    leaveMatching = "BilliardAllocService.LeaveMatching";
    exit = "BilliardService.Exit";
    enterByTable = "BilliardAllocService.EnterByTable";
    ready = "BilliardService.Ready";
    clientEvent = "BilliardService.ClientEvent";
    foreBackStageEvent = "BilliardService.ForeBackStageEvent";
}

class ServiceName9Ball implements ServiceName {
    enterMatching = "Billiard9BallAllocService.EnterMatching";
    leaveMatching = "Billiard9BallAllocService.LeaveMatching";
    exit = "Billiard9BallService.Exit";
    enterByTable = "Billiard9BallAllocService.EnterByTable";
    ready = "Billiard9BallService.Ready";
    clientEvent = "Billiard9BallService.ClientEvent";
    foreBackStageEvent = "Billiard9BallService.ForeBackStageEvent";
}

export class BilliardService extends StackListenerNew {
    private static __instance__: BilliardService;

    static get instance(): BilliardService {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardService();
        }
        return this.__instance__;
    }

    public delete(){
        delete BilliardService.__instance__;
    }


    public isStandAlone = false;

    public isUserEnterByTable = false;

    private tid: number;
    private levelData: protoBilliard.EnterReq;
    private rematchData: protoBilliard.BilliardsTableCfg
    private serviceName: ServiceName = new ServiceName9Ball();


    setServiceName(gameType: number) {
        if (gameType === 8) {
            this.serviceName = new ServiceName8Ball();
        }
        else if (gameType === 9) {
            this.serviceName = new ServiceName9Ball();
        }
        else {
            yy.log.e("billiard type error", gameType);
        }
    }

    setTid(nTid: any) {
        this.tid = typeof nTid === 'number'?  nTid : nTid.toNumber();
    }

    eventFuncMap: { [key: string]: string } = {
        ////////////////////////////////////////////// 桌球匹配相关 以下 //////////////////////////////////////////////
        ['BilliardAllocService_EnterMatching']: 'respEnterMatching',
        ["BilliardAllocService_EnterMatching_timeout"]: "respEnterMatching",
        ["BilliardAllocService_LeaveMatching"]: "respLeaveMatching",
        ["BilliardAllocService_LeaveMatching_timeout"]: "respLeaveMatching",
        // ["cmd_0x6000"]: "notifyMatchingTable",
        ["cmd_0x2100"]: "notifyMatchingTable",

        ['Billiard9BallAllocService_EnterMatching']: 'respEnterMatching',
        ["Billiard9BallAllocService_EnterMatching_timeout"]: "respEnterMatching",
        ["Billiard9BallAllocService_LeaveMatching"]: "respLeaveMatching",
        ["Billiard9BallAllocService_LeaveMatching_timeout"]: "respLeaveMatching",
        ////////////////////////////////////////////// 桌球匹配相关 以上 //////////////////////////////////////////////

        ["BilliardAllocService_EnterByTable"]: "BilliardAllocService_EnterByTable",
        ["BilliardAllocService_EnterByTable_timeout"]: "BilliardAllocService_EnterByTable_Timeout",
        ["BilliardService_EnterGame"]: "respEnterGame",
        ["BilliardService_Ready"]: "respReady",
        ["BilliardService_Exit"]: "respExit",
        ["BilliardService_ClientEvent"]: "respClientEvent",



        ["Billiard9BallAllocService_EnterByTable"]: "BilliardAllocService_EnterByTable",
        ["Billiard9BallAllocService_EnterByTable_timeout"]: "BilliardAllocService_EnterByTable_Timeout",
        ["Billiard9BallService_EnterGame"]: "respEnterGame",
        ["Billiard9BallService_Ready"]: "respReady",
        ["Billiard9BallService_Exit"]: "respExit",
        ["Billiard9BallService_ClientEevnt"]: "respClientEvent",


        ['AccountService.OnlineStatus']: 'onlineStatus',

        ["cmd_0x6003"]: "notifyReady",
        ["cmd_0x6004"]: "notifyExit",
        ["cmd_0x6008"]: "notifyOffLine",
        ["cmd_0x6009"]: "notifyDisbandTable",
    
        ["cmd_0x6011"]: "notifyEnterGame",
        ["cmd_0x6012"]: "notifyStart",
        ["cmd_0x6013"]: "notifyAction",
        ["cmd_0x6015"]: "notifyFreeBall",
        ["cmd_0x6017"]: "notifyCueAngle",
        ["cmd_0x6019"]: "notifyHit",
        ["cmd_0x6021"]: "notifyResult",
        ["cmd_0x6022"]: "notifyGameResult",
        ["cmd_0x6024"]: "notifyChat",
        ["cmd_0x6026"]: "notifyPersonal",
        ["cmd_0x6028"]: "notifyCueOffset",
        ["cmd_0x6029"]: "notifyActionTimeOut",
        ["cmd_0x6030"]: "notifyFoulTimes",



    /*测试协议*/
        // ["BilliardAllocService_Start"]: "notifyStart",
        // ["BilliardAllocService_CueMove"]: "notifyCueMove",
        // ["BilliardAllocService_CueAngle"]: "notifyCueAngle",
        // ["BilliardAllocService_Hit"]: "notifyHit",
        // ["BilliardAllocService_Result"]: "notifyResult",
        // ["BilliardAllocService_Action"]: "notifyAction",
    }

    


    public isUseMatch = false;  // 用于区分重连时的异常状态
    /********************************************匹配相关  开始**************************************** */
    sendEnterMatching(data: ISubGameTableInfoItemData) {
        let req: protoBilliard.EnterReq = new protoBilliard.EnterReq();
        req.tableMoney = data.tableMoney;
        
        // req.minCarry = data.carryLower;
        // req.maxCarry = data.carryUpper;
        // req.seatNumber = data.seats % 100;
        // req.matchingUserCount = Math.floor(data.seats / 100)  //data.playerNumber;
        // req.basescore = data.tableMoney;
        // req.ballcount = data.maxBetMoney;
        // req.seq = data.id;

        this.levelData = req;
        yy.socket.send(this.serviceName.enterMatching, req);

        this.isUseMatch = true;
    }
    
    respEnterMatching(data: any, req: any) {
        let resp = data.msg as protoBilliard.EnterRsp;//protoBilliard.CommonRsp
        if(data.code === 0 &&  resp) {
            if (resp.code === 0) {
                this.setTid(resp.tid);
                this.sendEnterByTable();
                // yy.event.emit(yy.Event_Name.Billiard_Matching);
            }
            else if( resp.code === 2803 || resp.code == 2804 || resp.code == 2801) {

            }
            else {
                switch(resp.code) {
                    case 2027: 
                        yy.toast.addNow(`error code:${resp.code}: You need more money to enter the room.`);
                    break;
                    case 2040: 
                        yy.toast.addNow(`error code:${resp.code}: You need more money to enter the room.`);
                    break;
                }

                yy.event.emit(yy.Event_Name.Billiard_Matching_Cancel)
                // this.errorTips(resp);
            }
        }
        else {
             yy.event.emit(yy.Event_Name.Billiard_Matching_Cancel)
            //  this.errorTips(resp);
        }
    }


    sendLeaveMatching() {
        if (this.isUserEnterByTable) { // 已经进入桌子就发退出房间协议
            BilliardService.instance.sendExit();
            yy.event.emit(yy.Event_Name.CasualCommonQuit)
        }
        else {
            let b: protoAlloc.CancelWaitQueueReq = new protoAlloc.CancelWaitQueueReq();
            b.tableMoney = this.levelData.tableMoney;
            yy.socket.send(this.serviceName.leaveMatching, b);
        }
    }

    respLeaveMatching(data: any, req: any) {
        let resp = data.msg as protoAlloc.CancelWaitQueueRsp;
        if(data.code === 0 &&  resp ) {
            if (resp.code === 0|| resp.code === 2808) {// 成功退出
                yy.event.emit(yy.Event_Name.Billiard_Matching_Cancel);
            }
            else if (resp.code === 2806) {//取消失败，已经在桌子上
                // this.sendEnterByTable();
                // 匹配中不能返回大厅
            }
            else if (resp.code === 2807) {//服务器正在分配，不能取消
                // 匹配中不能返回大厅
                this.errorTips(resp);  // 这种情况先提示一个错误码标记下
            }
            else {
                this.errorTips(resp);
                yy.event.emit(yy.Event_Name.Billiard_Matching_Cancel);
            }
        }
        else {
            this.errorTips(resp);
            yy.event.emit(yy.Event_Name.Billiard_Matching_Cancel);
        }
    }

    notifyMatchingTable(data: any) {
        let notify: protoAlloc.NoticeClientWaitEnterTableResult = data.msg;
        yy.log.w("BilliardService   notifyMatchingTable", notify);
        BilliardData.instance.setListener();
        if (notify.code === 0) {
            this.setTid(notify.tid);
            // let protoObj = ProtoHelper.Ins.getProto("protoBeauty", "BeautyExtendSpinRsp")
            // let beautyMsg = protoObj.decode(msg.ExtendPlayModeRsp);
            // yy.event.emit(yy.Event_Name.Billiard_Matching_Success, notify);
            this.sendEnterByTable();
        }
        else if(notify.code === 2805) {//找桌子失败，重新排队入桌

        }
        else if(notify.code === 2809) {//分配失败，不够人数分配到新的桌子，需要重新排队

        }
        else {
            this.errorTips(notify);
        }
    }
    /********************************************匹配相关  结束**************************************** */



    private errorTips(msg: protoBilliard.CommonRsp) {
        if (msg) {
            yy.toast.addNow(`error code:${msg.code} msg:${msg.msg}`);
        }
   }


   private send(cmd: string, msg: any) {
        if (!this.isStandAlone) {
            yy.socket.send(cmd, msg);
        }
   }

    BilliardAllocService_EnterByTable(data: any, elapsedTime: number) {
        BilliardData.instance.setListener();
        let msg: protoBilliard.EnterRsp = data.msg;
        if(data.code === 0 && msg && msg.code === 0) {
            this.notifyEnterGame( {msg:msg.gameStatus, isNotPush: true} );
        }else { // 异常重连 退出大厅
            yy.event.emit(yy.Event_Name.CasualCommonQuit);
        }
    }

    BilliardAllocService_EnterByTable_Timeout() {
        let pb = new protoAccount.OnlineStatusReq();
        yy.socket.send('AccountService.OnlineStatus', pb);
    }

    sendExit() {
        let req = new protoBilliard.ExitReq();
        this.send(this.serviceName.exit, req);
        // yy.socket.send("BilliardService.Exit", req);
    }

    respExit(data: any) {
        let msg: protoBilliard.CommonRsp = data.msg;
        if(data.code == 0 && msg && msg.code == 0) {
            
        }
    }
    notifyExit(data: any) {
        let notify: protoBilliard.NotifyUserExit = data.msg;
        if (notify) {
            BilliardData.instance.isOtherPlayExit = true;
            yy.event.emit(yy.Event_Name.billiard_notify_leave, notify.reason);
        }
    }


    sendEnterByTable() {
        yy.log.e("sendEnterByTable")
        const req = new protoBilliard.EnterReq();
        req.tid = this.tid;
        this.send(this.serviceName.enterByTable, req);

        this.isUserEnterByTable = true;
    }

    // sendEnterGame() {
    //     let req = new protoBilliard.EnterGameReq();
    //     req.uid = yy.user.getUid();
    //     this.send("BilliardService.EnterGame", req);
    //     // yy.socket.send("BilliardService.EnterGame", req);
    // }
    respEnterGame(data: any) {
        let msg: protoBilliard.CommonRsp = data.msg;   
        if(data.code == 0 && msg && msg.code == 0) {
            
        }
        else {
            this.errorTips(msg);
        }
    }

    notifyEnterGame(data: any) {
        let msg: protoBilliard.GameStatus = data.msg;   
        // 重连异常数据判断
        if (this.isUseMatch) {
            if (msg.users.length === 1) {
                yy.log.w("illegal match user  one");
                // this.isUseMatch = false; // 重置
                return; 
            }
        }
        else {
            if (msg.users.length === 1) {
                this.sendExit();
                yy.event.emit(yy.Event_Name.CasualCommonQuit);// 数据异常退出
                return;
            }
            else if (msg.stage === 0) {
                this.sendExit();
                yy.event.emit(yy.Event_Name.CasualCommonQuit);// 数据异常退出
                return;
            }
        }
        
        const isPush: boolean = !data.isNotPush;
        if (isPush) {
            if (msg.stage === 3 && msg.action.uid === yy.user.getUid() && msg.hitReq.power === 0) { // 自己行动回合过滤所有对方推送数据
                let lockTime = 0;
                msg.users.forEach(player=>{
                    if (player.status === 4) {
                        lockTime = player.offlineTimer;
                    }
                });
                if (lockTime > 0) {
                    BilliardData.instance.setMarkOfflineTime(lockTime*1000 + performance.now());
                }
                else BilliardData.instance.setMarkOfflineTime(0);
                return ;
            }
        }

        this.tid = msg.tid;
        BilliardData.instance.clearData();

        const scores: protoBilliard.ScoreBoardData[] = [];
        msg.users.forEach(player=>{
            BilliardData.instance.addPlayer(player.uid, player.nick, player.icon, player.scoreboard);
            let t = new protoBilliard.ScoreBoardData();
            t.uid = player.uid;
            t.scoreboard = player.scoreboard;
            scores.push(t);
        })
        BilliardData.instance.setGameType(msg.gamePlay);
        BilliardData.instance.setAlgoVersion(msg.minVersion);
        BilliardManager.instance.setAlogVersion(BilliardData.instance.getAlgoVersion());
        yy.event.emit(yy.Event_Name.billiard_notify_entergame);
        yy.event.emit(yy.Event_Name.billiard_notify_setgold, msg.chipPot);



        if (msg.stage === 3) { //牌局阶段(0:无牌局,1:准备,2:Start,3:再玩，注意：结算状态不发送) 
            yy.user.setNeedUpdateMoney(true) // 登录桌子成功后,如果当前正在牌局过程中，调用并传入 true
            yy.event.emit(yy.Event_Name.billiard_wait_enter_close); // 关闭等待界面
            let cueBall = msg.validResult.balls.find(b=>b.val === 0);
            cueBall.position.x = msg.freeBall.curPosition.x 
            cueBall.position.y = msg.freeBall.curPosition.y;

            for(let i = 0; i < msg.validResult.potBalls.length; ++i) { // 把进球实例化Ball对象
                let potBall = new protoBilliard.IBall();
                potBall.val = msg.validResult.potBalls[i];
                potBall.position = new protoBilliard.IPosition();
                msg.validResult.balls.push(potBall);
            }
            msg.validResult.balls.sort((a, b)=>a.val - b.val);
            let billiardData = BilliardData.instance;
            billiardData.setVersion(msg.version); // 版本兼容标记
            billiardData.setHitCount(msg.action.hitcount);
            billiardData.setActionType(msg.action.type);
            billiardData.setStartBalls(msg.validResult.balls);
            billiardData.setActionTimes(msg.action.times);
            billiardData.setActionMaxTimes(msg.action.maxtimes);
            billiardData.setAngle(msg.hitReq.angle/BilliardConst.multiple);
            billiardData.setPower(msg.hitReq.power/BilliardConst.multiple);

            if (msg.hitReq.power !== 0) billiardData.getOffset().setX(msg.hitReq.offset.x/BilliardConst.multiple).setY(msg.hitReq.offset.y/BilliardConst.multiple);
            else billiardData.getOffset().setX(msg.cueOffset.curOffset.x/BilliardConst.multiple).setY(msg.cueOffset.curOffset.y/BilliardConst.multiple);
            yy.event.emit(yy.Event_Name.billiard_notify_cueoffset, msg.cueOffset);



            billiardData.setActionUid(msg.action.uid);

            let hitType = msg.users.filter(u=>u.uid === msg.action.uid)[0].hitType;
            billiardData.setHitBallType(hitType);
            yy.event.emit(yy.Event_Name.billiard_reconnect, msg);      
            yy.event.emit(yy.Event_Name.billiard_set_score, scores);
        }
        else {
            yy.event.emit(yy.Event_Name.Billiard_Matching_Success, msg);
            // this.sendReady();
        }
        // yy.log.w("notifyEnterGame", msg);
    }

    sendReady() {
        let req = new protoBilliard.ReadyReq();
        req.uid = 0//yy.user.getUid(); // 新客户端发0, 老客户端默认发uid (为了兼容老客户端)
        req.minVersion = BilliardData.instance.getAlgoVersion();
        this.send(this.serviceName.ready, req);
        // yy.socket.send("BilliardService.Ready", req);
    }

    respReady(data: any) {
        let msg: protoBilliard.CommonRsp = data.msg;
        if(data.code === 0 && msg && msg.code === 0) {
            
        }
        else {
            if (msg && msg.code === 1108) { // 算法版本需要更新
                yy.dialog.show(
                    {
                        title: "Tip",
                        content: "The current version is low, please close the game and re-enter to update to the   latest version.",
                        isCancelEnable: false,
                        isConfirmEnable: true,
                        confirmText: "OK",
                        confirmCallback: () => {
                            this.sendExit();
                            yy.event.emit(yy.Event_Name.CasualCommonQuit);// 数据异常退出
                        },
                        closeCallback: () => {
                        },
                        fontSize: 52,
                        lineHeight: 60,
                        // horizontalAlign: HorizontalTextAlignment.CENTER,
                        // verticalAlign: VerticalTextAlignment.CENTER,
                    }
                )
            }
            else {
                let msgCode = data?.msg?.code;
                if (WalletErrorMgr.instance().checkIsWalletFailNeedExit(msgCode)) {
                    yy.log.d("BilliardService-respReady--checkIsWalletFailNeedExit,msgCode=",msgCode);
                    let callback = ()=>{ 
                        this.sendExit();
                        yy.event.emit(yy.Event_Name.CasualCommonQuit)
                    }
                    WalletErrorMgr.instance().showWalletErrorPopup(msgCode, callback, callback);
                } else {
                    this.errorTips(msg);
                }
            }
        }
    }
    notifyReady(data: any) {
        let notify:protoBilliard.BroadcastUserReady = data.msg;
        if (notify) {
            yy.event.emit(yy.Event_Name.billiard_notify_ready, notify);
            if (notify.uid === yy.user.getUid()) {
                yy.event.emit(yy.Event_Name.billiard_wait_enter_settime, notify.beginDelay);
            }
        }
    }


    respClientEvent(data: any) {
        let msg: protoBilliard.CommonRsp = data.msg;
        if(msg && msg.code !== 0) {
            this.errorTips(msg);
        }
    }

    sendFreeBallReq(x: number, y: number) {
        let pb: protoBilliard.GameProtocol = new protoBilliard.GameProtocol();
        let responseMsg = ProtoHelper.Ins.getProto('protoBilliard', 'IFreeBall');
        let req: protoBilliard.IFreeBall = new protoBilliard.IFreeBall();
        req.curPosition = new protoBilliard.IPosition();
        req.curPosition.x = Math.round(x * BilliardConst.multiple);
        req.curPosition.y = Math.round(y * BilliardConst.multiple);
        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6014;
        pb.TableId = this.tid;
        pb.databody = newMsg;

        this.send(this.serviceName.clientEvent, pb);
        // yy.socket.send("BilliardService.ClientEvent", pb);
    }
    notifyFreeBall(data: {msg:protoBilliard.IFreeBall }) {
        let msg: protoBilliard.IFreeBall = data.msg;
        if(msg) {
            if (!BilliardTools.instance.isMyAction()) { // 其他人操作才设置坐标
                yy.event.emit(yy.Event_Name.billiard_notify_cuemove, msg);
            }
        }
    }
    sendCueAngleReq(x: number, y: number) {
        let pb: protoBilliard.GameProtocol = new protoBilliard.GameProtocol();
        let responseMsg = ProtoHelper.Ins.getProto('protoBilliard', 'ICueAngle');
        let req: protoBilliard.ICueAngle = new protoBilliard.ICueAngle();
        req.curScreenPos = new protoBilliard.IPosition();
        req.curScreenPos.x = Math.round(x * BilliardConst.multiple);
        req.curScreenPos.y = Math.round(y * BilliardConst.multiple);
        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6016;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendCueAngleReq", req);
        this.send(this.serviceName.clientEvent, pb);
        // yy.socket.send("BilliardService.ClientEvent", pb);
    }
    notifyCueAngle(data: any) {
        let msg: protoBilliard.ICueAngle = data.msg;
        if(msg) {
            // yy.log.w("notifyCueAngle",data)
            if (!BilliardTools.instance.isMyAction()) { // 其他人操作才设置坐标
                yy.event.emit(yy.Event_Name.billiard_notify_cueangle, msg);
            }
        }
    }
    sendCueOffsetReq(x: number, y: number) {
        let pb: protoBilliard.GameProtocol = new protoBilliard.GameProtocol();
        let responseMsg = ProtoHelper.Ins.getProto('protoBilliard', 'ICueOffset');
        let req: protoBilliard.ICueOffset = new protoBilliard.ICueOffset();
        req.curOffset = new protoBilliard.IPosition();
        req.curOffset.x = Math.round(x * BilliardConst.multiple);//-2.991758887410948e-11;
        req.curOffset.y = Math.round(y * BilliardConst.multiple);//-49407.250443846286
        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6027;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendCueOffsetReq", req);
        this.send(this.serviceName.clientEvent, pb);
        // yy.socket.send("BilliardService.ClientEvent", pb);
    }
    notifyCueOffset(data: any) {
        let msg: protoBilliard.ICueOffset = data.msg;
        if(msg) {
            if (!BilliardTools.instance.isMyAction()) { // 其他人操作才设置坐标
                yy.event.emit(yy.Event_Name.billiard_notify_cueoffset, msg);
            }
        }
    }
    
    sendHitReq() {
        let billiardData = BilliardData.instance;
        let pb: protoBilliard.GameProtocol = new protoBilliard.GameProtocol();
        let responseMsg = ProtoHelper.Ins.getProto('protoBilliard', 'IHit');
        let req = new protoBilliard.IHit ();
        req.angle = Math.round(billiardData.getAngle() * BilliardConst.multiple);
        req.power = Math.round(billiardData.getPower() * BilliardConst.multiple);
        req.offset = new protoBilliard.IPosition();
        req.offset.x = Math.round(billiardData.getOffset().x * BilliardConst.multiple);
        req.offset.y = Math.round(billiardData.getOffset().y * BilliardConst.multiple);
        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6018;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendHitReq", req);
        yy.wait.showDelay("HitReq");
        this.send(this.serviceName.clientEvent, pb);
    }

    sendResultReq(outComeType: number) {
        let pb: protoBilliard.GameProtocol = new protoBilliard.GameProtocol();
        let responseMsg = ProtoHelper.Ins.getProto('protoBilliard', 'IResult');

        let table = BilliardManager.instance.getTable();

        let tBalls = table.getOnTableBalls();
        let pBalls = table.getInPocketBalls();
        let balls: protoBilliard.IBall[] = [];
        tBalls.forEach((ball) => {
            let b = new protoBilliard.IBall();
            b.val = ball.id;
            b.position = new protoBilliard.IPosition();
            b.position.x = Math.round(ball.pos.x * BilliardConst.multiple);
            b.position.y = Math.round(ball.pos.y * BilliardConst.multiple);
            b.rotation = new protoBilliard.IRotation();
            let meshNode = ball.ui.ballMesh.node;
            b.rotation.x = Math.round(meshNode.rotation.x * BilliardConst.multiple);
            b.rotation.y = Math.round(meshNode.rotation.y * BilliardConst.multiple);
            b.rotation.z = Math.round(meshNode.rotation.z * BilliardConst.multiple);
            b.rotation.w = Math.round(meshNode.rotation.w * BilliardConst.multiple);
            balls.push(b);
        });
        let potBalls: number[] = [];
        pBalls.forEach((ball) => {
            potBalls.push(ball.id);
        })

        let req = new protoBilliard.IResult ();
        req.type = outComeType
        req.hitType = BilliardData.instance.getHitBallType();// 当前行动玩家击球类型
        req.potBalls = potBalls
        req.balls = balls;

        req.tokenUid = BilliardData.instance.getActionUid();// 当前行动玩家  服务器需要字段处理延迟异常
        req.round = BilliardManager.instance.getRules().round; // 当前回合数  服务器需要字段处理延迟异常

        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6020;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendResultReq", req);
        this.send(this.serviceName.clientEvent, pb)
        // yy.socket.send("BilliardAllocService.Result", req);
    }

    notifyGameResult(data: any) {
        let msg: protoBilliard.BroadcastGameResult = data.msg;
        if(msg) {
            this.rematchData = msg.tablecfg;
            yy.event.emit(yy.Event_Name.billiard_notify_wins, msg);
            this.isUserEnterByTable = false;

            let player = msg.playerResult.filter(p=>p.uid == yy.user.getUid())[0];
            GameIsolateUtils.recordGameStatus(BilliardData.instance.gid, false, player.moneyTotal.toNumber());
            yy.user.setNeedUpdateMoney(false);// 结算时，调用该接口并传入 false
        }
    }

    sendChatReq(type:number ,content: string) {
        let billiardData = BilliardData.instance;
        let pb: protoBilliard.GameProtocol = new protoBilliard.GameProtocol();
        let responseMsg = ProtoHelper.Ins.getProto('protoBilliard', 'ChatReq');
        let req = new protoBilliard.ChatReq ();
        req.msgType = type;
        req.contentData = content;

        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6023;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendChatReq", req);
        this.send(this.serviceName.clientEvent, pb);
    }

    notifyChat(data: any) {
        let notify = data.msg as protoBilliard.ChatMsg;
        yy.event.emit(yy.Event_Name.billiard_send_msg, notify);
    }


    sendPersonalReq(uid: number) {
        let billiardData = BilliardData.instance;
        let pb: protoBilliard.GameProtocol = new protoBilliard.GameProtocol();
        let responseMsg = ProtoHelper.Ins.getProto('protoBilliard', 'UserPlayBilliardDataReq');
        let req = new protoBilliard.UserPlayBilliardDataReq ();
        req.uid = uid;
        req.ballcount = [8,9];

        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6025;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendPersonalReq", req);
        this.send(this.serviceName.clientEvent, pb);
    }

    notifyPersonal(data: any) {
        let notify = data.msg as protoBilliard.UserPlayBilliardDataRsp;
        yy.event.emit(yy.Event_Name.billiard_send_personal, notify);
    }



    
    sendEnterReMatching() {
        let req: protoBilliard.EnterReq = new protoBilliard.EnterReq();
        let data = this.rematchData;
        req.tableMoney = data.BaseScore.toNumber();

        this.levelData = req;
        yy.socket.send(this.serviceName.enterMatching, req);
        this.isUseMatch = true;
    }


    //=0后台切回前台  =1前台切到后台
    sendForeBackstageReq(status: number) {
        let req: protoBilliard.ForeBackstageReq = new protoBilliard.ForeBackstageReq();
        req.uid = yy.user.getUid();
        req.status = status;
        yy.socket.send(this.serviceName.foreBackStageEvent, req);
    }

    notifyOffLine(data: any) {
        let notify: protoBilliard.NotifyUserNetStatus = data.msg;
        if (notify.uid !== yy.user.getUid() && notify.timer !== -1) { // timer -1 为非 牌局状态不提示 等待
            yy.event.emit(yy.Event_Name.billiard_notify_offline, notify);
        }
    }

    notifyDisbandTable(data: any) {
        let notify = data.msg as protoBilliard.DisbandTableNotice;
        let test = new protoBilliard.NotifyUserExit();
        test.reason = 1;
        yy.event.emit(yy.Event_Name.billiard_notify_leave, test.reason);
    }

    notifyActionTimeOut(data: any) {
        let notify: protoBilliard.IHitTimeOut = data.msg;
        yy.event.emit(yy.Event_Name.billiard_notify_timeout, notify);
    }

    notifyFoulTimes(data: any) {
        let notify: protoBilliard.NotifyFoulAction = data.msg;
        yy.event.emit(yy.Event_Name.billiard_notify_foulstimes, notify);
    }


    notifyStart(data: any) {
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.IStart = data.msg;


        BilliardData.instance.isOtherPlayExit = false;
        yy.log.w("notifyStart", msg);
        yy.user.setNeedUpdateMoney(true);// 针对有牌局过程的游戏，在牌局开始时，调用该接口并传入 true
        if(msg) {
            msg.balls.sort((a, b)=>a.val - b.val);

            billiardData.setVersion(msg.version); // 版本兼容标记
            billiardData.setStartBalls(msg.balls);
            billiardData.setActionUid(msg.action.uid);
            billiardData.setActionTimes(msg.action.times);
            billiardData.setActionMaxTimes(msg.action.maxtimes);
            billiardData.setActionType(msg.action.type);
            billiardData.setHitCount(msg.action.hitcount);
            // yy.log.w("respStart");
            yy.event.emit(yy.Event_Name.billiard_notify_start);
            yy.event.emit(yy.Event_Name.billiard_wait_enter_close); // 关闭等待界面
            yy.event.emit(yy.Event_Name.billiard_notify_setgold, msg.chipPot);

            yy.event.emit(yy.Event_Name.billiard_set_score, msg.scoreBoardVS);
            GameIsolateUtils.recordGameStatus(billiardData.gid, true, yy.user.getTotalMoney());
        }
    }



    notifyCueMove(data: any) {
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.IFreeBall = data.msg;
        if(msg) {
            if (!BilliardTools.instance.isMyAction()) { // 其他人操作才设置坐标
                yy.event.emit(yy.Event_Name.billiard_notify_cuemove, msg);
            }
            // billiardData.setCueMove(msg.curPosition.x, msg.curPosition.y);
        }
    }


    notifyHit(data: any) {
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.IHit = data.msg;
        if(msg) {
            yy.wait.hide("HitReq");
            yy.event.emit(yy.Event_Name.billiard_stop_animations);
            billiardData.setAngle(msg.angle/BilliardConst.multiple);
            billiardData.setPower(msg.power/BilliardConst.multiple);
            billiardData.getOffset().setX(msg.offset.x/BilliardConst.multiple).setY(msg.offset.y/BilliardConst.multiple);
             yy.log.w("respHit", msg);
    
            yy.event.emit(yy.Event_Name.billiard_notify_hit);
        }
    }

    notifyResult(data: any) {
        let msg: protoBilliard.IValidResult = data.msg;
        if(msg) {
            if (msg.code === 0) {
                yy.event.emit(yy.Event_Name.billiard_notify_result, msg.validResult);
            }
            else {
                yy.log.e("notifyResult", msg.code);
            }
        }
    }

    notifyAction(data: any) {
        let msg: protoBilliard.IAction = data.msg;
        const billiardData = BilliardData.instance;
        if (msg) {
            billiardData.setHitCount(msg.hitcount);
            billiardData.setActionType(msg.type);
            billiardData.setActionTimes(msg.times);
            billiardData.setActionMaxTimes(msg.maxtimes);
            yy.event.emit(yy.Event_Name.billiard_notify_action, msg);
        }
    }

    //******************************************单机测试数据  开始*********************************** */
    sendStart() {
        // let req = new protoBilliard.IStart ();
        // this.standAloneSend("BilliardAllocService.Start", req)
        // yy.socket.send("BilliardAllocService.Start", req);

        if (this.isStandAlone ) {
            if(BilliardData.instance.isRecord()) {
                BilliardSimulateService.instance.notifyRecord();
            }
            else {
                BilliardSimulateService.instance.notifyStart();
            }


            // BilliardSimulateService.instance.notifyReconnect();
            
        }
    }

    sendCueMove(x: number, y: number) {
        // let req = new protoBilliard.IFreeBall();
        // req.curPosition = new protoBilliard.IPosition();
        // req.curPosition.x = x * BilliardConst.multiple;
        // req.curPosition.y = y * BilliardConst.multiple;
        // this.standAloneSend("BilliardAllocService.CueMove", req)
        // yy.socket.send("BilliardAllocService.CueMove", req);

        if (this.isStandAlone ) {
            BilliardSimulateService.instance.notifyCueMove();
        }
    }

    sendCueAngle(x: number, y: number) {
        // let req = new protoBilliard.IPosition();
        // req.x = x * BilliardConst.multiple;
        // req.y = y * BilliardConst.multiple;
        // this.standAloneSend("BilliardAllocService.CueAngle", req)
        // yy.socket.send("BilliardAllocService.CueAngle", req);
        if (this.isStandAlone ) {
            BilliardSimulateService.instance.notifyCueAngle();
        }
    }

    sendHit() {
        // yy.log.w("sendHit");
        // let billiardData = BilliardData.instance;
        // let req = new protoBilliard.IHit ();
        // req.angle = billiardData.getAngle() * BilliardConst.multiple;
        // req.power = billiardData.getPower() * BilliardConst.multiple;
        // req.offset = new protoBilliard.IPosition();
        // req.offset.x = billiardData.getOffset().x * BilliardConst.multiple;;
        // req.offset.y = billiardData.getOffset().y * BilliardConst.multiple;;
        // yy.wait.showDelay("HitReq");
        // this.standAloneSend("BilliardAllocService.Hit", req)
        // yy.socket.send("BilliardAllocService.Hit", req);
        if (this.isStandAlone ) {
            BilliardSimulateService.instance.notifyHit();
        }
    }

    sendResult(outComeType: number) {
        if (this.isStandAlone) {
            let table = BilliardManager.instance.getTable();

            let tBalls = table.getOnTableBalls();
            let pBalls = table.getInPocketBalls();
            let balls: protoBilliard.IBall[] = [];
            tBalls.forEach((ball) => {
                let b = new protoBilliard.IBall();
                b.val = ball.id;
                b.position = new protoBilliard.IPosition();
                b.position.x = ball.pos.x * BilliardConst.multiple;
                b.position.y = ball.pos.y * BilliardConst.multiple;
                b.rotation = new protoBilliard.IRotation();
                let meshNode = ball.ui.ballMesh.node;
                b.rotation.x = meshNode.rotation.x * BilliardConst.multiple;
                b.rotation.y = meshNode.rotation.y * BilliardConst.multiple;
                b.rotation.z = meshNode.rotation.z * BilliardConst.multiple;
                b.rotation.w = meshNode.rotation.w * BilliardConst.multiple;
                balls.push(b);
            });
            let potBalls: number[] = [];
            pBalls.forEach((ball) => {
                potBalls.push(ball.id);
            })
    
            let req = new protoBilliard.IResult ();
            req.type = outComeType
            req.hitType = BilliardData.instance.getHitBallType();// 当前行动玩家击球类型
            req.potBalls = potBalls
            req.balls = balls;
            // this.standAloneSend("BilliardAllocService.Result", req)
            // yy.socket.send("BilliardAllocService.Result", req);
            BilliardSimulateService.instance.notifyResult(req);
        }
    }

    round = 1;
    sendAction(uid: number, times: number, type: number) {
        if (this.isStandAlone) {
            let req = new protoBilliard.IAction();
            req.uid = uid;
            req.times = times;
            req.type = type;
            req.round = ++this.round;
            // this.standAloneSend("BilliardAllocService.Action", req)
            BilliardSimulateService.instance.notifyAction(req);
            // yy.socket.send("BilliardAllocService.Action", req);
        }
    }
//******************************************单机测试数据  结束*********************************** */
}


