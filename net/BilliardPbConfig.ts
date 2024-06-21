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
    {cmd: 0x6006, rsp: "protoBilliard.GameStatus"}, // 请求桌子数据协议
    
]