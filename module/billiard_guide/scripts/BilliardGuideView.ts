import { _decorator, BlockInputEvents, Component, Node, Slider, UITransform, Vec2, Vec3 } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { BilliardConst } from '../../../config/BilliardConst';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { R2d, Rtd } from '../../../scripts/physics/constants';
import { rayHit } from '../../../scripts/physics/physics';
const { ccclass, property } = _decorator;

@ccclass('BilliardGuideView')
export class BilliardGuideView extends BaseCommonScript {
    @property(Node)
    nodeGuide: Node;
    @property(Node)
    nodeLockClick: Node;
    @property(Node)
    nodeLine: Node;

    private curStep:number = 0;
    register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_touch_end]: "onTouchEnd",
        };
        super.register_event();
    }

    protected start(): void {
        this.nextGuid();
    }

    nextGuid(index: number = -1) {
        let curIndex = index;
        if (index === -1) curIndex = this.curStep;
        switch(curIndex) {
            case 0:
                this.showGuide(curIndex);
                this.lockClick();
                break;  
            case 1:
                this.showGuide(curIndex);

                let view = BilliardManager.instance.getView();
                let table = BilliardManager.instance.getTable();


                // let powerSlider = view.nodeLeft.getChildByPath("ExpSlider").getComponent(Slider);
                // powerSlider.enabled = false;
                // view.isAngleDisable = true;
                // view.nodeCueAnimations.active = false;
        

                // let lastSc = BilliardManager.instance.camera3d.worldToScreen(new Vec3(1007, 314.5, 0)).setZ(0);
                let v2 = new Vec2(1007, 314.5);
                view.onClickTable(v2);

                table.balls[1]

                let v3 = new Vec3(table.balls[1].node.worldPosition.x, table.balls[1].node.worldPosition.y - 0.03, 0);
                this.shotLine(v3);
                // yy.event.emit(yy.Event_Name.billiard_notify_cueangle, tmp);

                // view.nodeLeft.active = false;
                // view.nodeRight.active = false;
                this.unlockClick();
                break;
        }

        this.curStep ++;
    }

    showGuide(index: number) {
        this.nodeGuide.children.forEach((c,i)=>{
            c.active = i === index;
        })
    }


    lockClick() {
        this.nodeLockClick.active = true;
    }
    unlockClick() {
        this.nodeLockClick.active = false;
    }


    onClickGuide() {
        this.nextGuid();
    }


    shotLine(wp: Vec3) {
        let nodeCueArrow = this.nodeLine;
        let cueBall = BilliardManager.instance.getCueBall();
        let camera3DToCamera2DWPos = BilliardTools.instance.camera3DToCamera2DWPos.bind(BilliardTools.instance);
        let cue2dWp = camera3DToCamera2DWPos(cueBall.node.worldPosition);
        nodeCueArrow.worldPosition = cue2dWp;
        let direction = wp.clone().subtract(cueBall.node.worldPosition).normalize();
        let angle = BilliardTools.instance.roundToFiveDecimalPlaces(direction.angleTo(Vec3.RIGHT));// 返回弧度
        if (wp.y > cueBall.node.worldPosition.y) {
            nodeCueArrow.angle = angle * Rtd;// 返回角度
        }
        else {
            nodeCueArrow.angle = 360 - angle * Rtd;// 返回角度
        }

        let nodes = rayHit(cueBall.node.worldPosition, direction);
        let uiTran = nodeCueArrow.getComponent(UITransform);
        if (nodes.length > 0) {
            let k = BilliardTools.instance.getDisanceBy2dCamera(cueBall.node, nodes[0], direction)
            uiTran.setContentSize(k + R2d, uiTran.contentSize.y);//45.47 球直径2D摄像头尺寸
        }
    }

    protected onTouchEnd(dt: number): void {
        if (this.curStep === 2) {
            let view = BilliardManager.instance.getView();
            if (Math.abs(this.nodeLine.angle - view.nodeCueArrow.angle) < 0.1){
                yy.log.e("有效重叠")
                view.interactableTableTouch = false;
                view.nodeLeft.active = true;
                this.nodeLine.active = false;
            }
        }
    }

}


