import { Camera, find, Vec3 } from "cc";

export class BilliardData {
    private static __instance__: BilliardData;
    static get instance(): BilliardData {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardData();
        }
        return this.__instance__;
    }
    delete(){
        delete BilliardData.__instance__;
        BilliardData.ballId = 0;
    }


    static ballId: number = 0;
    private _ballNums: number = 15 + 1; // 母球 + 1
    private _angle: number = 0;
    private _power: number = 0;
    private readonly _offset: Vec3 = Vec3.ZERO.clone();


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

    getBallNums(): number {
        return this._ballNums;
    }

    getOffset(): Vec3 {
        return this._offset;
    }
}


