import { _decorator, Component, Node } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { CasualCommonMenu } from '../../../../../casual_common/module/menu/scripts/CasualCommonMenu';
const { ccclass, property } = _decorator;

@ccclass('BilliardMenu')
export class BilliardMenu extends CasualCommonMenu {
    @property(Node)
    nodeMore: Node;
    @property(Node)
    nodeButton: Node;


    private bMusicOn: boolean = true;

    register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.on_click_exit_to_lobby]: "onClickQuit",
            [yy.Event_Name.on_click_settings]: "onClickSetting",
            [yy.Event_Name.on_click_game_rule]: "onClickRule",
        };
        super.register_event();
    }
    on_init(): void {
        super.on_init();
        this.nodeButton.active = !BilliardTools.instance.isNeedGuide();
    }

    onClickMore() {
        this.nodeMore.active = !this.nodeMore.active;
        if (this.nodeMore.active) {
            yy.event.emit(yy.Event_Name.on_menu_update_button)
        }
    }

    onClickMask() {
        this.nodeMore.active = false;
    }

    onClickQuit() {
        yy.event.emit(yy.Event_Name.CasualCommonQuit)
        BilliardService.instance.sendExit();
    }

    onClickSound() {
        this.bMusicOn = !this.bMusicOn;
        yy.audio.setMusicSwitch(this.bIsMusicOn);
        yy.audio.setSoundSwitch(this.bIsMusicOn)
        // this.updateSoundStatus();
        this.onClickMask();
        yy.event.emit(yy.Event_Name.CasualCommonSound);
    }

    onClickRule() {
        this.onClickMask();
        BilliardTools.instance.openRuleView();
        yy.event.emit(yy.Event_Name.CasualCommonRule)
    }

    onClickHistory() {
        this.onClickMask();
        yy.event.emit(yy.Event_Name.CasualCommonHistory)
    }

    onClickSetting() {
        this.onClickMask();
        BilliardTools.instance.openSettingView();
    }
}


