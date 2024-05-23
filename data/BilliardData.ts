import { Camera, find } from "cc";
import { Ball } from "../module/table/scripts/Ball";
import { Table } from "../module/table/scripts/Table";

export class BilliardData {
    private static __instance__: BilliardData;
    static get instance(): BilliardData {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardData();
        }
        return this.__instance__;
    }


    private _ballNums: number = 21;
    private _camera3d: Camera
    get camera3d(): Camera {
        if (!this._camera3d) {
            this._camera3d = find("p_billiard_3d/Main Camera").getComponent(Camera);
        }
        return this._camera3d;
    }
    get camera2d(): Camera {
        if (!this._camera2d) {
            this._camera2d = find("Canvas/Camera").getComponent(Camera);
        }
        return this._camera2d;
    }
    private _camera2d: Camera
    private _cueBall: Ball;
    private _angle: number = 0;
    private _power: number = 0;

    getAngle(): number {
        return this._angle;
    }
    setAngle(angle: number) {
        this._angle = angle;
    }

    getPower(): number {
        return this._power;
    }
    setPower(power: number) {
        this._power = power;
    }



    getCueBall(): Ball {
        return this._cueBall;
    }
    setCueBall(node: Ball) {
        this._cueBall = node;
    }

    getBallNums(): number {
        return this._ballNums;
    }
}


