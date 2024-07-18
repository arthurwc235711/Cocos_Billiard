import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { BilliardData } from '../../../data/BilliardData';
import { BilliardTools } from '../../../scripts/BilliardTools';
const { ccclass, property } = _decorator;

@ccclass('BilliardSwitchFrame')
export class BilliardSwitchFrame extends Component {    
    @property([SpriteFrame])
    frames: SpriteFrame[] = [];
    
    private _sprite: Sprite
    get sprite() { 
        if (!this._sprite) this._sprite = this.node.getComponent(Sprite);
        return this._sprite 
    }

    switchFrame() {
        let index = BilliardTools.instance.isMyAction() ? 0 : 1
        this.sprite.spriteFrame = this.frames[index];
    }
}


