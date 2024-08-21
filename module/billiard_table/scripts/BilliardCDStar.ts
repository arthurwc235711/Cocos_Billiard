import { _decorator, Component, Node, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BilliardCDStar')
export class BilliardCDStar extends Component {

    updateTiems:number = 0;
    update(deltaTime: number) {
        this.updateTiems += deltaTime;
        if (this.updateTiems > 0.05) {
            const randomAngle = randomRange(0, 360); 
            this.node.setRotationFromEuler(0, 0, randomAngle); // 设置随机旋转角度
            this.updateTiems = 0;
        }
    }
}


