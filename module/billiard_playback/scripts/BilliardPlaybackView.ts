import { _decorator, Button, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { BilliardData } from '../../../data/BilliardData';
import { yy } from '../../../../../../yy';
import { BilliardConst } from '../../../config/BilliardConst';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { RecordBilliardView } from '../../../../../../lobby/module/record/script/RecordBilliardView';
import { ProtoHelper } from '../../../../../../../framework/socket/ProtoHelper';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardSimulateService } from '../../../net/BilliardSimulateService';
const { ccclass, property } = _decorator;


@ccclass('BilliardPlaybackView')
export class BilliardPlaybackView extends BaseCommonScript {
    @property(Button)
    btnReset: Button;
    @property(Button)
    btnPlay: Button;
    @property(Button)
    btnQuit: Button;
    @property(Node)
    nodeCenter: Node;

    @property([SpriteFrame])
    spriteFrames: SpriteFrame[] = [];


    register_event() {
        this.event_func_map = {
            // [yy.Event_Name.billiard_allStationary] : 'onReset',
            [yy.Event_Name.billiard_reconnect]: "initPlayers",
            [yy.Event_Name.billiard_allStationary] : 'onGameResult',
        }
        super.register_event();
    }

    public on_init(): void {
        this.btnReset.interactable = false;
        this.btnPlay.interactable = false;
    }

    onClickReset() {
        BilliardSimulateService.instance.notifyRecord();
        // this.btnReset.interactable = false;
        // this.btnPlay.interactable = true;
    }

    onClickPlay() {
        this.onClickReset();
        this.nodeCenter.active = false;
        // BilliardData.instance.rShootAtFun();
        // this.scheduleOnce(()=>{
        //     BilliardService.instance.notifyHit({msg:BilliardData.instance.rHitReq})
        // }, 0.2)

        this.btnPlay.interactable = false;
    }

    onClickQuit() {
        BilliardData.instance.setRecord(false);
        yy.event.emit(yy.Event_Name.CasualCommonQuit)
    }

    onReset() {
        yy.log.w("BilliardPlaybackView onReset")
        this.btnReset.interactable = false;
        this.btnPlay.interactable = true;
    }


    initPlayers(isShowReplay = true) {
        const players = BilliardData.instance.getAllPlayers();
        const myInfo = players.find(player => player.uid === yy.user.getUid());
        const otherInfo = players.find(player => player.uid !== yy.user.getUid());

        const myNode = this.node.getChildByPath("NodeCenter/NodePlayer1");
        const otherNode = this.node.getChildByPath("NodeCenter/NodePlayer2");
        const abnormal = ["", "", "Time Out", "Leave", "3 Foul"];
        function setData(node, info , self) {
            const gameResult = BilliardData.instance.rGameResult;
            node.getChildByPath("SpriteName/Label").getComponent(Label).string = info.name
            yy.ui.updateHeadIcon(info.url, node.getChildByPath("p_head_billiard/head_mask/img_head").getComponent(Sprite));
            node.getChildByPath("NodeWiner").active = info.uid === gameResult.winnerid;
            const sprite = node.getChildByPath("Sprite").getComponent(Sprite);
            sprite.node.active = info.uid !== gameResult.winnerid;
            sprite.spriteFrame = self.spriteFrames[gameResult.settleType];
        }

        if(myInfo) {
            setData(myNode, myInfo, this);
        }  

        if (otherInfo) {
            setData(otherNode, otherInfo, this);
        }

        this.btnPlay.node.active = isShowReplay;
    }

    onGameResult() {
        this.onReset();
        this.nodeCenter.active = true;
    }
}


