import { _decorator, Component, Node, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BilliardCDTips')
export class BilliardCDTips extends Component {
    quat: Quat = new Quat(0, 0, 0, 1);
    update(deltaTime: number) {
        this.node.worldRotation = this.quat;
    }
}


