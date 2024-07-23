import { _decorator, BlockInputEvents, Component, director, Node, Slider, UITransform, Vec2, Vec3 } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { BilliardConst } from '../../../config/BilliardConst';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { R2d, Rtd } from '../../../scripts/physics/constants';
import { rayHit } from '../../../scripts/physics/physics';
import { BilliardGuideRules } from '../../billiard_table/scripts/rules/BilliardGuideRules';
import { dir } from 'console';
import { BilliardScene } from '../../../scene/BilliardScene';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardMenu } from '../../billiard_menu/scripts/BilliardMenu';
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

    private curStep:number = 0;
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
                let v3 = new Vec3(table.balls[1].node.worldPosition.x, table.balls[1].node.worldPosition.y - 0.03, 0);
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
                wp = BilliardManager.instance.camera3d.worldToScreen(table.balls[1].node.worldPosition)
                sw = BilliardManager.instance.camera2d.screenToWorld(wp).setZ(0);
                this.nodeClick.worldPosition = sw; 
                view.nodeLeft.active = false;
                view.nodeRight.active = false;
                view.interactableTableTouch = false;
                this.unlockClick();
                break;
            case 5:
                this.showGuide(curIndex);
                let v2t = new Vec2(1110, 517);
                view.onClickTable(v2t);
                view.nodeRight.active = true;
                (rules as BilliardGuideRules).showRight = true;
                wp = BilliardManager.instance.camera3d.worldToScreen(table.balls[1].node.worldPosition)
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

    onClickStartGame() {
        let rules = BilliardManager.instance.getRules();
        (rules as BilliardGuideRules).restData();
        yy.event.emit(yy.Event_Name.billiard_clear_game_data);
        let billiardScene = director.getScene().getComponentInChildren(BilliardScene);
        BilliardService.instance.isStandAlone = false;
        BilliardData.instance.setGameType(billiardScene.levelData.maxBetMoney);
        BilliardTools.instance.openMatchView(billiardScene.levelData, null);

        let menu = director.getScene().getComponentInChildren(BilliardMenu);
        menu.nodeButton.active = true;
        this.node.destroy();

        BilliardTools.instance.setNeedGuide();
    }

    onClickQuit() {
        yy.event.emit(yy.Event_Name.CasualCommonQuit)
        BilliardTools.instance.setNeedGuide();
    }

    onHit() {
        let view = BilliardManager.instance.getView();
        view.nodeLeft.active = false;
        this.nodeGuide.children.forEach(c=>{
            if(c.active) c.active = false;
        })
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

    protected update(dt: number): void {
        if (this.curStep === 2) {
            let view = BilliardManager.instance.getView();
            if (Math.abs(this.nodeLine.angle - view.nodeCueArrow.angle) < 0.1){
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


