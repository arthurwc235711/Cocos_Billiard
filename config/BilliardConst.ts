import { Vec3 } from "cc";
import { IChatAnimConfig } from "../../../../common/props/scripts/interface";

export const BilliardConst = {
    // gameKey: "billiard",  // 8 ball 9ball 
    bundleName: "app_billiard",
    startPos: new Vec3(-0.75, 0, 0),
    gid8Ball: 47,
    gid9Ball: 48,
    multiple:100000,
}


export enum eRuleType {
    None,
    EightBall,
    NineBall,
}


export enum eOutcomeType {
    None,
    Continue,  // 继续击球
    Turn,      // 对方球权，
    FreeBall,  // 对方自由球
    Failed,    // 己方失败 —— 例如8球，误将8好球打入则对方直接胜利
    Win,       // 己方胜利
    StartPot8, // 开球进8球 重置
}


export enum eAudio {
    None,
    BGM = "audio/bgm/bgm",
    WindowClose = "audio/sound/Bt_Close",
    BtnPress = "audio/sound/Bt_Press",
    CountDown = "audio/sound/countDown",
    AngleSlider = "audio/sound/angleSlider",
    BallCollision = "audio/sound/ballCollision",
    BallInPocket = "audio/sound/ballInPocket",
    HitWeak = "audio/sound/hitWeak",
    HitStrong = "audio/sound/hitStrong",
    Win = "audio/sound/win",
    Applause = "audio/sound/applause",
    Turn = "audio/sound/turn",
    Match = "audio/sound/match",
    HeadRotate = "audio/sound/headRotate",
    FlyGold = "audio/sound/flyGold",
}

export enum eUI {
    None,
    Match = "module/billiard_match/view/p_billiard_match",
    Wait = "module/billiard_wait/view/p_billiard_wait",
    WaitEnter = "module/billiard_wait/view/p_billiard_wait_enter",
    HitPoint = "module/billiard_hitpoint/view/p_billiard_hit_point",
}

export const EmoAnimConfig: Map<number, IChatAnimConfig> = new Map<number, IChatAnimConfig>([
    [201, { name: "face",            animation: "face_ani"}],
    [202, { name: "face_baituo",     animation: "face_ani"}],
    [203, { name: "face_gaobudong",  animation: "face_ani"}],
    [204, { name: "face_haopai",     animation: "face_ani"}],
    [205, { name: "face_nanguo",     animation: "face_ani"}],
    [206, { name: "face_qishi",      animation: "face_qishi"}],
    [207, { name: "face_sorry",      animation: "face_sorry"}],
    [208, { name: "face_thanks",     animation: "face_ani"}],
    [209, { name: "face_what",       animation: "face_ani"}],
    [210, { name: "face_xiao",       animation: "fact_ani"}],
]);

export enum eReportEventId {
    e8BallGoBack = 104047,      //【返回】台球（8Ball）游戏内返回选场人数|
    e9BallGoBack = 104048,      //【返回】台球（9Ball）游戏内返回选场人数|

}