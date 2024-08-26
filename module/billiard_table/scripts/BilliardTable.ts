import { _decorator, Component, Node, Prefab, screen } from 'cc';
import { track } from '../../../scripts/physics/track';
import { BaseCommonScript } from '../../../../../../main/base/BaseCommonScript';
import { yy } from '../../../../../../yy';
import { BilliardManager } from '../../../scripts/BilliardManager';
import { Table } from './Table';
const { ccclass, property } = _decorator;

@ccclass('BilliardTable')
export class BilliardTable extends BaseCommonScript {
    @property(Node)
    nodeBalls: Node = null;
    @property(Prefab)
    prefabBall: Prefab = null;

    table: Table

    public register_event(): void {
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.System_Event.Screen_Size_Changed]: "onScreenSizeChanged",
        };
        super.register_event();
      }
  
      public on_init(): void {
        const table = new Table();
        table.setUI(this)
        BilliardManager.instance.setTable(table);
  
        this.onScreenSizeChanged();
      }

  protected update(dt: number): void {
    track.updateInTrack(dt);
  }

    // 适配小于16:9 时屏幕尺寸
    onScreenSizeChanged() {
        const camera3d = BilliardManager.instance.camera3d;
        const ratio = 16/9;
        const aspectRatio = screen.windowSize.width / screen.windowSize.height;
        const oHeight = 1.05; // 原有16:9时尺寸
        const rHeight = screen.windowSize.width / ratio;
        // yy.log.w("onScreenSizeChange", screen.windowSize,  camera3d.orthoHeight, rHeight);
        const xs = screen.windowSize.height / rHeight;
        if (ratio > aspectRatio) {
          camera3d.orthoHeight = xs * oHeight;
        }
        else {
          camera3d.orthoHeight = oHeight;
        }
    }

}


