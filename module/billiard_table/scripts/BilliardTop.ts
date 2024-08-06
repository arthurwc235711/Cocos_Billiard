import { _decorator, Color, Component, EventTouch, instantiate, Label, Node, Sprite, SpriteFrame, UIOpacity, Vec3 } from 'cc';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { BilliardData } from '../../../data/BilliardData';
import { yy } from '../../../../../../yy';
import { BilliardConst } from '../../../config/BilliardConst';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { BilliardSwitchFrame } from './BilliardSwitchFrame';
const { ccclass, property } = _decorator;

interface PlayerUI {
    uid: number,
    nodeShade: Node, 
    labelName: Label,
    spriteHead: Sprite,
    shadeHeadCD: Node,
    spriteCD: Sprite,
    labelCD: Label,
    nodeBalls: Node,
    nodeMsg: Node,
    emojiPos: Vec3,
    nodeDot: Node;
    nodeBallMask: Node;
}


@ccclass('BilliardTop')
export class BilliardTop extends BaseCommonScript {
    @property(Node)
    player1: Node;
    @property(Node)
    player2: Node;
    @property(Label)
    labelGold: Label;
    @property(Label)
    labelGold9: Label; // 9球金币
    @property(Node)
    node8Gold: Node;
    @property(Node)
    node9Gold: Node;
    @property(Node)
    node9Balls: Node;
    @property(Label)
    lablelScore: Label;


    mapAtlas:{ [key: string]: SpriteFrame }

    private playerUI: PlayerUI[] = [];
    private actionList:Function[] = [];
    private isPlaying = false;
    private maxLeng: number;

    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_send_msg]: "onMsg",
            [yy.Event_Name.billiard_set_score]: "onSetScore",
        };
        super.register_event();
    }

    on_init(): void {
        let players = [this.player1, this.player2];
        players.forEach(p => {
            this.playerUI.push({
                uid: 0,
                nodeShade: p.getChildByName('Sprite'),
                labelName: p.getChildByPath('SpriteName/Label').getComponent(Label),
                spriteHead: p.getChildByPath('p_head_billiard/head_mask/img_head').getComponent(Sprite),
                shadeHeadCD: p.getChildByPath('p_head_billiard/head_mask/CDShade'),
                spriteCD: p.getChildByPath('p_head_billiard/SpriteHeadCD').getComponent(Sprite),
                labelCD: p.getChildByPath('p_head_billiard/SpriteHeadCD/LabelCD').getComponent(Label),
                nodeBalls:  p.getChildByName('NodeBalls'),
                nodeMsg: p.getChildByName('NodeMsg'),
                emojiPos: Vec3.ZERO.clone(),
                nodeDot: p.getChildByPath('p_head_billiard/SpriteHeadCD/NodeDot'),
                nodeBallMask: p.getChildByPath('BallsMask'),
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
        this.playerUI[0].emojiPos.setX(88).setY(-60);
        return this;
    }
    setBindRightPlayerUID(uid: number) {
        this.playerUI[1].uid = uid;
        this.playerUI[1].emojiPos.setX(88).setY(-60);
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
        if (BilliardData.instance.is8Ball()) {
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
        }
        else if (BilliardData.instance.is9Ball()) {
            if (!this.mapAtlas) {
                yy.loader.asyncLoadSpriteAtlas(BilliardConst.bundleName, "module/billiard_table/texture/auto-atlas", (map:{ [key: string]: SpriteFrame } )=>{
                    this.mapAtlas = map;
                    this.node9Balls.children.forEach((c,i)=>{
                        function showId() {
                            for(let index = 0; index < balls.length; index++) {
                                if (balls[index] - 1 === i) {
                                    return true;
                                }
                            }
                            return false;
                        }

                        // let val = balls[i];
                        let isShow = showId()//val !== undefined;
                        let bNode = c.getChildByName("SpriteBall")
                        bNode.active = isShow;
                        if (isShow) {
                            bNode.getComponent(Sprite).spriteFrame = this.mapAtlas[(i+1).toString()];
                        }
                    });  
                });
            }
            else {
                this.node9Balls.children.forEach((c,i)=>{
                    function showId() {
                        for(let index = 0; index < balls.length; index++) {
                            if (balls[index] - 1 === i) {
                                return true;
                            }
                        }
                        return false;
                    }

                    // let val = balls[i];
                    let isShow = showId()//val !== undefined;
                    let bNode = c.getChildByName("SpriteBall")
                    bNode.active = isShow;
                    if (isShow) {
                        bNode.getComponent(Sprite).spriteFrame = this.mapAtlas[(i+1).toString()];
                    }
                });
            }
        }

        return this;
    }
    setPlayerCountDown(countDown: number, uid: number = 0) {
        if (uid === 0) uid = BilliardData.instance.getActionUid();
        const player = this.getPlayerByUID(uid);
        const oPlayer = this.playerUI.filter(p => p.uid !== uid)[0];
        if (oPlayer) { // 置灰非行动玩家
            if(BilliardData.instance.is8Ball() ) {
                this.playerUI.forEach(p=>{
                p.labelName.node.getComponent(UIOpacity).opacity = 255;
                p.nodeBallMask.active = false;
                });
                oPlayer.nodeBallMask.active = true;
            }
            oPlayer.labelName.node.getComponent(UIOpacity).opacity = 128;
        }
        let MaxTime = BilliardData.instance.getActionMaxTimes();
        if (player) {
            player.spriteCD.node.active = true;
            // player.labelCD.node.active = true;
            // player.shadeCD.active = true;
            // player.shadeHeadCD.active = true;
            player.nodeDot.active = true;

            const switchCD = player.spriteCD.node.getComponent(BilliardSwitchFrame);
            // const switchShader = player.shadeCD.getComponent(BilliardSwitchFrame);
            switchCD.switchSprite(0);
            // switchShader.switchSprite(0);

            // player.labelCD.fontSize = 48;
            // player.labelCD.color = Color.WHITE;
            let onUpdate = (dt)=>{
                let perCD = countDown;
                countDown -= dt;
                if (countDown < 0) {
                    countDown = 0;
                    if (BilliardTools.instance.isMyAction()) {
                        yy.event.emit(yy.Event_Name.billiard_action_arrow_cd, countDown);
                    }
                    this.unschedule(onUpdate);
                    // player.labelCD.string = `${countDown}`;
                    yy.audio.stopSound();
                    return;
                }
                let cd = Math.floor(countDown);

                // player.labelCD.string = `${cd + 1}`;
                player.spriteCD.fillRange = (countDown / MaxTime);
                player.nodeDot.position = player.nodeDot.position.setX(this.maxLeng * player.spriteCD.fillRange);

                if (countDown > 5.05 && countDown <= 15.05) {
                    switchCD.switchSprite(1);
                    // BilliardTools.instance.playSoundCD();
                }
                else if (countDown > 0 && countDown <= 5.05) {
                    switchCD.switchSprite(2);
                    // BilliardTools.instance.playSoundCD();
                }

                if (perCD > 5.05 && countDown <= 5.05) { // 5秒 倒计时播放
                    BilliardTools.instance.playSoundCD();
                }
                // else if (perCD > 4.05 && countDown <= 4.05) {
                //     BilliardTools.instance.playSoundCD();
                //     yy.log.w("4s")
                // }
                // else if (perCD > 3.05 && countDown <= 3.05) {
                //     BilliardTools.instance.playSoundCD();
                //     yy.log.w("3s")
                // }
                // else if (perCD > 2.05 && countDown <= 2.05) {
                //     BilliardTools.instance.playSoundCD();
                //     yy.log.w("2s")
                // }   
                // else if (perCD > 1.05 && countDown <= 1.05) {
                //     BilliardTools.instance.playSoundCD();
                //     yy.log.w("1s")
                // }


                if (countDown < 5) {
                    if (BilliardTools.instance.isMyAction()){
                        yy.event.emit(yy.Event_Name.billiard_action_arrow_cd, cd + 1)
                    }
                    // switchCD.switchSprite(1);
                    // switchShader.switchSprite(1);
                    // player.labelCD.fontSize = 80;
                    // player.labelCD.color = Color.RED;
                }
            }
            // player.labelCD.string = `${Math.floor(countDown) + 1}s`;
            this.schedule(onUpdate, 0);
        }
        return this;
    }

    stopCountDown() {
        this.unscheduleAllCallbacks();
        yy.audio.stopSound();
  
        // this.playerUI.forEach(p=>{
        //     p.labelName.node.getComponent(UIOpacity).opacity = 255;
        //     p.nodeBallMask.active = false;
        // });
        let player = this.getPlayerByUID(BilliardData.instance.getActionUid());
        if (player) {
            player.spriteCD.node.active = false;
            // player.labelCD.node.active = false;
            // player.shadeCD.active = false;
            // player.shadeHeadCD.active = false;
        }
        return this;
    }

    pauseCountDown() {
        this.unscheduleAllCallbacks();
        yy.audio.stopSound();
        if (!BilliardTools.instance.isMyAction()) {
            this.stopCountDown();
        }
    }

    resetData() {
        let player = this.getPlayerByUID(BilliardData.instance.getActionUid());
        if (player) {
            player.spriteCD.node.active = false;
            // player.labelCD.node.active = false;
            // player.shadeCD.active = false;
            // player.shadeHeadCD.active = false;
        }

        this.playerUI.forEach(p=>{
            p.labelName.node.getComponent(UIOpacity).opacity = 255;
            p.nodeBallMask.active = false;
        });
        this.unscheduleAllCallbacks();
    }


    setGold(gold:number) {
        if (BilliardData.instance.is8Ball()) 
            this.labelGold.string = yy.money.formatMoney(gold, false);
        if (BilliardData.instance.is9Ball()) 
            this.labelGold9.string = yy.money.formatMoney(gold, false);
        return this;
    }

    //type 1: 文字  2 标签
    onMsg(msg: protoBilliard.ChatMsg) {
        this.actionList.push(()=>{
            this.isPlaying = true;
            let player = this.playerUI.find(p => p.uid === msg.senderUid);
            if (player) {
                player.nodeMsg.active = true;
                if (msg.msgType === 1) {
                    player.nodeMsg.getChildByName("Msg").active = true;
                    player.nodeMsg.getChildByName("Emo").active = false;
                    player.nodeMsg.getChildByPath("Msg/SpriteMsg/Label").getComponent(Label).string = msg.contentData;
                }
                else if (msg.msgType === 2) {
                    player.nodeMsg.getChildByName("Msg").active = false;
                    let nodeEmo = player.nodeMsg.getChildByName("Emo");
                    nodeEmo.active = true;
                    let prent = nodeEmo.getChildByName("SpriteEmo");
                    for(let i = 1; i < prent.children.length; i++){
                        prent.children[i].destroy();
                    }
                    // let sprite = player.nodeMsg.getChildByPath("Emo/SpriteEmo/Sprite").getComponent(Sprite);

                    // let sprite = player.nodeMsg.getChildByPath("Emo/SpriteEmo/Sprite").getComponent(Sprite);
                    // sprite.spriteFrame = sprite.spriteAtlas.getSpriteFrame(msg.contentData);
                    yy.loader.asyncLoadPrefab(BilliardConst.bundleName, "module/billiard_chat/emoji/perfabs/" + msg.contentData, (p)=>{
                        let clone = instantiate(p) as Node;
                        prent.addChild(clone);
                        clone.position = player.emojiPos;
                    });
                }
            }
        })
    }

    playChatComplete() {
        this.isPlaying = false;
    }

    protected update(dt: number): void {
        if (!this.isPlaying && this.actionList.length > 0) {
            let action = this.actionList.shift();
            action();
        }
    }


    onClickPersonal(evt:EventTouch, index: string) {
        let i = parseInt(index);
        if (this.playerUI[i]) {
            BilliardTools.instance.openPersonalView(this.playerUI[i].uid);
        }
    }

    clearData() {
        this.playerUI.forEach(p=>{
            p.nodeBalls.children.forEach((c,i)=>{
                let bNode = c.getChildByName("SpriteBall")
                bNode.active = false;
            });
        });
    }


    show8BallUI() {
        this.node.active = true;
        this.playerUI.forEach(player => {
            player.nodeBalls.active = true;
            player.nodeShade.active = true;
        });

        this.maxLeng = 640;
        this.node8Gold.active = true;
        this.lablelScore.fontSize = 42;
    }

    show9BallUI() {
        this.maxLeng = 560;
        this.node.active = true;
        this.node9Gold.active = true;
        this.lablelScore.fontSize = 30;

        this.playerUI.forEach(player => {
            player.spriteCD = player.spriteCD.node.parent.getChildByPath('SpriteHeadCD9').getComponent(Sprite);
            player.nodeDot = player.spriteCD.node.getChildByName("NodeDot");
        });
    }

    showGuide() {
        this.node.active = false;
    }

    onSetScore(socres: protoBilliard.ScoreBoardData[]) {
        if (socres) {
            const m = socres.filter(s => s.uid === yy.user.getUid())[0];
            const o = socres.filter(s => s.uid !== yy.user.getUid())[0];
            if (m && o && (m.scoreboard > 0 || o.scoreboard > 0)) {
                this.lablelScore.string = `${m.scoreboard} - ${o.scoreboard}`;
                this.lablelScore.node.active = true;
                if (BilliardData.instance.is8Ball()) {
                    this.labelGold.node.parent.parent.position = new Vec3(0, 23, 0);
                    this.lablelScore.node.position = new Vec3(0, -56, 0);
                }
            }
            else {
                this.lablelScore.node.active = false;
            }
        }
    }
}



