import { _decorator, Component, Node, Vec3 } from 'cc';
import { R } from '../../../scripts/physics/constants';
import CylinderController from '../../../../../../../../extensions/power_tools/@types/packages/scene/@types/cce/public/gizmos/3d/elements/controller/cylinder-controller';
import { TableGeometry } from './TableGeometry';
import { Ball } from './Ball';
import { unitAtAngle } from '../../../scripts/utils';
import { cueToSpin } from '../../../scripts/physics/physics';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('Cue')
export class Cue extends Component {
    readonly offCenterLimit = 0.3
    readonly maxPower = 150 * R
    t = 0;


    protected onLoad(): void {
        this.node.scale = new Vec3(0.02, TableGeometry.tableX * 1, 0.02);
    }


    hit(ball: Ball) {
        this.t = 0;
        ball.setSliding();
        ball.vel.copy(unitAtAngle(0).multiplyScalar(this.maxPower));
        ball.rvel.copy(cueToSpin(Vec3.ZERO, ball.vel));


    }

}


