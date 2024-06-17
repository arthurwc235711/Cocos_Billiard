
import { StackListenerNew } from '../../../../main/data/GameMessageStack';

export class BilliardService extends StackListenerNew {
    private static __instance__: BilliardService = null;

    static get instance(): BilliardService {
        if (this.__instance__ === null) {
            this.__instance__ = new BilliardService();
        }
        return this.__instance__;
    }

    public delete(){
        delete BilliardService.__instance__;
    }

    eventFuncMap: { [key: string]: string } = {
        ["BilliardAllocService_EnterByTable"]: "BilliardAllocService_EnterByTable"

    }


    BilliardAllocService_EnterByTable(data: any, elapsedTime: number) {
        let msg: protoBilliard.EnterRsp = data.msg;
        if(data.code == 0 && msg && msg.code == 0) {
            
        }
    }
}


