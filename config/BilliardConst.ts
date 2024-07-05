import { Vec3 } from "cc";

export const BilliardConst = {
    gameKey: "billiard",
    bundleName: "app_billiard",
    startPos: new Vec3(-0.75, 0, 0),
    gid: 47,
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