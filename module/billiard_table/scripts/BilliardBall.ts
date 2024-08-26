import { _decorator, Component, Material, Mesh, MeshRenderer, Node, Quat, Vec3 } from 'cc';
import { Ball } from '../../../scripts/Ball';
import { BilliardTools } from '../../../scripts/BilliardTools';
import { norm, rotateAxisAngle } from '../../../scripts/utils';
const { ccclass, property } = _decorator;

@ccclass('BilliardBall')
export class BilliardBall extends Component {
    @property([Material])
    materials: Material[] = [];
    @property([Material])
    newMaterials: Material[] = [];
    @property([Mesh])
    meshs: Mesh[] = [];
    @property(Node)
    nodeBallAnimation: Node;

    @property(MeshRenderer)
    ballMesh: MeshRenderer;


    ball: Ball;

    delateTime: number = 0;

    get id(): number {
        return this.ball.id;
    }

    initBall(ball: Ball): void {
        this.ball = ball;
        this.node.name = "ball_" + this.ball.id;

        this.ball.setUI(this);

        if (this.ball.id === 0) {//母球
          this.ballMesh.material = this.newMaterials[this.ball.id];
          this.ballMesh.mesh = this.meshs[this.ball.id];
          this.ballMesh.node.scale = new Vec3(8.8, 8.8, 8.8);
        }
        else{
          this.ballMesh.material = this.materials[this.ball.id];
        }
    }


    protected update(dt: number): void {
        if (!this.ball.pos.vec3Equals(this.node.position)) {
            this.node.position = this.node.position.lerp(this.ball.pos, 1); // 更新球的位置
            const angle = this.ball.rvel.length() * dt//this.delateTime;
            let q = rotateAxisAngle(norm(this.ball.rvel), angle);
            const currentRotation = this.ballMesh.node.getRotation();
            this.ballMesh.node.setRotation(Quat.multiply(currentRotation, q, currentRotation));
        }
    }

    showTips() {
        this.nodeBallAnimation.active = true && BilliardTools.instance.isMyAction();
      }
      hideTips() {
        this.nodeBallAnimation.active = false;
      }
}


