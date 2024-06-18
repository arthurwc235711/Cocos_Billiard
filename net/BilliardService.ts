
import { StackListenerNew } from '../../../../main/data/GameMessageStack';
import { yy } from '../../../../yy';
import { BilliardData } from '../data/BilliardData';
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
        ["BilliardAllocService_Hit"]: "notifyHit",
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
        req.curPosition.x = x;
        req.curPosition.y = y;
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
}


