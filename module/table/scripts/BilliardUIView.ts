import { _decorator, Canvas, Component, find, Node, UITransform } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardTools } from '../../../scripts/BilliardTools';
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

    }

    initBtnTable(node3d:Node) {

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

    onClickTable() {
        yy.log.w('onClickTable');
    }
}


