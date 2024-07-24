import { _decorator, Component, Node } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardTools } from '../../../scripts/BilliardTools';
const { ccclass, property } = _decorator;

@ccclass('BilliardMenu')
export class BilliardMenu extends BaseCommonScript {
    @property(Node)
    nodeMore: Node;
    @property(Node)
    nodeButton: Node;


    private bMusicOn: boolean = true;

    on_init(): void {
        this.nodeButton.active = !BilliardTools.instance.isNeedGuide();
    }

    onClickMore() {
        this.nodeMore.active = !this.nodeMore.active;
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


