import { Camera, director, find, Vec3, Node } from "cc";
import { BaseCommonInstance } from "../../../../main/base/BaseCommonScript";
import { yy } from "../../../../yy";
import { BilliardUIView } from "../module/billiard_table/scripts/BilliardUIView";
import { Outcome } from "../module/billiard_table/scripts/Outcome";
import { Table } from "../module/billiard_table/scripts/Table";
import { Ball } from "../module/billiard_table/scripts/Ball";
import { BilliardData } from "../data/BilliardData";
import { track } from "./physics/track";

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


    register_event() {
        this.event_func_map = {
            [yy.Event_Name.billiard_table_init]: "onInitGame",
            [yy.Event_Name.billiard_allStationary] : 'onAllStationary',
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
        view.scheduleOnce(()=>{
            view.initBtnTable(node3d);
            let ball = table.recentlyBall();
            if (ball) {
                view.autoShotAt(ball.node);
                view.onFreeBall();
            }
        }, 0);

    }


    onAllStationary() {
        let view = this.getView();
        let table = this.getTable();
        this.getView().onAllStationary();
        this.onResult();
        let ball = table.recentlyBall();
        if (ball) {
            view.autoShotAt(ball.node);
        }
    }

    onResult() {
        let table = this.getTable();
        let view =this.getView();
        let freeBall = function() {
            yy.toast.addNow("你犯规了");
            table.cueBall.pos.copy(Vec3.ZERO);
            view.freeBall.node.active = true;
            view.onFreeBallMove(!table.isValidFreeBall());
            view.onFreeBall();
        }
        // 母球进洞
        if (Outcome.isCueBallPotted(table.cueBall, table.outcome) ) {
            yy.log.w("打进母球");
            if (Outcome.is8BallPotted(table.outcome)) {
                yy.toast.addNow("你输了");
                // yy.log.w("打进8号球， 你输了");
            }
            else {
                freeBall();
            }
        }
        else if (Outcome.isFirstCushion(table.outcome)) {// 先撞库
            yy.log.w("先撞库");
            freeBall();
        }
        else if (Outcome.firstCollision(table.outcome) === undefined) {// 没有撞球
            yy.log.w("没有撞球");
            freeBall();
        }
        else if (Outcome.isCollisionNoCushion(table.outcome)) { // 撞球后没有撞库
            yy.log.w("撞球后没有撞库");
            freeBall();
        }

    



    }
    
}


