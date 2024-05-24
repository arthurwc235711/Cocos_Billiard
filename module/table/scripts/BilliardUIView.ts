import { _decorator, Button, Canvas, Component, EventTouch, find, Label, Node, physics, quat, Quat, Slider, Sprite, UITransform, Vec2, Vec3, Widget } from 'cc';
import { BaseCommonScript, BaseCommonSocketReader } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { R, Rtd } from '../../../scripts/physics/constants';
import { rayHit } from '../../../scripts/physics/physics';
import { BaseRayCollision } from '../../../scripts/physics/component/BaseRayCollision';
import { RaySphereCollision } from '../../../scripts/physics/component/RaySphereCollision';
import { BilliardManager } from '../../../scripts/BilliardManager';
const { ccclass, property } = _decorator;

@ccclass('BilliardUIView')
export class BilliardUIView extends BaseCommonScript {
    private interactableTableTouch: boolean = true;
    private touchMove: boolean = false;
    private preTouchLocation: Vec2 = new Vec2();
    
    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            // [yy.Event_Name.billiard_table_init]: "initBtnTable",
            // [yy.Event_Name.billiard_allStationary]: "onAllStationary",
        };
        super.register_event();
    }

    public on_init(): void {
        BilliardManager.instance.setView(this);

        let btn = this.node.getChildByName("ButtonTable");
        btn.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            this.touchMove = false;
        });
        btn.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            let touch = event.touch;
            let local = touch.getLocation();
            let perLocal = touch.getPreviousLocation();
            if (this.touchMove ||  Math.abs(local.x - perLocal.x) > 2 || Math.abs(local.y - perLocal.y) > 2 ) {
                this.touchMove = true;
                let x = local.x - perLocal.x;
                let y = local.y - perLocal.y;
                this.preTouchLocation.add2f(x, y);
                this.onClickTable(this.preTouchLocation);
            }
        });
        btn.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            if (this.interactableTableTouch && !this.touchMove) {
                this.onClickTable(event.getLocation());
                this.preTouchLocation = event.getLocation();
            }
            this.touchMove = false;
        });


        let sliderNode = this.node.getChildByPath("NodePower/TouchPower/Slider");
        sliderNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            let slider = event.target.getComponent(Slider);
            let progress = 1 - slider.progress;
            if (progress > 0) {
                BilliardData.instance.setPower(progress * R * 150);
                this.onClickHit();

            }
        });
        sliderNode.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            let slider = event.target.getComponent(Slider);
            let progress = 1 - slider.progress;
            if (progress > 0) {
                BilliardData.instance.setPower(progress * R * 150);
                this.onClickHit();
            }
        });
    }

    initBtnTable(node3d:Node) {
        // this.scheduleOnce(()=>this.node.getChildByName("SpriteSplash").worldPosition = BilliardTools.instance.camera3DToCamera2DWPos(worldPosition), 0);

        // this.scheduleOnce(()=>{
            // this.node.getChildByName("SpriteSplash").worldPosition = BilliardTools.instance.camera3DToCamera2DWPos(worldPosition);
            let worldPosition = node3d.worldPosition;
            let worldScale = node3d.worldScale;
            let leftScreenPos = BilliardManager.instance.camera3d.worldToScreen(worldPosition.clone().setX(worldPosition.x - worldScale.x/2));
            let rightScreenPos = BilliardManager.instance.camera3d.worldToScreen(worldPosition.clone().setX(worldPosition.x + worldScale.x/2));
            let canvas = find("Canvas").getComponent(Canvas);
            let lWp = canvas.cameraComponent.screenToWorld(leftScreenPos);
            let rWp = canvas.cameraComponent.screenToWorld(rightScreenPos);
            let lCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(lWp);
            let rCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(rWp);
            let tran = this.node.getChildByName("ButtonTable").getComponent(UITransform)
            tran.width = Math.abs(rCanvasPos.x - lCanvasPos.x);
            let topScreenPos = BilliardManager.instance.camera3d.worldToScreen(worldPosition.clone().setY(worldPosition.y - worldScale.y/2));
            let bottomScreenPos = BilliardManager.instance.camera3d.worldToScreen(worldPosition.clone().setY(worldPosition.y + worldScale.y/2));
            let tWp = canvas.cameraComponent.screenToWorld(topScreenPos);
            let bWp = canvas.cameraComponent.screenToWorld(bottomScreenPos);
            let tCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(tWp);
            let bCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(bWp);
            tran.height = Math.abs(bCanvasPos.y - tCanvasPos.y);
        // }, 0)

    }

    onClickHit() {
        yy.event.emit(yy.Event_Name.billiard_hit);

        let nodeArrow = this.node.getChildByName("SpriteSplash")
        nodeArrow.active = false;
        this.interactableTableTouch = false;
        this.node.getChildByPath("NodePower").active = false;
    }

    onClickTable(local: Vec2) {       
        let screenPos = local;
        let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0)).setZ(0);
        this.onShotAt(wp);
    }

    onShotAt(wp: Vec3) {
        let cueBall = BilliardManager.instance.getCueBall();
        let nodeArrow = this.node.getChildByName("SpriteSplash");
        let camera3DToCamera2DWPos = BilliardTools.instance.camera3DToCamera2DWPos.bind(BilliardTools.instance);
        let cue2dWp = camera3DToCamera2DWPos(cueBall.node.worldPosition);
        nodeArrow.worldPosition = cue2dWp;
        nodeArrow.active = true;
        let direction = wp.clone().subtract(cueBall.node.worldPosition).normalize();
        let angle = direction.angleTo(Vec3.RIGHT);// 返回弧度
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
            let collision = nodes[0].getComponent(BaseRayCollision);
            let uiTran = nodeArrow.getComponent(UITransform);
            let ballArrow = nodeArrow.getChildByPath("Sprite/ballArrow");
            let cueArrow = nodeArrow.getChildByPath("Sprite/cueArrow");
            if (collision instanceof RaySphereCollision) {
                ballArrow.active = true;
                cueArrow.active = true;
                uiTran.setContentSize(BilliardTools.instance.getDisanceBy2dCamera(cueBall.node, nodes[0], direction), uiTran.contentSize.y);
                
                let b2dPos = camera3DToCamera2DWPos(nodes[0].worldPosition);
                let furCueNode = nodeArrow.getChildByPath("Sprite");
                furCueNode.getComponent(Widget).updateAlignment(); // 强制更新节点位置，不然当前帧数据会异常，需要等待下一帧计算才行
                let v1 = b2dPos.clone().subtract(furCueNode.worldPosition).normalize();
                let ballAngle = v1.angleTo(Vec3.RIGHT);;

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
                let dvAngle = dirOD.angleTo(v1);
                if (Math.abs(Math.abs(cue2dWp.x) - Math.abs(b2dPos.x)) > Math.abs(Math.abs(cue2dWp.y) - Math.abs(b2dPos.y)) ) {
                    if (dirOD.y > v1.y) {
                        cueArrow.worldRotation = Quat.fromAngleZ(new Quat(), cue2dWp.x < b2dPos.x ?  tmpBallAngle + 90 : tmpBallAngle - 90);
                    }
                    else {
                        cueArrow.worldRotation = Quat.fromAngleZ(new Quat(),  cue2dWp.x < b2dPos.x ? tmpBallAngle - 90 : tmpBallAngle + 90);
                    }
                }
                else {
                    if (dirOD.x > v1.x) {
                        cueArrow.worldRotation = Quat.fromAngleZ(new Quat(), cue2dWp.y > b2dPos.y ?  tmpBallAngle + 90 : tmpBallAngle - 90);
                    }
                    else {
                        cueArrow.worldRotation = Quat.fromAngleZ(new Quat(),  cue2dWp.y > b2dPos.y ? tmpBallAngle - 90 : tmpBallAngle + 90);
                    }
                }
    
                let maxLength = 60;
                let cosValue = Math.pow(Math.cos(dvAngle), 2);
                let ballLength = 60 * cosValue;
                let bTrans = ballArrow.getChildByName("Sprite").getComponent(UITransform);
                bTrans.setContentSize(ballLength, bTrans.contentSize.y);
                let cueTrans = cueArrow.getChildByName("Sprite").getComponent(UITransform);
                cueTrans.setContentSize(maxLength - ballLength, cueTrans.contentSize.y);
    
                // yy.log.w( "dvAngle", dvAngle * Rtd,  Math.pow(Math.cos(dvAngle), 2), ballLength);
                // yy.log.w( "cDir", cDir)
                // yy.log.w( "v1", v1 );
                // yy.log.w( "dirOD", dirOD );
                // yy.log.w( "ballArrow", ballArrow.angle );
            }
            else {
                ballArrow.active = false;
                cueArrow.active = false;
                uiTran.setContentSize(BilliardTools.instance.getRectangleDisanceBy2dCamera(cueBall.node, nodes[0], direction), uiTran.contentSize.y);
                // yy.log.w("", "未检测出碰撞点");
            }

        }
        else {
            uiTran.setContentSize(100, uiTran.contentSize.y);
        }
    }

    autoShotAt(node: Node) {
        let screenPos = BilliardManager.instance.camera3d.worldToScreen(node.worldPosition);
        this.preTouchLocation.set(screenPos.x, screenPos.y);
        this.onShotAt(node.worldPosition);
    }

    onAllStationary() {
        yy.log.w("", "所有球都静止");
        this.interactableTableTouch = true;
        let slider = this.node.getChildByPath("NodePower/TouchPower/Slider").getComponent(Slider);
        slider.progress = 1;
        this.node.getChildByPath("NodePower").active = true;
        this.node.getChildByPath("NodePower/Label").getComponent(Label).string = "";
        // let nodeArrow = this.node.getChildByName("SpriteSplash")
    }

    onSlider(slider: Slider) {
        let label = this.node.getChildByPath("NodePower/Label").getComponent(Label);
        if (slider.progress == 1) {
            label.string = "";
        }
        else {
            label.string = Math.floor( (1 - slider.progress) * 150 ).toString();
        }
    }
}


