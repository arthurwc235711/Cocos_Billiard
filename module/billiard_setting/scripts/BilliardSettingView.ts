import { _decorator, Component, Node, Toggle } from 'cc';
import { BaseCommonPopup } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardManager } from '../../../scripts/BilliardManager';
const { ccclass, property } = _decorator;

@ccclass('BilliardSettingView')
export class BilliardSettingView extends BaseCommonPopup {
    @property(Toggle)
    toggleMusic: Toggle = null;
    @property(Toggle)
    toggleSound: Toggle = null;
    @property(Toggle)
    toggleVibrating: Toggle = null;


    @property(Toggle)
    toggleCueLeft: Toggle = null;
    @property(Toggle)
    toggleCueRight: Toggle = null;

    @property(Toggle)
    toggleSlow: Toggle = null;
    @property(Toggle)
    toggleNormal: Toggle = null;
    @property(Toggle)
    toggleFast: Toggle = null;


    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_notify_wins]: "close",
        };
        super.register_event();
    }

    on_init() {
        super.on_init();

        this.toggleMusic.isChecked = yy.audio.getMusicSwitch();
        this.toggleSound.isChecked = yy.audio.getSoundSwitch();


        let limit = BilliardData.instance.getAngleLimit()
        this.toggleSlow.isChecked = limit === 200;
        this.toggleNormal.isChecked = limit === 100;
        this.toggleFast.isChecked = limit === 50;



        let x = BilliardManager.instance.getView().nodeLeft.position.x;
        this.toggleCueLeft.isChecked = x === -890;
        this.toggleCueRight.isChecked = x === 890;
    }

    protected start(): void {
        // 临时处理 popo通用接口适配异常处理
        let mask = this.node.parent.getChildByName('popup_shade_layer');
        if(mask){
            mask.active = false;
        }
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
                BilliardData.instance.setAngleLimit(200);
                BilliardTools.instance.setCacheCueSensitivity(200);
                break;
            case "ToggleNormal":
                BilliardData.instance.setAngleLimit(100);
                BilliardTools.instance.setCacheCueSensitivity(100);
                break;
            case "ToggleFast":
                BilliardData.instance.setAngleLimit(50);
                BilliardTools.instance.setCacheCueSensitivity(50);
                break;
            case "ToggleLeft":
                yy.event.emit(yy.Event_Name.billiard_setting_cue_location, true);
                BilliardTools.instance.setCacheCueLocation(true);
                break;
            case "ToggleRight":
                yy.event.emit(yy.Event_Name.billiard_setting_cue_location, false);
                BilliardTools.instance.setCacheCueLocation(false);
                break;

        }
    }

}


