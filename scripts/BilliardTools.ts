import { Camera, Vec3 } from "cc";
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
}


