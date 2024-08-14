import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardSlotsCell')
export class BilliardSlotsCell extends Component {
    @property(Sprite)
    sprite: Sprite;

    @property([SpriteFrame])
    frames: SpriteFrame[] = [];




    setData(url: string) {
        if (url === "")  return;
        switch(url) {
            case "default_1": this.sprite.spriteFrame = this.frames[0]; break;
            case "default_2": this.sprite.spriteFrame = this.frames[1]; break;
            case "default_3": this.sprite.spriteFrame = this.frames[2]; break;
            case "default_4": this.sprite.spriteFrame = this.frames[3]; break;
            case "default_5": this.sprite.spriteFrame = this.frames[4]; break;
            case "default_6": this.sprite.spriteFrame = this.frames[5]; break;
            default:
                yy.ui.updateHeadIcon(url, this.sprite);
                break;
        }

    }
}


