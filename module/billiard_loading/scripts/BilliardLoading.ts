import { _decorator, Component, Node } from 'cc';
import { CasualCommonLoading } from '../../../../../casual_common/module/loading/scripts/CasualCommonLoading';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardLoading')
export class BilliardLoading extends CasualCommonLoading {
    register_event() {
        this.event_func_map = {
            // [yy.System_Event.Screen_Size_Changed]: 'setBarPrecent',
            // [yy.Event_Name.CasualPreloadInstantiateSchedule]: 'onPreloadLoadedNotice',

            [yy.Event_Name.billiard_loading_resource]: "onLoadingResource",
        };
        super.register_event();
    }



    private resourceProgress = 0;

    get loadPrecess() {
        return this.nLoadPrecess * 0.5 + this.resourceProgress * 0.5;
    }

    onPreloadLoadedNotice(data: { schedule: number }) {
        this.nLoadPrecess = data.schedule;
    }



    onLoadingResource(progress: number) {
        this.resourceProgress = progress;
    }
}


