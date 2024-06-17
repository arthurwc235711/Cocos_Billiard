
import { StackListenerNew } from '../../../../main/data/GameMessageStack';
import { yy } from '../../../../yy';
import { BilliardData } from '../data/BilliardData';

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

        ["BilliardAllocService_Hit"]: "respHit",

    }


    BilliardAllocService_EnterByTable(data: any, elapsedTime: number) {
        let msg: protoBilliard.EnterRsp = data.msg;
        if(data.code === 0 && msg && msg.code === 0) {

        }
    }



    sendHitReq() {
        yy.log.w("sendHitReq");
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
    respHit(data: any) {
        yy.wait.hide("HitReq");
        let billiardData = BilliardData.instance;
        let msg: protoBilliard.IHit = data.msg;
        if(msg) {
            billiardData.setAngle(msg.angle);
            billiardData.setPower(msg.power);
            billiardData.getOffset().setX(msg.offset.x).setY(msg.offset.y);
            yy.log.w("respHit");
    
            yy.event.emit(yy.Event_Name.billiard_notify_hit);
        }

    }
}


