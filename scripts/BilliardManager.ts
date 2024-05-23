import { Vec3 } from "cc";
import { BaseCommonInstance } from "../../../../main/base/BaseCommonScript";
import { yy } from "../../../../yy";
import { BilliardUIView } from "../module/table/scripts/BilliardUIView";
import { Outcome } from "../module/table/scripts/Outcome";
import { Table } from "../module/table/scripts/Table";

export class BilliardManager extends BaseCommonInstance{
    private static __instance__: BilliardManager;
    static get instance(): BilliardManager {
        if (this.__instance__ === undefined) {
            this.__instance__ = new BilliardManager();
        }
        return this.__instance__;
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


    register_event() {
        this.event_func_map = {
            [yy.Event_Name.billiard_allStationary] : 'onAllStationary',
        }

        super.register_event();
    }

    onAllStationary() {
        this.getView().onAllStationary();

        this.onUpdate();
    }

    onUpdate() {
        let table = this.getTable();
        // 母球进洞
        if (Outcome.isCueBallPotted(table.cueBall, table.outcome)) {
            table.cueBall.pos = new Vec3(-0.85, 0, 0);
        }
    }
    


}


