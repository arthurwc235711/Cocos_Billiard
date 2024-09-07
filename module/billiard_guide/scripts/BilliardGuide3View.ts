import { _decorator, Component, director, Node, Vec3 } from 'cc';
import { BilliardGuideView } from './BilliardGuideView';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardConst } from '../../../config/BilliardConst';
import { BilliardHitPointView } from '../../billiard_hitpoint/scripts/BilliardHitPointView';
const { ccclass, property } = _decorator;

@ccclass('BilliardGuide3View')
export class BilliardGuide3View extends BilliardGuideView {

    fun:Function = null;

    nextGuid(index: number = -1) {
        let curIndex = index;
        let view = BilliardManager.instance.getView();
        let table = BilliardManager.instance.getTable();
        let rules = BilliardManager.instance.getRules();
        let wp;
        let sw;
        let ball;
        if (index === -1) curIndex = this.curStep;
        switch(curIndex) {
            case 0:
                this.showGuide(curIndex);
                this.lockClick();
                break;  
            case 1:
                this.showGuide(curIndex);
                this.lockClick();
                break;
            case 2:
                this.showGuide(curIndex);
                this.unlockClick();
                break;
            case 3:
                this.showGuide(curIndex);
                this.unlockClick();
                break;
            case 4:
                this.showGuide(curIndex);
                this.unlockClick();
                break;
            case 5:
                this.showGuide(curIndex);
                ball = table.balls.find(b => b.id === 14);
                wp = BilliardManager.instance.camera3d.worldToScreen(new Vec3(ball.ui.node.worldPosition.x , ball.ui.node.worldPosition.y - 0.15, 0));
                view.onClickTable(wp);
                sw = new Vec3(ball.ui.node.worldPosition.x, ball.ui.node.worldPosition.y - 0.015, 0);
                this.shotLine(sw);
                this.unlockClick();
                break;
            case 6:
                this.showGuide(curIndex);
                view.interactableTableTouch = false;
                view.isAngleDisable = true;
                view.nodeLeft.active = true;
                view.nodeRight.active = false;
                break;
            case 7:
                this.showGuide(curIndex);
                view.nodeLeft.active = false;
                view.nodeRight.active = false;
                break;
            case 8://现在我们学习用<color=#0fffff>高杆</color>来K球
                this.showGuide(curIndex);
                this.lockClick();
                break;
            case 9://<color=#0fffff>高杆</color>使母球在<color=#0fffff>气球后</color>获得<color=#0fffff>向前</color>的动能  从而向<color=#0fffff>出杆方向</color>偏移，K开全色球
                this.showGuide(curIndex);
                this.lockClick();
                break;
            case 10: //下面跟我做一下吧！
                this.showGuide(curIndex);
                this.nodeLine.parent.angle = 0;
                this.lockClick();
                break;
            case 11:
                yy.event.emit(yy.Event_Name.billiard_clear_game_data);
                BilliardService.instance.sendStart()// 单机测试用
                this.scheduleOnce(()=>{
                    this.showGuide(5);
                    ball = table.balls.find(b => b.id === 14);
                    wp = BilliardManager.instance.camera3d.worldToScreen(new Vec3(ball.ui.node.worldPosition.x , ball.ui.node.worldPosition.y - 0.15, 0));
                    view.onClickTable(wp);
                    let v3 = new Vec3(ball.ui.node.worldPosition.x, ball.ui.node.worldPosition.y - 0.015, 0);
                    this.shotLine(v3);
                    this.unlockClick();
                }, 0.22);
                break;
            case 12:
                this.showGuide(curIndex);
                view.interactableTableTouch = false;
                view.isAngleDisable = true;
                BilliardData.instance.setAngle(18862/BilliardConst.multiple);
                this.unlockClick();
                break;
            case 13:
                this.showGuide(curIndex);
                const hitPoint = view.node.getChildByName("NodeHitPoint");
                hitPoint.active = true;
                this.nodeClick.worldPosition = hitPoint.worldPosition; 
                view.interactableTableTouch = false;
                this.unlockClick();
                break;
            case 14:
                this.showGuide(curIndex);
                break;
            case 15:
                this.showGuide(curIndex);
                this.unlockClick();
                break;
            case 16:
                this.showGuide(6);
                view.interactableTableTouch = false;
                view.isAngleDisable = true;
                view.isHitPointDisable = true;
                view.nodeLeft.active = true;
                view.nodeRight.active = false;
                this.unlockClick();
                break;
            case 17:
                this.nodeLine = this.nodeGuide.getChildByPath("17/NodeCue/NodeCueLine");
                this.showGuide(curIndex);
                ball = table.balls.find(b => b.id === 8);
                wp = BilliardManager.instance.camera3d.worldToScreen(new Vec3(ball.ui.node.worldPosition.x , ball.ui.node.worldPosition.y + 0.3, 0));
                view.onClickTable(wp);
                sw = new Vec3(ball.ui.node.worldPosition.x, ball.ui.node.worldPosition.y + 0.13, 0);
                this.shotLine(sw);
                this.unlockClick();
                break;
            case 18:
                this.showGuide(curIndex);
                view.interactableTableTouch = false;
                view.isAngleDisable = true;
                view.nodeLeft.active = true;
                view.nodeRight.active = false;
                break;
            case 19:
                this.showGuide(curIndex);
                break;
            case 20:
                this.showGuide(curIndex);
                this.lockClick();
                break;
            default:
                yy.log.e("nextGuid error", curIndex)
        }

        yy.log.w("nextGuid", curIndex)
        this.curStep ++;
    }



    protected update(dt: number): void {
        if (this.curStep === 6 || this.curStep === 12 || this.curStep === 18) {
            let view = BilliardManager.instance.getView();
            if (Math.abs(this.nodeLine.parent.angle - view.nodeCueArrow.angle) < 0.1){
                yy.log.e("有效重叠")
                this.nextGuid();
                // this.nodeLine.active = false;
            }
        }
    }


    
    onClickHitPoint() {
        BilliardTools.instance.openHitPointView();

        this.scheduleOnce(()=>{
            let guide2View = director.getScene().getComponentInChildren(BilliardHitPointView);
            this.fun = guide2View.close.bind(guide2View);
            guide2View.close = ()=>{
                this.fun();
                this.curStep = 13;
                this.nextGuid();
                // yy.log.e("onClickHitPoint", this.curStep);
            }

            this.nextGuid()
        });
    }


    onClickPoint() {
        const msg = new protoBilliard.ICueOffset();
        msg.curOffset = new protoBilliard.IPosition();
        msg.curOffset.x = 0;
        msg.curOffset.y = 48800;
        let offset = BilliardData.instance.getOffset();
        offset.set( msg.curOffset.x / BilliardConst.multiple, msg.curOffset.y / BilliardConst.multiple, 0);
        yy.event.emit(yy.Event_Name.billiard_notify_cueoffset, msg);
        this.scheduleOnce(()=>{
            this.nextGuid()
        });

        let guide2View = director.getScene().getComponentInChildren(BilliardHitPointView);
        guide2View.close = ()=>{
            this.fun();
            this.nextGuid();
        }
    }

    // onClickCloseHitPointView() {
    //     // let guide2View = director.getScene().getComponentInChildren(BilliardHitPointView);
    //     this.fun();
    //     this.nextGuid();
    // }

    onClickWellDon() {
        const node = this.nodeGuide.getChildByPath("19/Sprite");
        if(node.scale.x === 1) {
            this.nextGuid();
        }
    }
}


