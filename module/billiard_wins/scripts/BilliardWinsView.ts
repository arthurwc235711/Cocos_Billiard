import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { yy } from '../../../../../../yy';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { BilliardService } from '../../../net/BilliardService';
const { ccclass, property } = _decorator;


interface BilliardMatchUI {
    labelName: Label;
    spriteUrl: Sprite;
    labelGold: Label;
}


@ccclass('BilliardWinsView')
export class BilliardWinsView extends BaseCommonScript {
    @property(Node)
    nodeMy: Node = null;
    @property(Node)
    nodeOther: Node = null;
    @property(Label)
    labelGold: Label = null;

    

    myUI: BilliardMatchUI = {labelName: null, spriteUrl: null, labelGold: null};
    otherUI: BilliardMatchUI = {labelName: null, spriteUrl: null, labelGold: null};


    // private sData: protoBilliard.BroadcastGameResult;
    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            // [yy.Event_Name.Billiard_Matching]: "onMatching",
            // [yy.Event_Name.Billiard_Matching_Success]: "onMatchingSuccess",
            // [yy.Event_Name.Billiard_Matching_Cancel]: "onMatchingCancel",
        };
        super.register_event();
    }

    on_init(): void {
        this.myUI.labelName = this.nodeMy.getChildByName("Label").getComponent(Label);
        this.myUI.spriteUrl = this.nodeMy.getChildByPath("p_head_billiard/head_mask/img_head").getComponent(Sprite);
        this.myUI.labelGold = this.nodeMy.getChildByPath("Layout/Label").getComponent(Label);

        this.otherUI.labelName = this.nodeOther.getChildByName("Label").getComponent(Label);
        this.otherUI.spriteUrl = this.nodeOther.getChildByPath("p_head_billiard/head_mask/img_head").getComponent(Sprite);
        this.otherUI.labelGold = this.nodeOther.getChildByPath("Layout/Label").getComponent(Label);

        yy.log.w("on_init")
    }

    setData(data: protoBilliard.BroadcastGameResult) {
        // this.sData = data;

        for(let i = 0; i < data.playerResult.length; i++) {
            let p = data.playerResult[i];
            if(p.uid === yy.user.getUid()) {
                this.setPlayerInfo(this.myUI, p.nick, p.icon, p.moneyTotal);
            }
            else {
                this.setPlayerInfo(this.otherUI, p.nick, p.icon, p.moneyTotal);
            }
        }

        this.nodeMy.getChildByName("NodeWiner").active = data.winnerid === yy.user.getUid();
        this.nodeOther.getChildByName("NodeWiner").active = data.winnerid === yy.user.getUid();
    }



    onClickGoBack() {
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



    setPlayerInfo(ui: BilliardMatchUI, name: string = null, url: string = null, gold: number = null) {
        ui.labelName.string = name;
        yy.ui.updateHeadIcon(url, ui.spriteUrl);
        ui.labelGold.string = yy.money.formatMoney(gold, false);
    }

}


