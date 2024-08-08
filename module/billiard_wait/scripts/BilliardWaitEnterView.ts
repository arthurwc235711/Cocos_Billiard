import { _decorator, Component, game, Label,  Node } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardWaitEnterView')
export class BilliardWaitEnterView extends BaseCommonScript {
    @property(Label)
    labelWait: Label;

    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_wait_enter_close]: "onClose",
            [yy.Event_Name.billiard_wait_enter_settime]: "setWaitTime",
        };
        super.register_event();
    }


    setWaitTime(time: number) {
        let inc = 0;
        let onUpdate = (dt)=>{
            inc += dt; 
            time -= dt;
            let suffix = "";
            let times = inc / 0.5;
            for (let i = 1; i < times; i++) {
                suffix += ".";
            }
            if (times >= 4) inc = 0
            else this.labelWait.string = `Wait for opponent to enter(${Math.ceil(time)})${suffix}`;

            if (time <= 0) this.onClose();
        }
        this.schedule(onUpdate, 0);
    }

    onClose() {
        this.node.destroy();
    }
}


