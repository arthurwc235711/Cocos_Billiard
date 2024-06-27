import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { ballsPathPoints } from '../../../../../poker_games/windrop/config/SlotsWindropConfig';
import { BilliardData } from '../../../data/BilliardData';
import { yy } from '../../../../../../yy';
import { BilliardConst } from '../../../config/BilliardConst';
import { BilliardTools } from '../../../scripts/BilliardTools';
const { ccclass, property } = _decorator;

interface PlayerUI {
    uid: number,
    shadeCD: Node, 
    labelName: Label,
    spriteHead: Sprite,
    shadeHeadCD: Node,
    spriteCD: Sprite,
    labelCD: Label,
    nodeBalls: Node,
}


@ccclass('BilliardTop')
export class BilliardTop extends BaseCommonScript {
    @property(Node)
    player1: Node = null;
    @property(Node)
    player2: Node = null;
    @property(Label)
    labelGold: Label = null;
    @property(Label)
    labelScore: Label = null;


    mapAtlas:{ [key: string]: SpriteFrame }

    private playerUI: PlayerUI[] = [];

    on_init(): void {
        let players = [this.player1, this.player2];
        players.forEach(p => {
            this.playerUI.push({
                uid: 0,
                shadeCD: p.getChildByName('SpriteCD'),
                labelName: p.getChildByPath('SpriteName/Label').getComponent(Label),
                spriteHead: p.getChildByPath('p_head_billiard/head_mask/img_head').getComponent(Sprite),
                shadeHeadCD: p.getChildByPath('p_head_billiard/head_mask/CDShade'),
                spriteCD: p.getChildByPath('p_head_billiard/SpriteHeadCD').getComponent(Sprite),
                labelCD: p.getChildByPath('p_head_billiard/SpriteHeadCD/LabelCD').getComponent(Label),
                nodeBalls:  p.getChildByName('NodeBalls'),
            });
        });
    }

    // protected start(): void {
    //     this.setBindLeftPlayerUID(1)
    //         .setBindRightPlayerUID(2)


    //         .setPlayerName("AI", 2)
    //         .setPlayerBalls([1,2,3], 2)
    //         .setPlayerCountDown(20, 2)
    //         .setPlayerCountDown(20, 1)

    //         .setScore(3, 2)
    //         .setGold(168000000)
    // }

    setBindLeftPlayerUID(uid: number) {
        this.playerUI[0].uid = uid;
        return this;
    }
    setBindRightPlayerUID(uid: number) {
        this.playerUI[1].uid = uid;
        return this;
    }

    getPlayerByUID(uid: number): PlayerUI {
        let player = this.playerUI.find(p => p.uid === uid);
        if (!player) {
            yy.log.e("getPlayerByUID don't find player uid = " + uid);
        }
        return player
    }
    setPlayerName(name: string, uid: number = 0) {
        if (uid === 0) uid = BilliardData.instance.getActionUid();
        let player = this.getPlayerByUID(uid);
        if (player) {
            player.labelName.string = name;
        }
        return this;
    }
    setPlayerHead(url: string, uid: number = 0) {
        if (uid === 0) uid = BilliardData.instance.getActionUid();
        let player = this.getPlayerByUID(uid);
        if (player) {
            yy.ui.updateHeadIcon(url, player.spriteHead);
        }
        return this;
    }
    setPlayerBalls(balls: number[], uid: number = 0) {
        if (uid === 0) uid = BilliardData.instance.getActionUid();
        let player = this.getPlayerByUID(uid);
        if (!this.mapAtlas) {
            yy.loader.asyncLoadSpriteAtlas(BilliardConst.bundleName, "module/billiard_table/texture/auto-atlas", (map:{ [key: string]: SpriteFrame } )=>{
                this.mapAtlas = map;
                if (player) {
                    player.nodeBalls.children.forEach((c,i)=>{
                        let val = balls[i];
                        let isShow = val !== undefined;
                        let bNode = c.getChildByName("SpriteBall")
                        bNode.active = isShow;
                        if (isShow) {
                            bNode.getComponent(Sprite).spriteFrame = map[val.toString()];
                        }
                    });
                }      
            });
        }
        else {
            if (player) {
                player.nodeBalls.children.forEach((c,i)=>{
                    let val = balls[i];
                    let isShow = val !== undefined;
                    let bNode = c.getChildByName("SpriteBall")
                    bNode.active = isShow;
                    if (isShow) {
                        bNode.getComponent(Sprite).spriteFrame = this.mapAtlas[val.toString()];
                    }
                });
            }
        }
        return this;
    }
    setPlayerCountDown(countDown: number, uid: number = 0) {
        if (uid === 0) uid = BilliardData.instance.getActionUid();
        let player = this.getPlayerByUID(uid);
        const MaxTime = 20;
        if (player) {
            player.spriteCD.node.active = true;
            player.labelCD.node.active = true;
            player.shadeCD.active = true;
            player.shadeHeadCD.active = true;

            let onUpdate = (dt)=>{
                countDown -= dt;
                if (countDown < 0) {
                    countDown = 0;
                    if (BilliardTools.instance.isMyAction()) {
                        yy.event.emit(yy.Event_Name.billiard_action_arrow_cd, countDown);
                    }
                    this.unschedule(onUpdate);
                }
                let cd = Math.floor(countDown);
                player.labelCD.string = `${cd}s`;
                player.spriteCD.fillRange = (countDown / MaxTime);

                if (countDown < 6 && BilliardTools.instance.isMyAction()) {
                    yy.event.emit(yy.Event_Name.billiard_action_arrow_cd, cd)
                }
            }
            player.labelCD.string = `${Math.floor(countDown)}s`;
            this.schedule(onUpdate, 0);
        }
        return this;
    }

    stopCountDown() {
        this.unscheduleAllCallbacks();
        let player = this.getPlayerByUID(BilliardData.instance.getActionUid());
        if (player) {
            player.spriteCD.node.active = false;
            player.labelCD.node.active = false;
            // player.shadeCD.active = false;
            player.shadeHeadCD.active = false;
        }
        return this;
    }

    resetData() {
        let player = this.getPlayerByUID(BilliardData.instance.getActionUid());
        if (player) {
            player.spriteCD.node.active = false;
            player.labelCD.node.active = false;
            player.shadeCD.active = false;
            player.shadeHeadCD.active = false;
        }
    }


    setScore() {
        let mp = BilliardData.instance.getPlayer(this.playerUI[0].uid);
        let op = BilliardData.instance.getPlayer(this.playerUI[1].uid);
        this.labelScore.string = `${mp.score} : ${op.score}`;
        return this;
    }

    setGold(gold:number) {
        this.labelGold.string = yy.money.formatMoney(gold, false);
        return this;
    }

}



