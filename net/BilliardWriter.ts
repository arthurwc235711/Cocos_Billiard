import { ws_base_writer } from '../../../../../framework/socket/ws3/ws_base_writer';

export class BilliardWriter extends ws_base_writer {
    on_send(service_name: string, func_name: string, pb: any, callback: CallableFunction): boolean {
        return super.on_send(service_name, func_name, pb, callback);
    }
}


