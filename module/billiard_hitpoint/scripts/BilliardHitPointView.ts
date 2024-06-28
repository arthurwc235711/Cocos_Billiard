import { _decorator, Camera, Component, EventTouch, find, Node, UITransform, Vec3 } from 'cc';
import { BaseCommonPopup } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
import { roundVec2 } from '../../../scripts/utils';
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
                    this.onTouch(touchWpos, dis, radius, length);
                }
            }
        });
        touchNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            if (!this.touchMove) {
                const local = event.getLocation();
                let touchWpos = camera.screenToWorld(v3.set(local.x, local.y, 0)).setZ(0);

                // this.onTouch(touchWpos, dis, radius);
                let length = dis.copy(touchWpos).subtract(this.nodeDot.parent.worldPosition).length();
                if (length <= radius) {// 圆内
                    this.onTouch(touchWpos, dis, radius, length);
                }
                else {
                    this.close();
                }
            }

            this.touchMove = false;
        });


        let offset = BilliardData.instance.getOffset();
        dis.set(-offset.x * radius * 2, offset.y * radius * 2, 0);
        let pos = this.nodeDot.parent.worldPosition.clone().add(dis);
        this.nodeDot.worldPosition = pos;

        super.on_init();
    }

    protected start(): void {
        // 临时处理 popo通用接口适配异常处理
        let mask = this.node.parent.getChildByName('popup_shade_layer');
        if(mask){
            mask.active = false;
        }
    }

    onTouch(touchWpos: Vec3, dis: Vec3, radius: number, length: number) {
        this.nodeDot.worldPosition = touchWpos;
        let offset = BilliardData.instance.getOffset();
        offset.set(-dis.x / (radius*2), dis.y / (radius*2), 0);
        roundVec2(offset);
        yy.event.emit(yy.Event_Name.billiard_hit_point, dis.normalize(), length/radius);
        // yy.log.w("offset", offset);
    }
    
}


