import { _decorator, BlockInputEvents, Component, director, Node, Slider, UITransform, Vec2, Vec3 } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { R2d, Rtd } from '../../../scripts/physics/constants';
import { rayHit } from '../../../scripts/physics/physics';
import { BilliardGuideRules } from '../../../scripts/rules/BilliardGuideRules';
import { BilliardScene } from '../../../scene/BilliardScene';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardMenu } from '../../billiard_menu/scripts/BilliardMenu';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { BaseRayCollision } from '../../../scripts/physics/component/BaseRayCollision';
import { RaySphereCollision } from '../../../scripts/physics/component/RaySphereCollision';
const { ccclass, property } = _decorator;

@ccclass('BilliardGuideView')
export class BilliardGuideView extends BaseCommonScript {
    @property(Node)
    nodeGuide: Node;
    @property(Node)
    nodeLockClick: Node;
    @property(Node)
    nodeLine: Node;
    @property(Node)
    nodeClick: Node;
    @property(Node)
    nodeArrow: Node;

    curStep:number = 0;
    register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            // [yy.Event_Name.billiard_touch_end]: "onTouchEnd",
            [yy.Event_Name.billiard_notify_hit]: "onHit",
            [yy.Event_Name.billiard_guide_next]: "nextGuid"
        };
        super.register_event();
    }

    protected start(): void {
        this.nextGuid();
    }

    nextGuid(index: number = -1) {
        let curIndex = index;
        let view = BilliardManager.instance.getView();
        let table = BilliardManager.instance.getTable();
        let rules = BilliardManager.instance.getRules();
        let wp;
        let sw;
        if (index === -1) curIndex = this.curStep;
        switch(curIndex) {
            case 0:
                this.showGuide(curIndex);
                let billiardScene = director.getScene().getComponentInChildren(BilliardScene);
                this.nodeGuide.children[0].getChildByName(`Label${billiardScene.levelData.maxBetMoney}`).active = true;
                this.lockClick();
                break;  
            case 1:
                this.showGuide(curIndex);
                let v2 = new Vec2(1007, 314.5);
                view.onClickTable(v2);
                let v3 = new Vec3(table.balls[1].ui.node.worldPosition.x, table.balls[1].ui.node.worldPosition.y - 0.03, 0);
                this.shotLine(v3);
                this.unlockClick();
                break;
            case 2:
            case 6:
                this.showGuide(2);
                view.interactableTableTouch = false;
                view.isAngleDisable = true;
                view.nodeLeft.active = true;
                view.nodeRight.active = false;
                break;
            case 3:
                this.showGuide(curIndex);
                yy.event.emit(yy.Event_Name.billiard_clear_game_data);
                BilliardService.instance.sendStart()// 单机测试用
                view.nodeLeft.active = false;
                view.nodeRight.active = false;
                this.lockClick();
                break;
            case 4:
                this.showGuide(curIndex);
                wp = BilliardManager.instance.camera3d.worldToScreen(table.balls[1].ui.node.worldPosition)
                sw = BilliardManager.instance.camera2d.screenToWorld(wp).setZ(0);
                this.nodeClick.worldPosition = sw; 
                view.nodeLeft.active = false;
                view.nodeRight.active = false;
                view.interactableTableTouch = false;
                this.unlockClick();
                break;
            case 5:
                this.showGuide(curIndex);
                let pot3 = table.balls[1].ui.node.worldPosition.clone();
                wp = BilliardManager.instance.camera3d.worldToScreen(pot3.setY(pot3.y - 0.02))
                // sw = BilliardManager.instance.camera2d.screenToWorld(wp).setZ(0);
                let v2t = new Vec2(wp.x, wp.y);
                view.onClickTable(v2t);
                view.nodeRight.active = true;
                (rules as BilliardGuideRules).showRight = true;
                wp = BilliardManager.instance.camera3d.worldToScreen(table.balls[1].ui.node.worldPosition)
                sw = BilliardManager.instance.camera2d.screenToWorld(wp).setZ(0);
                this.nodeArrow.worldPosition = sw;
                view.isAngleDisable = false;
                break;
            case 7:
                this.showGuide(curIndex);
                this.lockClick();
                break;

            default:
                yy.log.e("nextGuid error", curIndex)
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

    onClickStartGame(customEventData, key) {
        let billiardScene = director.getScene().getComponentInChildren(BilliardScene);
        BilliardService.instance.isStandAlone = false;
        BilliardData.instance.setGameType(billiardScene.levelData.maxBetMoney);
        yy.event.emit(yy.Event_Name.CasualCommonQuit)
        BilliardTools.instance.setNeedGuide(key);

        // let billiardScene = director.getScene().getComponentInChildren(BilliardScene);
        // let data = billiardScene.levelData;
        // const money = yy.user.getTotalMoney();
        // if (money < data.carryLower) {
        //     yy.dialog.show(
        //         {
        //             title: "Tip",
        //             content: "You need more money to enter the room.",
        //             isCancelEnable: false,
        //             isConfirmEnable: true,
        //             confirmText: "OK",
        //             confirmCallback: () => {
        //             },
        //             closeCallback: () => {
        //             },
        //             fontSize: 50,
        //             lineHeight: 60,
        //             // horizontalAlign: HorizontalTextAlignment.CENTER,
        //             // verticalAlign: VerticalTextAlignment.CENTER,
        //         }
        //     )
        // }
        // else if (money > data.carryUpper) {
        //     yy.dialog.show(
        //         {
        //             title: "Tip",
        //             content: "Please enter a more advanced room.",
        //             isCancelEnable: false,
        //             isConfirmEnable: true,
        //             confirmText: "OK",
        //             confirmCallback: () => {
        //             },
        //             closeCallback: () => {
        //             },
        //             fontSize: 50,
        //             lineHeight: 60,
        //             // horizontalAlign: HorizontalTextAlignment.CENTER,
        //             // verticalAlign: VerticalTextAlignment.CENTER,
        //         }
        //     )
        // }
        // else {
        //     let rules = BilliardManager.instance.getRules();
        //     (rules as BilliardGuideRules).restData();
        //     yy.event.emit(yy.Event_Name.billiard_clear_game_data);
    
        //     BilliardService.instance.isStandAlone = false;
        //     BilliardData.instance.setGameType(billiardScene.levelData.maxBetMoney);
        //     BilliardTools.instance.openMatchView(billiardScene.levelData, null);
    
        //     let menu = director.getScene().getComponentInChildren(BilliardMenu);
        //     menu.nodeButton.active = true;
        //     this.node.destroy();
        // }


        // BilliardTools.instance.setNeedGuide();
    }

    onClickQuit() {
        this.onClickStartGame(null, "1");
    }

    onHit() {
        let view = BilliardManager.instance.getView();
        view.nodeLeft.active = false;
        this.nodeGuide.children.forEach(c=>{
            if(c.active) c.active = false;
        })
    }

    shotLine(wp: Vec3) {
        let nodeCueArrow = this.nodeLine.parent;
        let cueBall = BilliardManager.instance.getCueBall();
        let camera3DToCamera2DWPos = BilliardTools.instance.camera3DToCamera2DWPos.bind(BilliardTools.instance);
        let cue2dWp = camera3DToCamera2DWPos(cueBall.ui.node.worldPosition);
        nodeCueArrow.worldPosition = cue2dWp;
        let direction = wp.clone().subtract(cueBall.ui.node.worldPosition).normalize();
        let angle = BilliardTools.instance.roundToFiveDecimalPlaces(direction.angleTo(Vec3.RIGHT));// 返回弧度
        if (wp.y > cueBall.ui.node.worldPosition.y) {
            nodeCueArrow.angle = angle * Rtd;// 返回角度
        }
        else {
            nodeCueArrow.angle = 360 - angle * Rtd;// 返回角度
        }

        let nodes = rayHit(cueBall.ui.node.worldPosition, direction);
        let uiTran = this.nodeLine.getComponent(UITransform);
        if (nodes.length > 0) {
            let collision = nodes[0].getComponent(BaseRayCollision);
            if (collision instanceof RaySphereCollision) {
                let k = BilliardTools.instance.getDisanceBy2dCamera(cueBall.ui.node, nodes[0], direction)
                uiTran.setContentSize(k, uiTran.contentSize.y);//45.47 球直径2D摄像头尺寸
            }
            else {
                let k = BilliardTools.instance.getRectangleDisanceBy2dCamera(cueBall.ui.node, nodes[0], direction)
                uiTran.setContentSize(k, uiTran.contentSize.y);//45.47 球直径2D摄像头尺寸
            }
        }
    }

    protected update(dt: number): void {
        if (this.curStep === 2) {
            let view = BilliardManager.instance.getView();
            if (Math.abs(this.nodeLine.parent.angle - view.nodeCueArrow.angle) < 0.1){
                // yy.log.e("有效重叠")
                this.nextGuid();
                // this.nodeLine.active = false;
            }
        }
        else if(this.curStep === 6) {
            let view = BilliardManager.instance.getView();
            // yy.log.w("worldRotation", view.cue.nodeBallArrow.worldRotation, this.nodeArrow.worldRotation)
            if( Math.abs(view.cue.nodeBallArrow.worldRotation.z - this.nodeArrow.worldRotation.z) < 0.01) {
                this.nextGuid();
                
            }
        }
    }

}


