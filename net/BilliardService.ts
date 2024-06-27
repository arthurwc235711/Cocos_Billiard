
import { ProtoHelper } from '../../../../../framework/socket/ProtoHelper';
import { StackListenerNew } from '../../../../main/data/GameMessageStack';
import { yy } from '../../../../yy';
import { BilliardConst } from '../config/BilliardConst';
import { BilliardData } from '../data/BilliardData';
import { BilliardManager } from '../scripts/BilliardManager';
import { BilliardTools } from '../scripts/BilliardTools';

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

    private tid: number;

    eventFuncMap: { [key: string]: string } = {
        ["BilliardAllocService_EnterByTable"]: "BilliardAllocService_EnterByTable",

        ["BilliardService_EnterGame"]: "respEnterGame",

        // ["BilliardService_Sit"]: "respSit",
        ["BilliardService_Ready"]: "respReady",
        ["BilliardService_Exit"]: "respExit",

        ["BilliardService_ClientEvent"]: "respClientEvent",



        ["cmd_0x6011"]: "notifyEnterGame",
        ["cmd_0x6012"]: "notifyStart",
        ["cmd_0x6013"]: "notifyAction",
        ["cmd_0x6015"]: "notifyFreeBall",
        ["cmd_0x6017"]: "notifyCueAngle",
        ["cmd_0x6019"]: "notifyHit",
        ["cmd_0x6021"]: "notifyResult",
        ["cmd_0x6022"]: "notifyGameResult",



        ["BilliardAllocService_Start"]: "notifyStart",
        ["BilliardAllocService_CueMove"]: "notifyCueMove",
        ["BilliardAllocService_CueAngle"]: "notifyCueAngle",
        ["BilliardAllocService_Hit"]: "notifyHit",
        ["BilliardAllocService_Result"]: "notifyResult",
        ["BilliardAllocService_Action"]: "notifyAction",
    }


    private errorTips(msg: protoBilliard.CommonRsp) {
        if (msg) {
            yy.toast.addNow(`error code:${msg.code} msg:${msg.msg}`);
        }
   }

   private standAloneSend(cmd: string, msg: any) {
        if (this.isStandAlone) {
            yy.socket.send(cmd, msg);
        }
   }

   private send(cmd: string, msg: any) {
        if (!this.isStandAlone) {
            yy.socket.send(cmd, msg);
        }
   }

    BilliardAllocService_EnterByTable(data: any, elapsedTime: number) {
        let msg: protoBilliard.EnterRsp = data.msg;
        if(data.code === 0 && msg && msg.code === 0) {

        }
    }

    sendExit() {
        let req = new protoBilliard.ExitReq();
        this.send("BilliardService.Exit", req);
        // yy.socket.send("BilliardService.Exit", req);
    }

    respExit(data: any) {
        let msg: protoBilliard.CommonRsp = data.msg;
        if(data.code == 0 && msg && msg.code == 0) {
            
        }
    }

    sendEnterGame() {
        let req = new protoBilliard.EnterGameReq();
        req.uid = yy.user.getUid();
        this.send("BilliardService.EnterGame", req);
        // yy.socket.send("BilliardService.EnterGame", req);
    }
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

        this.tid = msg.tid;


        msg.users.forEach(player=>{
            BilliardData.instance.addPlayer(player.uid, player.nick, player.icon);
        })

        yy.event.emit(yy.Event_Name.billiard_notify_entergame);
        yy.event.emit(yy.Event_Name.billiard_notify_setgold, msg.chipPot);

        // yy.log.w("notifyEnterGame", msg);

        this.sendReady();
    }

    sendReady() {
        let req = new protoBilliard.ReadyReq();
        req.uid = yy.user.getUid();
        this.send("BilliardService.Ready", req);
        // yy.socket.send("BilliardService.Ready", req);
    }

    respReady(data: any) {
        let msg: protoBilliard.CommonRsp = data.msg;
        if(data.code === 0 && msg && msg.code === 0) {
            
        }
        else {
            this.errorTips(msg);
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
        req.curPosition.x = x * BilliardConst.multiple;
        req.curPosition.y = y * BilliardConst.multiple;;
        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6014;
        pb.TableId = this.tid;
        pb.databody = newMsg;

        this.send("BilliardService.ClientEvent", pb);
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
        req.curScreenPos.x = x * BilliardConst.multiple;
        req.curScreenPos.y = y * BilliardConst.multiple;;
        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6016;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendCueAngleReq", req);
        this.send("BilliardService.ClientEvent", pb);
        // yy.socket.send("BilliardService.ClientEvent", pb);
    }
    
    sendHitReq() {
        let billiardData = BilliardData.instance;
        let pb: protoBilliard.GameProtocol = new protoBilliard.GameProtocol();
        let responseMsg = ProtoHelper.Ins.getProto('protoBilliard', 'IHit');
        let req = new protoBilliard.IHit ();
        req.angle = billiardData.getAngle() * BilliardConst.multiple;
        req.power = billiardData.getPower() * BilliardConst.multiple;
        req.offset = new protoBilliard.IPosition();
        req.offset.x = billiardData.getOffset().x * BilliardConst.multiple;;
        req.offset.y = billiardData.getOffset().y * BilliardConst.multiple;;
        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6018;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendHitReq", req);
        yy.wait.showDelay("HitReq");
        this.send("BilliardService.ClientEvent", pb);
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
            let meshNode = ball.ballMesh.node;
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

        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = 0x6020;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.log.w("sendResultReq", req);
        this.send("BilliardService.ClientEvent", pb)
        // yy.socket.send("BilliardAllocService.Result", req);
    }

    notifyGameResult(data: any) {
        let msg: protoBilliard.BroadcastGameResult = data.msg;
        if(msg) {
            yy.event.emit(yy.Event_Name.billiard_notify_wins, msg);
        }
    }

    //---------------------------------------------------------------------------------------
    sendStart() {
        let req = new protoBilliard.IStart ();
        this.standAloneSend("BilliardAllocService.Start", req)
        // yy.socket.send("BilliardAllocService.Start", req);
    }
    notifyStart(data: any) {
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.IStart = data.msg;

        yy.log.w("notifyStart", msg);
        if(msg) {
            billiardData.setStartBalls(msg.balls);
            billiardData.setActionUid(msg.action.uid);
            billiardData.setActionTimes(msg.action.times);
            billiardData.setActionType(msg.action.type);
            // yy.log.w("respStart");
            yy.event.emit(yy.Event_Name.billiard_notify_start);
            yy.event.emit(yy.Event_Name.billiard_notify_setgold, msg.chipPot);
        }
    }

    sendCueMove(x: number, y: number) {
        let req = new protoBilliard.IFreeBall();
        req.curPosition = new protoBilliard.IPosition();
        req.curPosition.x = x * BilliardConst.multiple;
        req.curPosition.y = y * BilliardConst.multiple;
        this.standAloneSend("BilliardAllocService.CueMove", req)
        // yy.socket.send("BilliardAllocService.CueMove", req);
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


    sendCueAngle(x: number, y: number) {
        let req = new protoBilliard.IPosition();
        req.x = x * BilliardConst.multiple;
        req.y = y * BilliardConst.multiple;
        this.standAloneSend("BilliardAllocService.CueAngle", req)
        // yy.socket.send("BilliardAllocService.CueAngle", req);
    }
    notifyCueAngle(data: any) {
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.ICueAngle = data.msg;
        if(msg) {
            if (!BilliardTools.instance.isMyAction()) { // 其他人操作才设置坐标
                yy.event.emit(yy.Event_Name.billiard_notify_cueangle, msg);
            }
        }
    }


    sendHit() {
        // yy.log.w("sendHit");
        let billiardData = BilliardData.instance;
        let req = new protoBilliard.IHit ();
        req.angle = billiardData.getAngle() * BilliardConst.multiple;
        req.power = billiardData.getPower() * BilliardConst.multiple;
        req.offset = new protoBilliard.IPosition();
        req.offset.x = billiardData.getOffset().x * BilliardConst.multiple;;
        req.offset.y = billiardData.getOffset().y * BilliardConst.multiple;;
        yy.wait.showDelay("HitReq");
        this.standAloneSend("BilliardAllocService.Hit", req)
        // yy.socket.send("BilliardAllocService.Hit", req);
    }
    notifyHit(data: any) {
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.IHit = data.msg;
        if(msg) {
            yy.wait.hide("HitReq");
            billiardData.setAngle(msg.angle/BilliardConst.multiple);
            billiardData.setPower(msg.power/BilliardConst.multiple);
            billiardData.getOffset().setX(msg.offset.x/BilliardConst.multiple).setY(msg.offset.y/BilliardConst.multiple);
             yy.log.w("respHit", msg);
    
            yy.event.emit(yy.Event_Name.billiard_notify_hit);
        }

    }


    sendResult(outComeType: number) {
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
            let meshNode = ball.ballMesh.node;
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
        this.standAloneSend("BilliardAllocService.Result", req)
        // yy.socket.send("BilliardAllocService.Result", req);
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


    round = 1;
    sendAction(uid: number, times: number, type: number) {
        let req = new protoBilliard.IAction();
        req.uid = uid;
        req.times = times;
        req.type = type;
        req.round = ++this.round;
        this.standAloneSend("BilliardAllocService.Action", req)
        // yy.socket.send("BilliardAllocService.Action", req);
    }
    notifyAction(data: any) {
        let msg: protoBilliard.IAction = data.msg;
        if (msg) {
            BilliardData.instance.setActionType(msg.type);
            BilliardData.instance.setActionTimes(msg.times);
            yy.event.emit(yy.Event_Name.billiard_notify_action, msg);
        }
    }

}


