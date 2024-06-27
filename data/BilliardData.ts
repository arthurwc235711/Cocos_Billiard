import { Camera, find, Vec3 } from "cc";
import { yy } from "../../../../yy";
import { BilliardService } from "../net/BilliardService";


interface BilliardPlayer {
    name: string;
    url: string;
    uid: number;
    hitType: number;
    score: number;
}

const SolidsBalls = [1,2,3,4,5,6,7];
const StripesBalls = [9,10,11,12,13,14,15];

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
        if (BilliardService.instance.isStandAlone) {
            this.addPlayer(1, "Player", "", 0);
            this.addPlayer(2, "AI", "", 0);
        }
    }


    static ballId: number = 0;
    private _ballNums: number = 15 + 1; // 母球 + 1
    private _angle: number = 0;
    private _power: number = 0;
    private readonly _offset: Vec3 = Vec3.ZERO.clone();


    private actionUid: number = 0;
    private actionTimes: number = 0;
    private players: BilliardPlayer[] = [];
    private balls: protoBilliard.IBall[] = [];
    private actionType: number = 0;


    getActionType(): number {
        return this.actionType;
    }
    setActionType(type: number) {
        this.actionType = type;
    }

    getActionUid(): number {
        return this.actionUid;
    }
    setActionUid(uid: number) {
        this.actionUid = uid;
    }
    getActionTimes(): number {
        return this.actionTimes;
    }
    setActionTimes(times: number) {
        this.actionTimes = times;
    }
    getStartBalls() {
        return this.balls;
    }
    setStartBalls(balls: protoBilliard.IBall[]) {
        this.balls = balls;
    }


    getAllPlayers(): BilliardPlayer[] {
        return this.players;
    }

    addPlayer(uid: number, name: string, url: string, score: number){
        if (this.players.filter(p=>p.uid === uid).length === 0) {
            this.players.push({uid:uid, hitType:0, name:name, url:url, score:score});
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
    getHitBalls(uid = 0): number[] {
        if(uid === 0) uid = this.actionUid;
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].uid === uid){
                let type = this.players[i].hitType;
                if(type === 1){
                    // yy.log.w("type 1 - 7")
                    return SolidsBalls;
                }
                else if(type === 2){
                    // yy.log.w("type 9 - 15")
                    return StripesBalls;
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

    getNotActionUid() {
        return this.players[0].uid === this.actionUid ? this.players[1].uid : this.players[0].uid;
    }

    getPlayer(uid: number): BilliardPlayer {
        return this.players.filter(p=>p.uid === uid)[0];
    }
}


