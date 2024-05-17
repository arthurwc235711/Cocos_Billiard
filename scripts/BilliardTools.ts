import { Camera, find, Node, UITransform, Vec3 } from "cc";
import { BilliardData } from "../data/BilliardData";
import { yy } from "../../../../yy";

export class BilliardTools {
    private static __instance__: BilliardTools;
    static get instance(): BilliardTools {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardTools();
        }
        return this.__instance__;
    }


    // 摄像头之间坐标转换
    cameraToCameraWPos(orgWPos:Vec3, orgCamera: Camera, disCamera: Camera) {
        let orgScrPos = orgCamera.worldToScreen(orgWPos);
        let worldPos = disCamera.screenToWorld(orgScrPos);
        return worldPos;
    }
    camera3DToCamera2DWPos(orgWPos:Vec3, orgCamera: Camera = null, disCamera: Camera = null) {
        if (!orgCamera) orgCamera = BilliardData.instance.camera3d;
        if (!disCamera) disCamera = BilliardData.instance.camera2d;
        return this.cameraToCameraWPos(orgWPos, orgCamera, disCamera);
    }
    camera2DToCamera3DWPos(orgWPos:Vec3, orgCamera: Camera = null, disCamera: Camera = null) {
        if (!orgCamera) orgCamera = BilliardData.instance.camera2d;
        if (!disCamera) disCamera = BilliardData.instance.camera3d;
        return this.cameraToCameraWPos(orgWPos, orgCamera, disCamera);
    }


    getDisanceByCamera(org: Node, dis: Node) {
        let camera3d = BilliardData.instance.camera3d;
        let camera2d = BilliardData.instance.camera2d;
        let srcX1 = camera3d.worldToScreen(org.worldPosition);//org.worldPosition.distanceTo(dis.worldPosition);
        let srcX2 = camera3d.worldToScreen(dis.worldPosition);
        let wp1 = camera2d.screenToWorld(srcX1);
        let wp2 = camera2d.screenToWorld(srcX2);
        let canvas = find("Canvas")
        let canvasPos1 = canvas.getComponent(UITransform).convertToNodeSpaceAR(wp1);
        let canvasPos2 = canvas.getComponent(UITransform).convertToNodeSpaceAR(wp2);

        let x = Math.abs(canvasPos1.x - canvasPos2.x);
        let y = Math.abs(canvasPos1.y - canvasPos2.y);
        yy.log.w("getDisanceByCamera", x, y);

        return x > y ? x : y;
    }
}


