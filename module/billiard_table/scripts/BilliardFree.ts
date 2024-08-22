import { _decorator, BlockInputEvents, Component, EventTouch, Node, Sprite, Vec3 } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { yy } from '../../../../../../yy';
import { R } from '../../../scripts/physics/constants';
import { TableGeometry } from './TableGeometry';
import { table } from 'console';
import { BilliardTools } from '../../../scripts/BilliardTools';
const { ccclass, property } = _decorator;

@ccclass('BilliardFree')
export class BilliardFree extends BaseCommonScript {
    @property(Node)
    nodeHand: Node;
    @property(Node)
    nodeStart: Node;
    @property(Node)
    nodeForbid: Node;
    @property(Node)
    nodeFistTips: Node;
    @property(Node)
    nodeHandSprite: Node;

    touchMove: boolean = false;



    public on_init(): void {
        this.initHandClick();
    }

    protected onDisable(): void {
        this.nodeStart.active = false;
    }

    initHandClick() {
        let btn = this.nodeHand;
        let vec3 = new Vec3();
        let outV3 = new Vec3();
        let table = BilliardManager.instance.getTable();
        let view = BilliardManager.instance.getView();
        let cueStartPos = new Vec3();
        
        btn.on(Node.EventType.TOUCH_START, (event: EventTouch) => {
            this.touchMove = false;
            cueStartPos.set(table.cueBall.pos);
        });
        btn.on(Node.EventType.TOUCH_MOVE, (event: EventTouch) => {

            let touch = event.touch;
            let local = touch.getLocation();
            let perLocal = touch.getPreviousLocation();
            if ( BilliardTools.instance.isMyAction() && (this.touchMove ||  Math.abs(local.x - perLocal.x) > 0.01 || Math.abs(local.y - perLocal.y) > 0.01)) {
                if (!this.touchMove) yy.event.emit(yy.Event_Name.billiard_free_ball_move, true);
                this.touchMove = true;
                BilliardManager.instance.camera3d.screenToWorld(vec3.set(local.x, local.y, 0), outV3);
                outV3.setZ(0).setY(outV3.y + 4 * R).setX(outV3.x - R)

                const DEVIATION = 0.005; // 修正X轴到库的误差值
                if (this.nodeStart.active) {
                    if (Math.abs(outV3.y) <= TableGeometry.tableY && outV3.x >= -TableGeometry.tableX && outV3.x <= -0.75) {
                        // yy.log.w("正常", outV3, TableGeometry.tableY)
                        table.cueBall.updatePosImmediately(outV3);
                        BilliardManager.instance.camera2d.screenToWorld(vec3, outV3);
                        this.nodeHand.setWorldPosition(outV3);
                    }
                    else {
    
                        // yy.log.w("溢出")
                        // outV3.setZ(0).setY(outV3.y + 4 * R).setX(outV3.x - R)
                        if (Math.abs(outV3.y) > TableGeometry.tableY) {
                            outV3.y = outV3.y > 0 ? TableGeometry.tableY : -TableGeometry.tableY;
                        }
                        if (outV3.x < -TableGeometry.tableX ) {
                            outV3.x = -TableGeometry.tableX + DEVIATION;
                        }
                        else {
                            if (outV3.x > -0.75) {
                                outV3.x = -0.75;
                            }
                        }
                        table.cueBall.updatePosImmediately(outV3);
                        outV3.setZ(0).setY(outV3.y - 4 * R).setX(outV3.x + R)
                        BilliardManager.instance.camera3d.worldToScreen(outV3, vec3);
    
                        BilliardManager.instance.camera2d.screenToWorld(vec3, outV3);
                        this.nodeHand.setWorldPosition(outV3);
                    }
                }
                else {
                    if (Math.abs(outV3.y) <= TableGeometry.tableY && Math.abs(outV3.x) <= TableGeometry.tableX) {
                        // yy.log.w("正常", outV3, TableGeometry.tableY)
                        table.cueBall.updatePosImmediately(outV3);
                        BilliardManager.instance.camera2d.screenToWorld(vec3, outV3);
                        this.nodeHand.setWorldPosition(outV3);
                    }
                    else {
    
                        // yy.log.w("溢出")
                        // outV3.setZ(0).setY(outV3.y + 4 * R).setX(outV3.x - R)
                        if (Math.abs(outV3.y) > TableGeometry.tableY) {
                            outV3.y = outV3.y > 0 ? TableGeometry.tableY : -TableGeometry.tableY;
                        }
                        if (Math.abs(outV3.x) > TableGeometry.tableX) {
                            outV3.x = outV3.x > 0 ? TableGeometry.tableX - DEVIATION : -TableGeometry.tableX + DEVIATION;
                        }
                        table.cueBall.updatePosImmediately(outV3);
                        outV3.setZ(0).setY(outV3.y - 4 * R).setX(outV3.x + R)
                        BilliardManager.instance.camera3d.worldToScreen(outV3, vec3);
    
                        BilliardManager.instance.camera2d.screenToWorld(vec3, outV3);
                        this.nodeHand.setWorldPosition(outV3);
                    }
                }

                // yy.log.w("isValidFreeBall", BilliardManager.instance.getTable().isValidFreeBall())
                this.nodeForbid.active = !BilliardManager.instance.getTable().isValidFreeBall();
            }
        });
        btn.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            if (BilliardTools.instance.isMyAction()) {
                if (table.isValidFreeBall()) {
                    yy.event.emit(yy.Event_Name.billiard_free_ball_move, false);
                    this.showHand();
                    this.nodeFistTips.active = false;
                    view.interactableTableTouch = true;
                }
                else {
                    table.cueBall.updatePosImmediately(cueStartPos);
                    view.onFreeBall();
                    view.onFreeBallMove(false);
                    view.interactableTableTouch = table.isValidFreeBall();
                }
                this.touchMove = false;
            }

               
        });
        btn.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            if (BilliardTools.instance.isMyAction()) {
                if (table.isValidFreeBall()) {
                    yy.event.emit(yy.Event_Name.billiard_free_ball_move, false);
                    this.showHand();
                    this.nodeFistTips.active = false;
                    view.interactableTableTouch = true;
                }
                else {
                    table.cueBall.updatePosImmediately(cueStartPos);
                    view.onFreeBall();
                    view.onFreeBallMove(false);
                    view.interactableTableTouch = table.isValidFreeBall();
                }
                this.touchMove = false;
            }
        });
    }

    setFreeBallHand() {
        let table = BilliardManager.instance.getTable();
        let outV3 = table.cueBall.pos.clone();
        let vec3 = new Vec3();
        outV3.setY(outV3.y - 4 * R).setX(outV3.x + R)
        BilliardManager.instance.camera3d.worldToScreen(outV3, vec3);
        BilliardManager.instance.camera2d.screenToWorld(vec3, outV3);
        this.nodeHand.setWorldPosition(outV3.setZ(0));
        this.nodeHand.active = true;//BilliardTools.instance.isMyAction();
        this.showHand();
        this.node.active = true;

        const  isValidFreeBall = table.isValidFreeBall();
        this.nodeForbid.active = !isValidFreeBall;
    }

    setStartAreaShow() {
        this.nodeStart.active = true;
    }

    setStartAreaHide() {
        this.nodeStart.active = false;
    }

    showHand() {
        this.nodeHandSprite.active = true;
    }
    hideHand() {
        this.nodeHandSprite.active = false;
        this.nodeFistTips.active = false;
    }
}


