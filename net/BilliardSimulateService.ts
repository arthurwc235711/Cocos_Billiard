import { yy } from '../../../../yy';
import { BilliardConst } from '../config/BilliardConst';
import { BilliardData } from '../data/BilliardData';
import { TableGeometry } from '../module/billiard_table/scripts/TableGeometry';
import { BilliardScene } from '../scene/BilliardScene';
import { R } from '../scripts/physics/constants';
import { BilliardService } from './BilliardService';

export class BilliardSimulateService {
    private static __instance__: BilliardSimulateService = null;

    static get instance(): BilliardSimulateService {
        if (this.__instance__ === null) {
            this.__instance__ = new BilliardSimulateService();
        }
        return this.__instance__;
    }

    private delayAction(cb:Function, delayTime:number = 0.2) {
        let scene = yy.scene.get_scene_script<BilliardScene>();
        scene.scheduleOnce(cb, delayTime);
    }



    notifyStart() {
        let notify = new protoBilliard.IStart();
        notify.balls = [];
        notify.action = new protoBilliard.IAction();
        notify.action.uid = (Math.random() < 0.5 ? 1 : 2 );
        notify.action.times = 20;
        for(let i = 0; i < BilliardData.instance.getBallNums(); ++i) {
            let ball = new protoBilliard.IBall();
            ball.val = i;
            ball.position = new protoBilliard.IPosition();
            ball.rotation = new protoBilliard.IRotation();
            notify.balls.push(ball);
        }
        let row = 1;
        let cNum = 0;
        let lNum = 0;
        let x = TableGeometry.tableX; // 1.40825
        let r = R //* 1.4;
        let acos25 = Math.acos(22.5 * Math.PI / 180 );


        for(let i = 0; i < notify.balls.length; ++i) {
            let ball = notify.balls[i];
            if (ball.val === 0) {
                ball.position.x = -0.75;
                ball.position.y = 0;
                ball.rotation.x = 0;
                ball.rotation.y = 0;
                ball.rotation.z = 0;
                ball.rotation.w = 0;
            }
            else {
                if (row === 1) {
                    ball.position.x = x/2;//设置首行1球坐标
                    ball.position.y = 0;
                  }
                  else {
                    let space = 0//0.001 //日后这里使用随机数取值则可保证 同样输入不同输出结果
                    let y = (lNum+1)%2 === 0 ?  (r + space/2) +  (2*r + space) * (Math.ceil((lNum+1)/2)-1) : (2*r + space) * (Math.ceil((lNum+1)/2)-1);
                    ball.position.x = x/2 + (2 * r / acos25  +  0.001) * (row - 1);//设置其他球
                    ball.position.y = -y + (2 * r + space) * (lNum - cNum);
                  }
            
                  cNum += 1;
                  if (cNum - lNum === 1) {
                    row += 1;
                    lNum = cNum;
                    cNum = 0;
                  }
            }
        }
        for(let i = 0; i < notify.balls.length; ++i) {
            let ball = notify.balls[i];
            ball.position.x *= BilliardConst.multiple;
            ball.position.y *= BilliardConst.multiple;
        }



        this.delayAction(() => {
            BilliardService.instance.notifyStart({msg: notify});
        });
    }


    notifyCueMove() {
        let notify = new protoBilliard.IFreeBall();
        notify.curPosition = new protoBilliard.IPosition();
        notify.curPosition.x = -0.85 * BilliardConst.multiple;
        notify.curPosition.y = 0;

        this.delayAction(()=>{
            BilliardService.instance.notifyCueMove({msg: notify});
        });
    }


    notifyCueAngle() {
        let notify = new protoBilliard.ICueAngle();
        notify.curScreenPos = new protoBilliard.IPosition();
        notify.curScreenPos.x = 700.8000104427338 * BilliardConst.multiple;;
        notify.curScreenPos.y = 194.07812789198942 * BilliardConst.multiple;;

        this.delayAction(()=>{
            BilliardService.instance.notifyCueAngle({msg: notify});
        });
    }

    notifyHit() { 
        let billiardData = BilliardData.instance;
        let notify = new protoBilliard.IHit ();
        notify.angle = billiardData.getAngle();
        notify.power = billiardData.getPower();
        notify.offset = new protoBilliard.IPosition();
        notify.offset.x = billiardData.getOffset().x;
        notify.offset.y = billiardData.getOffset().y;

        this.delayAction(() => {
            BilliardService.instance.notifyHit({msg: notify});
         });
    }
    
}


