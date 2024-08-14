import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
import { BilliardSlotsCell } from './BilliardSlotsCell';
import { yy } from '../../../../../../yy';
const { ccclass, property } = _decorator;

@ccclass('BilliardSlotIcon')
export class BilliardSlotIcon extends Component {
    @property(Node)
    private container: Node = null;
    private scrollSpeed: number = 750; // 滚动速度
    private scrollSlowSpeed: number = 300
    private scrollTime: number = Number.MAX_VALUE; // 滚动时间
    private isScrolling: boolean = false;
    private deltaTime: number = 0;
   
    private nCell:number = 0;
    private slotsCells: BilliardSlotsCell[] = [];
  
    private slotsData: string;
  
    private nums = ["default_1", "default_2", "default_3", "default_4", "default_5", "default_6"];
    private nIndex = -1;
    protected onLoad(): void {
      // this.slotsCells = this.container.getComponentsInChildren(BilliardSlotsCell);
      this.nCell = this.slotsCells[0].getComponent(UITransform).height;

      // this.scheduleOnce(()=>{
      //   this.startScroll();
      // }, 3);
      // this.initSlots();
    }
  
    initSlots() {
      // this.slotsCells.forEach((v,i)=>{
      //   v.setData((3-i).toString());
      // });
      this.slotsCells = this.container.getComponentsInChildren(BilliardSlotsCell);
      this.slotsCells[2].setData(this.getIndexData(1));
      this.slotsCells[1].setData(this.getIndexData(2));
      this.slotsCells[0].setData(this.getIndexData(3));
      this.nIndex ++;
    }


    getIndexData(index: number) {
      const i = (this.nIndex + index) % this.nums.length;
      return this.nums[i];
    }
  
    private _startScroll() {
      if(this.isScrolling) return;
  
      this.initSlots();
      this.isScrolling = true;
      let onUpdate = (dt: number) => {
        this.deltaTime += dt;
        // yy.log.w(this.deltaTime, this.scrollTime)
        this.container.position = this.container.position.add3f(0, -1 * this.scrollSpeed * dt, 0);
  
          if (this.container.position.y <= -this.nCell * 1.5) {
            this.container.position = this.container.position.add3f(0, this.nCell, 0);

  
            this.slotsCells[2].setData(this.getIndexData(1));
            this.slotsCells[1].setData(this.getIndexData(2));
            this.slotsCells[0].setData(this.getIndexData(3));
            this.nIndex ++;
          }    
          if (this.deltaTime >= this.scrollTime) {
            if (this.container.position.y <= -this.nCell ) {
              this.container.position = this.container.position.add3f(0, this.nCell, 0);

    
              this.slotsCells[2].setData("1");
              this.slotsCells[1].setData("2");
              this.slotsCells[0].setData("3");
  
            }
  
            this.unschedule(onUpdate);
            this.stopScroll();
          }
        }
      
      
      this.schedule(onUpdate, 0);
  
    // 在需要开始滚动的时机调用 startScroll() 方法
    }
  
    stopScroll(url: string = "") {
      if (this.slotsData === undefined)  this.slotsData = url;
      this.isScrolling = false;
      this.unscheduleAllCallbacks();
      let times = 0;
      this.slotsCells[0].setData(this.slotsData);// = dis.toString();
      let onUpdate = (dt: number) => {
        this.deltaTime += dt;
        // yy.log.w(this.deltaTime, this.scrollTime)
        this.container.position = this.container.position.add3f(0, -1 * this.scrollSlowSpeed * dt, 0);
  
  
       
  
  
          if (this.container.position.y <= -this.nCell * 2) {
              this.container.position = new Vec3(this.container.position.x, -2 * this.nCell, 0);
              this.isScrolling = false;
              this.unschedule(onUpdate);
          }
      }
  
      this.schedule(onUpdate, 0);
    }
  
  
    onClickStart() {
      this.deltaTime = 0;
      this._startScroll();
    }
  
    onStartScroll(time: number, slotsData: string) {
      this.slotsData = slotsData;
      this.scrollTime = time;
      this.deltaTime = 0;
      this._startScroll();
    }
}


