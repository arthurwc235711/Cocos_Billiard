import { _decorator, Component, Node, Toggle } from 'cc';
import { BaseCommonPopup } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardSettingView')
export class BilliardSettingView extends BaseCommonPopup {
    @property(Toggle)
    toggleMusic: Toggle = null;
    @property(Toggle)
    toggleSound: Toggle = null;
    @property(Toggle)
    toggleVibrating: Toggle = null;


    on_init() {
        super.on_init();

        this.toggleMusic.isChecked = yy.audio.getMusicSwitch();
        this.toggleSound.isChecked = yy.audio.getSoundSwitch();
    }



    onToggle(toggle: Toggle) {
        switch(toggle.node.name) {
            case "ToggleMusic":
                yy.audio.setMusicSwitch(toggle.isChecked);
                break;
            case "ToggleSound":
                yy.audio.setSoundSwitch(toggle.isChecked);
                break;
            case "ToggleVibrating":
                yy.log.w("ToggleVibrating");
                break;
        }
        toggle.node.getChildByName("Sprite").active = !toggle.isChecked;
    }

    onToggleGroup(toggle: Toggle) {
        // yy.log.w("onToggleGroup", toggle.node.name, toggle.isChecked);
        switch(toggle.node.name) {
            case "ToggleSlow":
                yy.log.w("ToggleSlow");
                break;
            case "ToggleNormal":
                yy.log.w("ToggleNormal");
                break;
            case "ToggleFast":
                yy.log.w("ToggleFast");
                break;
            case "ToggleLeft":
                yy.event.emit(yy.Event_Name.billiard_setting_cue_location, true);
                break;
            case "ToggleRight":
                yy.event.emit(yy.Event_Name.billiard_setting_cue_location, false);
                break;

        }

    }

}


