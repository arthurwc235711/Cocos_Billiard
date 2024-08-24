import { yy } from '../../../../yy';
import { BilliardConst } from '../config/BilliardConst';
import { BilliardData } from '../data/BilliardData';
import { TableGeometry } from '../module/billiard_table/scripts/TableGeometry';
import { BilliardScene } from '../scene/BilliardScene';
import { BilliardManager } from '../scripts/BilliardManager';
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
        notify.action.uid = 1//(Math.random() < 0.5 ? 1 : 2 );
        notify.action.times = 30;
        notify.action.round = 1;
        notify.action.type = 1;
        notify.action.maxtimes = 30
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
        let x = TableGeometry.tableX; // 1.39679
        let r = R //* 0.04421;
        // let pi180 = Math.PI / 180;

        let acos25 = 1.16723//17198700313//Math.acos(22.5 *  pi180);
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
                if (BilliardData.instance.is8Ball()) {
                    if (row === 1) {
                        ball.position.x = x/2;//设置首行1球坐标
                        ball.position.y = 0;
                      }
                      else {
                        let space =0// 0.001 //日后这里使用随机数取值则可保证 同样输入不同输出结果
                        // yy.log.w("随机值", space)
                        let y = (lNum+1)%2 === 0 ?  (r + space/2) +  (2*r + space) * (Math.ceil((lNum+1)/2)-1) : (2*r + space) * (Math.ceil((lNum+1)/2)-1);
                        ball.position.x = x/2 + (2 * r / acos25  +  0.001) * (row - 1);//设置其他球
                        ball.position.y = -y + (2 * r + space) * (lNum - cNum);
                      }
                      ball.rotation.x =  Math.random() * BilliardConst.multiple;
                      ball.rotation.y =  Math.random() * BilliardConst.multiple;
                      ball.rotation.z =  Math.random() * BilliardConst.multiple;
                      ball.rotation.w =  Math.random() * BilliardConst.multiple;
                
                      cNum += 1;
                      if (cNum - lNum === 1) {
                        row += 1;
                        lNum = cNum;
                        cNum = 0;
                      }
                }

                if (BilliardData.instance.is9Ball()) {
                    notify.balls[9].val = 5;
                    notify.balls[5].val = 9;
                    if (row === 1) {
                        ball.position.x = x/2;//设置首行1球坐标
                        ball.position.y = 0;
                      }
                      else {
                        let space = 0// 0.001 //日后这里使用随机数取值则可保证 同样输入不同输出结果
                        // yy.log.w("随机值", space)

                        function getY() {
                            if (row < 4) {
                                return (lNum+1)%2 === 0 ?  (r + space/2) +  (2*r + space) * (Math.ceil((lNum+1)/2)-1) : (2*r + space) * (Math.ceil((lNum+1)/2)-1);
                            }
                            else {
                                let tmp = row - 3;
                                return (tmp+1)%2 === 0 ?  (r + space/2) +  (2*r + space) * (Math.ceil((tmp+1)/2)-1) : (2*r + space) * (Math.ceil((tmp+1)/2)-1);
                            }

                        }

                        let y = getY();
                        ball.position.x = x/2 + (2 * r / acos25  +  0.001) * (row - 1);//设置其他球
                        let inc = row > 3 ? (row - 3) * (2 * r + space) * 2 : 0;
                        ball.position.y = -y + (2 * r + space) * (lNum - cNum ) - inc;

                      }
                      ball.rotation.x =  Math.random() * BilliardConst.multiple;
                      ball.rotation.y =  Math.random() * BilliardConst.multiple;
                      ball.rotation.z =  Math.random() * BilliardConst.multiple;
                      ball.rotation.w =  Math.random() * BilliardConst.multiple;
                
                      cNum += 1;
                      if (cNum - lNum === 1) {
                        row += 1;
                        lNum = cNum;
                        cNum = 0;
                      }else if (row > 3) {
                        if (row === 4)  {
                            if (cNum === 2) {
                                row += 1;
                                lNum = row;
                                cNum = 0;
                            }
                        }
                        
                      }
                }

                if (BilliardData.instance.isGuide()) {
                    // let cueBall = notify.balls[0];
                    // cueBall.position.x = -1.185;
                    ball.position.x = 1.369;
                    ball.position.y = 0.632;


                    ball.rotation.x =  Math.random() * BilliardConst.multiple;
                    ball.rotation.y =  Math.random() * BilliardConst.multiple;
                    ball.rotation.z =  Math.random() * BilliardConst.multiple;
                    ball.rotation.w =  Math.random() * BilliardConst.multiple;
                
                }


            }
        }


        for(let i = 0; i < notify.balls.length; ++i) {
            let ball = notify.balls[i];
            ball.position.x =  Math.ceil(ball.position.x * BilliardConst.multiple);
            ball.position.y =  Math.ceil(ball.position.y * BilliardConst.multiple);
        }

        BilliardManager.instance.setRules();
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
        notify.angle = billiardData.getAngle() * BilliardConst.multiple;
        notify.power = billiardData.getPower() * BilliardConst.multiple;
        notify.offset = new protoBilliard.IPosition();
        notify.offset.y = billiardData.getOffset().y * BilliardConst.multiple;
        notify.offset.x = billiardData.getOffset().x * BilliardConst.multiple;

        this.delayAction(() => {
            BilliardService.instance.notifyHit({msg: notify});
         });
    }
    

    notifyResult(req: protoBilliard.IResult) {
        let notify = new protoBilliard.IValidResult();
        notify.code = 0;
        notify.validResult = req;

        this.delayAction(() => {
            BilliardService.instance.notifyResult({msg: notify});
        });
    }


    notifyAction(req: protoBilliard.IAction) {
        let notify = req//new protoBilliard.IAction();
        notify.maxtimes = 30;
        this.delayAction(() => {
            BilliardService.instance.notifyAction({msg: notify});
        });
    }

    notifyReconnect() {
        let notify = new protoBilliard.GameStatus();
        notify.stage = 3;
        notify.gamePlay = 8;
        notify.validResult = new protoBilliard.IResult();
        notify.validResult.type = 2;
        notify.validResult.potBalls = [3, 6, 12, 13, 15];
        notify.validResult.balls = [];
        function getBall(val, x, y,  wX, wY, wZ, wW) {
            let ball = new protoBilliard.IBall();
            ball.val = val;
            ball.position = new protoBilliard.IPosition();
            ball.position.x = x;
            ball.position.y = y;
            ball.rotation = new protoBilliard.IRotation();
            ball.rotation.x = wX;
            ball.rotation.y = wY;
            ball.rotation.z = wZ;
            ball.rotation.w = wW;
            return ball;
        }
        notify.validResult.balls.push(getBall(0, 101580, 61027, -85852, 4318, 36975, 35262));
        notify.validResult.balls.push(getBall(1, -98263, -54123, 558, -66981, 66458, 33113));
        notify.validResult.balls.push(getBall(2, 72339, 66915, -48702, -8956, 81935, -28887));
        notify.validResult.balls.push(getBall(4, 124802, -66279, -15498, -23520, 95939, 1553));
        notify.validResult.balls.push(getBall(5, -106341, -61008, -35319, 67749, 63888, 8997));
        notify.validResult.balls.push(getBall(7, 72805, 47419, 89741, 28479, 28326, -18252));
        notify.validResult.balls.push(getBall(8, -36376, -45964, -137, -60661, -26660, -74896));
        notify.validResult.balls.push(getBall(9, -125923, -19502, -72672, 20557, -19922, -62445));
        notify.validResult.balls.push(getBall(10, 10611, -63888, 37515, 17973, -84274, -34169));
        notify.validResult.balls.push(getBall(11, 34002, -54337, 27403, 85230, -41784, -15461));
        notify.validResult.balls.push(getBall(14, -84281, 52372, -75548, -4828, 41881, 50152));
        notify.validResult.hitType = 2;
        notify.validResult.round = 8;
        notify.validResult.tokenUid = 11025987;

        notify.action = new protoBilliard.IAction();
        notify.action.maxtimes = 30;
        notify.action.times = 30;
        notify.action.uid = 1;
        notify.action.type = 0;
        notify.action.hitcount = 1;
        
        notify.cueAngle = new protoBilliard.ICueAngle();
        notify.cueAngle.curScreenPos = new protoBilliard.IPosition();
        notify.cueAngle.curScreenPos.x = 81151;
        notify.cueAngle.curScreenPos.y = 51209;
        notify.cueAngle.lastScreenPos = new protoBilliard.IPosition();
        notify.cueAngle.lastScreenPos.x = 81181;
        notify.cueAngle.lastScreenPos.y = 50324;

        notify.hitReq = new protoBilliard.IHit();
        notify.hitReq.power = 349259;
        notify.hitReq.angle = 283878;
        notify.hitReq.offset = new protoBilliard.IPosition();
        notify.hitReq.offset.x = 0;
        notify.hitReq.offset.y = 0;

         notify.users = [];
         function getUser(uid, name) {
             let user = new protoBilliard.UserInfo();
             user.uid = uid;
             user.nick = name;
             return user;
         }
         notify.users.push(getUser(1, "Player"));
         notify.users.push(getUser(2, "AI"));

         notify.freeBall = new protoBilliard.IFreeBall();
         notify.freeBall.curPosition = new protoBilliard.IPosition();
         notify.freeBall.curPosition.x = 101580;
         notify.freeBall.curPosition.y = 61027;

         this.delayAction(() => {
            BilliardService.instance.notifyEnterGame({msg: notify});
        }, 5);
    }

}


