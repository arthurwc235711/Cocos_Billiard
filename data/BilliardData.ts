
export class BilliardData {
    private static __instance__: BilliardData;
    static get instance(): BilliardData {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardData();
        }
        return this.__instance__;
    }


    private _ballNums: number = 21;


    getBallNums(): number {
        return this._ballNums;
    }
}


