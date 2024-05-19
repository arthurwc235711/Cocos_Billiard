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


    getDisanceByCamera(org: Node, dis: Node, dir: Vec3, wp2d: Vec3) {
        // 3d摄像头转化2d摄像头的大小
        let to2dSize = function(org3dWp) {
            let camera3d = BilliardData.instance.camera3d;
            let camera2d = BilliardData.instance.camera2d;
            let srcX1 = camera3d.worldToScreen(org3dWp);//org.worldPosition.distanceTo(dis.worldPosition);
            let wp1 = camera2d.screenToWorld(srcX1);
            let canvas = find("Canvas")
            let canvasPos = canvas.getComponent(UITransform).convertToNodeSpaceAR(wp1);
            return canvasPos;
        }

        let source = to2dSize(org.worldPosition);
        let sphereCenter = to2dSize(dis.worldPosition);
        let rayDirection = dir;
        let tmp1 = new Vec3(0, 0, 0);
        let tmp2 = new Vec3(2*R, 0, 0);
        let cp1 = to2dSize(tmp1)//camera2d.screenToWorld(srcTmp);
        let cp2 = to2dSize(tmp2)//camera2d.screenToWorld(disTmp);
        let sphereRadius = Math.abs(cp1.x - cp2.x);

        let offset = sphereCenter.clone().subtract(source);
        let e = offset.length();
        let a = offset.dot(rayDirection);

        let f = Math.sqrt(sphereRadius * sphereRadius - e*e + a*a);
        let t = a - f;
        yy.log.w("t", t);
        return t;
        // let tmp1 = new Vec3(0, 0, 0);
        // let tmp2 = new Vec3(2*R, 0, 0);
        // let cp1 = to2dSize(tmp1)//camera2d.screenToWorld(srcTmp);
        // let cp2 = to2dSize(tmp2)//camera2d.screenToWorld(disTmp);
        // let r = Math.abs(cp1.x - cp2.x);
        // let hitPoint = cPos1.clone().add(dir.multiplyScalar(projection - Math.sqrt(r * r - distance * distance)));

        // yy.log.w("hitPoint", hitPoint, cPos2, cPos1, distance, r, projection, dir);



        // let canvasPos1 = to2dSize(org.worldPosition);//canvas.getComponent(UITransform).convertToNodeSpaceAR(wp1);
        // let canvasPos2 = to2dSize(dis.worldPosition);//canvas.getComponent(UITransform).convertToNodeSpaceAR(wp2);

        // let x = Math.abs(canvasPos1.x - canvasPos2.x);
        // let y = Math.abs(canvasPos1.y - canvasPos2.y);
        
        // let length = Math.sqrt(x * x + y * y);

        // let tmp1 = new Vec3(R, 0, 0);
        // let tmp2 = new Vec3(2*R, 0, 0);
        // let cp1 = to2dSize(tmp1)//camera2d.screenToWorld(srcTmp);
        // let cp2 = to2dSize(tmp2)//camera2d.screenToWorld(disTmp);

        // let r = Math.abs(cp1.x - cp2.x);

        // let tmp = Math.sqrt(length * length -  2*r * 2*r);
        // yy.log.w("getDisanceByCamera", x, y, tmp, r, angle);
 
        // let cPos1 = to2dSize(org.worldPosition);
        // let cPos2 = to2dSize(dis.worldPosition);
        // // let direction = wp2d.clone().subtract(cPos1).normalize();

        // let m = cPos2.clone().subtract(cPos1).setZ(0).normalize();
        // yy.log.w("direction", cPos1,cPos2, m);

        // let x = Math.abs(cPos1.x - cPos2.x);
        // let y = Math.abs(cPos1.y - cPos2.y);
        // let length = Math.sqrt(x * x + y * y);
        // let b = m.dot(dir);
        // let angleRad: number = Math.acos(b);
        // yy.log.w("direction", dir, m);

        // let angel =  misc.radiansToDegrees(angleRad);

        // let ob = Math.tan(angel) * length;


        // yy.log.w(length, b, angleRad, angel, ob);



        // let colissionPoint =  cPos2.clone().add(normal.normalize().multiplyScalar(r/(r+r)));


        // yy.log.w(cPos1, cPos2, dir, perpendicularVector, intersectionPoint);


        // let x = Math.abs(cPos1.x - colissionPoint.x);
        // let y = Math.abs(cPos1.y - colissionPoint.y);
        
        // let length = Math.sqrt(x * x + y * y);

        return  100;//length;//tmp//length * Math.cos(angle); //s- tmp;

    }
}


