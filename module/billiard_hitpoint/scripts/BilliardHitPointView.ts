import { _decorator, Camera, Component, EventTouch, find, Node, UITransform, Vec3 } from 'cc';
import { BaseCommonPopup } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardService } from '../../../net/BilliardService';
import { off } from 'process';
const { ccclass, property } = _decorator;

@ccclass('BilliardHitPointView')
export class BilliardHitPointView extends BaseCommonPopup {
    @property(Node)
    nodeDot: Node = null


    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_notify_wins]: "close",
        };
        super.register_event();
    }

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
            // if ((this.touchMove ||  Math.abs(local.x - perLocal.x) > 2 || Math.abs(local.y - perLocal.y) > 2)) {
                this.touchMove = true;
                let touchWpos = camera.screenToWorld(v3.set(local.x, local.y, 0)).setZ(0);
                let length = dis.copy(touchWpos).subtract(this.nodeDot.parent.worldPosition).length();
                if (length <= radius) {// 圆内
                    this.onTouch(touchWpos, dis, radius, length);
                }
            // }
        });
        touchNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            const local = event.getLocation();
            let touchWpos = camera.screenToWorld(v3.set(local.x, local.y, 0)).setZ(0);
            let length = dis.copy(touchWpos).subtract(this.nodeDot.parent.worldPosition).length();
            if (!this.touchMove) {
                if (length > radius) {// 圆内
                    this.close();
                }
                else {
                    this.onTouch(touchWpos, dis, radius, length);
                    let offset = BilliardData.instance.getOffset()
                    BilliardService.instance.sendCueOffsetReq(offset.x, offset.y);
                }
            }
            else {
                if (length <= radius) {// 圆内
                    this.onTouch(touchWpos, dis, radius, length);
                }
                let offset = BilliardData.instance.getOffset()
                BilliardService.instance.sendCueOffsetReq(offset.x, offset.y);
            }

            this.touchMove = false;
        });

        touchNode.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            const local = event.getLocation();
            let touchWpos = camera.screenToWorld(v3.set(local.x, local.y, 0)).setZ(0);
            let length = dis.copy(touchWpos).subtract(this.nodeDot.parent.worldPosition).length();
            if (!this.touchMove) {
                if (length > radius) {// 圆内
                    this.close();
                }
                else {
                    this.onTouch(touchWpos, dis, radius, length);
                    let offset = BilliardData.instance.getOffset()
                    BilliardService.instance.sendCueOffsetReq(offset.x, offset.y);
                }
            }
            else {
                if (length <= radius) {// 圆内
                    this.onTouch(touchWpos, dis, radius, length);
                }
                let offset = BilliardData.instance.getOffset()
                BilliardService.instance.sendCueOffsetReq(offset.x, offset.y);
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
        offset.set( Number((-dis.x / (radius*2)).toFixed(5)), Number((dis.y / (radius*2)).toFixed(5)), 0);
        // roundVec2(offset);
        yy.event.emit(yy.Event_Name.billiard_hit_point, dis.normalize(), length/radius);
        // yy.log.w("offset", offset, dis.normalize(), offset.clone().normalize());
    }
    
}


