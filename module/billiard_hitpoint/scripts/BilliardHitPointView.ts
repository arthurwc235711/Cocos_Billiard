import { _decorator, Camera, Component, EventTouch, find, Node, UITransform, Vec3 } from 'cc';
import { BaseCommonPopup } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardHitPointView')
export class BilliardHitPointView extends BaseCommonPopup {
    @property(Node)
    nodeDot: Node = null


    private touchMove: boolean = false;
    on_init(): void {
        let touchNode = this.node.getChildByName("TouchBall");
        let radius = this.nodeDot.parent.getComponent(UITransform).width / 2;
        let camera = find("Canvas/Camera").getComponent(Camera);
        let v3 = new Vec3();
        let dis = new Vec3();
        touchNode.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            this.touchMove = false;
            // yy.log.w("TOUCH_START")
        });
        touchNode.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            const local = event.getLocation();
            const perLocal = event.getPreviousLocation();
            if ((this.touchMove ||  Math.abs(local.x - perLocal.x) > 2 || Math.abs(local.y - perLocal.y) > 2)) {
                this.touchMove = true;
                let touchWpos = camera.screenToWorld(v3.set(local.x, local.y, 0)).setZ(0);
                let length = dis.copy(touchWpos).subtract(this.nodeDot.parent.worldPosition).length();
                if (length <= radius) {// 圆内
                    this.nodeDot.worldPosition = touchWpos;
                    yy.event.emit(yy.Event_Name.billiard_hit_point, dis.normalize(), length/radius);
                }
            }
        });
        touchNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            if (!this.touchMove) {
                const local = event.getLocation();
                let touchWpos = camera.screenToWorld(v3.set(local.x, local.y, 0)).setZ(0);
                let length = dis.copy(touchWpos).subtract(this.nodeDot.parent.worldPosition).length();
                if (length <= radius) {// 圆内
                    this.nodeDot.worldPosition = touchWpos;
                    yy.event.emit(yy.Event_Name.billiard_hit_point, dis.normalize(), length/radius);
                }
                else {
                    this.close();
                }
            }

            this.touchMove = false;
        });

        super.on_init();
    }
    
}


