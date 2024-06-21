
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


    private tid: number;

    eventFuncMap: { [key: string]: string } = {
        ["BilliardAllocService_EnterByTable"]: "BilliardAllocService_EnterByTable",

        ["BilliardService_EnterGame"]: "respEnterGame",

        // ["BilliardService_Sit"]: "respSit",
        ["BilliardService_Ready"]: "respReady",
        ["BilliardService_Exit"]: "respExit",

        ["BilliardService_ClientEvent"]: "respClientEvent",



        ["cmd_0x6006"]: "notifyEnterGame",
        ["cmd_0x0005"]: "notifyFreeBall",
        ["cmd_0x0002"]: "notifyStart",


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

    BilliardAllocService_EnterByTable(data: any, elapsedTime: number) {
        let msg: protoBilliard.EnterRsp = data.msg;
        if(data.code === 0 && msg && msg.code === 0) {

        }
    }

    sendExit() {
        let req = new protoBilliard.ExitReq();
        yy.socket.send("BilliardService.Exit", req);
    }

    respExit(data: any) {
        let msg: protoBilliard.CommonRsp = data.msg;
        if(data.code == 0 && msg && msg.code == 0) {
            
        }
    }

    sendEnterGame() {
        let req = new protoBilliard.EnterGameReq();
        req.uid = yy.user.getUid();
        yy.socket.send("BilliardService.EnterGame", req);
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
        yy.log.w("notifyEnterGame", msg);

        this.sendReady();
    }
    // sendSit() {
    //     let req = new protoBilliard.SitReq();
    //     req.seat = -1;
    //     yy.socket.send("BilliardService.Sit", req);
    // }
    // respSit(data: any) {
    //     let msg: protoBilliard.CommonRsp = data.msg;
    //     if(data.code == 0 && msg && msg.code == 0) {
    //         this.sendReady();
    //     }
    //     else {
    //         this.errorTips(msg);
    //     }
    // }

    sendReady() {
        let req = new protoBilliard.ReadyReq();
        yy.socket.send("BilliardService.Ready", req);
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
        // req.useFree = PiggytapData.instance.getFreeTimes() > 0 ? 1 : 0;
        let newMsg = responseMsg.encode(req).finish();
        pb.Cmd = protoBilliard.BILLIARD_SubCmd.eBilliardFreeBallReq;
        pb.TableId = this.tid;
        pb.databody = newMsg;
        yy.socket.send("BilliardService.ClientEvent", pb);
    }


    notifyFreeBall(data: {msg:protoBilliard.IFreeBall }) {
        let msg: protoBilliard.IFreeBall = data.msg;
        if(msg) {
            if (!BilliardTools.instance.isMyAction()) { // 其他人操作才设置坐标
                yy.event.emit(yy.Event_Name.billiard_notify_cueangle, msg);
            }
        }
    }




    //---------------------------------------------------------------------------------------
    sendStart() {
        let req = new protoBilliard.IStart ();
        yy.socket.send("BilliardAllocService.Start", req);
    }
    notifyStart(data: any) {
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.IStart = data.msg;
        if(msg) {
            billiardData.setStartBalls(msg.balls);
            billiardData.setActionUid(msg.action.uid);
            billiardData.setActionTimes(msg.action.times);
            billiardData.setActionType(msg.action.type);
            // yy.log.w("respStart");
            yy.event.emit(yy.Event_Name.billiard_notify_start);
        }
    }

    sendCueMove(x: number, y: number) {
        let req = new protoBilliard.IFreeBall();
        req.curPosition = new protoBilliard.IPosition();
        req.curPosition.x = x * BilliardConst.multiple;
        req.curPosition.y = y * BilliardConst.multiple;;
        yy.socket.send("BilliardAllocService.CueMove", req);
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
        yy.socket.send("BilliardAllocService.CueAngle", req);
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


    sendHitReq() {
        // yy.log.w("sendHitReq");
        let billiardData = BilliardData.instance;
        let req = new protoBilliard.IHit ();
        req.angle = billiardData.getAngle();
        req.power = billiardData.getPower();
        req.offset = new protoBilliard.IPosition();
        req.offset.x = billiardData.getOffset().x;
        req.offset.y = billiardData.getOffset().y;
        yy.wait.showDelay("HitReq");
        yy.socket.send("BilliardAllocService.Hit", req);
    }
    notifyHit(data: any) {
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.IHit = data.msg;
        if(msg) {
            yy.wait.hide("HitReq");
            billiardData.setAngle(msg.angle);
            billiardData.setPower(msg.power);
            billiardData.getOffset().setX(msg.offset.x).setY(msg.offset.y);
            // yy.log.w("respHit");
    
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
        yy.socket.send("BilliardAllocService.Result", req);
    }
    notifyResult(data: any) {
        let msg: protoBilliard.IResult = data.msg;
        if(msg) {
            yy.event.emit(yy.Event_Name.billiard_notify_result, msg);
        }
    }


    round = 1;
    sendAction(uid: number, times: number, type: number) {
        let req = new protoBilliard.IAction();
        req.uid = uid;
        req.times = times;
        req.type = type;
        req.round = ++this.round;
        yy.socket.send("BilliardAllocService.Action", req);
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


