import { _decorator, Component, director, Label, Node, Sprite, tween, Vec3 } from 'cc';
import { BilliardSlotIcon } from './BilliardSlotIcon';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { ISubGameTableInfoItemData } from '../../../../../../main/data/SubGameData';
import { BilliardTools } from '../../../scripts/BilliardTools';
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
    nodeMy: Node = null;
    @property(Node)
    nodeOther: Node = null;
    @property(Node)
    nodeVs: Node = null;
    @property(Node)
    nodeAddGold: Node = null;
    @property(BilliardSlotIcon)
    slotIcon: BilliardSlotIcon = null;
    @property(Label)
    lableMyGold: Label = null;


    myUI: BilliardMatchUI = {labelName: null, spriteUrl: null, labelGold: null};
    
    otherUI: BilliardMatchUI = {labelName: null, spriteUrl: null, labelGold: null};
    state: BilliardMatchState = BilliardMatchState.eNone;


    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.Billiard_Matching]: "onMatching",
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


    protected start(): void {


        // this.scheduleOnce(()=>{
            // this.setState(BilliardMatchState.eMatchSucess);
        // }, 3);
    }

    onClickGoBack() {
        BilliardService.instance.sendLeaveMatching();
        if (yy.Event_Name.CasualCommonQuit) { // 桌球游戏内调用
            yy.event.emit(yy.Event_Name.CasualCommonQuit);
        }
    }

    onMatchingCancel() {
        this.node.destroy();
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
                break;
            case BilliardMatchState.eMatchSucess:
                this.unscheduleAllCallbacks();

                yy.audio.stopSound();
                BilliardTools.instance.playSoundMatch();
                this.slotIcon.stopScroll();
                tween(this.nodeOther)
                .to(0.5, {position: new Vec3(453, 0, 0)})
                .start();

                tween(this.nodeMy)
                .to(0.5, {position: new Vec3(-453, 0, 0)})
                .start();

                tween(this.nodeVs)
                .to(0.5, {position: new Vec3(3, 89, 0)})
                .call(()=>{
                    this.nodeAddGold.active = true;
                    
                })
                .start();


                this.scheduleOnce(()=>{
                    if (director.getScene().name === "billiard") {
                        yy.event.emit(yy.Event_Name.billiard_rematch);
                        this.node.destroy();
                    }
                    else {
                        yy.subGameData.enterSubGame("billiard", { isPractice: false });  
                    }
                }, 1)

                break;
            case BilliardMatchState.eEnterGame:
                break;
        }
    }

    setPlayerInfo(ui: BilliardMatchUI, info: protoBilliardAlloc.MatchingUserInfo, score: number) {
        ui.labelName.string = info.nick;
        yy.ui.updateHeadIcon(info.icon, ui.spriteUrl);
        ui.labelGold.string = yy.money.formatMoney(score, false);
    }

    onMatching() {

    }

    onMatchingSuccess(msg: protoBilliardAlloc.MatchingTableMsg) {
        let myInfo = msg.userList.filter((v)=>v.uid === yy.user.getUid());
        let otherInfo = msg.userList.filter((v)=>v.uid !== yy.user.getUid());
        this.setPlayerInfo(this.myUI, myInfo[0], msg.basescore);
        this.setPlayerInfo(this.otherUI, otherInfo[0], msg.basescore);
        this.otherUI.labelGold.node.parent.active = true;
        this.myUI.labelGold.node.parent.active = true;

        this.nodeAddGold.getChildByName("Label").getComponent(Label).string = yy.money.formatMoney(msg.basescore * 2, false);
        this.setState(BilliardMatchState.eMatchSucess);

        this.lableMyGold.string = yy.money.formatMoney(yy.user.getTotalMoney() - msg.basescore, false);
    }
}


