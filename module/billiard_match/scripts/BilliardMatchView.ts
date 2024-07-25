import { _decorator, Component, director, Label, Node, Sprite, tween, Vec3 } from 'cc';
import { BilliardSlotIcon } from './BilliardSlotIcon';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { ISubGameTableInfoItemData } from '../../../../../../main/data/SubGameData';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardData } from '../../../data/BilliardData';
const { ccclass, property } = _decorator;

interface BilliardMatchUI {
    labelName: Label;
    spriteUrl: Sprite;
    labelGold: Label;
}

enum BilliardMatchState {
    eNone,
    eMatching,
    eMatchSucess,
    eEnterGame,
}

@ccclass('BilliardMatchView')
export class BilliardMatchView extends BaseCommonScript {
    @property(Node)
    nodeMy: Node;
    @property(Node)
    nodeOther: Node;
    @property(Sprite)
    spriteVs: Sprite;
    @property(Node)
    nodeAddGold: Node;
    @property(BilliardSlotIcon)
    slotIcon: BilliardSlotIcon;
    @property(Label)
    lableMyGold: Label;
    @property(Node)
    nodeSpineGod:Node;
    @property(Node)
    nodeSpineHead:Node


    myUI: BilliardMatchUI = {labelName: null, spriteUrl: null, labelGold: null};
    
    otherUI: BilliardMatchUI = {labelName: null, spriteUrl: null, labelGold: null};
    state: BilliardMatchState = BilliardMatchState.eNone;


    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.Billiard_Matching_Success]: "onMatchingSuccess",
            [yy.Event_Name.Billiard_Matching_Cancel]: "onMatchingCancel",
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

        this.setMyData();
        this.setState(BilliardMatchState.eMatching);
    }

    reqMatching(data: ISubGameTableInfoItemData) {
        BilliardService.instance.sendEnterMatching(data);
    }

    reqGameSceneMatching() {
        yy.log.w("reqGameSceneMatching");
    }

    onClickGoBack() {
        BilliardService.instance.sendLeaveMatching();
        // yy.event.emit(yy.Event_Name.CasualCommonQuit);
    }

    onMatchingCancel() {
        yy.event.emit(yy.Event_Name.CasualCommonQuit);
        // this.scheduleOnce(()=>{
        //     this.onClickGoBack();
        // }, 2);
    }

    
    setMyData() {
        this.myUI.labelName.string = yy.user.getNick();
        yy.ui.updateHeadIcon(yy.user.getIcon(), this.myUI.spriteUrl);
        this.lableMyGold.string = yy.money.formatMoney(yy.user.getTotalMoney(), false);
    }


    setState(eState: BilliardMatchState) {
        this.state = eState;
        switch (eState) {
            case BilliardMatchState.eMatching:
                let inc = 0;
                let onUpdate = (dt)=>{
                    inc += dt; 
                    let suffix = "";
                    let times = inc / 0.5;
                    for (let i = 1; i < times; i++) {
                        suffix += ".";
                    }
                    if (times >= 4) inc = 0
                    else this.otherUI.labelName.string = "Matching" + suffix;
                }

                BilliardTools.instance.playSoundHeadRotate();
                this.slotIcon.onClickStart();
                this.schedule(onUpdate, 0);
                let labelTitle = this.node.getChildByPath("SpriteTitle/Label").getComponent(Label);
                labelTitle.string = BilliardData.instance.is8Ball() ? "8 Ball" : "9 Ball";
                break;
            case BilliardMatchState.eMatchSucess:
                this.unscheduleAllCallbacks();

                yy.audio.stopSound();
                BilliardTools.instance.playSoundMatch();

                this.nodeSpineHead.active = true
                tween(this.nodeOther)
                .to(0.5, {position: new Vec3(453, 0, 0)})
                .start();

                tween(this.nodeMy)
                .to(0.5, {position: new Vec3(-453, 0, 0)})
                .start();

                this.spriteVs.enabled = false;
                this.spriteVs.node.children[0].active = true;
                tween(this.spriteVs.node)
                .to(0.5, {position: new Vec3(3, 89, 0)})
                .call(()=>{
                    this.nodeAddGold.active = true;
                    this.nodeSpineGod.active = true;
                })
                .start();


                this.scheduleOnce(()=>{
                    yy.event.emit(yy.Event_Name.billiard_rematch);
                    yy.audio.stopSound();
                    this.node.destroy();
                    // if (director.getScene().name === "billiard") {
                    //     yy.event.emit(yy.Event_Name.billiard_rematch);
                    //     yy.audio.stopSound();
                    //     this.node.destroy();
                    // }
                    // else {
                    //     yy.subGameData.enterSubGame("billiard", { isPractice: false });  
                    // }
                }, 3)

                break;
            case BilliardMatchState.eEnterGame:
                break;
        }
    }

    setPlayerInfo(ui: BilliardMatchUI, info: protoBilliardAlloc.MatchingUserInfo, score: number) {
        ui.labelName.string = info.nick;
        // yy.ui.updateHeadIcon(info.icon, ui.spriteUrl);
        // ui.labelGold.string = yy.money.formatMoney(score, false);
        this.rollNum(ui.labelGold, score, 0, 2.5);
    }


    onMatchingSuccess(msg: protoBilliardAlloc.MatchingTableMsg) {
        let myInfo = msg.userList.filter((v)=>v.uid === yy.user.getUid());
        let otherInfo = msg.userList.filter((v)=>v.uid !== yy.user.getUid());
        this.otherUI.labelGold.node.parent.active = true;
        this.myUI.labelGold.node.parent.active = true;

        // this.nodeAddGold.getChildByName("Label").getComponent(Label).string = yy.money.formatMoney(msg.basescore * 2, false);

        this.slotIcon.stopScroll(otherInfo[0].icon);
        this.setState(BilliardMatchState.eMatchSucess);

        this.setPlayerInfo(this.myUI, myInfo[0], msg.basescore);
        this.setPlayerInfo(this.otherUI, otherInfo[0], msg.basescore);
        this.rollNum(this.nodeAddGold.getChildByName("Label").getComponent(Label), 0, msg.basescore * 2, 2.5);

        this.lableMyGold.string = yy.money.formatMoney(yy.user.getTotalMoney() - msg.basescore, false);
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
}


