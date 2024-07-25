import { _decorator, Button, Component, Label, Node, Sprite, tiledLayerAssembler, Vec3 } from 'cc';
import { yy } from '../../../../../../yy';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardData } from '../../../data/BilliardData';
import { OnEnablePlaySpine } from '../../../../../../common/scripts/component/OnEnablePlaySpine';
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
    nodeMy: Node;
    @property(Node)
    nodeOther: Node;
    @property(Label)
    labelGold: Label;
    @property(Label)
    labelMyGold: Label;
    @property(Node)
    nodeMyPao: Node;
    @property(Node)
    nodePao: Node;
    @property(Label)
    labelTips: Label;
    @property(Button)
    btnPlayAgain:Button;
    @property(Button)
    btnRematch: Button;
    @property(OnEnablePlaySpine)
    playSpine: OnEnablePlaySpine;
    

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

        

        this.scheduleOnce(()=>{
            yy.event.emit(yy.Event_Name.billiard_clear_game_data);
            this.node.getChildByName("NodeBtn").scale = Vec3.ONE;
        }, 2)

        if (BilliardData.instance.isOtherPlayExit) {
            this.onLeave();
        }

        BilliardTools.instance.playSoundFlyGold();

        let labelTitle = this.node.getChildByPath("SpriteTitle/Label").getComponent(Label);
        labelTitle.string = BilliardData.instance.is8Ball() ? "8 Ball" : "9 Ball";
    }

    setData(data: protoBilliard.BroadcastGameResult) {
        for(let i = 0; i < data.playerResult.length; i++) {
            let p = data.playerResult[i];
            if(p.uid === yy.user.getUid()) {
                this.setPlayerInfo(this.myUI, p.nick, p.icon, p.moneyTotal.toNumber());
                this.nodeMy.getChildByName("NodeWiner").active = data.winnerid === p.uid;
                this.myUI.nodeHalo.active = data.winnerid === p.uid;

                this.isEnoughMoney = p.moneyTotal.toNumber() >= data.tablecfg.CarryLower;
                if (data.winnerid === p.uid) this.playSpine.animName = "ani1";
            }
            else {
                this.setPlayerInfo(this.otherUI, p.nick, p.icon, p.moneyTotal.toNumber());
                this.nodeOther.getChildByName("NodeWiner").active = data.winnerid === p.uid;
                this.otherUI.nodeHalo.active = data.winnerid === p.uid;

                if (data.winnerid === p.uid) this.playSpine.animName = "ani2";
                
            }
        }

        this.playSpine.node.active = true;

        if (yy.user.getUid() === data.winnerid) {
            this.labelMyGold.string = yy.money.formatMoney( yy.user.getTotalMoney() - data.ChipPot.toNumber(), false);
            this.rollNum(this.labelMyGold, yy.user.getTotalMoney() - data.ChipPot.toNumber(), yy.user.getTotalMoney(), 3);
        }
        else {
            this.labelMyGold.string = yy.money.formatMoney( yy.user.getTotalMoney(), false);
        }
        this.rollNum(this.labelGold, data.ChipPot.toNumber(), 0, 3);

        // this.labelGold.string = yy.money.formatMoney( data.ChipPot.toNumber(), false);

        // if (data.winnerid === yy.user.getUid()) {
        BilliardTools.instance.playSoundWin();
        // }
    }

    rollNum(label:Label, orgNum:number, distNum: number, totalTimes: number) {
        let num = orgNum;
        let onUpdate = (dt)=>{
            if (orgNum < distNum) {
                num += dt/totalTimes * (distNum - orgNum);
                if (num >= distNum)  {
                    num = distNum
                    label.string = yy.money.formatMoney(num, false);
                    this.unschedule(onUpdate);
                }
            }
            else {
                num -= dt/totalTimes * orgNum;
                if (num <= 0)  {
                    num = distNum
                    label.string = ""//yy.money.formatMoney(num, false);
                    this.unschedule(onUpdate);
                }
            }

            label.string = yy.money.formatMoney(Math.floor(num/1000)*1000, false);
        }
        // this.schedule(this.loopUpdate, 0); 
        this.schedule(onUpdate, 0);
    }



    onClickGoBack() {
        BilliardService.instance.sendExit();
        yy.event.emit(yy.Event_Name.CasualCommonQuit)
    }



    setPlayerInfo(ui: BilliardMatchUI, name: string = null, url: string = null, gold: number = null) {
        ui.labelName.string = name;
        yy.ui.updateHeadIcon(url, ui.spriteUrl);
        // ui.labelGold.string = yy.money.formatMoney(gold, false);
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

    onLeave(reason: number = 0) {
        if (reason === 0) {// 强制退出
            this.nodePao.active = true;
            this.labelTips.string = "Have Left!";
            this.btnPlayAgain.interactable = false;
            this.btnRematch.interactable = true;
        }
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


