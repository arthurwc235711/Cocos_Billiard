import { Camera, director, find, misc, Node, UITransform, Vec3 } from "cc";
import { BilliardData } from "../data/BilliardData";
import { yy } from "../../../../yy";
import { R } from "./physics/constants";
import { log } from "console";

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

    // 3d摄像头转化2d摄像头的大小
    get3dTo2dSize(v3d: Vec3): Vec3 {
        let camera3d = BilliardData.instance.camera3d;
        let camera2d = BilliardData.instance.camera2d;
        let srcX1 = camera3d.worldToScreen(v3d);//org.worldPosition.distanceTo(dis.worldPosition);
        let wp1 = camera2d.screenToWorld(srcX1);
        let canvas = find("Canvas")
        let canvasPos = canvas.getComponent(UITransform).convertToNodeSpaceAR(wp1);
        return canvasPos;
    }


    getDisanceByCamera(org: Node, dis: Node, dir: Vec3, wp2d: Vec3) {
        let source = this.get3dTo2dSize(org.worldPosition);
        let sphereCenter = this.get3dTo2dSize(dis.worldPosition);
        let rayDirection = dir;
        let tmp1 = new Vec3(0, 0, 0);
        let tmp2 = new Vec3(2*R, 0, 0);
        let cp1 = this.get3dTo2dSize(tmp1)//camera2d.screenToWorld(srcTmp);
        let cp2 = this.get3dTo2dSize(tmp2)//camera2d.screenToWorld(disTmp);
        let sphereRadius = Math.abs(cp1.x - cp2.x);

        let offset = sphereCenter.clone().subtract(source);
        let e = offset.length();
        let a = offset.dot(rayDirection);

        let f = Math.sqrt(sphereRadius * sphereRadius - e*e + a*a);
        let t = a - f;
        yy.log.w("t", t);
        return t;
    }
}


