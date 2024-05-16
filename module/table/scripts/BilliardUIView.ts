import { _decorator, Component, Node } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardUIView')
export class BilliardUIView extends BaseCommonScript {
    public register_event() {
        // 注册指定的监听方法，格式如下
        // this.event_func_map = {
        //     [yy.Event_Name.billiard_hit]: "hitEvent",
        // };
        // super.register_event();
    }

    public on_init(): void {

    }

    onClickHit() {
        yy.event.emit(yy.Event_Name.billiard_hit);
    }
}


