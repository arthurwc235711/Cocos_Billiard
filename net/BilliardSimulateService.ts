import { yy } from '../../../../yy';
import { BilliardData } from '../data/BilliardData';
import { BilliardScene } from '../scene/BilliardScene';
import { BilliardService } from './BilliardService';

export class BilliardSimulateService {
    private static __instance__: BilliardSimulateService = null;

    static get instance(): BilliardSimulateService {
        if (this.__instance__ === null) {
            this.__instance__ = new BilliardSimulateService();
        }
        return this.__instance__;
    }

    private delayAction(cb:Function, delayTime:number = 0.2) {
        let scene = yy.scene.get_scene_script<BilliardScene>();
        scene.scheduleOnce(cb, delayTime);
    }


    notifyHit() { 
        let billiardData = BilliardData.instance;
        let resp = new protoBilliard.IHit ();
        resp.angle = billiardData.getAngle();
        resp.power = billiardData.getPower();
        resp.offset = new protoBilliard.IPosition();
        resp.offset.x = billiardData.getOffset().x;
        resp.offset.y = billiardData.getOffset().y;

        this.delayAction(() => {
            BilliardService.instance.respHit({msg: resp});
         });
    }
    
}


