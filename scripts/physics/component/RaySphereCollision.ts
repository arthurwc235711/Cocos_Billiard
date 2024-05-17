import { _decorator, CCFloat, Component, Node } from 'cc';
import { BaseRayCollision } from './BaseRayCollision';
const { ccclass, property } = _decorator;

@ccclass('RaySphereCollision')
export class RaySphereCollision extends BaseRayCollision {
    static sRaySphereCollisions: RaySphereCollision[] = [];
    @property(CCFloat)
    radius: number = 0;


    protected onEnable(): void {
        RaySphereCollision.sRaySphereCollisions.push(this);
    }

    protected onDisable(): void {
        RaySphereCollision.sRaySphereCollisions.splice(RaySphereCollision.sRaySphereCollisions.indexOf(this), 1);
    }

}


