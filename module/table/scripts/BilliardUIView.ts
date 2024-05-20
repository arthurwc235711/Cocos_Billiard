import { _decorator, Button, Canvas, Component, EventTouch, find, Node, physics, quat, Quat, UITransform, Vec3 } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { Rtd } from '../../../scripts/physics/constants';
import { rayHit } from '../../../scripts/physics/physics';
const { ccclass, property } = _decorator;

@ccclass('BilliardUIView')
export class BilliardUIView extends BaseCommonScript {
    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_table_init]: "initBtnTable",
        };
        super.register_event();
    }

    public on_init(): void {
        let btn = this.node.getChildByName("ButtonTable").getComponent(Button);
        btn.setSchTime(0.01);
    }

    initBtnTable(node3d:Node) {
        // this.scheduleOnce(()=>this.node.getChildByName("SpriteSplash").worldPosition = BilliardTools.instance.camera3DToCamera2DWPos(worldPosition), 0);

        this.scheduleOnce(()=>{
            // this.node.getChildByName("SpriteSplash").worldPosition = BilliardTools.instance.camera3DToCamera2DWPos(worldPosition);
            let worldPosition = node3d.worldPosition;
            let worldScale = node3d.worldScale;
            let leftScreenPos = BilliardData.instance.camera3d.worldToScreen(worldPosition.clone().setX(worldPosition.x - worldScale.x/2));
            let rightScreenPos = BilliardData.instance.camera3d.worldToScreen(worldPosition.clone().setX(worldPosition.x + worldScale.x/2));
            let canvas = find("Canvas").getComponent(Canvas);
            let lWp = canvas.cameraComponent.screenToWorld(leftScreenPos);
            let rWp = canvas.cameraComponent.screenToWorld(rightScreenPos);
            let lCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(lWp);
            let rCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(rWp);
            let tran = this.node.getChildByName("ButtonTable").getComponent(UITransform)
            tran.width = Math.abs(rCanvasPos.x - lCanvasPos.x);
            let topScreenPos = BilliardData.instance.camera3d.worldToScreen(worldPosition.clone().setY(worldPosition.y - worldScale.y/2));
            let bottomScreenPos = BilliardData.instance.camera3d.worldToScreen(worldPosition.clone().setY(worldPosition.y + worldScale.y/2));
            let tWp = canvas.cameraComponent.screenToWorld(topScreenPos);
            let bWp = canvas.cameraComponent.screenToWorld(bottomScreenPos);
            let tCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(tWp);
            let bCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(bWp);
            tran.height = Math.abs(bCanvasPos.y - tCanvasPos.y);
        }, 0)

    }

    onClickHit() {
        yy.event.emit(yy.Event_Name.billiard_hit);
    }

    onClickTable(event:EventTouch) {       
        let screenPos = event.getLocation();
        let nodeArrow = this.node.getChildByName("SpriteSplash");
        let cueBall = BilliardData.instance.getCueBall();
        let camera3DToCamera2DWPos = BilliardTools.instance.camera3DToCamera2DWPos.bind(BilliardTools.instance);
        let cue2dWp = camera3DToCamera2DWPos(cueBall.node.worldPosition);
        nodeArrow.worldPosition = cue2dWp;
        let wp = BilliardData.instance.camera3d.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0)).setZ(0);

        let wp2d = BilliardData.instance.camera2d.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0)).setZ(0);

        // yy.log.w("screenPos", screenPos, "wp", wp, "cueBall", cueBall.node.worldPosition);
        let direction = wp.clone().subtract(cueBall.node.worldPosition).normalize();
        let angle = direction.angleTo(Vec3.RIGHT);// 返回弧度
        // yy.log.w("screenPos", screenPos, "wp", wp, "cueBall", cueBall.node.worldPosition);
        // yy.log.w("angle", angle, direction,  hDir);

        if (wp.y > cueBall.node.worldPosition.y) {
            nodeArrow.angle = angle * Rtd;// 返回角度
        }
        else {
            nodeArrow.angle = 360 - angle * Rtd;// 返回角度
            angle = - angle;
        }
        // yy.log.w("setAngle angle", angle, nodeArrow.angle);
        BilliardData.instance.setAngle(angle);

        let nodes = rayHit(cueBall.node.worldPosition, direction);
        let uiTran = nodeArrow.getComponent(UITransform);
        if (nodes.length > 0) {
            // yy.log.w("hit sucess", nodes[0].name);
            let uiTran = nodeArrow.getComponent(UITransform);
            uiTran.setContentSize(BilliardTools.instance.getDisanceBy2dCamera(cueBall.node, nodes[0], direction, wp2d), uiTran.contentSize.y);
            this.scheduleOnce(() => {
                let b2dPos = camera3DToCamera2DWPos(nodes[0].worldPosition);
                let furCueNode = nodeArrow.getChildByPath("Sprite");
                let v1 = b2dPos.clone().subtract(furCueNode.worldPosition).normalize();
                let ballAngle = v1.angleTo(Vec3.RIGHT);;
                let ballArrow = nodeArrow.getChildByPath("Sprite/ballArrow");
                let cueArrow = nodeArrow.getChildByPath("Sprite/cueArrow");
                let tmpBallAngle = ballAngle * Rtd;
                if (furCueNode.worldPosition.y < b2dPos.y) {// 预判被撞球的运动方向
                    ballArrow.worldRotation = Quat.fromAngleZ(new Quat(), tmpBallAngle);
                }
                else {
                    tmpBallAngle = 360 - tmpBallAngle;
                    ballArrow.worldRotation = Quat.fromAngleZ(new Quat(), tmpBallAngle);
                }
        
                // 计算母球方向
                let dirOD = b2dPos.clone().subtract(cue2dWp).normalize();
                if (dirOD.y > v1.y) {
                    cueArrow.worldRotation = Quat.fromAngleZ(new Quat(), dirOD.x > 0 ? tmpBallAngle + 90 : tmpBallAngle -90);
                }
                else {
                    cueArrow.worldRotation = Quat.fromAngleZ(new Quat(), dirOD.x > 0 ? tmpBallAngle - 90 : tmpBallAngle + 90);
                }

                yy.log.w( "v1", v1 );
                yy.log.w( "dirOD", dirOD );
                yy.log.w( "ballArrow", ballArrow.angle );
            }, 0);

        }
        else {
            uiTran.setContentSize(100, uiTran.contentSize.y);
        }


    }
}


