import { EventTouch, Node, Slider, Vec3 } from "cc";
import { yy } from "../../../../../yy";
import { eRuleType, eOutcomeType, BilliardConst } from "../../config/BilliardConst";
import { BilliardData } from "../../data/BilliardData";
import { BilliardService } from "../../net/BilliardService";
import { Outcome } from "../physics/Outcome";
import { IBilliardRules } from "./IBilliardRules";
import { R } from "../physics/constants";
import { BilliardManager } from "../BilliardManager";
import { Ball } from "../Ball";
import { BilliardTools } from "../BilliardTools";

export class BilliardGuideRules implements IBilliardRules {
    ruleType: eRuleType;
    ruleName: string;
    round: number;
    uidTimeOut: number;

    showLeft: boolean = false;
    showRight: boolean = false;

    isFoul(outcome: Outcome[]): boolean {
        return false;
    }
    placeBalls(isStart: boolean) {
        let table = BilliardManager.instance.getTable();
        table.prepareBalls(BilliardConst.startPos, isStart);
        table.initTable();
    }
    isGameEnd(outcome: Outcome[], reslut: { type: eOutcomeType; }): boolean {
        reslut.type = eOutcomeType.Continue;
        return false
        // throw new Error("Method not implemented.");
    }
    nextTurn(type: number, actionUid: number, round: number) {
        yy.event.emit(yy.Event_Name.billiard_guide_next);
    }
    startTurn() {
        let table = BilliardManager.instance.getTable();
        let view = BilliardManager.instance.getView();
        this.round = 1; // 回合数 + 1
        this.uidTimeOut = 0;


        view.onClickTable = (local)=>{
            // yy.log.w("onClickTable", local)
            view.cue.showCueLine();
            let screenPos = local;
            let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0)).setZ(0);
            view.onShotAt(wp);
    

            // yy.log.w("----------", wp);
            view.nodeLeft.active = this.showLeft;
            view.nodeRight.active = this.showRight;
        };

        let sliderNode = view.nodeLeft.getChildByPath("ExpSlider");
        let MaxPower = 60;
        switch(BilliardData.instance.getTutorial()) {
            case 2: MaxPower = 100; break;
            case 3: MaxPower = 100; break;
            case 4: MaxPower = 60; break;

        }

        sliderNode.off(Node.EventType.TOUCH_END);
        sliderNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            let progress = 1 - view.powerSlider.progress;
            if (progress > 0) {
                // yy.log.w("----------");
                BilliardData.instance.setPower( MaxPower * R );
                BilliardService.instance.sendHit();
                // BilliardService.instance.sendHitReq();
            }
        });
        sliderNode.off(Node.EventType.TOUCH_CANCEL);
        sliderNode.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            let progress = 1 - view.powerSlider.progress;
            if (progress > 0) {

                BilliardData.instance.setPower( MaxPower * R );
                BilliardService.instance.sendHit();
                // BilliardService.instance.sendHitReq();
            }
        });

        BilliardData.instance.setActionUid(yy.user.getUid()=== 0 ? 1: yy.user.getUid())//(Math.random() < 0.5 ? 1 : 2 );
        BilliardData.instance.setActionType(0);
        // view.setPlayerCountDown(BilliardData.instance.getActionTimes());
        yy.log.w("当前行动玩家", BilliardData.instance.getActionUid());

        view.controlShow();

        let tmp = new protoBilliard.ICueAngle();
        tmp.curScreenPos = new protoBilliard.IPosition();
        tmp.lastScreenPos = new protoBilliard.IPosition();
        tmp.curScreenPos.x = 84400000;
        tmp.curScreenPos.y = 53250000;
        tmp.lastScreenPos.x = 84400000;
        tmp.lastScreenPos.y = 53250000;

        view.scheduleOnce(()=>{
            BilliardService.instance.notifyCueAngle({msg: tmp});
        }, 0.5)// 下一帧调用

    }
    onShotBall(): Ball {
        throw new Error("Method not implemented.");
    }
    getShowBalls(type: any): number[] {
        return [];
    }


    restData() {
        let view = BilliardManager.instance.getView();
        view.onClickTable = (local)=>{
            view.cue.showCueLine();
            view.nodeRight.active = BilliardTools.instance.isMyAction();
            view.nodeLeft.active = BilliardTools.instance.isMyAction();
            let screenPos = local;
            let wp = BilliardManager.instance.camera3d.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0)).setZ(0);
            view.onShotAt(wp);
    
            // 自由球相关显示
            if (BilliardData.instance.isFreeBall()) {
                view.freeBall.hideHand();
                view.cue.ShowFreeBallAnim();
            }
        };

        let sliderNode = view.nodeLeft.getChildByPath("ExpSlider");
        const MaxPower = 120;
        sliderNode.off(Node.EventType.TOUCH_END);
        sliderNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            let progress = 1 - view.powerSlider.progress;
            if (progress > 0) {
                BilliardData.instance.setPower( Math.floor( progress * MaxPower ) * R );
                BilliardService.instance.sendHit();
                BilliardService.instance.sendHitReq();
            }
            else {
                view.nodeRight.getChildByName("NodeAngle").active = true;
            }
        });
        sliderNode.off(Node.EventType.TOUCH_CANCEL);
        sliderNode.on(Node.EventType.TOUCH_CANCEL, (event: EventTouch) => {
            let progress = 1 - view.powerSlider.progress;
            if (progress > 0) {
                let rules = BilliardManager.instance.getRules();
                let maxPower = MaxPower;
                if (rules.round === 1) {
                    maxPower += MaxPower * Math.random();
                }

                BilliardData.instance.setPower( Math.floor( progress * MaxPower ) * R );
                BilliardService.instance.sendHit();
                BilliardService.instance.sendHitReq();
            }
            else {
                view.nodeRight.getChildByName("NodeAngle").active = true;
            }
        });
        view.node.getChildByName("ButtonChat").active = true;
        view.node.getChildByName("NodeHitPoint").active = true;

        view.isAngleDisable = false;
    }

}


