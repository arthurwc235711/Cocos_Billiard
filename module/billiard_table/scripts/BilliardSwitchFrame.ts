import { _decorator, CCFloat, Component, Node, Sprite, SpriteFrame, UIOpacity } from 'cc';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardTools } from '../../../scripts/BilliardTools';
const { ccclass, property } = _decorator;

@ccclass('BilliardSwitchFrame')
export class BilliardSwitchFrame extends Component {    
    @property([SpriteFrame])
    frames: SpriteFrame[] = [];
    @property(CCFloat)
    ratio: number = 0;
    
    private _sprite: Sprite
    get sprite() { 
        if (!this._sprite) this._sprite = this.node.getComponent(Sprite);
        return this._sprite 
    }

    switchFrame() {
        let index = BilliardTools.instance.isMyAction() ? 0 : 1
        if (this.frames.length > 0) {
            this.sprite.spriteFrame = this.frames[index];
        }
        else {
            this.node.getComponent(UIOpacity).opacity = index == 0 ? 255 : 255 * this.ratio;
        }

    }
}


