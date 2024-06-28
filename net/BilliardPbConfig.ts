export let BilliardPbConfig = [
    // 快速开始
    {router: "BilliardAllocService.EnterByTable",  rsp: "protoBilliard.EnterRsp" },

    {router: "BilliardService.EnterGame",  rsp: "protoBilliard.CommonRsp" },//请求桌子数据协议
    {router: "BilliardService.ClientEvent",  rsp: "protoBilliard.GameProtocol" },//游戏交互协议

    {router: "BilliardService.Ready",  rsp: "protoBilliard.CommonRsp" },
    {router: "BilliardService.Exit",  rsp: "protoBilliard.CommonRsp" },

    {router: "BilliardAllocService.Start",  rsp: "protoBilliard.EnterRsp" },
    {router: "BilliardAllocService.CueMove",  rsp: "protoBilliard.EnterRsp" },
    {router: "BilliardAllocService.CueAngle",  rsp: "protoBilliard.EnterRsp" },
    {router: "BilliardAllocService.Hit",  rsp: "protoBilliard.EnterRsp" },
    {router: "BilliardAllocService.Result",  rsp: "protoBilliard.EnterRsp" },
    {router: "BilliardAllocService.Action",  rsp: "protoBilliard.EnterRsp" },



    // 广播&通知
    {cmd: 0x6004, rsp: "protoBilliard.NotifyUserExit"}, // 退出桌子数据协议
    {cmd: 0x6011, rsp: "protoBilliard.GameStatus"}, // 请求桌子数据协议
    {cmd: 0x6012, rsp: "protoBilliard.IStart"}, // GC游戏开始 IStart
    {cmd: 0x6013, rsp: "protoBilliard.IAction"}, // GC令牌玩家 IAction
    {cmd: 0x6015, rsp: "protoBilliard.IFreeBall"}, // GC自由球 IFreeBall
    {cmd: 0x6017, rsp: "protoBilliard.ICueAngle"}, // GC角度操作 ICueAngle
    {cmd: 0x6019, rsp: "protoBilliard.IHit"}, // GC击球同步 IHit
    {cmd: 0x6021, rsp: "protoBilliard.IValidResult"}, // GC玩家操作结果 IValidResult
    {cmd: 0x6022, rsp: "protoBilliard.BroadcastGameResult"}, // 游戏协议 BroadcastGameResult
    {cmd: 0x6024, rsp: "protoBilliard.ChatMsg"}, // 聊天协议 ChatMsg
]