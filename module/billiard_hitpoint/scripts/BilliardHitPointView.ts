import { _decorator, Component, EventTouch, Node } from 'cc';
import { BaseCommonPopup } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardHitPointView')
export class BilliardHitPointView extends BaseCommonPopup {
    @property(Node)
    nodeDot: Node = null

    on_init(): void {
        let touchNode = this.node.getChildByName("TouchBall");
        touchNode.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            yy.log.w("TOUCH_START")
        });
        touchNode.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {

        });
        touchNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {

        });

        // super.on_init();
    }
    
}


