import { EventTouch, Node, Slider } from "cc";
import { yy } from "../../../../../../../yy";
import { eRuleType, eOutcomeType, BilliardConst } from "../../../../config/BilliardConst";
import { BilliardData } from "../../../../data/BilliardData";
import { BilliardService } from "../../../../net/BilliardService";
import { BilliardManager } from "../../../../scripts/BilliardManager";
import { BilliardTools } from "../../../../scripts/BilliardTools";
import { Ball } from "../Ball";
import { Outcome } from "../Outcome";
import { IBilliardRules } from "./IBilliardRules";
import { R } from "../../../../scripts/physics/constants";

export class BilliardGuideRules implements IBilliardRules {
    ruleType: eRuleType;
    ruleName: string;
    round: number;
    uidTimeOut: number;

    showLeft: boolean = false;
    showRight: boolean = false;
    isFoul(outcome: Outcome[]): boolean {
        throw new Error("Method not implemented.");
    }
    placeBalls(isStart: boolean) {
        let table = BilliardManager.instance.getTable();
        table.prepareBalls(BilliardConst.startPos, isStart);
        table.initTable();
    }
    isGameEnd(outcome: Outcome[], reslut: { type: eOutcomeType; }): boolean {
        throw new Error("Method not implemented.");
    }
    nextTurn(type: number, actionUid: number, round: number) {
        throw new Error("Method not implemented.");
    }
    startTurn() {
        let table = BilliardManager.instance.getTable();
        let view = BilliardManager.instance.getView();
        this.round = 1; // 回合数 + 1
        this.uidTimeOut = 0;
        view.freeBall.hideHand

        let fun = view.onClickTable.bind(view);
        view.onClickTable = (v)=>{
            fun(v);
            view.nodeLeft.active = this.showLeft;
            view.nodeRight.active = this.showRight;
        };

        let sliderNode = view.nodeLeft.getChildByPath("ExpSlider");
        const MaxPower = 120;
        sliderNode.off(Node.EventType.TOUCH_END);
        sliderNode.on(Node.EventType.TOUCH_END, (event: EventTouch) => {
            let progress = 1 - view.powerSlider.progress;
            if (progress > 0) {
                yy.log.w("----------");
                BilliardData.instance.setPower( Math.floor( 0.7 * MaxPower ) * R );
                BilliardService.instance.sendHit();
                // BilliardService.instance.sendHitReq();
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

                BilliardData.instance.setPower( Math.floor( 0.7 * MaxPower ) * R );
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
        throw new Error("Method not implemented.");
    }

}


