import { _decorator, Component, director, instantiate, Node, Prefab } from 'cc';
import { CasualCommonSceneBase } from '../../../casual_common/scripts/base/CasualCommonSceneBase';
import { yy } from '../../../../yy';
import BilliardEventConfig from '../config/BilliardEventConfig';
import { BilliardManager } from '../scripts/BilliardManager';
const { ccclass, property } = _decorator;

@ccclass('BilliardScene')
export class BilliardScene extends CasualCommonSceneBase {
    @property(Prefab)
    prefabBilliard3D: Prefab = null;

    public register_event() {
        yy.event.addEventNameList(BilliardEventConfig);
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            // [yy.Event_Name.PPSlotsEventClickRules]: "onClickRule",
            // [yy.Event_Name.PPSlotsEventClickHistory]: "onClickHistory",
            // [yy.Event_Name.reset_all_view]: 'onEventResetAllView',
        };
        super.register_event();
    }


    protected start(): void {
        let clone = instantiate(this.prefabBilliard3D);
        director.getScene().addChild(clone);
    }


    on_uninit() {
        yy.event.removeEventNameList(BilliardEventConfig);
        BilliardManager.instance.release();
    }
}


