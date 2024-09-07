import { _decorator, Component, director, Node, Vec3 } from 'cc';
import { BilliardGuide3View } from './BilliardGuide3View';
import { yy } from '../../../../../../yy';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { BilliardConst } from '../../../config/BilliardConst';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardHitPointView } from '../../billiard_hitpoint/scripts/BilliardHitPointView';
import { BilliardTools } from '../../../scripts/BilliardTools';
const { ccclass, property } = _decorator;

@ccclass('BilliardGuide4View')
export class BilliardGuide4View extends BilliardGuide3View {

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
                this.tipClip(this.nodeGuide.getChildByName("2"));
                this.unlockClick();
                break;
            case 3:
                this.showGuide(curIndex);
                this.tipClip(this.nodeGuide.getChildByName("3"));
                this.unlockClick();
                break;
            case 4:
                this.showGuide(curIndex);
                this.tipClip(this.nodeGuide.getChildByName("4"));
                this.unlockClick();
                break;
            case 5:
                this.showGuide(curIndex);
                this.tipClip(this.nodeGuide.getChildByName("5"));
                this.unlockClick();
                break;
            case 6:
                this.showGuide(curIndex);
                ball = table.balls.find(b => b.id === 14);
                wp = BilliardManager.instance.camera3d.worldToScreen(new Vec3(ball.ui.node.worldPosition.x + 0.25, ball.ui.node.worldPosition.y, 0));
                view.onClickTable(wp);
                sw = new Vec3(ball.ui.node.worldPosition.x + 0.087 , ball.ui.node.worldPosition.y, 0);
                this.shotLine(sw);
                this.unlockClick();
                break;
            case 7:
                this.showGuide(curIndex);
                view.interactableTableTouch = false;
                view.isAngleDisable = true;
                view.nodeLeft.active = true;
                view.nodeRight.active = false;
                BilliardData.instance.setAngle(223308/BilliardConst.multiple);
                break;
            case 8:// 白球没有走到黑8右侧
                this.showGuide(curIndex);
                this.tipClip(this.nodeGuide.getChildByName("8"));
                this.unlockClick();
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
                    this.showGuide(6);
                    ball = table.balls.find(b => b.id === 14);
                    wp = BilliardManager.instance.camera3d.worldToScreen(new Vec3(ball.ui.node.worldPosition.x + 0.25, ball.ui.node.worldPosition.y, 0));
                    view.onClickTable(wp);
                    sw = new Vec3(ball.ui.node.worldPosition.x + 0.087 , ball.ui.node.worldPosition.y, 0);
                    this.shotLine(sw);
                    this.unlockClick();
                }, 0.22);
                break;
            // case 12:
            //     this.showGuide(curIndex);
            //     view.interactableTableTouch = false;
            //     view.isAngleDisable = true;
            //     view.nodeLeft.active = true;
            //     view.nodeRight.active = false;
            //     BilliardData.instance.setAngle(223308/BilliardConst.multiple);
            //     break;
            case 12:
                this.nodeLine.parent.angle = 0;
                this.showGuide(curIndex);
                const hitPoint = view.node.getChildByName("NodeHitPoint");
                hitPoint.active = true;
                this.nodeClick.worldPosition = hitPoint.worldPosition; 
                view.interactableTableTouch = false;
                this.unlockClick();
                break;
            case 13:
                this.showGuide(curIndex);
                break;
            case 14:
                this.showGuide(curIndex);
                this.unlockClick();
                break;
            case 15:
                this.showGuide(curIndex);
                view.interactableTableTouch = false;
                view.isAngleDisable = true;
                view.isHitPointDisable = true;
                view.nodeLeft.active = true;
                view.nodeRight.active = false;
                BilliardData.instance.setAngle(223308/BilliardConst.multiple);
                this.unlockClick();
                break;
            case 16:
                this.showGuide(curIndex);
                this.tipClip(this.nodeGuide.getChildByName("16"));
                this.unlockClick();
                break;
            case 17:
                this.nodeLine = this.nodeGuide.getChildByPath("17/NodeCue/NodeCueLine");
                this.showGuide(curIndex);
                ball = table.balls.find(b => b.id === 8);
                wp = BilliardManager.instance.camera3d.worldToScreen(new Vec3(ball.ui.node.worldPosition.x + 0.25, ball.ui.node.worldPosition.y, 0));
                view.onClickTable(wp);
                sw = new Vec3(ball.ui.node.worldPosition.x + 0.087 , ball.ui.node.worldPosition.y, 0);
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
                this.scheduleOnce(()=>this.nextGuid(), 2);
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
        if (this.curStep === 7 || this.curStep === 12 || this.curStep === 18) {
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
                this.curStep = 12;
                this.nextGuid();
                // yy.log.e("onClickHitPoint", this.curStep);
            }

            this.nextGuid()
        });
    }

    onClickPoint() {
        const msg = new protoBilliard.ICueOffset();
        msg.curOffset = new protoBilliard.IPosition();
        msg.curOffset.x = -48800;
        msg.curOffset.y = 0;
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


}


