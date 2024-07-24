import { _decorator, Component, Label, Node, RichText } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardData } from '../../../data/BilliardData';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;


@ccclass('BilliardGameTips')
export class BilliardGameTips extends BaseCommonScript {
    @property(Label)
    labelTips: Label;
    @property(Node)
    nodeTips: Node;
    @property(Node)
    nodeSolids: Node;
    @property(Node)
    nodeStripes: Node;
    @property(Node)
    nodeWin: Node;
    @property(Node)
    nodeYouTurn: Node;
    @property(Node)
    nodeFouls: Node;
    @property(RichText)
    labelFouls: RichText;

    static actionList:Function[] = [];

    isPlaying:boolean = false;

    register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_notify_foulstimes]: "onFoulsTimes",
        };
        super.register_event();
    }

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
        if (BilliardTools.instance.isMyAction()) {
            this.nodeYouTurn.active = true;
            this.scheduleOnce(()=>{
                this.nodeYouTurn.active = false;
            }, 2);
        }

        // BilliardGameTips.actionList.push(()=>{
        //     if (BilliardTools.instance.isMyAction()) {
        //         this.isPlaying = true;
        //         this.labelTips.string = "It's your turn";
        //         this.nodeTips.active = true;
        //     }
        // });
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
                this.labelTips.string = `"${this.getActionName()}" has the ball in hand`;
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
                if (BilliardData.instance.is8Ball()) {
                    if (!BilliardTools.instance.isMyAction()) { // 行动切换完 所以是上一次行动玩家击球提示
                        this.labelTips.string = "The cue ball did not strike another ball";
                    }
                    else {
                        this.labelTips.string = "Opponent's cue ball did not strike another ball";
                    }
                }
                else {
                    if (!BilliardTools.instance.isMyAction()) { // 行动切换完 所以是上一次行动玩家击球提示
                        this.labelTips.string = "You failed to hit the lowest-numbered ball first.";
                    }
                    else {
                        this.labelTips.string = `"${this.getNoActionName()}" failed to hit the lowest-numbered ball first.`;
                    }
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

    cushionTips() {
        BilliardGameTips.actionList.push(()=>{
            this.isPlaying = true;
            if (!BilliardTools.instance.isMyAction()) { // 行动切换完 所以是上一次行动玩家击球提示
                this.labelTips.string = "No balls hit the rail after first contact";
            }
            else {
                this.labelTips.string = `"${this.getNoActionName()}" No balls hit the rail after first contact`;
            }
            this.nodeTips.active = true;
        });
    }

    timeOutTips(uid: number) {
        BilliardGameTips.actionList.push(()=>{
            this.isPlaying = true;
            if (uid === yy.user.getUid()) { // 行动切换完 所以是上一次行动玩家击球提示
                this.labelTips.string = "You ran out of time";
            }
            else {
                let p = BilliardData.instance.getPlayer(uid);
                this.labelTips.string = `"${p.name}" is running out of time`;
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


    onFoulsTimes(notify: protoBilliard.NotifyFoulAction) {
        if (notify.uid === yy.user.getUid()){
            this.nodeFouls.active = true;
            this.scheduleOnce(()=>{
                this.nodeFouls.active = false;
            }, 2);
            this.labelFouls.string = `You already got <size=48><color=#FFE102>${notify.count}</color></size> consecutive fouls\n 3 consecutive fouls will lose`
        }

    }

}

