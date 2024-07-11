import { _decorator, CCObject, Component, Label, Node, Sprite, UITransform } from 'cc';
import { noDeprecation } from 'process';
const { ccclass, property } = _decorator;

@ccclass('BilliardCue')
export class BilliardCue extends Component {
    @property(Node)
    nodeFreeBallAnim: Node;
    @property(Node)
    nodeCueLine: Node;
    @property(Sprite)
    spriteLine: Sprite;
    @property(Node)
    nodeAllow;
    @property(Node)
    nodeForbid;
    @property(Node)
    nodeCue;
    @property(Label)
    label: Label;
    @property(Node)
    nodeBallArrow: Node;
    @property(Node)
    nodeCueArrow: Node;

    hideAll() {
        this.hideFreeBallAnim()
            .hideCueLine()
            .hideBallArrow()
        return this;
    }
    ShowFreeBallAnim() {
        this.nodeFreeBallAnim.active = true;
        return this;
    }
    hideFreeBallAnim() {
        this.nodeFreeBallAnim.active = false;
        return this;
    }
    showLine() {
        this.spriteLine.enabled = true;
        return this;
    }
    hideLine() {
        this.spriteLine.enabled = false;
        return this;
    }
    showCue() {
        this.nodeCue.active = true;
        return this;
    }
    hideCue() {
        this.nodeCue.active = false;        
        return this;
    }

    showCueLine() {
        this.spriteLine.enabled = true;
        this.nodeCueLine.active = true;
        return this;
    }
    hideCueLine() {
        this.spriteLine.enabled = false;
        this.nodeCueLine.active = false;
        return this;
    }
    showBallArrow(isAllow: boolean) {
        this.nodeAllow.active = isAllow;
        this.nodeForbid.active = !isAllow;
        return this;
    }
    hideBallArrow() {
        this.nodeAllow.active = false;
        this.nodeForbid.active = false;
        return this;
    }
    showLabel() {
        this.label.node.active = true;
        return this;
    }
    hideLabel() {
        this.label.node.active = false;
        return this;
    }


    onlyShowFreeBallAnim() {
        this.node.active = true;
        this.nodeFreeBallAnim.active = true;
        this.nodeCueLine.active = false;
        return this;
    }

    



}


