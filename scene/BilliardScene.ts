import { _decorator, Component, director, instantiate, JsonAsset, Node, Prefab } from 'cc';
import { CasualCommonSceneBase } from '../../../casual_common/scripts/base/CasualCommonSceneBase';
import { yy } from '../../../../yy';
import BilliardEventConfig from '../config/BilliardEventConfig';
import { BilliardManager } from '../scripts/BilliardManager';
import { eRuleType } from '../config/BilliardConst';
import { GameMessageStack, ITemplateGameServiceListener } from '../../../../main/data/GameMessageStack';
import { BilliardService } from '../net/BilliardService';
import { BilliardPbConfig } from '../net/BilliardPbConfig';
import { BilliardReader } from '../net/BilliardReader';
import { BilliardWriter } from '../net/BilliardWriter';
import { ProtoHelper } from '../../../../../framework/socket/ProtoHelper';
const { ccclass, property } = _decorator;

@ccclass('BilliardScene')
export class BilliardScene extends CasualCommonSceneBase implements ITemplateGameServiceListener {
    @property(Prefab)
    prefabBilliard3D: Prefab = null;
    @property([JsonAsset])
    protoJson: JsonAsset[] = [];

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


    public on_init(): void {
        GameMessageStack.instance().setLogTag("[BilliardMsgStack]");
        GameMessageStack.instance().openLock();
        BilliardService.instance.setSceneScript(this);
        GameMessageStack.instance().setListener(BilliardService.instance);

        this.addGameScoketConfig();
        this.protoJson.forEach(info => {
            ProtoHelper.Ins.parseJsonData(info.json)
        })
    }


    protected start(): void {
        let clone = instantiate(this.prefabBilliard3D);
        director.getScene().addChild(clone);
        yy.toast.setToastRes('app_common', 'toast/view/toast_view');
        BilliardManager.instance.setRules(eRuleType.EightBall);
    }


    addGameScoketConfig() {
        yy.socket.add_pb_config_list(BilliardPbConfig);
        yy.socket.add_socket_reader('BilliardReader', new BilliardReader());
        yy.socket.add_socket_writer('BilliardWriter', new BilliardWriter());
    }

    removeGameSocketConfig() {
        yy.socket.remove_pb_config_list(BilliardPbConfig);
        yy.socket.remove_socket_reader('BilliardReader');
        yy.socket.remove_socket_writer('BilliardWriter');
    }

    on_uninit() {
        this.removeGameSocketConfig();
        yy.event.removeEventNameList(BilliardEventConfig);
        BilliardManager.instance.release();

        GameMessageStack.instance().release();
        BilliardService.instance.delete();
    }


    generateTimerOnce(callback: Function, elapsedTime: number): void {
        this.g_canvas.scheduleOnce(callback, elapsedTime);
    }
    clearAllTimer(): void {
        this.g_canvas.unscheduleAllCallbacks();
    }
}


