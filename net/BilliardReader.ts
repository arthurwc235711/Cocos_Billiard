import { _decorator, Component, Node } from 'cc';
import { ws_base_writer } from '../../../../../framework/socket/ws3/ws_base_writer';
import { yy } from '../../../../yy';
import { GameMessageStack } from '../../../../main/data/GameMessageStack';
const { ccclass, property } = _decorator;

@ccclass('BilliardReader')
export class BilliardReader extends ws_base_writer {
    on_message(service_name: string, func_name: string, data: any, pb: any): void {
        try {
            let name:string = `${service_name}_${func_name}`;
            if (name != null) {
                yy.log.d(`收到消息: service_name.func_name:${name}`, data)
                GameMessageStack.instance().tryStackMessage(name, {code: data.code, msg: data.msg, pb: pb});
            }
        } catch (error) {
            yy.log.e(`收到消息: error service_name.func_name:${service_name}.${func_name}`, error)
        }
    }

    on_command(cmd: number, data: any) {
        try {
            let result = cmd
            if (result != null) {
                let name = `cmd_0x${result.toString(16)}`;
                yy.log.d(`收到消息: cmd:${cmd.toString(16)}`, data)
                GameMessageStack.instance().tryStackMessage(name, { code: 0, msg: data.msg });
            } else {
                yy.log.d(`收到消息: cmd:${cmd.toString(16)}, 子游戏没有配置`, data)
            }
        } catch (error) {
            yy.log.e(`收到消息: error cmd:${cmd.toString(16)}`, error)
        }
    }

    on_timeout(service_name: string, func_name: string, data: any, pb: any) {
        let name = `${service_name}_${func_name}_timeout`;
        GameMessageStack.instance().tryStackMessage(name, {code: data.code, pb: pb});
    }
}


