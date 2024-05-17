import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseRayCollision')
export class BaseRayCollision extends Component {
    sqrDeep: number = 0;
}


