import { _decorator, Button, Component, Label, Node, Sprite, tiledLayerAssembler, Vec3 } from 'cc';
import { yy } from '../../../../../../yy';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardData } from '../../../data/BilliardData';
const { ccclass, property } = _decorator;


interface BilliardMatchUI {
    labelName: Label;
    spriteUrl: Sprite;
    labelGold: Label;
    nodeHalo: Node;
}


@ccclass('BilliardWinsView')
export class BilliardWinsView extends BaseCommonScript {
    @property(Node)
    nodeMy: Node = null;
    @property(Node)
    nodeOther: Node = null;
    @property(Label)
    labelGold: Label = null;
    @property(Label)
    labelMyGold: Label = null;
    @property(Node)
    nodeMyPao: Node = null;
    @property(Node)
    nodePao: Node = null;
    @property(Label)
    labelTips: Label = null;
    @property(Button)
    btnPlayAgain:Button = null;
    @property(Button)
    btnRematch: Button = null;

    

    myUI: BilliardMatchUI = {labelName: null, spriteUrl: null, labelGold: null, nodeHalo: null};
    otherUI: BilliardMatchUI = {labelName: null, spriteUrl: null, labelGold: null, nodeHalo: null};


    private isEnoughMoney: boolean = true;
    // private sData: protoBilliard.BroadcastGameResult;
    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_notify_ready]: "onReady",
            [yy.Event_Name.billiard_notify_leave]: "onLeave",
            [yy.Event_Name.billiard_notify_start]: "onReStart",
        };
        super.register_event();
    }

    on_init(): void {
        this.myUI.labelName = this.nodeMy.getChildByName("Label").getComponent(Label);
        this.myUI.spriteUrl = this.nodeMy.getChildByPath("p_head_billiard/head_mask/img_head").getComponent(Sprite);
        this.myUI.labelGold = this.nodeMy.getChildByPath("Layout/Label").getComponent(Label);
        this.myUI.nodeHalo = this.nodeMy.getChildByName("Halo");

        this.otherUI.labelName = this.nodeOther.getChildByName("Label").getComponent(Label);
        this.otherUI.spriteUrl = this.nodeOther.getChildByPath("p_head_billiard/head_mask/img_head").getComponent(Sprite);
        this.otherUI.labelGold = this.nodeOther.getChildByPath("Layout/Label").getComponent(Label);
        this.otherUI.nodeHalo = this.nodeOther.getChildByName("Halo");

        this.labelMyGold.string = yy.money.formatMoney( yy.user.getTotalMoney(), false);

        this.scheduleOnce(()=>{
            yy.event.emit(yy.Event_Name.billiard_clear_game_data);
            this.node.getChildByName("NodeBtn").scale = Vec3.ONE;
        }, 2)

        if (BilliardData.instance.isOtherPlayExit) {
            this.onLeave();
        }

        BilliardTools.instance.playSoundFlyGold();
    }

    setData(data: protoBilliard.BroadcastGameResult) {
        for(let i = 0; i < data.playerResult.length; i++) {
            let p = data.playerResult[i];
            if(p.uid === yy.user.getUid()) {
                this.setPlayerInfo(this.myUI, p.nick, p.icon, p.moneyTotal.toNumber());
                this.nodeMy.getChildByName("NodeWiner").active = data.winnerid === p.uid;
                this.myUI.nodeHalo.active = data.winnerid === p.uid;

                this.isEnoughMoney = p.moneyTotal.toNumber() >= data.tablecfg.CarryLower;
            }
            else {
                this.setPlayerInfo(this.otherUI, p.nick, p.icon, p.moneyTotal.toNumber());
                this.nodeOther.getChildByName("NodeWiner").active = data.winnerid === p.uid;
                this.otherUI.nodeHalo.active = data.winnerid === p.uid;
            }
        }

        this.labelGold.string = yy.money.formatMoney( data.ChipPot.toNumber(), false);

        // if (data.winnerid === yy.user.getUid()) {
        BilliardTools.instance.playSoundWin();
        // }
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


    onReady(notify: protoBilliard.BroadcastUserReady) {
        if (notify.uid === yy.user.getUid()) {
            this.btnPlayAgain.interactable = false;
            // this.btnRematch.interactable = false;
            this.nodeMyPao.active = true;
        }
        else {
            this.nodePao.active = true;
            this.labelTips.string = "Let's play another round!";
        }
    }

    onLeave() {
        this.nodePao.active = true;
        this.labelTips.string = "Have Left!";
        this.btnPlayAgain.interactable = false;
        this.btnRematch.interactable = true;
    }


    onReStart() {
        this.node.destroy();
    }


    onClickReady() {
        if (this.isEnoughMoney) {
            BilliardService.instance.sendReady();
        }
        else {
            yy.dialog.show(
                {
                    title: "Tip",
                    content: "You need more money to enter the room.",
                    isCancelEnable: false,
                    isConfirmEnable: true,
                    confirmText: "OK",
                    confirmCallback: () => {
                    },
                    closeCallback: () => {
                    },
                    fontSize: 50,
                    lineHeight: 60,
                    // horizontalAlign: HorizontalTextAlignment.CENTER,
                    // verticalAlign: VerticalTextAlignment.CENTER,
                }
            )
        }

    }

    onClickRematch() {
        if (this.isEnoughMoney) {
            BilliardTools.instance.openReMatchView(()=>{
                this.node.destroy();
            });
        }
        else {
            yy.dialog.show(
                {
                    title: "Tip",
                    content: "You need more money to enter the room.",
                    isCancelEnable: false,
                    isConfirmEnable: true,
                    confirmText: "OK",
                    confirmCallback: () => {
                    },
                    closeCallback: () => {
                    },
                    fontSize: 50,
                    lineHeight: 60,
                    // horizontalAlign: HorizontalTextAlignment.CENTER,
                    // verticalAlign: VerticalTextAlignment.CENTER,
                }
            )
        }

    }
}


