import { Camera, director, find, instantiate, misc, Node, UITransform, Vec3 } from "cc";
import { BilliardData } from "../data/BilliardData";
import { yy } from "../../../../yy";
import { R, R2d } from "./physics/constants";
import { log } from "console";
import { BilliardManager } from "./BilliardManager";
import { BilliardConst } from "../config/BilliardConst";
import { BaseCommonScript } from "../../../../main/base/BaseCommonScript";
import { BilliardScene } from "../scene/BilliardScene";

export class BilliardTools {
    private static __instance__: BilliardTools;
    static get instance(): BilliardTools {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardTools();
        }
        return this.__instance__;
    }

    isMyAction() {
        return  BilliardData.instance.getActionUid() === yy.user.getUid()//1;
    }

    // 摄像头之间坐标转换
    cameraToCameraWPos(orgWPos:Vec3, orgCamera: Camera, disCamera: Camera) {
        let orgScrPos = orgCamera.worldToScreen(orgWPos);
        let worldPos = disCamera.screenToWorld(orgScrPos);
        return worldPos;
    }
    camera3DToCamera2DWPos(orgWPos:Vec3, orgCamera: Camera = null, disCamera: Camera = null) {
        if (!orgCamera) orgCamera = BilliardManager.instance.camera3d;
        if (!disCamera) disCamera = BilliardManager.instance.camera2d;
        return this.cameraToCameraWPos(orgWPos, orgCamera, disCamera);
    }
    camera2DToCamera3DWPos(orgWPos:Vec3, orgCamera: Camera = null, disCamera: Camera = null) {
        if (!orgCamera) orgCamera = BilliardManager.instance.camera2d;
        if (!disCamera) disCamera = BilliardManager.instance.camera3d;
        return this.cameraToCameraWPos(orgWPos, orgCamera, disCamera);
    }

    // 3d摄像头转化2d摄像头的大小
    get3dTo2dSize(v3d: Vec3): Vec3 {
        let camera3d = BilliardManager.instance.camera3d;
        let camera2d = BilliardManager.instance.camera2d;
        let srcX1 = camera3d.worldToScreen(v3d);//org.worldPosition.distanceTo(dis.worldPosition);
        let wp1 = camera2d.screenToWorld(srcX1);
        let canvas = find("Canvas")
        let canvasPos = canvas.getComponent(UITransform).convertToNodeSpaceAR(wp1);
        return canvasPos;
    }


    getDisanceBy2dCamera(org: Node, dis: Node, dir: Vec3) {
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
        // let c = rayDirection.length();

        // let length = a / (a / (e * c) )
        // let oa = dir.multiplyScalar(length);



        // let cos = a/e/c;
        // let sin = Math.sqrt(1 - cos*cos);
        // let y = sphereRadius * cos;
        // let x = sphereRadius * sin;
        // let vx = dis.worldRotation.x - x;
        // let vy = dis.worldRotation.y + y;


        
        // yy.log.w("getDisanceBy2dCamera", sphereRadius)
        let f = Math.sqrt(sphereRadius * sphereRadius - e*e + a*a);
        let t = a - f;
        // yy.log.w("getDisanceBy2dCamera", rayDirection, rayDirection.clone().multiplyScalar(t));
        // yy.log.w("t", t);
        return t; //减少15像素贴图的误差
    }

    getRectangleDisanceBy2dCamera(org: Node, cushion:Node, dir: Vec3 ) {
        let source = this.get3dTo2dSize(org.worldPosition);
        let target = this.get3dTo2dSize(cushion.worldPosition);
        let tmp1 = new Vec3(0, 0, 0);
        let tmp2 = new Vec3(0.025 + R, 0, 0);
        let cp1 = this.get3dTo2dSize(tmp1)//camera2d.screenToWorld(srcTmp);
        let cp2 = this.get3dTo2dSize(tmp2)//camera2d.screenToWorld(disTmp);
        let inc = Math.abs(cp1.x - cp2.x);

        if (cushion.position.y !== 0) {
            let h = Math.abs(target.y - source.y) - inc;
            let w = dir.x/dir.y * h;
            return Math.sqrt(h*h + w*w)- R2d*2;//减少45.47像素贴图的误差
        }
        else {
            let w = Math.abs(target.x - source.x) - inc;
            let h = dir.y/dir.x * w;
            return Math.sqrt(h*h + w*w)- R2d*2;
        }
    }


    roundToFiveDecimalPlaces(num: number): number {
        return Math.round(num * BilliardConst.multiple) / BilliardConst.multiple
    }


    openView(path: string, call:Function|null = null) {
        const s = director.getScene();
        yy.loader.asyncLoadPrefab(BilliardConst.bundleName, path, (p)=>{
            let clone = instantiate(p) as Node;
            let cmp = clone.getComponent(BaseCommonScript)
            const scene = s.getComponentInChildren(BilliardScene)
            scene.get_scene_layer_game().addChild(clone);
            call && call(cmp);
        });
    }

    openWinsView(data: protoBilliard.BroadcastGameResult) {
        this.openView("module/billiard_wins/view/p_billiard_wins", (base)=>{
            base["setData"](data);
        });
    } 


    isVaildShot(ballId: number) {
        if (BilliardData.instance.getHitBallType() === 0) {
            return true;
        }
        else {
            let vaildBalls = BilliardData.instance.getHitBalls();
            return vaildBalls.includes(ballId);
        }
    }
}


