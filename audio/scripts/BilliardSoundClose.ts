import { _decorator, Button, Component, Node, EventTouch } from 'cc';
import { yy } from '../../../../../yy';
import { Event } from 'cc';
import { BilliardTools } from '../../scripts/BilliardTools';
const { ccclass, property } = _decorator;

@ccclass('BilliardSoundClose')
export class BilliardSoundClose extends Component {
    onLoad() {
        let btn = this.node.getComponent(Button);
        Object.defineProperty(btn, "_onTouchEnded", {
            value: function (event: EventTouch) {
                // 在这里自定义按钮的触摸结束行为
                // 可以在这里添加额外的逻辑或修改按钮的状态
                yy.log.w("BilliardSoundClose");
                BilliardTools.instance.playSoundClose();
                btn.clickEvents.forEach(event => {
                    event.emit([btn, event.customEventData]);
                });
                // 调用原始的 _onTouchEnded 方法以保持原有的行为
                // (Button.prototype as any)._onTouchEnded.call(this, event);
            }
            // writable: true,
            // enumerable: true,
            // configurable: true
        });
    }
}

