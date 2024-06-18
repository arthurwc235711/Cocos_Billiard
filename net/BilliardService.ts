
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

    eventFuncMap: { [key: string]: string } = {
        ["BilliardAllocService_EnterByTable"]: "BilliardAllocService_EnterByTable",



        ["BilliardAllocService_Start"]: "notifyStart",
        ["BilliardAllocService_CueMove"]: "notifyCueMove",
        ["BilliardAllocService_CueAngle"]: "notifyCueAngle",
        ["BilliardAllocService_Hit"]: "notifyHit",
        ["BilliardAllocService_Result"]: "notifyResult",
        ["BilliardAllocService_Action"]: "notifyAction",
    }


    BilliardAllocService_EnterByTable(data: any, elapsedTime: number) {
        let msg: protoBilliard.EnterRsp = data.msg;
        if(data.code === 0 && msg && msg.code === 0) {

        }
    }



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
            BilliardData.instance.setActionTimes(msg.times);
            yy.event.emit(yy.Event_Name.billiard_notify_action, msg);
        }
    }
}


