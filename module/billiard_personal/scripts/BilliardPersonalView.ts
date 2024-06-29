import { _decorator, Component, Label, Node, Sprite, Toggle } from 'cc';
import { BaseCommonPopup } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardService } from '../../../net/BilliardService';
const { ccclass, property } = _decorator;

@ccclass('BilliardPersonalView')
export class BilliardPersonalView extends BaseCommonPopup {
    @property(Label)
    lableTotalGames:Label;
    @property(Label)
    lableWiningRate:Label;
    @property(Label)
    lableBallsPotted:Label;
    @property(Label)
    lableTotalWins:Label;
    @property(Label)
    lableCWinStreak:Label;

    @property(Sprite)
    spriteHead: Sprite;
    @property(Label)
    lableNickName: Label;
    @property(Label)
    lableID: Label;

    @property(Toggle)
    toggle8Ball: Toggle;
    @property(Toggle)
    toggle9Ball: Toggle;

    private serviceData: protoBilliard.UserPlayBilliardDataRsp;

    public register_event() {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.billiard_send_personal]: "onPersonal",
        };
        super.register_event();
    }

    start() {
        // 临时处理 popo通用接口适配异常处理
        let mask = this.node.parent.getChildByName('popup_shade_layer');
        if(mask){
            mask.active = false;
        }
    }

    on_update(uid: number) {
        yy.log.w("BilliardPersonalView on_update uid = " + uid);
        BilliardService.instance.sendPersonalReq(uid);
    }


    onPersonal(personal: protoBilliard.UserPlayBilliardDataRsp) {
        this.serviceData = personal;


        yy.ui.updateHeadIcon(personal.icon, this.spriteHead);
        this.lableNickName.string = personal.nick;
        this.lableID.string = `ID:${personal.uid}`;

        this.onToggleGroup(this.toggle8Ball);
     }

    setData(type: number) {
        function calculatePercentage(dividend: number, divisor: number, decimalPlaces: number = 0): string {
            if (divisor === 0) {
                return "-%";
            }
            const quotient = dividend / divisor;
            const percentage = quotient * 100;
            const formattedPercentage = percentage.toFixed(decimalPlaces);
            return `${formattedPercentage}%`;
        }
        

        let data = this.serviceData.datalist.filter(d=>d.gamePlay==type)[0];
        if (data) {
            this.lableTotalGames.string = data.matchTimes.toString();
            this.lableWiningRate.string = calculatePercentage(data.winTimes, data.matchTimes);
            this.lableBallsPotted.string = data.goalCount.toString();
            this.lableTotalWins.string = data.winTimes.toString();
            this.lableCWinStreak.string = data.winningStreak.toString();
        }
    }


    onToggleGroup(toggle: Toggle) {
        yy.log.w(toggle.node.name, toggle.isChecked);
        this.lableTotalGames.string = "";
        this.lableWiningRate.string = "";
        this.lableBallsPotted.string = "";
        this.lableTotalWins.string = "";
        this.lableCWinStreak.string = "";
        if (this.toggle8Ball.isChecked) {
            this.setData(8);
        }
        if (this.toggle9Ball.isChecked) {
            this.setData(9);
        }
    }

}


