import { Camera, director, find, Vec3, Node } from "cc";
import { BaseCommonInstance } from "../../../../main/base/BaseCommonScript";
import { yy } from "../../../../yy";
import { BilliardUIView } from "../module/billiard_table/scripts/BilliardUIView";
import { Outcome } from "../module/billiard_table/scripts/Outcome";
import { Table } from "../module/billiard_table/scripts/Table";
import { Ball } from "../module/billiard_table/scripts/Ball";
import { BilliardData } from "../data/BilliardData";
import { track } from "./physics/track";
import { IBilliardRules } from "../module/billiard_table/scripts/rules/IBilliardRules";
import { eOutcomeType, eRuleType } from "../config/BilliardConst";
import { BilliardEightBall } from "../module/billiard_table/scripts/rules/BilliardEightBall";

export class BilliardManager extends BaseCommonInstance{
    private static __instance__: BilliardManager;
    static get instance(): BilliardManager {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardManager();
        }
        return this.__instance__;
    }

    delete(){
        delete BilliardManager.__instance__
    }

    private _camera3d: Camera
    get camera3d(): Camera {
        if (!this._camera3d) {
            this._camera3d = find("p_billiard_3d/Main Camera").getComponent(Camera);
        }
        return this._camera3d;
    }
    private _camera2d: Camera
    get camera2d(): Camera {
        if (!this._camera2d) {
            this._camera2d = find("Canvas/Camera").getComponent(Camera);
        }
        return this._camera2d;
    }

    private _table: Table;
    private _view: BilliardUIView;
    private _rules: IBilliardRules;

    setTable(table: Table) {
        this._table = table;
    }
    getTable(): Table {
        return this._table;
    }

    setView(view: BilliardUIView) {
        this._view = view;
    }
    getView(): BilliardUIView {
        return this._view;
    }

    getCueBall(): Ball {
        return this.getTable().cueBall;
    }

    setRules(rules: eRuleType) {
        switch (rules) {
            case eRuleType.EightBall:
                this._rules = new BilliardEightBall();
                break;
            case eRuleType.NineBall:
                break;

            default: 
                yy.log.e("error eRuleType:", rules);
        }
    }

    getRules() {        
        return this._rules;
    }


    register_event() {
        this.event_func_map = {
            [yy.Event_Name.billiard_table_init]: "onInitGame",
            [yy.Event_Name.billiard_allStationary] : 'onAllStationary',
            [yy.Event_Name.billiard_hit_cd_stop]: "onHitCdStop",
        }

        super.register_event();
    }

    reset_data () {
        this.delete();
        BilliardData.instance.delete();
        track.clear();
    }

    onInitGame(node3d:Node) {
        let view = this.getView();
        let table = this.getTable();
        let rules = this.getRules();

        rules.placeBalls();
        view.scheduleOnce(()=>{
            view.initBtnTable(node3d);
            rules.startTurn();
            view.setPlayerInfo();
            view.setPlayerCountDown(20);
        }, 0);
    }


    onAllStationary() {
        let view = this.getView();
        // let table = this.getTable();
        let rules = this.getRules();
        this.onResult();
        this.getView().onAllStationary();
        let ball = rules.onShotBall();
        if (ball) {
            view.autoShotAt(ball.node);
        }
    }

    onResult() {
        let table = this.getTable();
        let rules = this.getRules();
        let view = this.getView();
        let result: { type: eOutcomeType } = { type: eOutcomeType.None };
        if (rules.isFoul(table.outcome)) {
            result.type = eOutcomeType.FreeBall;
            if (rules.isGameEnd(table.outcome, result)) {
                yy.log.w("游戏结束");
                // if (result.type === eOutcomeType.Failed) {
                    let uid = BilliardData.instance.getNotActionUid();
                    let p = BilliardData.instance.getPlayer(uid);
                    yy.dialog.show(
                        {
                            title: "Tip",
                            content: `游戏结束 ${p.name} 获胜`,
                            isCancelEnable: false,
                            isConfirmEnable: true,
                            confirmText: "OK",
                            confirmCallback: () => {
                            },
                            closeCallback: () => {
                            },
                            fontSize: 50,
                            lineHeight: 60,
                        }
                    )
                // }


                return;
            }
        }
        else if (rules.isGameEnd(table.outcome, result)) {
            let uid = BilliardData.instance.getActionUid();
            let p = BilliardData.instance.getPlayer(uid);

            if (result.type === eOutcomeType.Failed) {
                uid = BilliardData.instance.getNotActionUid();
                p = BilliardData.instance.getPlayer(uid);
            }

            yy.dialog.show(
                {
                    title: "Tip",
                    content: `游戏结束 ${p.name} 获胜`,
                    isCancelEnable: false,
                    isConfirmEnable: true,
                    confirmText: "OK",
                    confirmCallback: () => {
                    },
                    closeCallback: () => {
                    },
                    fontSize: 50,
                    lineHeight: 60,
                }
            )
            yy.log.w("游戏结束");
            return;
        } 

        view.resetData();
        rules.nextTurn(result.type);
        view.setPlayerCountDown(20);
        this.setSureBalls();
    }

    onHitCdStop() {
        let view = this.getView();
        view.stopCountDown();
    }


    setSureBalls() {
        const table = this.getTable();
        const view = this.getView();
        const rules = this.getRules();
        const players = BilliardData.instance.getAllPlayers();
        players.forEach(p=>{
            // yy.log.w("getHitBalls", p, p.uid);          

            view.billiardTop.setPlayerBalls(rules.getShowBalls(p.hitType), p.uid);
        });
    }
}


