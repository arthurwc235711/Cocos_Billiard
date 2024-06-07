import { _decorator, Button, Component, Node, Vec3 } from 'cc';
import { R } from '../../../scripts/physics/constants';
import CylinderController from '../../../../../../../../extensions/power_tools/@types/packages/scene/@types/cce/public/gizmos/3d/elements/controller/cylinder-controller';
import { TableGeometry } from './TableGeometry';
import { Ball } from './Ball';
import { unitAtAngle } from '../../../scripts/utils';
import { cueToSpin } from '../../../scripts/physics/physics';
import { yy } from '../../../../../../yy';
import { BilliardData } from '../../../data/BilliardData';
const { ccclass, property } = _decorator;

@ccclass('Cue')
export class Cue extends Component {
    readonly offCenterLimit = 0.3
    readonly maxPower = 150 * R



    protected onLoad(): void {
        // this.node.scale = new Vec3(0.02, TableGeometry.tableX * 1, 0.02);
    }

    hit(ball: Ball) {
        let billiardData = BilliardData.instance;
        ball.setSliding();
        ball.vel.copy(unitAtAngle(billiardData.getAngle()).multiplyScalar(billiardData.getPower()));
        ball.rvel.copy(cueToSpin(billiardData.getOffset(), ball.vel));
    }
}


