import { _decorator, Component, game, RichText, Node } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
const { ccclass, property } = _decorator;

@ccclass('BilliardWaitView')
export class BilliardWaitView extends BaseCommonScript {
    @property(RichText)
    labelWait: RichText;
    @property(Node)
    lockNode: Node;
    @property(Node)
    lockTipsNode: Node;

    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_reconnect]: "onReconnect",
        };
        super.register_event();
    }


    setWaitTime(time: number) {
        this.unscheduleAllCallbacks();
        this.lockNode.active = BilliardData.instance.isOldVersion();// 兼容处理
        this.lockTipsNode.active = BilliardData.instance.isOldVersion();// 兼容处理

        let onUpdate = function() {
            time -= game.deltaTime;
            this.labelWait.string = `Opponent's disconnected(<color=#FBC21EFF>${Math.max(Math.floor(time), 0)}</color>)`//`等待}秒`;     
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
            if (player.status === 4) {
                isUnlock = false;
            }
        });
        yy.log.w("BilliardWaitView", msg, isUnlock);
        if (isUnlock) this.node.destroy();
    }
}


