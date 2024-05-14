import { _decorator, Component, Node, Vec3 } from 'cc';
import { yy } from '../../../../../../yy';
import { Ball } from './Ball';
const { ccclass, property } = _decorator;



@ccclass('billiardTest')
export class billiardTest extends Component {

    balls: Ball[] = [];
    vel: Vec3 = new Vec3(0, 0, 0);

    start() {
        this.balls.every

        this.node.position.setZ(5);
        this.vel.lengthSqr()
    }

    update(deltaTime: number) {
        
    }
}


