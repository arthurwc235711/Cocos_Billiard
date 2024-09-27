import { Vec3 } from "cc";
import { BilliardService } from "../net/BilliardService";
import { yy } from "../../../../yy";
import { BilliardConst } from "../config/BilliardConst";
import { BilliardTools } from "../scripts/BilliardTools";


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

            this.setGameType(8);
        }

        this.angleLimit = BilliardTools.instance.getCacheCueSensitivity()
    }


    static ballId: number = 0;
    private iBallNums: number = 0//15 + 1; // 母球 + 1
    private iAngle: number = 0;
    private iPower: number = 0;
    private readonly _offset: Vec3 = Vec3.ZERO.clone();


    private iActionUid: number = 0;
    private iActionTimes: number = 0;
    private players: BilliardPlayer[] = [];
    private iActionMaxTimes: number = 0;
    private balls: protoBilliard.IBall[] = [];
    private actionType: number = 0;

    private angleLimit: number = 0; // 微调参数

    isOtherPlayExit = false;// 对方是否退出游戏
    gid = 0; // 游戏id

    private gameType = 0; // 8球类型 9球类型
    private iHitCount = 0; // 当前行动玩家连杆数
    private iVersion = 0; // 版本号  1: 代表旧版本
    private bListener = false; // 是否监听推送消息
    private iMarkOfflineTime = 0; // 离线标记剩余时间
    private iAlgoVersion = 0; // 算法版本

    private iTutorial: number = 0;



    private bIsRecord: boolean = false; // 是否是回放
    public rHitReq: protoBilliard.IHit
    public rShootAtFun: Function;
    public rGameResult: protoBilliard.BroadcastGameResult; // 回放结算

    isFreeBall(): boolean {
        return this.actionType !== 0;
    }

    getActionType(): number {
        return this.actionType;
    }
    setActionType(type: number) {
        this.actionType = type;
    }

    getActionUid(): number {
        return this.iActionUid;
    }
    setActionUid(uid: number) {
        this.iActionUid = uid;
    }
    getActionTimes(): number {
        return this.iActionTimes;
    }
    setActionTimes(times: number) {
        this.iActionTimes = times;
    }
    getActionMaxTimes(): number {
        return this.iActionMaxTimes === 0 ? 30 : this.iActionMaxTimes;
    }
    setActionMaxTimes(times: number) {
        this.iActionMaxTimes = times;
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
            if(this.players[i].uid === this.iActionUid){
                return this.players[i].hitType;
            }
        }
    }
    setHitBallType(type: number) {
        if (type === 0) {
            for(let i = 0; i < this.players.length; i++){
                this.players[i].hitType = 0;
            }
        }
        else {
            for(let i = 0; i < this.players.length; i++){
                if(this.players[i].uid === this.iActionUid){
                    this.players[i].hitType = type;
                    this.players[i === 0 ? 1 : 0].hitType = type === 1 ? 2 : 1;
                }
            }
        }


    }
    getHitBalls(uid = 0): number[] {
        if(uid === 0) uid = this.iActionUid;
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
        return this.iAngle;
    }
    setAngle(angle: number) {
        this.iAngle = angle;
    }

    getPower(): number {
        return this.iPower;
    }
    setPower(power: number) {
        this.iPower = power;
    }

    getBallNums(): number {
        return this.iBallNums;
    }

    getOffset(): Vec3 {
        return this._offset;
    }

    getNotActionUid() {
        return this.players[0].uid === this.iActionUid ? this.players[1].uid : this.players[0].uid;
    }

    getPlayer(uid: number): BilliardPlayer {
        return this.players.filter(p=>p.uid === uid)[0];
    }

    getAngleLimit(): number {
        return this.angleLimit;
    }
    setAngleLimit(limit: number) {
        this.angleLimit = limit;
    }


    resetData() {
        this.players.forEach(p=> {
            p.hitType = 0;
        });
        BilliardData.ballId = 0;
    }

    clearData() {
        this.players.length = 0;
        BilliardData.ballId = 0;  
        this.iMarkOfflineTime = 0;
    }

    is8Ball() {
        return this.gameType === 8;
    }
    is9Ball() {
        return this.gameType === 9;
    }
    isGuide() {
        return this.gameType === 0;
    }
    getGameType() {
        return this.gameType;
    }

    setGameType(type: number) {
        switch(type) {
            case 0: // 新手引导

                switch(this.iTutorial){
                    case 1:
                    case 2:
                        this.iBallNums = 1 + 1;
                        break;
                    case 3:
                        this.iBallNums = 5 + 1;
                        break;
                    case 4:
                        this.iBallNums = 3 + 1;
                        break;
                }


                // this.iBallNums = 1 + 1;
                this.gameType = 0;
                this.gid = 0;
                break;
            case 8:
                this.iBallNums = 15 + 1;
                this.gameType = 8;
                this.gid = BilliardConst.gid8Ball;
                break;
            case 9:
                this.iBallNums = 9 + 1;
                this.gameType = 9;
                this.gid = BilliardConst.gid9Ball;
                break;
            default:
                yy.log.e("Billiard GameType error: ", type);
        }
    }


    getHitCount() {
        return this.iHitCount;
    }
    setHitCount(count: number){
        this.iHitCount = count;
    }

/************************* 版本兼容临时处理 **********************/
    setVersion(version: number) {
        this.iVersion = version;
    }
    isOldVersion() {
        return this.iVersion === 1;
    }
    isNewVersion() {
        return this.iVersion !== 1;
    }
/************************* 版本兼容临时处理 **********************/
    setListener() {
        this.bListener = true;
    }

    isListener() {
        return this.bListener;
    }


    setMarkOfflineTime(time: number) {
        this.iMarkOfflineTime = time;
    }
    getMarkOfflineTime() {
        return this.iMarkOfflineTime;
    }

    // 算法版本用于
    getAlgoVersion() {
        return this.iAlgoVersion;
    }
    setAlgoVersion(version: number) {
        this.iAlgoVersion = version;
    }
    isAlogVersion1() {
        return this.iAlgoVersion === 1;
    }

    // 教程版本
    setTutorial(tutorial: number) {
        this.iTutorial = tutorial;
    }
    getTutorial() {
        return this.iTutorial;
    }



    isRecord() {
        return this.bIsRecord;
    }
    setRecord(bRecord: boolean) {
        this.bIsRecord = bRecord;
    }
}
