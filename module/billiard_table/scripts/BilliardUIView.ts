import { _decorator, Button, Canvas, Component, director, EventTouch, find, game, Label, Node, physics, quat, Quat, Size, Slider, Sprite, tween, UIOpacity, UITransform, Vec2, Vec3, Widget } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { R, R2d, Rtd } from '../../../scripts/physics/constants';
import { rayHit } from '../../../scripts/physics/physics';
import { BaseRayCollision } from '../../../scripts/physics/component/BaseRayCollision';
import { RaySphereCollision } from '../../../scripts/physics/component/RaySphereCollision';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { BilliardFree } from './BilliardFree';
import { BilliardTop } from './BilliardTop';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardConst } from '../../../config/BilliardConst';
import { BilliardGameTips } from './BilliardGameTips';
import { Ball } from './Ball';
import { BilliardCue } from './BilliardCue';
import { BilliardSwitchFrame } from './BilliardSwitchFrame';
const { ccclass, property } = _decorator;

// 力度杆最大强度 MaxPower * R
const MaxPower = 120;

@ccclass('BilliardUIView')
export class BilliardUIView extends BaseCommonScript {
    @property(Label)
    labelTestInfo: Label;

    @property(Node)
    nodeCueArrow: Node;
    @property(Node)
    nodeArrow: Node;
    @property(Node)
    nodeCue:Node;
    @property(BilliardFree)
    freeBall: BilliardFree;
    @property(BilliardTop)
    billiardTop: BilliardTop;
    @property(Node) 
    nodeCueAnimations: Node;
    @property(BilliardGameTips)
    gameTips: BilliardGameTips;
    @property(Node)
    nodeLeft: Node;
    @property(Node)
    nodeRight: Node;

    @property(BilliardCue)
    cue: BilliardCue;
    @property(Slider)
    powerSlider: Slider;

    private _interactableTableTouch: boolean = true;
    private touchMove: boolean = false;
    private preTouchLocation: Vec2 = new Vec2();

    private isShotAtBall = false;

    spinePockets: Node[];


    public isAngleDisable = false;

    get interactableTableTouch() {
        return this._interactableTableTouch && BilliardTools.instance.isMyAction();
    }
    set interactableTableTouch(value: boolean) {
        this._interactableTableTouch = value;
    }
    
    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_hit_point]: "onHitPoint",
            [yy.Event_Name.billiard_free_ball_move]: "onFreeBallMove",
            [yy.Event_Name.billiard_notify_hit]: "onClickHit",
            [yy.Event_Name.billiard_notify_cuemove]: "onCueMove",
            [yy.Event_Name.billiard_notify_cueangle]: "onCueAngle",
            [yy.Event_Name.billiard_notify_cueoffset]: "onCueOffset",
            [yy.Event_Name.billiard_action_arrow_cd]: "onActionArrowCd",
            [yy.Event_Name.billiard_setting_cue_location]: "onSettingCueLocation",
            [yy.Event_Name.billiard_notify_setgold]: "setGold",

            [yy.Event_Name.billiard_stop_animations]: "onStopAnimations",
        };
        super.register_event();
    }

    public on_init(): void {
        BilliardManager.instance.setView(this);

        this.initBtnTableClick();
        this.initAngleSliderClick();
        this.initPowerSliderClick();

        let btnBall = this.node.getChildByPath("NodeHitPoint/ButtonBall");
        btnBall.on("click", this.onClickStroke, this);
    }

    protected start(): void {
        // BilliardService.instance.sendEnterGame();
        this.nodeCueArrow.active = false;

        let isLeft = BilliardTools.instance.isCacheCueLocationLeft();
        this.onSettingCueLocation(isLeft);
    }

    onClickStroke() {
        if (BilliardTools.instance.isMyAction() && BilliardManager.instance.getTable().allStationary() ) {
            yy.popup.show_popup("app_billiard", "module/billiard_hitpoint/view/p_billiard_hit_point", null);
        }
    }

    initBtnTable(node3d:Node, pockets:Node[]) {
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

        let spinePockets = tran.node.getChildByName("NodePockets").children;
        pockets.forEach((pocket, index) => {
            let sw = worldToScreen3d(pocket.worldPosition);
            spinePockets[index].worldPosition = BilliardManager.instance.camera2d.screenToWorld(sw);
        })

        this.spinePockets = spinePockets
    }

    initBtnTableClick() {
        let btn = this.node.getChildByName("ButtonTable");
        let isFreeBallMove = false;
        btn.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            this.touchMove = false;
            isFreeBallMove = this.freeBall.touchMove;
        });
        let scv2 = new Vec2();
        btn.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            this.nodeCueAnimations.active = false;
            if (this.interactableTableTouch && !this.freeBall.touchMove) {
                let touch = event.touch;
                let local = touch.getLocation();
                let perLocal = touch.getPreviousLocation();

                // yy.log.w("Move", local, perLocal);
                if ((this.touchMove ||  Math.abs(local.x - perLocal.x) > 0.01 || Math.abs(local.y - perLocal.y) > 0.01)) {
                    this.touchMove = true;
                    let cueBall = BilliardManager.instance.getCueBall();
                    let sc = BilliardManager.instance.camera3d.worldToScreen(cueBall.node.worldPosition);
                    scv2.set(sc.x, sc.y);
                    let ab = local.clone().subtract(scv2);
                    let perAb = perLocal.clone().subtract(scv2);
                    function calculateAngleBetweenVectors(x1: number, y1: number, x2: number, y2: number): number {
                        const dotProduct = x1 * x2 + y1 * y2;
                        const lengthAB = Math.sqrt(x1 * x1 + y1 * y1);
                        const lengthAC = Math.sqrt(x2 * x2 + y2 * y2);
                        const cosine = dotProduct / (lengthAB * lengthAC);
                        const angleInRadians = Math.acos(cosine);
                        const angleInDegrees = angleInRadians * (180 / Math.PI);
                        return angleInDegrees;
                    }
                    let angle = calculateAngleBetweenVectors(perAb.x, perAb.y, ab.x, ab.y)

                    let perangele = calculateAngleBetweenVectors(perAb.x, perAb.y, 1, 0); // 和x轴方向角度
                    let curangele = calculateAngleBetweenVectors(ab.x, ab.y, 1, 0);
                    let f = 0;
                    if (curangele > perangele) {
                        if (sc.y > local.y) {
                            f = -1;
                        }
                        else {
                            f = 1;
                        }
                    } 
                    else {
                        if (sc.y > local.y) {
                            f = 1;
                        }
                        else {
                            f = -1;
                        }

                    }

                    if (this.isShotAtBall) { // 指向球使用微调相关 周长算法
                        let inc = Math.max(Math.abs(local.x - perLocal.x), Math.abs(local.y - perLocal.y));
                        let xs = 1;
                        if (this.isShotAtBall) {
                            xs = inc < 5 ? 0.1 : 1;
                        }

                        let tran = this.nodeArrow.getComponent(UITransform);
                        let sin = R2d / 10  / (tran.width + R2d*2)
                        if (Math.abs(sin) > 1 || Math.abs(sin) < 0.0001) {
                            sin = 0.25;
                        }
                        let asin = Math.asin(sin);
                        let incangle = asin * Rtd;

                        this.nodeCueArrow.angle = this.nodeCueArrow.angle + f * incangle * xs;

                        let wp = this.cue.nodeBallArrow.worldPosition;
                        let cs = BilliardManager.instance.camera2d.worldToScreen(wp);
                        this.preTouchLocation.x = cs.x;
                        this.preTouchLocation.y = cs.y;
                    }
                    else {
                        let inc = Math.max(Math.abs(local.x - perLocal.x), Math.abs(local.y - perLocal.y));
                        let xs = 1;
                        if (this.isShotAtBall) {
                            xs = inc < 5 ? 0.25 : 0.5;
                        }
                        function getAngle(a) {
                            let tmp = a + angle * f * xs;
                            if (tmp >360) {
                                return Math.abs(tmp - 360);
                            }
                            else if (tmp < 0) {
                                return 360 - Math.abs(tmp);
                            }
    
                            return tmp
    
                        }
                        let value = getAngle(this.nodeCueArrow.angle)
                        if (!Number.isNaN(value)) {
                            this.nodeCueArrow.angle = value;
                            let wp = this.cue.nodeBallArrow.worldPosition;
                            let cs = BilliardManager.instance.camera2d.worldToScreen(wp);
                            this.preTouchLocation.x = cs.x;
                            this.preTouchLocation.y = cs.y;      
                        }
                    }

              


                    // let x = local.x - perLocal.x;
                    // let y = local.y - perLocal.y;
                    // this.preTouchLocation.add2f(x, y);
                    this.onClickTable(this.preTouchLocation);
                }
            }
            isFreeBallMove = this.freeBall.touchMove;
        });
        btn.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            this.nodeCueAnimations.active = BilliardTools.instance.isMyAction() && BilliardData.instance.getActionType() !== 0;
            if (this.interactableTableTouch && !isFreeBallMove && !this.touchMove) {
                this.preTouchLocation = event.getLocation();
                this.preTouchLocation.x = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.x);
                this.preTouchLocation.y = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.y);

                let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(this.preTouchLocation.x, this.preTouchLocation.y, 0)).setZ(0);
                this.onClickTable(this.preTouchLocation);

                // yy.log.w("cueAngle1", this.preTouchLocation)
                BilliardService.instance.sendCueAngle(this.preTouchLocation.x, this.preTouchLocation.y);
                BilliardService.instance.sendCueAngleReq(wp.x, wp.y);

                BilliardTools.instance.playSoundPress();
                yy.event.emit(yy.Event_Name.billiard_touch_end);
            }
            else if (this.interactableTableTouch && !isFreeBallMove) {
                // this.preTouchLocation = event.getLocation();
                this.preTouchLocation.x = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.x);
                this.preTouchLocation.y = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.y);
                let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(this.preTouchLocation.x, this.preTouchLocation.y, 0)).setZ(0);
                this.onClickTable(this.preTouchLocation);

                // yy.log.w("cueAngle2", this.preTouchLocation)
                BilliardService.instance.sendCueAngle(this.preTouchLocation.x, this.preTouchLocation.y);
                BilliardService.instance.sendCueAngleReq(wp.x, wp.y);
                yy.event.emit(yy.Event_Name.billiard_touch_end);
            }

            this.touchMove = false;
        });

        btn.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            this.nodeCueAnimations.active = BilliardTools.instance.isMyAction() && BilliardData.instance.getActionType() !== 0;
            if (this.interactableTableTouch && !isFreeBallMove && !this.touchMove) {
                this.preTouchLocation = event.getLocation();
                this.preTouchLocation.x = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.x);
                this.preTouchLocation.y = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.y);

                let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(this.preTouchLocation.x, this.preTouchLocation.y, 0)).setZ(0);
                this.onClickTable(this.preTouchLocation);

                // yy.log.w("cueAngle1", this.preTouchLocation)
                BilliardService.instance.sendCueAngle(this.preTouchLocation.x, this.preTouchLocation.y);
                BilliardService.instance.sendCueAngleReq(wp.x, wp.y);
                yy.event.emit(yy.Event_Name.billiard_touch_end);
            }
            else if (this.interactableTableTouch && !isFreeBallMove) {
                // this.preTouchLocation = event.getLocation();
                this.preTouchLocation.x = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.x);
                this.preTouchLocation.y = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.y);
                let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(this.preTouchLocation.x, this.preTouchLocation.y, 0)).setZ(0);
                this.onClickTable(this.preTouchLocation);

                // yy.log.w("cueAngle2", this.preTouchLocation)
                BilliardService.instance.sendCueAngle(this.preTouchLocation.x, this.preTouchLocation.y);
                BilliardService.instance.sendCueAngleReq(wp.x, wp.y);
                yy.event.emit(yy.Event_Name.billiard_touch_end);
            }

            this.touchMove = false;
        });
    }

    initAngleSliderClick() {
        let angleSlider = this.nodeRight.getChildByPath("NodeAngle/SpriteShader/Mask/TouchSprite");
        let uiTransform = angleSlider.getComponent(UITransform);
        let min = uiTransform.contentSize.y;
        let max = min * 2;
        let nodeAngle = this.nodeRight.getChildByPath("NodeAngle");

        let times = 0;
        nodeAngle.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {
            if (this.isAngleDisable) return ;
            let touch = event.touch;
            let local = touch.getLocation();
            let perLocal = touch.getPreviousLocation();
            let inc = local.y - perLocal.y;

            let angleInRadians;
            if (inc === 0) return;

            if (inc < 0) { // 往下移固定顺时针
                let y = uiTransform.contentSize.y - inc > max ? uiTransform.contentSize.y - inc - max + min : uiTransform.contentSize.y - inc;
                uiTransform.setContentSize(new Size(uiTransform.contentSize.width, y));
                angleInRadians = -1//(0.01 * Math.PI) / 180
            }
            else {// 往上移固定逆时针
                let y = uiTransform.contentSize.y - inc < min ? max - uiTransform.contentSize.y - inc + min : uiTransform.contentSize.y - inc;
                uiTransform.setContentSize(new Size(uiTransform.contentSize.width, y));
                angleInRadians = 1//(-0.01 * Math.PI) / 180  
            }

            let dealtInc = Math.max(Math.abs(local.x - perLocal.x), Math.abs(local.y - perLocal.y));
            let xs = dealtInc < 3 ? 0.1 : 1;

            let tran = this.nodeArrow.getComponent(UITransform);
            let sin = R2d / BilliardData.instance.getAngleLimit()  / (tran.width + R2d*2)
            if (Math.abs(sin) > 1 || Math.abs(sin) < 0.0001) {
                sin = 0.25;
            }
            let asin = Math.asin(sin);
            let angle = asin * Rtd;
            // yy.log.w("p角度:", this.nodeCueArrow.angle, angleInRadians);
            this.nodeCueArrow.angle = this.nodeCueArrow.angle + angleInRadians * angle * xs;

            let wp = this.cue.nodeBallArrow.worldPosition;
            let cs = BilliardManager.instance.camera2d.worldToScreen(wp);
            this.preTouchLocation.x = cs.x;
            this.preTouchLocation.y = cs.y;
            // yy.log.w("c角度:", this.nodeCueArrow.angle, cs);
            this.onClickTable(this.preTouchLocation);

            if (times === 0 || game.totalTime - times > 450) {// 音效0.45S
                BilliardTools.instance.playSoundAngleSlider();
                times = game.totalTime;
            }

        });

        nodeAngle.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            if (this.isAngleDisable) return ;
            this.preTouchLocation.x = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.x);
            this.preTouchLocation.y = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.y);

            let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(this.preTouchLocation.x, this.preTouchLocation.y, 0)).setZ(0);
            this.onClickTable(this.preTouchLocation);
            yy.log.w("TOUCH_END", this.preTouchLocation, wp)
            BilliardService.instance.sendCueAngleReq(wp.x, wp.y);

            times = 0;
        });
        nodeAngle.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            if (this.isAngleDisable) return ;
            this.preTouchLocation.x = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.x);
            this.preTouchLocation.y = BilliardTools.instance.roundToFiveDecimalPlaces(this.preTouchLocation.y);

            let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(this.preTouchLocation.x, this.preTouchLocation.y, 0)).setZ(0);
            this.onClickTable(this.preTouchLocation);
            yy.log.w("TOUCH_CANCEL", this.preTouchLocation, wp)
            BilliardService.instance.sendCueAngleReq(wp.x, wp.y);
            times = 0;
        });

    }

    initPowerSliderClick() {
        // let sliderNode = this.nodeLeft.getChildByPath("TouchPower/Slider");
        let sliderNode = this.nodeLeft.getChildByPath("ExpSlider");
        sliderNode.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            let slider = event.target.getComponent(Slider);
            let progress = 1 - slider.progress;
        });

        sliderNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            let slider = event.target.getComponent(Slider);
            let progress = 1 - this.powerSlider.progress;
            if (progress > 0) {
                BilliardData.instance.setPower( Math.floor( progress * MaxPower ) * R );
                BilliardService.instance.sendHit();
                BilliardService.instance.sendHitReq();
            }
            else {
                this.nodeRight.getChildByName("NodeAngle").active = true;
            }
        });
        sliderNode.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            let slider = event.target.getComponent(Slider);
            let progress = 1 - this.powerSlider.progress;
            if (progress > 0) {
                let rules = BilliardManager.instance.getRules();
                let maxPower = MaxPower;
                if (rules.round === 1) {
                    maxPower += MaxPower * Math.random();
                }

                BilliardData.instance.setPower( Math.floor( progress * MaxPower ) * R );
                BilliardService.instance.sendHit();
                BilliardService.instance.sendHitReq();
            }
            else {
                this.nodeRight.getChildByName("NodeAngle").active = true;
            }
        });
    }

    onClickHit() {
        yy.event.emit(yy.Event_Name.billiard_hit_cd_stop);

        let power = BilliardData.instance.getPower();
        tween(this.nodeCue)
        .to(0.25, {position: new Vec3((power/MaxPower/R * 5 + 1) * -R2d*2, -15, 0)})
        .to(0.5, {position: new Vec3(-R2d*2, -15, 0)}, {easing: "quintIn"})
        .call(()=>{
            yy.event.emit(yy.Event_Name.billiard_hit);
            this.nodeCueArrow.active = false;
        })
        .start()
        this.controlHide(true);
    }

    controlHide(cueHide: boolean = false) {
        let tBalls = BilliardManager.instance.getTable().getOnTableBalls();
        tBalls.forEach((ball)=>{
            ball.hideTips();
        })

        this.nodeCueArrow.active = cueHide;
        // this.setArrowLine(false);
        this.cue.hideLine()
            .hideBallArrow()
            .hideLabel()
        let nodeAngle = this.nodeRight;
        nodeAngle.active = false;
        this.interactableTableTouch = false;
        this.scheduleOnce(()=>{
            this.nodeLeft.active = false;
        });

        // this.nodeArrow.getChildByPath("Sprite/LabelCD").active = false;
        this.freeBall.node.active = false;
    }

    setArrowLine(isShow:boolean) {
        this.nodeArrow.getChildByName("Sprite").active = isShow;
        this.nodeArrow.getComponent(Sprite).enabled = isShow;
    }

    controlShow() {
        this.interactableTableTouch = BilliardManager.instance.getTable().isValidFreeBall() && BilliardTools.instance.isMyAction();
        this.nodeCueAnimations.active = BilliardTools.instance.isMyAction() && BilliardData.instance.getActionType() !== 0; // 0 正常球权，1 开球， 2 自由球
        let slider = this.nodeLeft.getChildByPath("ExpSlider").getComponent(Slider);
        slider.progress = 1;
        this.onExpSlider(slider);
        this.nodeRight.getChildByName("NodeAngle").active = BilliardTools.instance.isMyAction();
        this.nodeLeft.active = BilliardData.instance.getActionType() === 0 && BilliardTools.instance.isMyAction();
        this.nodeLeft.getChildByPath("Label").getComponent(Label).string = "";
        let nodeAngle = this.nodeRight;
        nodeAngle.active = BilliardData.instance.getActionType() === 0 && BilliardTools.instance.isMyAction();

        BilliardData.instance.getOffset().copy(Vec3.ZERO);
        let dot = this.node.getChildByPath("NodeHitPoint/ButtonBall/Node/Dot");
        dot.position = Vec3.ZERO;
    }

    cueHide() {
        this.nodeCueArrow.active = false;
    }

    onClickTable(local: Vec2) {    
        this.cue.showCueLine();
        this.nodeRight.active = BilliardTools.instance.isMyAction();
        this.nodeLeft.active = BilliardTools.instance.isMyAction();
        let screenPos = local;
        let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0)).setZ(0);
        this.onShotAt(wp);

        // 自由球相关显示
        if (BilliardData.instance.isFreeBall()) {
            this.freeBall.hideHand();
            this.cue.ShowFreeBallAnim();
        }

    }

    onShotAt(wp: Vec3) {
        this.nodeCue.setPosition(-R2d*2, -15, 0);
        let nodeCueArrow = this.nodeCueArrow;
        let cueBall = BilliardManager.instance.getCueBall();
        let nodeArrow = this.nodeArrow;
        let camera3DToCamera2DWPos = BilliardTools.instance.camera3DToCamera2DWPos.bind(BilliardTools.instance);
        let cue2dWp = camera3DToCamera2DWPos(cueBall.node.worldPosition);
        nodeCueArrow.worldPosition = cue2dWp;
        nodeCueArrow.active = true;
        // this.setArrowLine(true);
        this.cue.showLine()
        let direction = wp.clone().subtract(cueBall.node.worldPosition).normalize();
        let angle = BilliardTools.instance.roundToFiveDecimalPlaces(direction.angleTo(Vec3.RIGHT));// 返回弧度
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
        let uiTran = this.cue.nodeCueLine.getComponent(UITransform);
        this.isShotAtBall = false;
        if (nodes.length > 0) {
            // yy.log.w("hit sucess", nodes[0].name);
            let collision = nodes[0].getComponent(BaseRayCollision);
            let ballArrow = this.cue.nodeBallArrow;
            let cueArrow = this.cue.nodeCueArrow;
            if (collision instanceof RaySphereCollision) {
                let shotAtBall = nodes[0].getComponent(Ball);
                if (shotAtBall) {
                    this.isShotAtBall = true;
                    let isVaildShot = BilliardTools.instance.isVaildShot(shotAtBall.id);
                    this.cue.showBallArrow(isVaildShot);
                    ballArrow.active = true;
                    cueArrow.active = true;
                    let k = BilliardTools.instance.getDisanceBy2dCamera(cueBall.node, nodes[0], direction)
                    uiTran.setContentSize(k - R2d*2, uiTran.contentSize.y);//45.47 球直径2D摄像头尺寸
                    if (uiTran.width > 0) this.cue.showLine();
                    else this.cue.hideLine();
                    
                    let b2dPos = camera3DToCamera2DWPos(nodes[0].worldPosition);
                    let furCueNode = this.cue.nodeAllow;
                    furCueNode.getComponent(Widget).updateAlignment(); // 强制更新节点位置，不然当前帧数据会异常，需要等待下一帧计算才行
                    // yy.log.w("furCueNode", furCueNode.worldPosition)
                    let v1 = b2dPos.clone().subtract(direction.multiplyScalar(k).add(cue2dWp)).normalize();
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

                    let maxLength = 65;
                    let cosValue = Math.pow(Math.cos(dvAngle), 2);
                    let ballLength = 65 * cosValue;
                    let bTrans = ballArrow.getChildByName("Sprite").getComponent(UITransform);
                    bTrans.setContentSize(Math.max(ballLength, 5), bTrans.contentSize.y);
                    let cueTrans = cueArrow.getChildByName("Sprite").getComponent(UITransform);
                    cueTrans.setContentSize(Math.max(maxLength - ballLength, 5), cueTrans.contentSize.y);

                }
                else {
                    let k = BilliardTools.instance.getDisanceBy2dCamera(cueBall.node, nodes[0], direction)
                    uiTran.setContentSize(k - R2d*2, uiTran.contentSize.y);//45.47 球直径2D摄像头尺寸
                    this.cue.showBallArrow(true)
                    let furCueNode = this.cue.nodeAllow;
                    furCueNode.getComponent(Widget).updateAlignment(); // 强制更新节点位置，不然当前帧数据会异常，需要等待下一帧计算才行
                    ballArrow.active = false;
                    cueArrow.active = false;
                    if (uiTran.width > 0) this.cue.showLine();
                    else this.cue.hideLine();
                }


            }
            else {

                uiTran.setContentSize(BilliardTools.instance.getRectangleDisanceBy2dCamera(cueBall.node, nodes[0], direction), uiTran.contentSize.y);
                this.cue.showBallArrow(true)
                let furCueNode = this.cue.nodeAllow;
                furCueNode.getComponent(Widget).updateAlignment(); // 强制更新节点位置，不然当前帧数据会异常，需要等待下一帧计算才行
                ballArrow.active = false;
                cueArrow.active = false;
                if (uiTran.width > 0) this.cue.showLine();
                else this.cue.hideLine();
               
            }

            // yy.log.w(nodes[0].name, "球与球之间的距离:" + uiTran.width);

        }
        else {
            //  yy.log.w("", "未检测出碰撞点");
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
        this.freeBall.nodeFistTips.active = BilliardTools.instance.isMyAction();
        let switchFrames = this.cue.getComponentsInChildren(BilliardSwitchFrame);
        switchFrames.forEach((item) => {
            item.switchFrame();
        })
    }

    onSlider(slider: Slider) {
        this.nodeRight.getChildByName("NodeAngle").active = false;
        let label = this.nodeLeft.getChildByPath("Label").getComponent(Label);
        let maskProgress = this.nodeLeft.getChildByPath("TouchPower/MaskProgress").getComponent(UITransform);
        let maxHight = 528;
        let progress = 1 - slider.progress;

        maskProgress.height = progress * maxHight;
        if (progress === 0) {
            label.string = "";
        }
        else {
            label.string = Math.floor( progress * MaxPower ).toString();
        }


        this.nodeCue.setPosition((progress * 5 + 1)* -R2d*2, -15, 0);
    }

    onExpSlider(slider: Slider) {
        const startPer = 0.88;
        if (slider.progress <= startPer) {
            this.powerSlider.progress = slider.progress / startPer;
            this.onSlider(this.powerSlider);
        }
        else {
            this.powerSlider.progress = 1;
            this.onSlider(this.powerSlider);
        }
    }


    onHitPoint(nor: Vec3, per: number) {
        let dot = this.node.getChildByPath("NodeHitPoint/ButtonBall/Node/Dot");
        let radius = dot.parent.getComponent(UITransform).width / 2;
        let length = radius * per;
        let dis = nor.multiplyScalar(length)
        let pos = dot.parent.worldPosition.clone().add(dis);
        dot.worldPosition = pos;
    }

    // private frameCount: number = 0;
    // private dt: number = 0;
    // private fps: number = 0;
    // private tmpString: string = null;
    // private minFps = 100000;
    // private maxFps = 0;
    // protected update(dt: number): void {
    //     this.dt += dt;
    //     this.frameCount++;
    //     let cfps = 1/dt;
    //     if (this.dt > 1) {
    //         this.fps = this.frameCount / this.dt;
    //         this.tmpString = `FPS: ${this.fps.toFixed(0)}  MinDT: ${(1/this.minFps).toFixed(3)}  minFps: ${this.minFps.toFixed(0)}  maxFps: ${this.maxFps.toFixed(0)}`;
    //         this.labelTestInfo.string = this.tmpString;
    //         this.dt = 0;
    //         this.frameCount = 0;
    //         this.minFps = 100000;
    //         this.maxFps = 0;
    //     }
    //     this.minFps = Math.min(this.minFps, cfps);
    //     this.maxFps = Math.max(this.maxFps, cfps);


    //     // this.labelTestInfo.string = this.tmpString +  ` fps: ${(1/dt).toFixed(3)}`
    // }

    onFreeBall() {
        this.freeBall.setFreeBallHand();
        this.nodeCueAnimations.active = true && BilliardTools.instance.isMyAction();
        let opacity = this.freeBall.getComponentInChildren(UIOpacity);
        opacity.opacity = BilliardTools.instance.isMyAction() ? 255 : 178.5;
    }

    onFreeBallMove(isMove: boolean, isSend: boolean = true, isShowShot:boolean = true) {
        if (isMove) {
            this.nodeCueArrow.active = false;
            this.nodeRight.active = false;
            this.nodeLeft.active = false;
        }else {
            this.nodeCueArrow.active = isShowShot;
            // this.setArrowLine(true);
            // this.cue.showLine()

            this.nodeRight.active = isShowShot && BilliardTools.instance.isMyAction();
            this.nodeLeft.active = isShowShot && BilliardTools.instance.isMyAction();
            let table = BilliardManager.instance.getTable();
            let ball = table.recentlyBall();
            if (ball && isShowShot) {
                this.autoShotAt(ball.node);
                this.cue.onlyShowFreeBallAnim();
            }

            if (isSend) {
                // yy.log.w("发送球球位置", table.cueBall.pos);
                BilliardService.instance.sendCueMove(table.cueBall.pos.x, table.cueBall.pos.y);
                BilliardService.instance.sendFreeBallReq(table.cueBall.pos.x, table.cueBall.pos.y);
            }

            this.nodeRight.active = false;
            this.nodeLeft.active = false;
        }
    }

    onCueMove(msg: protoBilliard.IFreeBall) {
        let table = BilliardManager.instance.getTable();
        table.cueBall.updatePosImmediately(new Vec3(msg.curPosition.x/BilliardConst.multiple, msg.curPosition.y/BilliardConst.multiple, 0));
        this.onFreeBall();
        this.onFreeBallMove(false, false);
        // this.freeBall.hideHand();
        this.cue.onlyShowFreeBallAnim();

        yy.log.w("onCueMove", msg)
    }


    _lastSc = new Vec2()
    _sc = new Vec2();
    onCueAngle(msg: protoBilliard.ICueAngle) {
        let lastSc = BilliardManager.instance.camera3d.worldToScreen(new Vec3(msg.lastScreenPos.x/BilliardConst.multiple, msg.lastScreenPos.y/BilliardConst.multiple, 0)).setZ(0);
        let sc = BilliardManager.instance.camera3d.worldToScreen(new Vec3(msg.curScreenPos.x/BilliardConst.multiple, msg.curScreenPos.y/BilliardConst.multiple, 0)).setZ(0);
        this._lastSc.set(lastSc.x, lastSc.y);
        this._sc.set(sc.x, sc.y);
        this.unschedule(this.onUpdateCueAngle);
        this.schedule(this.onUpdateCueAngle);
    }
    onUpdateCueAngle() {
        this._lastSc.lerp(this._sc, 0.1);
        this.onClickTable(this._lastSc);
        if (Math.abs(this._lastSc.x - this._sc.x) < 0.1) {
            this.onClickTable(this._sc);
            this.unschedule(this.onUpdateCueAngle);
        }
    }

    onCueOffset(msg: protoBilliard.ICueOffset) {
        let dot = this.node.getChildByPath("NodeHitPoint/ButtonBall/Node/Dot");
        let radius = dot.parent.getComponent(UITransform).width / 2;
        let offset = new Vec3(msg.curOffset.x/BilliardConst.multiple, msg.curOffset.y/BilliardConst.multiple, 0);
        let nor = offset.clone().normalize();
        nor.setX(-nor.x);
        let length = radius * (offset.length() * 2);
        let dis = nor.multiplyScalar(length)
        let pos = dot.parent.worldPosition.clone().add(dis);
        dot.worldPosition = pos;
    }
    

    initUIShow() {
        if(BilliardData.instance.is8Ball()) {
            this.billiardTop.show8BallUI();
        }
        else if(BilliardData.instance.is9Ball()) {
            this.billiardTop.show9BallUI();
        }
        else if(BilliardData.instance.isGuide()) {
            this.billiardTop.showGuide();
            this.node.getChildByName("ButtonChat").active = false;
            this.node.getChildByName("NodeHitPoint").active = false;
        }
    }

    setPlayerInfo() {
        this.billiardTop.setBindLeftPlayerUID(1)
        .setBindRightPlayerUID(2)

        const players = BilliardData.instance.getAllPlayers();
        players.forEach(p=>{
            if (p.uid === yy.user.getUid()) {
                this.billiardTop.setBindLeftPlayerUID(p.uid)
            }
            else {
                this.billiardTop.setBindRightPlayerUID(p.uid)
            }
        })

        players.forEach(p=>{
            this.billiardTop.setPlayerName(p.name, p.uid)
                .setPlayerHead(p.url, p.uid)
                .setPlayerBalls(BilliardData.instance.getHitBalls(p.uid), p.uid);
        });

        // this.setScore();
    }

    setGold(gold: number) {
        this.billiardTop.setGold(gold);
    }

    stopCountDown() {
        this.billiardTop.stopCountDown();
    }

    setPlayerCountDown(countDown: number) {
        this.billiardTop.setPlayerCountDown(countDown);
    }

    resetData() {
        this.billiardTop.resetData();
        
        this.cue.hideLabel();
    }

    onActionArrowCd(cd: number) {
        let nodeCd = this.nodeArrow.getChildByPath("NodeAllow/LabelCD");
        nodeCd.active = true;
        nodeCd.getComponent(Label).string = `${cd}`;
    }

    onSettingCueLocation(isLeft: boolean) {
        if (isLeft) {
            this.nodeLeft.position = this.nodeLeft.position.setX(-890);
            let labelNode = this.nodeLeft.getChildByName("Label");
            labelNode.position = labelNode.position.setX(110);
            let nAngle = this.nodeRight.getChildByName("NodeAngle");
            nAngle.position = nAngle.position.setX(0);
        }
        else {
            this.nodeLeft.position = this.nodeLeft.position.setX(890);
            let labelNode = this.nodeLeft.getChildByName("Label");
            labelNode.position = labelNode.position.setX(-110);
            let nAngle = this.nodeRight.getChildByName("NodeAngle");
            nAngle.position = nAngle.position.setX(-1780);
        }
    }

    onClickChat() {
        BilliardTools.instance.openChatView();
    }


    clearData() {
        this.billiardTop.clearData();
    }


    // onRematch() {
    //     BilliardService.instance.sendEnterGame();
    // }

    onStopAnimations() {
        this.unschedule(this.onUpdateCueAngle);
    }


}


