export let BilliardPbConfig = [
    // 快速开始
    {router: "BilliardAllocService.EnterByTable",  rsp: "protoBilliard.EnterRsp" },


    {router: "BilliardAllocService.Start",  rsp: "protoBilliard.EnterRsp" },
    {router: "BilliardAllocService.CueMove",  rsp: "protoBilliard.EnterRsp" },
    {router: "BilliardAllocService.CueAngle",  rsp: "protoBilliard.EnterRsp" },
    {router: "BilliardAllocService.Hit",  rsp: "protoBilliard.EnterRsp" },


    // 广播&通知
    {cmd: 0x48e1, rsp: "protoMiniGamePiggy.PiggyLoginRsp"}, // 登陆
    
]