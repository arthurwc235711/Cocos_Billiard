import { _decorator, Component, director, instantiate, JsonAsset, Node, Prefab } from 'cc';
import { CasualCommonSceneBase } from '../../../casual_common/scripts/base/CasualCommonSceneBase';
import { yy } from '../../../../yy';
import BilliardEventConfig from '../config/BilliardEventConfig';
import { BilliardManager } from '../scripts/BilliardManager';
import { BilliardConst, eRuleType } from '../config/BilliardConst';
import { GameMessageStack, ITemplateGameServiceListener } from '../../../../main/data/GameMessageStack';
import { BilliardService } from '../net/BilliardService';
import { BilliardPbConfig } from '../net/BilliardPbConfig';
import { BilliardReader } from '../net/BilliardReader';
import { BilliardWriter } from '../net/BilliardWriter';
import { ProtoHelper } from '../../../../../framework/socket/ProtoHelper';
import { BilliardTools } from '../scripts/BilliardTools';
import { SoundAudio } from '../../../../main/audio/SoundAudio';
import { GameEnterTypeEnum, IEnterGameEmitData, ISubGameTableInfoItemData } from '../../../../main/data/SubGameData';
import { BilliardData } from '../data/BilliardData';
const { ccclass, property } = _decorator;

@ccclass('BilliardScene')
export class BilliardScene extends CasualCommonSceneBase implements ITemplateGameServiceListener {
    @property(Prefab)
    prefabBilliard3D: Prefab = null;
    @property([JsonAsset])
    protoJson: JsonAsset[] = [];


    levelData: ISubGameTableInfoItemData;

    private commonBtnClickSound: ()=>void;
    async onLoad() {
        yy.scene.reset_scene_size(true)
        super.onLoad();

        
    }

    public register_event() {
        yy.event.addEventNameList(BilliardEventConfig);
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.Common_Enter_SubGame_Success] : "onLevelData",
            [yy.Event_Name.CasualProgressComplete]: "onProgressComplete",
            // [yy.Event_Name.PPSlotsEventClickHistory]: "onClickHistory",
            // [yy.Event_Name.reset_all_view]: 'onEventResetAllView',
        };
        super.register_event();
    }

    

    public on_init(): void {
        GameMessageStack.instance().setLogTag("[BilliardMsgStack]");
        GameMessageStack.instance().openLock();
        BilliardService.instance.setSceneScript(this);
        GameMessageStack.instance().setListener(BilliardService.instance);

        this.addGameScoketConfig();
        this.protoJson.forEach(info => {
            ProtoHelper.Ins.parseJsonData(info.json)
        })

        this.commonBtnClickSound = SoundAudio.clickGameSound;
        SoundAudio.clickGameSound = BilliardTools.instance.playSoundPress;

        this.loadingResource();
    }


    protected start(): void {
        let clone = instantiate(this.prefabBilliard3D);
        director.getScene().addChild(clone);
        yy.toast.setToastRes('app_common', 'toast/view/toast_view');
        BilliardManager.instance.setRules(eRuleType.EightBall);

        BilliardTools.instance.playBgm();
    }


    addGameScoketConfig() {
        yy.socket.add_pb_config_list(BilliardPbConfig);
        yy.socket.add_socket_reader('BilliardReader', new BilliardReader());
        yy.socket.add_socket_writer('BilliardWriter', new BilliardWriter());
    }

    removeGameSocketConfig() {
        yy.socket.remove_pb_config_list(BilliardPbConfig);
        yy.socket.remove_socket_reader('BilliardReader');
        yy.socket.remove_socket_writer('BilliardWriter');
    }

    on_uninit() {
        SoundAudio.clickGameSound = this.commonBtnClickSound;
        this.removeGameSocketConfig();
        yy.event.removeEventNameList(BilliardEventConfig);
        BilliardManager.instance.release();

        GameMessageStack.instance().release();
        BilliardService.instance.delete();
    }


    generateTimerOnce(callback: Function, elapsedTime: number): void {
        this.g_canvas.scheduleOnce(callback, elapsedTime);
    }
    clearAllTimer(): void {
        this.g_canvas.unscheduleAllCallbacks();
    }


    onLevelData(enterData: IEnterGameEmitData) {
        if (enterData.enterType !== GameEnterTypeEnum.RECONNECT) {
            this.levelData = enterData.tableInfo.data;
            yy.log.w("BilliardScene onLevelData", this.levelData)
            // BilliardTools.instance.openMatchView(enterData.tableInfo.data);
        }
        else {
            yy.log.e("BilliardScene onLevelData", "enterType is RECONNECT")
            this.levelData = null;
        }
    }

    onProgressComplete() {

        yy.log.w("onProgressComplete", this.levelData)
        if (this.levelData != null) {
            yy.log.w("------------")
            BilliardTools.instance.openMatchView(this.levelData, null);
        }
    }


    loadingResource() {
        // 预设预加载资源
        let pre = [
            "module/billiard_match/view/p_billiard_match",
        ]
        // 音效预加载资源
        let preSound = [
        ]
        const max = pre.length + preSound.length;
        let cur = 0;
        pre.forEach((name, i)=>{
            yy.loader.asyncLoadPrefab(BilliardConst.bundleName, name, (prefab)=>{
                cur ++;
                yy.event.emit(yy.Event_Name.billiard_loading_resource, cur/max);
            });
        })
    
        preSound.forEach((name, i)=>{
            yy.loader.asyncLoadAudioClip(BilliardConst.bundleName, name, (clip)=>{
                cur ++;
                yy.event.emit(yy.Event_Name.billiard_loading_resource, cur/max);
            })
        });
    }

}


