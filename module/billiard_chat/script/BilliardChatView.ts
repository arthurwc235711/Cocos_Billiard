import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import List from '../../../../../../main/ui/List';
import { BilliardService } from '../../../net/BilliardService';
const { ccclass, property } = _decorator;

const CMsgList = [
    "Good luck",
    "Nice shot",
    "Well played",
    "You're good!",
    "Thanks",
    "Oops",
    "Unlucky",
    "Nice try",
    "Hehe",
    "Close!",
    "Good game",
    "Sorry gotta run",
    "Nice Cue",
    "One more game?",
    "Hello",
]


@ccclass('BilliardChatView')
export class BilliardChatView extends BaseCommonScript  {
    @property(List)
    listMsg: List = null;
    @property(Node)
    nodeEmo: Node = null;


    on_init(): void {

        // yy.log.w("on_init", CMsgList);
        // this.listMsg.numItems = CMsgList.length;
        this.listMsg.numItems = CMsgList.length;

        this.nodeEmo.children.forEach(emo=>{
            emo.on("click", ()=> {
                let s = emo.getComponent(Sprite);
                BilliardService.instance.sendChatReq(2, s.spriteFrame.name);
                // yy.event.emit(yy.Event_Name.billiard_send_msg, 2, s.spriteFrame.name);
                // yy.log.w(s.spriteFrame.name);
                this.onClickClose();
            }, this);
        });
    }

    onListRender(item: Node, idx: number) {
        // yy.log.w("onListRender", item, idx)
        if (!item) return;

        item.getChildByName("Label").getComponent(Label).string = CMsgList[idx];
        item.off("click");
        item.on("click", ()=> {this.onClickMsg(CMsgList[idx])}, this);
    }

    onClickMsg(msg: string) {
        BilliardService.instance.sendChatReq(1, msg);
        // yy.event.emit(yy.Event_Name.billiard_send_msg, 1, msg);
        // yy.log.w("onClickMsg", msg)
        this.onClickClose();
    }

    onClickClose() {
        this.node.destroy();
    }


}


