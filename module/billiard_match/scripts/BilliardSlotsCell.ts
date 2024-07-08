import { _decorator, Component, Node, Sprite } from 'cc';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardSlotsCell')
export class BilliardSlotsCell extends Component {
    @property(Sprite)
    sprite: Sprite;





    setData(url: string) {
        if (url === "")  return;
        yy.ui.updateHeadIcon(url, this.sprite);
    }
}


