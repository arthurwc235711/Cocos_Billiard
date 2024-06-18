import { ws_base_writer } from '../../../../../framework/socket/ws3/ws_base_writer';
import { BilliardSimulateService } from './BilliardSimulateService';

export class BilliardWriter extends ws_base_writer {
    on_send(service_name: string, func_name: string, pb: any, callback: CallableFunction): boolean {
        return super.on_send(service_name, func_name, pb, callback);
    }

    BilliardAllocService_Start(req:any) {
        BilliardSimulateService.instance.notifyStart();
    }

    BilliardAllocService_CueMove(req:any) {
        BilliardSimulateService.instance.notifyCueMove();
    }

    BilliardAllocService_CueAngle(req:any) {
        BilliardSimulateService.instance.notifyCueAngle();
    }

    BilliardAllocService_Hit(req:any) {
        BilliardSimulateService.instance.notifyHit();
    }
}


