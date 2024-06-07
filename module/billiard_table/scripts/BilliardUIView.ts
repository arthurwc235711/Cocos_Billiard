import { _decorator, Button, Canvas, Component, EventTouch, find, game, Label, Node, physics, quat, Quat, Size, Slider, Sprite, UITransform, Vec2, Vec3, Widget } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { R, Rtd } from '../../../scripts/physics/constants';
import { rayHit } from '../../../scripts/physics/physics';
import { BaseRayCollision } from '../../../scripts/physics/component/BaseRayCollision';
import { RaySphereCollision } from '../../../scripts/physics/component/RaySphereCollision';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { BilliardFree } from './BilliardFree';
const { ccclass, property } = _decorator;

@ccclass('BilliardUIView')
export class BilliardUIView extends BaseCommonScript {
    @property(Label)
    labelTestInfo: Label = null;

    @property(Node)
    nodeCueArrow: Node = null;
    @property(Node)
    nodeArrow: Node = null;
    @property(Node)
    nodeCue:Node = null;
    @property(BilliardFree)
    freeBall: BilliardFree;

    private _interactableTableTouch: boolean = true;
    private touchMove: boolean = false;
    private preTouchLocation: Vec2 = new Vec2();

    get interactableTableTouch() {
        return this._interactableTableTouch && BilliardTools.instance.isMyAction();
    }
    set interactableTableTouch(value: boolean) {
        this._interactableTableTouch = value;
    }
    
    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            // [yy.Event_Name.billiard_table_init]: "initBtnTable",
            // [yy.Event_Name.billiard_allStationary]: "onAllStationary",
            [yy.Event_Name.billiard_hit_point]: "onHitPoint",
            [yy.Event_Name.billiard_free_ball_move]: "onFreeBallMove",
        };
        super.register_event();
    }

    public on_init(): void {
        BilliardManager.instance.setView(this);

        this.initBtnTableClick();
        this.initAngleSliderClick();
        this.initPowerSliderClick();

        let btnBall = this.node.getChildByPath("NodeRight/NodeHitPoint/ButtonBall");
        btnBall.on("click", this.onClickStroke, this);
    }

    onClickStroke() {
        // yy.log.w("onClickStroke");

        yy.popup.show_popup("app_billiard", "module/billiard_hitpoint/view/p_billiard_hit_point", null);
    }

    initBtnTable(node3d:Node) {
        let worldToScreen3d = BilliardManager.instance.camera3d.worldToScreen.bind(BilliardManager.instance.camera3d);
        let worldPosition = node3d.worldPosition;
        let worldScale = node3d.worldScale;
        let leftScreenPos = worldToScreen3d(worldPosition.clone().setX(worldPosition.x - worldScale.x/2));
        let rightScreenPos = worldToScreen3d(worldPosition.clone().setX(worldPosition.x + worldScale.x/2));
        let canvas = find("Canvas").getComponent(Canvas);
        let lWp = canvas.cameraComponent.screenToWorld(leftScreenPos);
        let rWp = canvas.cameraComponent.screenToWorld(rightScreenPos);
        let lCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(lWp);
        let rCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(rWp);
        let tran = this.node.getChildByName("ButtonTable").getComponent(UITransform)
        tran.width = Math.abs(rCanvasPos.x - lCanvasPos.x);
        let topScreenPos = worldToScreen3d(worldPosition.clone().setY(worldPosition.y - worldScale.y/2));
        let bottomScreenPos = worldToScreen3d(worldPosition.clone().setY(worldPosition.y + worldScale.y/2));
        let tWp = canvas.cameraComponent.screenToWorld(topScreenPos);
        let bWp = canvas.cameraComponent.screenToWorld(bottomScreenPos);
        let tCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(tWp);
        let bCanvasPos = canvas.node.getComponent(UITransform).convertToNodeSpaceAR(bWp);
        tran.height = Math.abs(bCanvasPos.y - tCanvasPos.y);
        let centerScreenPos = worldToScreen3d(worldPosition.clone().setY(worldPosition.y));
        let cWp = canvas.cameraComponent.screenToWorld(centerScreenPos);
        tran.node.worldPosition = cWp;
    }

    initBtnTableClick() {
        let btn = this.node.getChildByName("ButtonTable");
        let isFreeBallMove = false;
        btn.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            this.touchMove = false;
            isFreeBallMove = this.freeBall.touchMove;
        });
        btn.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            if (this.interactableTableTouch && !this.freeBall.touchMove) {
                let touch = event.touch;
                let local = touch.getLocation();
                let perLocal = touch.getPreviousLocation();
                if ((this.touchMove ||  Math.abs(local.x - perLocal.x) > 2 || Math.abs(local.y - perLocal.y) > 2)) {
                    this.touchMove = true;
                    let x = local.x - perLocal.x;
                    let y = local.y - perLocal.y;
                    this.preTouchLocation.add2f(x, y);
                    this.onClickTable(this.preTouchLocation);
                }
            }
            isFreeBallMove = this.freeBall.touchMove;
        });
        btn.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            if (this.interactableTableTouch && !isFreeBallMove && !this.touchMove) {
                this.onClickTable(event.getLocation());
                this.preTouchLocation = event.getLocation();
            }
            this.touchMove = false;
        });
    }

    initAngleSliderClick() {
        let angleSlider = this.node.getChildByPath("NodeRight/NodeAngle/SpriteShader/Mask/TouchSprite");
        let uiTransform = angleSlider.getComponent(UITransform);
        let min = uiTransform.contentSize.y;
        let max = min * 2;
        angleSlider.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            let touch = event.touch;
            let local = touch.getLocation();
            let perLocal = touch.getPreviousLocation();
            let inc = local.y - perLocal.y;
            let angleInRadians;
            if (inc < 0) {
                let y = uiTransform.contentSize.y - inc > max ? uiTransform.contentSize.y - inc - max + min : uiTransform.contentSize.y - inc;
                uiTransform.setContentSize(new Size(uiTransform.contentSize.width, y));
                angleInRadians = (0.01 * Math.PI) / 180
            }
            else {
                let y = uiTransform.contentSize.y - inc < min ? max - uiTransform.contentSize.y - inc + min : uiTransform.contentSize.y - inc;
                uiTransform.setContentSize(new Size(uiTransform.contentSize.width, y));
                angleInRadians = (-0.01 * Math.PI) / 180  
            }

            const newX = this.preTouchLocation.x * Math.cos(angleInRadians) - this.preTouchLocation.y * Math.sin(angleInRadians);
            const newY = this.preTouchLocation.x * Math.sin(angleInRadians) + this.preTouchLocation.y * Math.cos(angleInRadians);
            this.preTouchLocation.x = newX;
            this.preTouchLocation.y = newY;
            this.onClickTable(this.preTouchLocation);
        });
    }

    initPowerSliderClick() {
        let sliderNode = this.node.getChildByPath("NodePower/TouchPower/Slider");
        sliderNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            let slider = event.target.getComponent(Slider);
            let progress = 1 - slider.progress;
            if (progress > 0) {
                BilliardData.instance.setPower( Math.floor( progress * 150 ) * R );
                this.onClickHit();

            }
        });
        sliderNode.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            let slider = event.target.getComponent(Slider);
            let progress = 1 - slider.progress;
            if (progress > 0) {
                BilliardData.instance.setPower( Math.floor( progress * 150 ) * R );
                this.onClickHit();
            }
        });
    }

    onClickHit() {
        yy.event.emit(yy.Event_Name.billiard_hit);

        this.controlHide();
    }

    controlHide() {
        this.nodeCueArrow.active = false;
        let nodeAngle = this.node.getChildByName("NodeRight");
        nodeAngle.active = false;
        this.interactableTableTouch = false;
        this.node.getChildByPath("NodePower").active = false;

        this.freeBall.node.active = false;
    }

    controlShow() {
        this.interactableTableTouch = true;
        let slider = this.node.getChildByPath("NodePower/TouchPower/Slider").getComponent(Slider);
        slider.progress = 1;
        this.node.getChildByPath("NodePower").active = true && BilliardTools.instance.isMyAction();
        this.node.getChildByPath("NodePower/Label").getComponent(Label).string = "";
        let nodeAngle = this.node.getChildByName("NodeRight");
        nodeAngle.active = true && BilliardTools.instance.isMyAction();

        BilliardData.instance.getOffset().copy(Vec3.ZERO);
        let dot = this.node.getChildByPath("NodeRight/NodeHitPoint/ButtonBall/Node/Dot");
        dot.position = Vec3.ZERO;
    }

    cueHide() {
        this.nodeCueArrow.active = false;
    }

    onClickTable(local: Vec2) {       
        let screenPos = local;
        let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0)).setZ(0);
        this.onShotAt(wp);
    }

    onShotAt(wp: Vec3) {
        this.nodeCue.setPosition(-300, 0, 0);
        let nodeCueArrow = this.nodeCueArrow;
        let cueBall = BilliardManager.instance.getCueBall();
        let nodeArrow = this.nodeArrow;
        let camera3DToCamera2DWPos = BilliardTools.instance.camera3DToCamera2DWPos.bind(BilliardTools.instance);
        let cue2dWp = camera3DToCamera2DWPos(cueBall.node.worldPosition);
        nodeCueArrow.worldPosition = cue2dWp;
        nodeCueArrow.active = true;
        let direction = wp.clone().subtract(cueBall.node.worldPosition).normalize();
        let angle = direction.angleTo(Vec3.RIGHT);// 返回弧度
        if (wp.y > cueBall.node.worldPosition.y) {
            nodeCueArrow.angle = angle * Rtd;// 返回角度
        }
        else {
            nodeCueArrow.angle = 360 - angle * Rtd;// 返回角度
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
                // yy.log.w("furCueNode", furCueNode.worldPosition)
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
        // yy.log.w("", "所有球都静止");
        this.controlShow();
    }

    onSlider(slider: Slider) {
        let label = this.node.getChildByPath("NodePower/Label").getComponent(Label);
        let progress = 1 - slider.progress;
        if (progress === 0) {
            label.string = "";
        }
        else {
            label.string = Math.floor( progress * 150 ).toString();
        }


        this.nodeCue.setPosition((progress + 1)* -300, 0, 0);
    }


    onHitPoint(nor: Vec3, per: number) {
        let dot = this.node.getChildByPath("NodeRight/NodeHitPoint/ButtonBall/Node/Dot");
        let radius = dot.parent.getComponent(UITransform).width / 2;
        let length = radius * per;
        let dis = nor.multiplyScalar(length)
        let pos = dot.parent.worldPosition.clone().add(dis);
        dot.worldPosition = pos;
    }

    private frameCount: number = 0;
    private dt: number = 0;
    private fps: number = 0;
    private tmpString: string = null;
    private minFps = 100000;
    private maxFps = 0;
    protected update(dt: number): void {
        this.dt += dt;
        this.frameCount++;
        let cfps = 1/dt;
        if (this.dt > 1) {
            this.fps = this.frameCount / this.dt;
            this.tmpString = `FPS: ${this.fps.toFixed(2)}  DT: ${(this.dt/this.frameCount).toFixed(3)}  minFps: ${this.minFps.toFixed(3)},  maxFps: ${this.maxFps.toFixed(3)}`;
            this.labelTestInfo.string = this.tmpString;
            this.dt = 0;
            this.frameCount = 0;
            this.minFps = 100000;
            this.maxFps = 0;
        }
        this.minFps = Math.min(this.minFps, cfps);
        this.maxFps = Math.max(this.maxFps, cfps);


        // this.labelTestInfo.string = this.tmpString +  ` fps: ${(1/dt).toFixed(3)}`
    }

    onFreeBall() {
        this.freeBall.setFreeBallHand();
    }

    onFreeBallMove(isMove: boolean) {
        if (isMove) {
            this.nodeCueArrow.active = false;
            this.node.getChildByName("NodeRight").active = false;
            this.node.getChildByPath("NodePower").active = false;
        }else {
            this.nodeCueArrow.active = true;
            this.node.getChildByName("NodeRight").active = true && BilliardTools.instance.isMyAction();
            this.node.getChildByPath("NodePower").active = true && BilliardTools.instance.isMyAction();
            let table = BilliardManager.instance.getTable();
            let ball = table.recentlyBall();
            if (ball) {
                this.autoShotAt(ball.node);
            }
        }
    }
}


