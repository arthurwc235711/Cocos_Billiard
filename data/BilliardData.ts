import { Camera, find, Vec3 } from "cc";


interface BilliardPlayer {
    uid: number;
    hitType: number;
}

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

    constructor (){
        this.addPlayer(1);
        this.addPlayer(2);
    }


    static ballId: number = 0;
    private _ballNums: number = 15 + 1; // 母球 + 1
    private _angle: number = 0;
    private _power: number = 0;
    private readonly _offset: Vec3 = Vec3.ZERO.clone();


    private actionUid: number = 0;
    private players: BilliardPlayer[] = [];



    getActionUid(): number {
        return this.actionUid;
    }
    setActionUid(uid: number) {
        this.actionUid = uid;
    }

    addPlayer(uid: number){
        if (this.players.filter(p=>p.uid === uid).length === 0) {
            this.players.push({uid:uid, hitType:0});
        }
    }

    getHitBallType(): number {
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].uid === this.actionUid){
                return this.players[i].hitType;
            }
        }
    }
    setHitBallType(type: number) {
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].uid === this.actionUid){
                this.players[i].hitType = type;
                this.players[i === 0 ? 1 : 0].hitType = type === 1 ? 2 : 1;
            }
        }
    }
    getHitBalls(): number[] {
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].uid === this.actionUid){
                let type = this.players[i].hitType;
                if(type === 1){
                    return [1,2,3,4,5,6,7];
                }
                else if(type === 2){
                    return [9,10,11,12,13,14,15];
                }
                else{
                    return [];
                }
            }
        }
    }

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


