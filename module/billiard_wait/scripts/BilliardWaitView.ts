import { _decorator, Component, game, Label, Node } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardWaitView')
export class BilliardWaitView extends BaseCommonScript {
    @property(Label)
    labelWait: Label;

    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_reconnect]: "onReconnect",
        };
        super.register_event();
    }


    setWaitTime(time: number) {
        let onUpdate = function() {
            time -= game.deltaTime;
            this.labelWait.string = `等待${Math.max(Math.floor(time), 0)}秒`;     
            if (time <= 0) {
                this.unschedule(onUpdate);
                this.scheduleOnce(()=> this.node.destroy(), 1);
            }
        }
        this.schedule(onUpdate, 0);
    }

    onReconnect(msg: protoBilliard.GameStatus) {
        yy.log.w("BilliardWaitView", msg);
        let isUnlock = true;
        msg.users.forEach(player=>{
            if (player.status !== 3) {
                isUnlock = false;
            }
        });
        yy.log.w("BilliardWaitView", msg, isUnlock);
        if (isUnlock) this.node.destroy();
    }
}


