import { Vec3 } from "cc";

export const BilliardConst = {
    gameKey: "billiard",
    bundleName: "app_billiard",
    startPos: new Vec3(-0.75, 0, 0),
    gid: 60,
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