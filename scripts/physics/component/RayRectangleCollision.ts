import { _decorator, CCFloat, Component, Node } from 'cc';
import { BaseRayCollision } from './BaseRayCollision';
const { ccclass, property } = _decorator;

@ccclass('RayRectangleCollision')
export class RayRectangleCollision extends BaseRayCollision {
    static sRayRectangleCollisions: RayRectangleCollision[] = [];
    @property(CCFloat)
    width: number = 0;
    @property(CCFloat)
    length: number = 0;
    get halfWidth () {
        return this.width * 0.5;
    }
    get halfLength() {
        return this.length * 0.5;
    }

    protected onEnable(): void {
        RayRectangleCollision.sRayRectangleCollisions.push(this);
    }

    protected onDisable(): void {
        RayRectangleCollision.sRayRectangleCollisions.splice(RayRectangleCollision.sRayRectangleCollisions.indexOf(this), 1);
    }

}


