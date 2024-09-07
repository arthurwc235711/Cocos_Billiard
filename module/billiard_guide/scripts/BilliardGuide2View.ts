import { _decorator, Component, director, Node, Vec2, Vec3 } from 'cc';
import { BilliardGuideView } from './BilliardGuideView';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { BilliardScene } from '../../../scene/BilliardScene';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
import { BilliardGuideRules } from '../../../scripts/rules/BilliardGuideRules';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardHitPointView } from '../../billiard_hitpoint/scripts/BilliardHitPointView';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardConst } from '../../../config/BilliardConst';
const { ccclass, property } = _decorator;

@ccclass('BilliardGuide2View')
export class BilliardGuide2View extends BilliardGuideView {

    fun:Function = null;

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
                this.lockClick();
                break;  
            case 1:
                this.showGuide(curIndex);
                wp = BilliardManager.instance.camera3d.worldToScreen(new Vec3(table.balls[1].ui.node.worldPosition.x + 0.5, table.balls[1].ui.node.worldPosition.y, 0));
                view.onClickTable(wp);
                let v3 = new Vec3(table.balls[1].ui.node.worldPosition.x, table.balls[1].ui.node.worldPosition.y, 0);
                this.shotLine(v3);
                this.unlockClick();
                break;
            case 2:
            case 9:
                this.showGuide(2);
                BilliardData.instance.setAngle(248417/BilliardConst.multiple);
                view.interactableTableTouch = false;
                view.isAngleDisable = true;
                view.isHitPointDisable = true;
                view.nodeLeft.active = true;
                view.nodeRight.active = false;
                break;
            case 3:
                this.showGuide(curIndex);
                // table.cueBall.pos.set(-1.491, 0.763, 1);
                // yy.event.emit(yy.Event_Name.billiard_clear_game_data);
                // BilliardService.instance.sendStart()// 单机测试用
                // view.nodeLeft.active = false;
                // view.nodeRight.active = false;
                // this.lockClick();
                break;
            case 4:
                this.showGuide(curIndex);
                this.nodeLine.parent.angle = 0;
                this.lockClick();
                break;
            case 5:
                yy.event.emit(yy.Event_Name.billiard_clear_game_data);
                BilliardService.instance.sendStart()// 单机测试用
                this.scheduleOnce(()=>{
                    this.showGuide(1);
                    view.nodeLeft.active = false;
                    view.nodeRight.active = false;
                    wp = BilliardManager.instance.camera3d.worldToScreen(new Vec3(table.balls[1].ui.node.worldPosition.x + 0.5, table.balls[1].ui.node.worldPosition.y, 0));
                    view.onClickTable(wp);
                    sw = new Vec3(table.balls[1].ui.node.worldPosition.x, table.balls[1].ui.node.worldPosition.y, 0);
                    this.shotLine(sw);
                    this.unlockClick();
                }, 0.22);
                break;
            case 6:
                this.showGuide(curIndex);
                const hitPoint = view.node.getChildByName("NodeHitPoint");
                hitPoint.active = true;
                this.nodeClick.worldPosition = hitPoint.worldPosition; 
                view.interactableTableTouch = false;
                break;
            case 7:
                this.showGuide(curIndex);
                break;
            case 8:
                this.showGuide(curIndex);
                break;
            case 10: // 母球没进袋提示
                this.showGuide(curIndex);
                break;
            case 11:
                this.showGuide(curIndex);
                this.scheduleOnce(()=>this.nextGuid(), 2);
                break;
            case 12:
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
        if (this.curStep === 2 || this.curStep === 6) {
            let view = BilliardManager.instance.getView();
            if (Math.abs(this.nodeLine.parent.angle - view.nodeCueArrow.angle) < 0.1){
                yy.log.e("有效重叠")
                this.nextGuid();
                // this.nodeLine.active = false;
            }
        }
        // else if(this.curStep === 6) {
        //     let view = BilliardManager.instance.getView();
        //     // yy.log.w("worldRotation", view.cue.nodeBallArrow.worldRotation, this.nodeArrow.worldRotation)
        //     if( Math.abs(view.cue.nodeBallArrow.worldRotation.z - this.nodeArrow.worldRotation.z) < 0.01) {
        //         this.nextGuid();
                
        //     }
        // }
    }

    onClickHitPoint() {
        BilliardTools.instance.openHitPointView();

        this.scheduleOnce(()=>{
            let guide2View = director.getScene().getComponentInChildren(BilliardHitPointView);
            this.fun = guide2View.close.bind(guide2View);
            guide2View.close = ()=>{
                this.fun();
                this.curStep = 6;
                this.nextGuid();
            }

            this.nextGuid()
        });
    }


    onClickPoint() {
        const msg = new protoBilliard.ICueOffset();
        msg.curOffset = new protoBilliard.IPosition();
        msg.curOffset.x = 0;
        msg.curOffset.y = -48800;
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
    //     let guide2View = director.getScene().getComponentInChildren(BilliardHitPointView);
    //     guide2View.close();
    //     this.nextGuid();
    // }

    onClickWellDon() {
        const node = this.nodeGuide.getChildByPath("11/Sprite");
        if(node.scale.x === 1) {
            this.nextGuid();
        }
    }
}


