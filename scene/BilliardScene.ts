import { _decorator, Component, director, instantiate, JsonAsset, Node, Prefab, ResolutionPolicy, screen, view } from 'cc';
import { CasualCommonSceneBase } from '../../../casual_common/scripts/base/CasualCommonSceneBase';
import { yy } from '../../../../yy';
import BilliardEventConfig from '../config/BilliardEventConfig';
import { BilliardConst, eAudio, eRuleType, eUI } from '../config/BilliardConst';
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
import { IOnlineInfo } from '../../../../main/data/UserData';
import CasualMenuEventConfig from '../../../casual_common/module/menu/config/CasualMenuEventConfig';
import { CasualMenuButtonEnum, ICasualMenuButtonConfig } from '../../../casual_common/module/menu/config/CasualMenuConfig';
import { CasualMenuData } from '../../../casual_common/module/menu/data/CasualMenuData';
import { getEmojiPreloadConfog } from '../../../../common/props/scripts/EmojiPreloadConfog';
import { PreloadUtils } from '../../../../main/utils/PreloadUtils';
import { BilliardManager } from '../scripts/BilliardManager';
import { WalletErrorMgr } from '../../../../main/data/WalletErrorMgr';
const { ccclass, property } = _decorator;

@ccclass('BilliardScene')
export class BilliardScene extends CasualCommonSceneBase implements ITemplateGameServiceListener {
    @property([JsonAsset])
    protoJson: JsonAsset[] = [];


    levelData: ISubGameTableInfoItemData;
    
    get isGuide() {
        return BilliardTools.instance.isNeedGuide()
    }
    
    private commonBtnClickSound: ()=>void;
    async onLoad() {

        // view.setDesignResolutionSize(2341, 1080, ResolutionPolicy.FIXED_WIDTH + ResolutionPolicy.FIXED_HEIGHT);
        yy.scene.reset_scene_size(true)
        super.onLoad();
    }

    

    public register_event() {
        yy.event.addEventNameList(BilliardEventConfig);
        // 注册指定的监听方法，格式如下
        this.event_func_map = {
            [yy.Event_Name.Common_Enter_SubGame_Success] : "onLevelData",
            [yy.Event_Name.CasualProgressComplete]: "onProgressComplete",
            [yy.Event_Name.reconnect_game_table] : "reconnectGameTable",
            [yy.System_Event.Screen_Size_Changed]: "onScreenSizeChange",

            // [yy.Event_Name.PPSlotsEventClickHistory]: "onClickHistory",
            // [yy.Event_Name.reset_all_view]: 'onEventResetAllView',

            ['AccountService.OnlineStatus']: 'onlineStatus',
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

        this.addMenuConfig();

        this.preloadAssets();
        BilliardManager.instance.setScene(this);
    }


    addMenuConfig(){
        yy.event.addEventNameList(CasualMenuEventConfig); // 初始化事件配置
        let list :Array<ICasualMenuButtonConfig> = []
        list.push({type:CasualMenuButtonEnum.GAME_RULE,event: yy.Event_Name.on_click_game_rule,buttonText: "Rules"});
        list.push({type:CasualMenuButtonEnum.SETTING,event: yy.Event_Name.on_click_settings,  buttonText: "Settings"}),
        list.push({type:CasualMenuButtonEnum.EXIT_TO_LOBBY,event: yy.Event_Name.on_click_exit_to_lobby});
        list.push({type:CasualMenuButtonEnum.FULL_SCREEN, buttonText: "Full Screen"})
        list.push({type:CasualMenuButtonEnum.FULL_SCREEN_EXIT, buttonText: "Esc"})
        // list.push({type:CasualMenuButtonEnum.VOICE,event: null,backPannalAcitive: true,buttonText: "Sound"})

        // list.push({type:CasualMenuButtonEnum.RECORD_VERTICAL,event: yy.Event_Name.on_click_menu,buttonText: "Record", extendData: {gameKey: "piggytap", lock: true}})

        // list.push({type:CasualMenuButtonEnum.FULL_SCREEN, buttonText: "Full Screen"})
        // list.push({type:CasualMenuButtonEnum.FULL_SCREEN_EXIT, buttonText: "Esc"})

        CasualMenuData.instance().setButtonConfig(list)
        //支付打点上报
        // CasualMenuData.instance().setReportDepositEventId(PiggytapConst.DepositId);
    }


    // protected start(): void {
    //     // let clone = instantiate(this.prefabBilliard3D);
    //     // director.getScene().addChild(clone);
    //     // yy.toast.setToastRes('app_common', 'toast/view/toast_view');
    //     // BilliardManager.instance.setRules(eRuleType.EightBall);

    //     // BilliardTools.instance.playBgm();
    // }


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
        yy.event.removeEventNameList(CasualMenuEventConfig); // 初始化事件配置
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
            if (enterData.tid === -1) {// 教程标识
                BilliardData.instance.setTutorial(this.levelData.id);
            } 

            yy.log.w("BilliardScene onLevelData", this.levelData)
            if(this.isGuide){
                BilliardTools.instance.openGuideView()
            }

            BilliardData.instance.setAlgoVersion(this.levelData.minVersion); // 设置算法版本
        }
        else {
            yy.log.e("BilliardScene onLevelData", "enterType is RECONNECT", enterData)
            BilliardService.instance.setTid(enterData.tid );
            if (enterData.gameKey === "billiard8ball") {
                BilliardService.instance.setServiceName(8);
            }
            else if( enterData.gameKey === "billiard9ball") {
                BilliardService.instance.setServiceName(9);
            }
            this.levelData = null;
        }
    }

    onProgressComplete() {
        if (this.levelData != null) {
            if (this.isGuide) {
                BilliardService.instance.isStandAlone = true;
                BilliardData.instance.setGameType(0);
            }
            else {
                BilliardData.instance.setGameType(this.levelData.maxBetMoney);// 匹配时设置 为了退出返回大厅的标签，开始游戏也会设置
                BilliardService.instance.setServiceName(this.levelData.maxBetMoney);
                BilliardTools.instance.openMatchView(this.levelData, null);
            }
        }
        else {
            yy.log.w("onProgressComplete", "sendEnterByTable");
            BilliardService.instance.sendEnterByTable();
        }
        yy.event.emit(yy.Event_Name.billiard_table_init);
        yy.log.w("onProgressComplete", this.levelData)
    }


    loadingResource() {
        // 预设预加载资源
        let guidePath = "module/billiard_guide/view/p_billiard_guide" + BilliardData.instance.getTutorial();
        let pre = [
            "module/billiard_table/view/p_billiard_3d",
            eUI.HitPoint.toString(),
            eUI.Match.toString(),
            eUI.Wait.toString(),
            eUI.WaitEnter.toString(),
        ]
        if (this.isGuide) {
            pre.push(guidePath);
        }
        // 音效预加载资源
        let preSound:string[] = [
            eAudio.Match.toString(),
            eAudio.HeadRotate.toString(),
            eAudio.Turn.toString(),
            eAudio.Win.toString(),
            eAudio.Applause.toString(),
            eAudio.BallInPocket.toString(),
        ]
        const max = pre.length + preSound.length;
        let cur = 0;
        pre.forEach((name, i)=>{
            yy.loader.asyncLoadPrefab(BilliardConst.bundleName, name, (prefab)=>{
                if (name === pre[0]) { // 实例化3d对象
                    let clone = instantiate(prefab);
                    director.getScene().addChild(clone);
                    yy.toast.setToastRes('app_common', 'toast/view/toast_view');
            
                    BilliardTools.instance.playBgm();
                }
                
                if (i > 1) {
                    BilliardTools.instance.mapPerfab.set(name, prefab);
                }

                // if (name == eUI.Wait) {
                //     // 缓存当前帧实例化
                //     BilliardTools.instance.waitPerfab = prefab;
                // }
                // if (this.isGuide) {
                //     if (name === guidePath) {
                //         let clone = instantiate(prefab);
                //         this.get_scene_layer_popup().addChild(clone);
                //     }
                // }
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

    reconnectGameTable() {
        let pb = new protoAccount.OnlineStatusReq();
        yy.socket.send('AccountService.OnlineStatus', pb);
    }
    
    private onlineStatus(e_data: any){
        let online_info: IOnlineInfo = yy.user.getOnlineInfo();
        if (WalletErrorMgr.instance().checkIsWalletPlayAbnormal(online_info.code)) {
            let callback = ()=>{
                yy.event.emit(yy.Event_Name.CasualCommonQuit);
            }
            WalletErrorMgr.instance().showWalletErrorPopup(online_info.code, callback, callback)
        } else {
            if (online_info?.playStatus == null || e_data?.timeOut ){
                yy.event.emit(yy.Event_Name.CasualCommonQuit);
            }else if(online_info.playStatus == 0){
                yy.event.emit(yy.Event_Name.CasualCommonQuit);
            } else if(online_info.playStatus > 0){
                BilliardService.instance.sendEnterByTable();
                yy.user.resetOnlineInfo();
            }
        }
    }

    private preloadAssets() {
        let emojiList = getEmojiPreloadConfog();
        emojiList.push({abName: "app_lobby", filePath:"scene/lobby_scene"});
        PreloadUtils.addPreload(this.node, emojiList);
    }

    onScreenSizeChange() {
        yy.scene.reset_scene_size(true)
    }

}


