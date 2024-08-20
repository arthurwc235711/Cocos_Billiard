import { _decorator, Component, Node, randomRange } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BilliardCDStar')
export class BilliardCDStar extends Component {

    index:number = 0;
    update(deltaTime: number) {
        if (this.index ++ % 3 === 0) {
            const randomAngle = randomRange(0, 360); 
            this.node.setRotationFromEuler(0, 0, randomAngle); // 设置随机旋转角度
        }
    }
}


