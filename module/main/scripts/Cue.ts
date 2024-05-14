import { _decorator, Component, Node } from 'cc';
import { R } from '../../../scripts/physics/constants';
const { ccclass, property } = _decorator;

@ccclass('Cue')
export class Cue extends Component {
    readonly offCenterLimit = 0.3
    readonly maxPower = 150 * R
    t = 0;


    protected onLoad(): void {
        
    }

}


