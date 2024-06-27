import { _decorator, Component, Label, Node } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardData } from '../../../data/BilliardData';
const { ccclass, property } = _decorator;


@ccclass('BilliardGameTips')
export class BilliardGameTips extends BaseCommonScript {
    @property(Label)
    labelTips: Label = null;
    @property(Node)
    nodeTips: Node = null;
    @property(Node)
    nodeSolids: Node = null;
    @property(Node)
    nodeStripes: Node = null;
    @property(Node)
    nodeWin: Node = null;

    static actionList:Function[] = [];

    isPlaying:boolean = false;



    startTips() {
        BilliardGameTips.actionList.push(()=>{
            this.isPlaying = true;
            if (BilliardTools.instance.isMyAction()) {
                this.labelTips.string = "You are breaking，good luck";
            }
            else {
                this.labelTips.string = `"${this.getActionName()}" is breaking`;
            }
            this.nodeTips.active = true;
        });
    }

    turnTips() {
        BilliardGameTips.actionList.push(()=>{
            if (BilliardTools.instance.isMyAction()) {
                this.isPlaying = true;
                this.labelTips.string = "It's your turn";
                this.nodeTips.active = true;
            }
        });
    }

    cueInPocketTips() {
        BilliardGameTips.actionList.push(()=>{
            this.isPlaying = true;
            if (!BilliardTools.instance.isMyAction()) { // 行动切换完 所以是上一次行动玩家击球提示
                this.labelTips.string = "You potted the cue ball";
            }
            else {
                this.labelTips.string = `"${this.getNoActionName()}" potted the cue ball`;
            }
            this.nodeTips.active = true;
        });
    }

    freeBallTips() {
        BilliardGameTips.actionList.push(()=>{
            this.isPlaying = true;
            if (BilliardTools.instance.isMyAction()) { // 行动切换完 所以是上一次行动玩家击球提示
                this.labelTips.string = "You have the ball in hand";
            }
            else {
                this.labelTips.string = `"${this.getNoActionName()}" has the ball in hand`;
            }
            this.nodeTips.active = true;
        });
    }

    foulTips() {
        BilliardGameTips.actionList.push(()=>{
            this.isPlaying = true;
            let hitType = BilliardData.instance.getHitBallType();
            let tip = ""
            if (hitType === 1) {
                tip = "Stripes"; // 获取对方球色所以取反
            }
            else if (hitType === 2) {
                tip = "Solids";
            }
            
            
            
            if (hitType === 0) {
                if (!BilliardTools.instance.isMyAction()) { // 行动切换完 所以是上一次行动玩家击球提示
                    this.labelTips.string = "The cue ball did not strike another ball";
                }
                else {
                    this.labelTips.string = "Opponent's cue ball did not strike another ball";
                }
            }
            else {
                if (!BilliardTools.instance.isMyAction()) { // 行动切换完 所以是上一次行动玩家击球提示
                    this.labelTips.string = `You need to hit a "${tip}" ball`;
                }
                else {
                    this.labelTips.string = `"${this.getNoActionName()}" failed to hit a ${tip} ball`;
                }
            }

            this.nodeTips.active = true;
        });
    }

    playComplete() {
        this.isPlaying = false;
    }

    getActionName() {
        let billiardData = BilliardData.instance;
        return billiardData.getPlayer(billiardData.getActionUid()).name;
    }

    getNoActionName() {
        let billiardData = BilliardData.instance;
       return billiardData.getPlayer(billiardData.getNotActionUid()).name;
    }





    protected update(dt: number): void {
        if (!this.isPlaying && BilliardGameTips.actionList.length > 0) {
            let action = BilliardGameTips.actionList.shift();
            action();
        }
    }


    showMyBallTips() {
        let hitType = BilliardData.instance.getHitBallType();
        if (BilliardTools.instance.isMyAction()) {
            if (hitType === 1) {
                this.showSolidsTips();
            }
            else if (hitType === 2) {
                this.showStripesTips()
            }
        }
        else {
            if (hitType === 1) {
                this.showStripesTips();
            }
            else if (hitType === 2) {
                this.showSolidsTips()
            }
        }
    }


    showSolidsTips() {
        this.nodeSolids.active = true;
        this.scheduleOnce(()=>{
            this.nodeSolids.active = false;
        }, 2);
    }

    showStripesTips() {
        this.nodeStripes.active = true;
        this.scheduleOnce(()=>{
            this.nodeStripes.active = false;
        }, 2);
    }


    showWinTips() {
        this.nodeWin.active = true;
        this.scheduleOnce(()=>{
            this.nodeWin.active = false;
        }, 2);
    }

    showLoseTips(winUid: number) {
        const player = BilliardData.instance.getPlayer(winUid);
        BilliardGameTips.actionList.push(()=>{
            this.isPlaying = true;
            this.labelTips.string = `"${player.name}" Wins`;
            this.nodeTips.active = true;
        });
    }

}

