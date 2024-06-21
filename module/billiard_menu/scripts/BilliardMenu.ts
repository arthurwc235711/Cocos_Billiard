import { _decorator, Component, Node } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
const { ccclass, property } = _decorator;

@ccclass('BilliardMenu')
export class BilliardMenu extends BaseCommonScript {
    @property(Node)
    nodeMore: Node = null;


    private bMusicOn: boolean = true;

    onClickMore() {
        this.nodeMore.active = !this.nodeMore.active;
    }

    onClickMask() {
        this.nodeMore.active = false;
    }

    onClickQuit() {
        yy.audio.stopMusic()
        yy.audio.stopSound()
        yy.scene.change_bundle_scene('app_lobby', 'lobby_scene', () => {
            let gameBundleName = this.sGameBundleName;
            if (typeof gameBundleName === 'string' && gameBundleName.length > 0) {
                yy.loader.releaseBundle(gameBundleName);
            }
            yy.loader.releaseBundle('app_casual_common');
        });
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
        yy.event.emit(yy.Event_Name.CasualCommonRule)
    }

    onClickHistory() {
        this.onClickMask();
        yy.event.emit(yy.Event_Name.CasualCommonHistory)
    }
}


