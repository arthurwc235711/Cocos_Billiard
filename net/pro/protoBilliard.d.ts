declare global {

	/** Namespace protoBilliard. */
	export namespace protoBilliard {

		/** Properties of a CommonRsp. */
		interface ICommonRsp{

			/** CommonRsp code */
			code?: (number | null);

			/** CommonRsp msg */
			msg?: (string | null);

		}

		/** Represents a CommonRsp. */
		class CommonRsp implements ICommonRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.ICommonRsp);

			/** CommonRsp code */
			public code: number | null;

			/** CommonRsp msg */
			public msg: string | null;

		}

		/** Properties of a billiardInfo. */
		interface IbilliardInfo{

			/** billiardInfo ballno */
			ballno?: (number | null);

			/** billiardInfo ballaxis */
			ballaxis?: (string | null);

		}

		/** Represents a billiardInfo. */
		class billiardInfo implements IbilliardInfo {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IbilliardInfo);

			/** billiardInfo ballno */
			public ballno: number | null;

			/** billiardInfo ballaxis */
			public ballaxis: string | null;

		}

		/** USER_STATUS enum. */
		enum USER_STATUS {
			User_Status_Idle = 0,
			User_Status_Sit = 1,
			User_Status_Ready = 2,
			User_Status_Gaming = 3,
			User_Status_Offline = 4,
			User_Status_Leave = 5,
		}

		/** Properties of a UserInfo. */
		interface IUserInfo{

			/** UserInfo uid */
			uid?: (number | null);

			/** UserInfo nick */
			nick?: (string | null);

			/** UserInfo icon */
			icon?: (string | null);

			/** UserInfo seat */
			seat?: (number | null);

			/** UserInfo vipLevel */
			vipLevel?: (number | null);

			/** UserInfo moneyBet */
			moneyBet?: (number | Long | null);

			/** UserInfo moneyTotal */
			moneyTotal?: (number | Long | null);

			/** UserInfo status */
			status?: (USER_STATUS | null);

			/** UserInfo isPlaying */
			isPlaying?: (boolean | null);

			/** UserInfo goalsinfo */
			goalsinfo?: (number[] | null);

			/** UserInfo wincount */
			wincount?: (number | null);

			/** UserInfo scoreboard */
			scoreboard?: (number | null);

			/** UserInfo currTurnHitCount */
			currTurnHitCount?: (number | null);

			/** UserInfo hitType */
			hitType?: (number | null);

		}

		/** Represents a UserInfo. */
		class UserInfo implements IUserInfo {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IUserInfo);

			/** UserInfo uid */
			public uid: number | null;

			/** UserInfo nick */
			public nick: string | null;

			/** UserInfo icon */
			public icon: string | null;

			/** UserInfo seat */
			public seat: number | null;

			/** UserInfo vipLevel */
			public vipLevel: number | null;

			/** UserInfo moneyBet */
			public moneyBet: number | Long | null;

			/** UserInfo moneyTotal */
			public moneyTotal: number | Long | null;

			/** UserInfo status */
			public status: USER_STATUS | null;

			/** UserInfo isPlaying */
			public isPlaying: boolean | null;

			/** UserInfo goalsinfo */
			public goalsinfo: number[] | null;

			/** UserInfo wincount */
			public wincount: number | null;

			/** UserInfo scoreboard */
			public scoreboard: number | null;

			/** UserInfo currTurnHitCount */
			public currTurnHitCount: number | null;

			/** UserInfo hitType */
			public hitType: number | null;

		}

		/** Properties of a BilliardsTableCfg. */
		interface IBilliardsTableCfg{

			/** BilliardsTableCfg Seq */
			Seq?: (number | null);

			/** BilliardsTableCfg SrvId */
			SrvId?: (number | null);

			/** BilliardsTableCfg TableMaxPlayerNum */
			TableMaxPlayerNum?: (number | null);

			/** BilliardsTableCfg MatchingPlayerNum */
			MatchingPlayerNum?: (number | null);

			/** BilliardsTableCfg BaseScore */
			BaseScore?: (number | Long | null);

			/** BilliardsTableCfg TableFee */
			TableFee?: (number | null);

			/** BilliardsTableCfg FlowRate */
			FlowRate?: (float | null);

			/** BilliardsTableCfg CarryLower */
			CarryLower?: (number | Long | null);

			/** BilliardsTableCfg CarryUpper */
			CarryUpper?: (number | Long | null);

			/** BilliardsTableCfg BallCount */
			BallCount?: (number | null);

		}

		/** Represents a BilliardsTableCfg. */
		class BilliardsTableCfg implements IBilliardsTableCfg {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBilliardsTableCfg);

			/** BilliardsTableCfg Seq */
			public Seq: number | null;

			/** BilliardsTableCfg SrvId */
			public SrvId: number | null;

			/** BilliardsTableCfg TableMaxPlayerNum */
			public TableMaxPlayerNum: number | null;

			/** BilliardsTableCfg MatchingPlayerNum */
			public MatchingPlayerNum: number | null;

			/** BilliardsTableCfg BaseScore */
			public BaseScore: number | Long | null;

			/** BilliardsTableCfg TableFee */
			public TableFee: number | null;

			/** BilliardsTableCfg FlowRate */
			public FlowRate: float | null;

			/** BilliardsTableCfg CarryLower */
			public CarryLower: number | Long | null;

			/** BilliardsTableCfg CarryUpper */
			public CarryUpper: number | Long | null;

			/** BilliardsTableCfg BallCount */
			public BallCount: number | null;

		}

		/** Properties of a PlayerResult. */
		interface IPlayerResult{

			/** PlayerResult uid */
			uid?: (number | null);

			/** PlayerResult seat */
			seat?: (number | null);

			/** PlayerResult nick */
			nick?: (string | null);

			/** PlayerResult icon */
			icon?: (string | null);

			/** PlayerResult moneyBet */
			moneyBet?: (number | Long | null);

			/** PlayerResult moneyWon */
			moneyWon?: (number | Long | null);

			/** PlayerResult moneyChange */
			moneyChange?: (number | Long | null);

			/** PlayerResult moneyFee */
			moneyFee?: (number | Long | null);

			/** PlayerResult moneyTotal */
			moneyTotal?: (number | Long | null);

			/** PlayerResult app */
			app?: (number | null);

			/** PlayerResult channelId */
			channelId?: (string | null);

			/** PlayerResult character */
			character?: (number | null);

			/** PlayerResult moneyTaxed */
			moneyTaxed?: (number | Long | null);

			/** PlayerResult gamePlay */
			gamePlay?: (number | null);

			/** PlayerResult playTimes */
			playTimes?: (number | null);

			/** PlayerResult winTimes */
			winTimes?: (number | null);

			/** PlayerResult strokesTimes */
			strokesTimes?: (number | null);

			/** PlayerResult winningStreakTimes */
			winningStreakTimes?: (number | null);

			/** PlayerResult oneShotClearingTimes */
			oneShotClearingTimes?: (number | null);

			/** PlayerResult goalCount */
			goalCount?: (number | null);

			/** PlayerResult goalsinfo */
			goalsinfo?: (number[] | null);

			/** PlayerResult scoreboard */
			scoreboard?: (number | null);

		}

		/** Represents a PlayerResult. */
		class PlayerResult implements IPlayerResult {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IPlayerResult);

			/** PlayerResult uid */
			public uid: number | null;

			/** PlayerResult seat */
			public seat: number | null;

			/** PlayerResult nick */
			public nick: string | null;

			/** PlayerResult icon */
			public icon: string | null;

			/** PlayerResult moneyBet */
			public moneyBet: number | Long | null;

			/** PlayerResult moneyWon */
			public moneyWon: number | Long | null;

			/** PlayerResult moneyChange */
			public moneyChange: number | Long | null;

			/** PlayerResult moneyFee */
			public moneyFee: number | Long | null;

			/** PlayerResult moneyTotal */
			public moneyTotal: number | Long | null;

			/** PlayerResult app */
			public app: number | null;

			/** PlayerResult channelId */
			public channelId: string | null;

			/** PlayerResult character */
			public character: number | null;

			/** PlayerResult moneyTaxed */
			public moneyTaxed: number | Long | null;

			/** PlayerResult gamePlay */
			public gamePlay: number | null;

			/** PlayerResult playTimes */
			public playTimes: number | null;

			/** PlayerResult winTimes */
			public winTimes: number | null;

			/** PlayerResult strokesTimes */
			public strokesTimes: number | null;

			/** PlayerResult winningStreakTimes */
			public winningStreakTimes: number | null;

			/** PlayerResult oneShotClearingTimes */
			public oneShotClearingTimes: number | null;

			/** PlayerResult goalCount */
			public goalCount: number | null;

			/** PlayerResult goalsinfo */
			public goalsinfo: number[] | null;

			/** PlayerResult scoreboard */
			public scoreboard: number | null;

		}

		/** Properties of a IPosition. */
		interface IIPosition{

			/** IPosition x */
			x?: (number | null);

			/** IPosition y */
			y?: (number | null);

		}

		/** Represents a IPosition. */
		class IPosition implements IIPosition {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIPosition);

			/** IPosition x */
			public x: number | null;

			/** IPosition y */
			public y: number | null;

		}

		/** Properties of a IRotation. */
		interface IIRotation{

			/** IRotation x */
			x?: (number | null);

			/** IRotation y */
			y?: (number | null);

			/** IRotation z */
			z?: (number | null);

			/** IRotation w */
			w?: (number | null);

		}

		/** Represents a IRotation. */
		class IRotation implements IIRotation {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIRotation);

			/** IRotation x */
			public x: number | null;

			/** IRotation y */
			public y: number | null;

			/** IRotation z */
			public z: number | null;

			/** IRotation w */
			public w: number | null;

		}

		/** Properties of a IBall. */
		interface IIBall{

			/** IBall val */
			val?: (number | null);

			/** IBall position */
			position?: (IPosition | null);

			/** IBall rotation */
			rotation?: (IRotation | null);

		}

		/** Represents a IBall. */
		class IBall implements IIBall {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIBall);

			/** IBall val */
			public val: number | null;

			/** IBall position */
			public position: IPosition | null;

			/** IBall rotation */
			public rotation: IRotation | null;

		}

		/** Properties of a IAction. */
		interface IIAction{

			/** IAction uid */
			uid?: (number | null);

			/** IAction times */
			times?: (number | null);

			/** IAction type */
			type?: (number | null);

			/** IAction round */
			round?: (number | null);

			/** IAction maxtimes */
			maxtimes?: (number | null);

			/** IAction hitcount */
			hitcount?: (number | null);

		}

		/** Represents a IAction. */
		class IAction implements IIAction {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIAction);

			/** IAction uid */
			public uid: number | null;

			/** IAction times */
			public times: number | null;

			/** IAction type */
			public type: number | null;

			/** IAction round */
			public round: number | null;

			/** IAction maxtimes */
			public maxtimes: number | null;

			/** IAction hitcount */
			public hitcount: number | null;

		}

		/** Properties of a IStart. */
		interface IIStart{

			/** IStart balls */
			balls?: (IBall[] | null);

			/** IStart action */
			action?: (IAction | null);

			/** IStart gamePlay */
			gamePlay?: (number | null);

			/** IStart chipPot */
			chipPot?: (number | null);

		}

		/** Represents a IStart. */
		class IStart implements IIStart {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIStart);

			/** IStart balls */
			public balls: IBall[] | null;

			/** IStart action */
			public action: IAction | null;

			/** IStart gamePlay */
			public gamePlay: number | null;

			/** IStart chipPot */
			public chipPot: number | null;

		}

		/** Properties of a IFreeBall. */
		interface IIFreeBall{

			/** IFreeBall curPosition */
			curPosition?: (IPosition | null);

			/** IFreeBall lastPosition */
			lastPosition?: (IPosition | null);

		}

		/** Represents a IFreeBall. */
		class IFreeBall implements IIFreeBall {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIFreeBall);

			/** IFreeBall curPosition */
			public curPosition: IPosition | null;

			/** IFreeBall lastPosition */
			public lastPosition: IPosition | null;

		}

		/** Properties of a ICueAngle. */
		interface IICueAngle{

			/** ICueAngle curScreenPos */
			curScreenPos?: (IPosition | null);

			/** ICueAngle lastScreenPos */
			lastScreenPos?: (IPosition | null);

		}

		/** Represents a ICueAngle. */
		class ICueAngle implements IICueAngle {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IICueAngle);

			/** ICueAngle curScreenPos */
			public curScreenPos: IPosition | null;

			/** ICueAngle lastScreenPos */
			public lastScreenPos: IPosition | null;

		}

		/** Properties of a ICueOffset. */
		interface IICueOffset{

			/** ICueOffset curOffset */
			curOffset?: (IPosition | null);

			/** ICueOffset lastOffset */
			lastOffset?: (IPosition | null);

		}

		/** Represents a ICueOffset. */
		class ICueOffset implements IICueOffset {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IICueOffset);

			/** ICueOffset curOffset */
			public curOffset: IPosition | null;

			/** ICueOffset lastOffset */
			public lastOffset: IPosition | null;

		}

		/** Properties of a IHit. */
		interface IIHit{

			/** IHit power */
			power?: (number | null);

			/** IHit angle */
			angle?: (number | null);

			/** IHit offset */
			offset?: (IPosition | null);

		}

		/** Represents a IHit. */
		class IHit implements IIHit {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIHit);

			/** IHit power */
			public power: number | null;

			/** IHit angle */
			public angle: number | null;

			/** IHit offset */
			public offset: IPosition | null;

		}

		/** OutcomeType enum. */
		enum OutcomeType {
			none = 0,
			continueHit = 1,
			turn = 2,
			freeBall = 3,
			failed = 4,
			win = 5,
			tee = 6,
		}

		/** Properties of a IResult. */
		interface IIResult{

			/** IResult type */
			type?: (number | null);

			/** IResult potBalls */
			potBalls?: (number[] | null);

			/** IResult balls */
			balls?: (IBall[] | null);

			/** IResult hitType */
			hitType?: (number | null);

		}

		/** Represents a IResult. */
		class IResult implements IIResult {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIResult);

			/** IResult type */
			public type: number | null;

			/** IResult potBalls */
			public potBalls: number[] | null;

			/** IResult balls */
			public balls: IBall[] | null;

			/** IResult hitType */
			public hitType: number | null;

		}

		/** Properties of a IValidResult. */
		interface IIValidResult{

			/** IValidResult code */
			code?: (number | null);

			/** IValidResult validResult */
			validResult?: (IResult | null);

		}

		/** Represents a IValidResult. */
		class IValidResult implements IIValidResult {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIValidResult);

			/** IValidResult code */
			public code: number | null;

			/** IValidResult validResult */
			public validResult: IResult | null;

		}

		/** Properties of a IReconnection. */
		interface IIReconnection{

			/** IReconnection potBalls */
			potBalls?: (number[] | null);

			/** IReconnection balls */
			balls?: (IBall[] | null);

			/** IReconnection cueAngle */
			cueAngle?: (ICueAngle | null);

			/** IReconnection hitType */
			hitType?: (number | null);

			/** IReconnection action */
			action?: (IAction | null);

		}

		/** Represents a IReconnection. */
		class IReconnection implements IIReconnection {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIReconnection);

			/** IReconnection potBalls */
			public potBalls: number[] | null;

			/** IReconnection balls */
			public balls: IBall[] | null;

			/** IReconnection cueAngle */
			public cueAngle: ICueAngle | null;

			/** IReconnection hitType */
			public hitType: number | null;

			/** IReconnection action */
			public action: IAction | null;

		}

		/** Properties of a GameStatus. */
		interface IGameStatus{

			/** GameStatus tid */
			tid?: (number | Long | null);

			/** GameStatus configId */
			configId?: (number | null);

			/** GameStatus stage */
			stage?: (number | null);

			/** GameStatus users */
			users?: (UserInfo[] | null);

			/** GameStatus gamePlay */
			gamePlay?: (number | null);

			/** GameStatus chipPot */
			chipPot?: (number | null);

			/** GameStatus hitReq */
			hitReq?: (IHit | null);

			/** GameStatus validResult */
			validResult?: (IResult | null);

			/** GameStatus action */
			action?: (IAction | null);

			/** GameStatus freeBall */
			freeBall?: (IFreeBall | null);

			/** GameStatus cueAngle */
			cueAngle?: (ICueAngle | null);

			/** GameStatus cueOffset */
			cueOffset?: (ICueOffset | null);

		}

		/** Represents a GameStatus. */
		class GameStatus implements IGameStatus {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IGameStatus);

			/** GameStatus tid */
			public tid: number | Long | null;

			/** GameStatus configId */
			public configId: number | null;

			/** GameStatus stage */
			public stage: number | null;

			/** GameStatus users */
			public users: UserInfo[] | null;

			/** GameStatus gamePlay */
			public gamePlay: number | null;

			/** GameStatus chipPot */
			public chipPot: number | null;

			/** GameStatus hitReq */
			public hitReq: IHit | null;

			/** GameStatus validResult */
			public validResult: IResult | null;

			/** GameStatus action */
			public action: IAction | null;

			/** GameStatus freeBall */
			public freeBall: IFreeBall | null;

			/** GameStatus cueAngle */
			public cueAngle: ICueAngle | null;

			/** GameStatus cueOffset */
			public cueOffset: ICueOffset | null;

		}

		/** Properties of a IHitTimeOut. */
		interface IIHitTimeOut{

			/** IHitTimeOut uid */
			uid?: (number | null);

			/** IHitTimeOut code */
			code?: (number | null);

		}

		/** Represents a IHitTimeOut. */
		class IHitTimeOut implements IIHitTimeOut {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IIHitTimeOut);

			/** IHitTimeOut uid */
			public uid: number | null;

			/** IHitTimeOut code */
			public code: number | null;

		}

		/** Properties of a NotifyFoulAction. */
		interface INotifyFoulAction{

			/** NotifyFoulAction uid */
			uid?: (number | null);

			/** NotifyFoulAction count */
			count?: (number | null);

			/** NotifyFoulAction code */
			code?: (number | null);

		}

		/** Represents a NotifyFoulAction. */
		class NotifyFoulAction implements INotifyFoulAction {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.INotifyFoulAction);

			/** NotifyFoulAction uid */
			public uid: number | null;

			/** NotifyFoulAction count */
			public count: number | null;

			/** NotifyFoulAction code */
			public code: number | null;

		}

		/** Properties of a MatchingReq. */
		interface IMatchingReq{

			/** MatchingReq basescore */
			basescore?: (number | Long | null);

			/** MatchingReq ballcount */
			ballcount?: (number | Long | null);

			/** MatchingReq uid */
			uid?: (number | null);

			/** MatchingReq accSrvId */
			accSrvId?: (number | null);

			/** MatchingReq seq */
			seq?: (number | null);

			/** MatchingReq ip */
			ip?: (string | null);

			/** MatchingReq seat */
			seat?: (number | null);

			/** MatchingReq notEnter */
			notEnter?: (boolean | null);

			/** MatchingReq sync */
			sync?: (boolean | null);

			/** MatchingReq minCarry */
			minCarry?: (number | Long | null);

			/** MatchingReq maxCarry */
			maxCarry?: (number | Long | null);

			/** MatchingReq seatNumber */
			seatNumber?: (number | null);

			/** MatchingReq matchingUserCount */
			matchingUserCount?: (number | null);

			/** MatchingReq appId */
			appId?: (number | null);

			/** MatchingReq channelId */
			channelId?: (string | null);

			/** MatchingReq RemoteIP */
			RemoteIP?: (string | null);

			/** MatchingReq MatchingScore */
			MatchingScore?: (number | null);

			/** MatchingReq MatchingTime */
			MatchingTime?: (number | Long | null);

			/** MatchingReq MatchingPower */
			MatchingPower?: (number | Long | null);

		}

		/** Represents a MatchingReq. */
		class MatchingReq implements IMatchingReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IMatchingReq);

			/** MatchingReq basescore */
			public basescore: number | Long | null;

			/** MatchingReq ballcount */
			public ballcount: number | Long | null;

			/** MatchingReq uid */
			public uid: number | null;

			/** MatchingReq accSrvId */
			public accSrvId: number | null;

			/** MatchingReq seq */
			public seq: number | null;

			/** MatchingReq ip */
			public ip: string | null;

			/** MatchingReq seat */
			public seat: number | null;

			/** MatchingReq notEnter */
			public notEnter: boolean | null;

			/** MatchingReq sync */
			public sync: boolean | null;

			/** MatchingReq minCarry */
			public minCarry: number | Long | null;

			/** MatchingReq maxCarry */
			public maxCarry: number | Long | null;

			/** MatchingReq seatNumber */
			public seatNumber: number | null;

			/** MatchingReq matchingUserCount */
			public matchingUserCount: number | null;

			/** MatchingReq appId */
			public appId: number | null;

			/** MatchingReq channelId */
			public channelId: string | null;

			/** MatchingReq RemoteIP */
			public RemoteIP: string | null;

			/** MatchingReq MatchingScore */
			public MatchingScore: number | null;

			/** MatchingReq MatchingTime */
			public MatchingTime: number | Long | null;

			/** MatchingReq MatchingPower */
			public MatchingPower: number | Long | null;

		}

		/** Properties of a EnterReq. */
		interface IEnterReq{

			/** EnterReq antes */
			antes?: (number | Long | null);

			/** EnterReq tid */
			tid?: (number | Long | null);

			/** EnterReq uid */
			uid?: (number | null);

			/** EnterReq accSrvId */
			accSrvId?: (number | null);

			/** EnterReq seq */
			seq?: (number | null);

			/** EnterReq ip */
			ip?: (string | null);

			/** EnterReq seat */
			seat?: (number | null);

			/** EnterReq notEnter */
			notEnter?: (boolean | null);

			/** EnterReq sync */
			sync?: (boolean | null);

			/** EnterReq tableMoney */
			tableMoney?: (number | Long | null);

			/** EnterReq practice */
			practice?: (boolean | null);

		}

		/** Represents a EnterReq. */
		class EnterReq implements IEnterReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IEnterReq);

			/** EnterReq antes */
			public antes: number | Long | null;

			/** EnterReq tid */
			public tid: number | Long | null;

			/** EnterReq uid */
			public uid: number | null;

			/** EnterReq accSrvId */
			public accSrvId: number | null;

			/** EnterReq seq */
			public seq: number | null;

			/** EnterReq ip */
			public ip: string | null;

			/** EnterReq seat */
			public seat: number | null;

			/** EnterReq notEnter */
			public notEnter: boolean | null;

			/** EnterReq sync */
			public sync: boolean | null;

			/** EnterReq tableMoney */
			public tableMoney: number | Long | null;

			/** EnterReq practice */
			public practice: boolean | null;

		}

		/** Properties of a EnterRsp. */
		interface IEnterRsp{

			/** EnterRsp code */
			code?: (number | null);

			/** EnterRsp gameStatus */
			gameStatus?: (GameStatus | null);

			/** EnterRsp tid */
			tid?: (number | Long | null);

			/** EnterRsp antes */
			antes?: (number | Long | null);

		}

		/** Represents a EnterRsp. */
		class EnterRsp implements IEnterRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IEnterRsp);

			/** EnterRsp code */
			public code: number | null;

			/** EnterRsp gameStatus */
			public gameStatus: GameStatus | null;

			/** EnterRsp tid */
			public tid: number | Long | null;

			/** EnterRsp antes */
			public antes: number | Long | null;

		}

		/** Properties of a ExitReq. */
		interface IExitReq{

			/** ExitReq uid */
			uid?: (number | null);

		}

		/** Represents a ExitReq. */
		class ExitReq implements IExitReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IExitReq);

			/** ExitReq uid */
			public uid: number | null;

		}

		/** Properties of a SitReq. */
		interface ISitReq{

			/** SitReq seat */
			seat?: (number | null);

		}

		/** Represents a SitReq. */
		class SitReq implements ISitReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.ISitReq);

			/** SitReq seat */
			public seat: number | null;

		}

		/** Properties of a EnterGameReq. */
		interface IEnterGameReq{

			/** EnterGameReq uid */
			uid?: (number | null);

		}

		/** Represents a EnterGameReq. */
		class EnterGameReq implements IEnterGameReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IEnterGameReq);

			/** EnterGameReq uid */
			public uid: number | null;

		}

		/** Properties of a StandReq. */
		interface IStandReq{

			/** StandReq uid */
			uid?: (number | null);

		}

		/** Represents a StandReq. */
		class StandReq implements IStandReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IStandReq);

			/** StandReq uid */
			public uid: number | null;

		}

		/** Properties of a ReadyReq. */
		interface IReadyReq{

			/** ReadyReq uid */
			uid?: (number | null);

		}

		/** Represents a ReadyReq. */
		class ReadyReq implements IReadyReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IReadyReq);

			/** ReadyReq uid */
			public uid: number | null;

		}

		/** Properties of a BroadcastUserReady. */
		interface IBroadcastUserReady{

			/** BroadcastUserReady uid */
			uid?: (number | null);

			/** BroadcastUserReady seat */
			seat?: (number | null);

			/** BroadcastUserReady ready */
			ready?: (number | null);

		}

		/** Represents a BroadcastUserReady. */
		class BroadcastUserReady implements IBroadcastUserReady {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastUserReady);

			/** BroadcastUserReady uid */
			public uid: number | null;

			/** BroadcastUserReady seat */
			public seat: number | null;

			/** BroadcastUserReady ready */
			public ready: number | null;

		}

		/** Properties of a ForeBackstageReq. */
		interface IForeBackstageReq{

			/** ForeBackstageReq uid */
			uid?: (number | null);

			/** ForeBackstageReq status */
			status?: (number | null);

		}

		/** Represents a ForeBackstageReq. */
		class ForeBackstageReq implements IForeBackstageReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IForeBackstageReq);

			/** ForeBackstageReq uid */
			public uid: number | null;

			/** ForeBackstageReq status */
			public status: number | null;

		}

		/** Properties of a NotifyUserNetStatus. */
		interface INotifyUserNetStatus{

			/** NotifyUserNetStatus uid */
			uid?: (number | null);

			/** NotifyUserNetStatus status */
			status?: (number | null);

			/** NotifyUserNetStatus timer */
			timer?: (number | null);

		}

		/** Represents a NotifyUserNetStatus. */
		class NotifyUserNetStatus implements INotifyUserNetStatus {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.INotifyUserNetStatus);

			/** NotifyUserNetStatus uid */
			public uid: number | null;

			/** NotifyUserNetStatus status */
			public status: number | null;

			/** NotifyUserNetStatus timer */
			public timer: number | null;

		}

		/** Properties of a ChatReq. */
		interface IChatReq{

			/** ChatReq receiverUid */
			receiverUid?: (number[] | null);

			/** ChatReq msgType */
			msgType?: (number | null);

			/** ChatReq contentId */
			contentId?: (number | null);

			/** ChatReq contentData */
			contentData?: (string | null);

		}

		/** Represents a ChatReq. */
		class ChatReq implements IChatReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IChatReq);

			/** ChatReq receiverUid */
			public receiverUid: number[] | null;

			/** ChatReq msgType */
			public msgType: number | null;

			/** ChatReq contentId */
			public contentId: number | null;

			/** ChatReq contentData */
			public contentData: string | null;

		}

		/** Properties of a ChatMsg. */
		interface IChatMsg{

			/** ChatMsg senderUid */
			senderUid?: (number | null);

			/** ChatMsg receiverUid */
			receiverUid?: (number[] | null);

			/** ChatMsg msgType */
			msgType?: (number | null);

			/** ChatMsg contentId */
			contentId?: (number | null);

			/** ChatMsg contentData */
			contentData?: (string | null);

		}

		/** Represents a ChatMsg. */
		class ChatMsg implements IChatMsg {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IChatMsg);

			/** ChatMsg senderUid */
			public senderUid: number | null;

			/** ChatMsg receiverUid */
			public receiverUid: number[] | null;

			/** ChatMsg msgType */
			public msgType: number | null;

			/** ChatMsg contentId */
			public contentId: number | null;

			/** ChatMsg contentData */
			public contentData: string | null;

		}

		/** Properties of a GetStandingUsersReq. */
		interface IGetStandingUsersReq{

			/** GetStandingUsersReq tid */
			tid?: (number | Long | null);

		}

		/** Represents a GetStandingUsersReq. */
		class GetStandingUsersReq implements IGetStandingUsersReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IGetStandingUsersReq);

			/** GetStandingUsersReq tid */
			public tid: number | Long | null;

		}

		/** Properties of a GetStandingUsersRsp. */
		interface IGetStandingUsersRsp{

			/** GetStandingUsersRsp code */
			code?: (number | null);

			/** GetStandingUsersRsp users */
			users?: (UserInfo[] | null);

		}

		/** Represents a GetStandingUsersRsp. */
		class GetStandingUsersRsp implements IGetStandingUsersRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IGetStandingUsersRsp);

			/** GetStandingUsersRsp code */
			public code: number | null;

			/** GetStandingUsersRsp users */
			public users: UserInfo[] | null;

		}

		/** Properties of a BroadcastGameResult. */
		interface IBroadcastGameResult{

			/** BroadcastGameResult logId */
			logId?: (string | null);

			/** BroadcastGameResult winnerid */
			winnerid?: (number | null);

			/** BroadcastGameResult ChipPot */
			ChipPot?: (number | Long | null);

			/** BroadcastGameResult playerResult */
			playerResult?: (PlayerResult[] | null);

			/** BroadcastGameResult tablecfg */
			tablecfg?: (BilliardsTableCfg | null);

		}

		/** Represents a BroadcastGameResult. */
		class BroadcastGameResult implements IBroadcastGameResult {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastGameResult);

			/** BroadcastGameResult logId */
			public logId: string | null;

			/** BroadcastGameResult winnerid */
			public winnerid: number | null;

			/** BroadcastGameResult ChipPot */
			public ChipPot: number | Long | null;

			/** BroadcastGameResult playerResult */
			public playerResult: PlayerResult[] | null;

			/** BroadcastGameResult tablecfg */
			public tablecfg: BilliardsTableCfg | null;

		}

		/** Properties of a BroadcastUserSit. */
		interface IBroadcastUserSit{

			/** BroadcastUserSit user */
			user?: (UserInfo | null);

		}

		/** Represents a BroadcastUserSit. */
		class BroadcastUserSit implements IBroadcastUserSit {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastUserSit);

			/** BroadcastUserSit user */
			public user: UserInfo | null;

		}

		/** Properties of a BroadcastUserStand. */
		interface IBroadcastUserStand{

			/** BroadcastUserStand uid */
			uid?: (number | null);

			/** BroadcastUserStand seat */
			seat?: (number | null);

			/** BroadcastUserStand isUserStand */
			isUserStand?: (boolean | null);

		}

		/** Represents a BroadcastUserStand. */
		class BroadcastUserStand implements IBroadcastUserStand {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastUserStand);

			/** BroadcastUserStand uid */
			public uid: number | null;

			/** BroadcastUserStand seat */
			public seat: number | null;

			/** BroadcastUserStand isUserStand */
			public isUserStand: boolean | null;

		}

		/** Properties of a NotifyUserExit. */
		interface INotifyUserExit{

			/** NotifyUserExit reason */
			reason?: (number | null);

		}

		/** Represents a NotifyUserExit. */
		class NotifyUserExit implements INotifyUserExit {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.INotifyUserExit);

			/** NotifyUserExit reason */
			public reason: number | null;

		}

		/** Properties of a BroadcastStandingNumberUpdate. */
		interface IBroadcastStandingNumberUpdate{

			/** BroadcastStandingNumberUpdate number */
			number?: (number | null);

		}

		/** Represents a BroadcastStandingNumberUpdate. */
		class BroadcastStandingNumberUpdate implements IBroadcastStandingNumberUpdate {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastStandingNumberUpdate);

			/** BroadcastStandingNumberUpdate number */
			public number: number | null;

		}

		/** Properties of a BroadcastUserMoneyUpdate. */
		interface IBroadcastUserMoneyUpdate{

			/** BroadcastUserMoneyUpdate uid */
			uid?: (number | null);

			/** BroadcastUserMoneyUpdate seat */
			seat?: (number | null);

			/** BroadcastUserMoneyUpdate moneyCarrying */
			moneyCarrying?: (number | Long | null);

			/** BroadcastUserMoneyUpdate moneyTotal */
			moneyTotal?: (number | Long | null);

			/** BroadcastUserMoneyUpdate moneyFree */
			moneyFree?: (number | Long | null);

		}

		/** Represents a BroadcastUserMoneyUpdate. */
		class BroadcastUserMoneyUpdate implements IBroadcastUserMoneyUpdate {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastUserMoneyUpdate);

			/** BroadcastUserMoneyUpdate uid */
			public uid: number | null;

			/** BroadcastUserMoneyUpdate seat */
			public seat: number | null;

			/** BroadcastUserMoneyUpdate moneyCarrying */
			public moneyCarrying: number | Long | null;

			/** BroadcastUserMoneyUpdate moneyTotal */
			public moneyTotal: number | Long | null;

			/** BroadcastUserMoneyUpdate moneyFree */
			public moneyFree: number | Long | null;

		}

		/** Properties of a BroadcastUserMessage. */
		interface IBroadcastUserMessage{

			/** BroadcastUserMessage senderUid */
			senderUid?: (number | null);

			/** BroadcastUserMessage senderSeat */
			senderSeat?: (number | null);

			/** BroadcastUserMessage senderLang */
			senderLang?: (string | null);

			/** BroadcastUserMessage receiverSeat */
			receiverSeat?: (number | null);

			/** BroadcastUserMessage msgType */
			msgType?: (number | null);

			/** BroadcastUserMessage contentId */
			contentId?: (number | null);

			/** BroadcastUserMessage contentData */
			contentData?: (string | null);

		}

		/** Represents a BroadcastUserMessage. */
		class BroadcastUserMessage implements IBroadcastUserMessage {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastUserMessage);

			/** BroadcastUserMessage senderUid */
			public senderUid: number | null;

			/** BroadcastUserMessage senderSeat */
			public senderSeat: number | null;

			/** BroadcastUserMessage senderLang */
			public senderLang: string | null;

			/** BroadcastUserMessage receiverSeat */
			public receiverSeat: number | null;

			/** BroadcastUserMessage msgType */
			public msgType: number | null;

			/** BroadcastUserMessage contentId */
			public contentId: number | null;

			/** BroadcastUserMessage contentData */
			public contentData: string | null;

		}

		/** Properties of a GameLog. */
		interface IGameLog{

			/** GameLog tid */
			tid?: (number | Long | null);

			/** GameLog antes */
			antes?: (number | Long | null);

			/** GameLog logId */
			logId?: (number | Long | null);

			/** GameLog startTime */
			startTime?: (number | Long | null);

			/** GameLog finishTime */
			finishTime?: (number | Long | null);

			/** GameLog players */
			players?: (PlayerResult[] | null);

			/** GameLog isStopped */
			isStopped?: (boolean | null);

			/** GameLog isPractice */
			isPractice?: (boolean | null);

			/** GameLog dealerTotalWin */
			dealerTotalWin?: (number | Long | null);

			/** GameLog gameId */
			gameId?: (number | null);

			/** GameLog level */
			level?: (number | null);

			/** GameLog gameplay */
			gameplay?: (number | null);

			/** GameLog tableFee */
			tableFee?: (number | null);

			/** GameLog gamereplay */
			gamereplay?: (Uint8Array | null);

		}

		/** Represents a GameLog. */
		class GameLog implements IGameLog {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IGameLog);

			/** GameLog tid */
			public tid: number | Long | null;

			/** GameLog antes */
			public antes: number | Long | null;

			/** GameLog logId */
			public logId: number | Long | null;

			/** GameLog startTime */
			public startTime: number | Long | null;

			/** GameLog finishTime */
			public finishTime: number | Long | null;

			/** GameLog players */
			public players: PlayerResult[] | null;

			/** GameLog isStopped */
			public isStopped: boolean | null;

			/** GameLog isPractice */
			public isPractice: boolean | null;

			/** GameLog dealerTotalWin */
			public dealerTotalWin: number | Long | null;

			/** GameLog gameId */
			public gameId: number | null;

			/** GameLog level */
			public level: number | null;

			/** GameLog gameplay */
			public gameplay: number | null;

			/** GameLog tableFee */
			public tableFee: number | null;

			/** GameLog gamereplay */
			public gamereplay: Uint8Array | null;

		}

		/** Properties of a TableListReq. */
		interface ITableListReq{

			/** TableListReq uid */
			uid?: (number | null);

			/** TableListReq Version */
			Version?: (number | Long | null);

		}

		/** Represents a TableListReq. */
		class TableListReq implements ITableListReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.ITableListReq);

			/** TableListReq uid */
			public uid: number | null;

			/** TableListReq Version */
			public Version: number | Long | null;

		}

		/** Properties of a TableInfo. */
		interface ITableInfo{

			/** TableInfo ID */
			ID?: (number | Long | null);

			/** TableInfo LevelMoney */
			LevelMoney?: (number | Long | null);

			/** TableInfo CarryLower */
			CarryLower?: (number | Long | null);

			/** TableInfo MaxPlayerCount */
			MaxPlayerCount?: (number | null);

		}

		/** Represents a TableInfo. */
		class TableInfo implements ITableInfo {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.ITableInfo);

			/** TableInfo ID */
			public ID: number | Long | null;

			/** TableInfo LevelMoney */
			public LevelMoney: number | Long | null;

			/** TableInfo CarryLower */
			public CarryLower: number | Long | null;

			/** TableInfo MaxPlayerCount */
			public MaxPlayerCount: number | null;

		}

		/** Properties of a TableListRsp. */
		interface ITableListRsp{

			/** TableListRsp code */
			code?: (number | null);

			/** TableListRsp data */
			data?: (TableInfo[] | null);

			/** TableListRsp msg */
			msg?: (string | null);

			/** TableListRsp NeedUpdate */
			NeedUpdate?: (boolean | null);

			/** TableListRsp Version */
			Version?: (number | Long | null);

		}

		/** Represents a TableListRsp. */
		class TableListRsp implements ITableListRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.ITableListRsp);

			/** TableListRsp code */
			public code: number | null;

			/** TableListRsp data */
			public data: TableInfo[] | null;

			/** TableListRsp msg */
			public msg: string | null;

			/** TableListRsp NeedUpdate */
			public NeedUpdate: boolean | null;

			/** TableListRsp Version */
			public Version: number | Long | null;

		}

		/** Properties of a GameProtocol. */
		interface IGameProtocol{

			/** GameProtocol Cmd */
			Cmd?: (number | null);

			/** GameProtocol TableId */
			TableId?: (number | Long | null);

			/** GameProtocol databody */
			databody?: (Uint8Array | null);

		}

		/** Represents a GameProtocol. */
		class GameProtocol implements IGameProtocol {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IGameProtocol);

			/** GameProtocol Cmd */
			public Cmd: number | null;

			/** GameProtocol TableId */
			public TableId: number | Long | null;

			/** GameProtocol databody */
			public databody: Uint8Array | null;

		}

		/** BILLIARD_GAME_STATUS enum. */
		enum BILLIARD_GAME_STATUS {
			BILLIARD_STU_INIT = 0,
			BILLIARD_STU_READY = 1,
			BILLIARD_STU_START = 2,
			BILLIARD_STU_PLAYING = 3,
			BILLIARD_STU_RESULT = 4,
			BILLIARD_STU_CONTINUE = 5,
		}

		/** Properties of a UserPlayBilliardDataReq. */
		interface IUserPlayBilliardDataReq{

			/** UserPlayBilliardDataReq uid */
			uid?: (number | null);

			/** UserPlayBilliardDataReq ballcount */
			ballcount?: (number[] | null);

		}

		/** Represents a UserPlayBilliardDataReq. */
		class UserPlayBilliardDataReq implements IUserPlayBilliardDataReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IUserPlayBilliardDataReq);

			/** UserPlayBilliardDataReq uid */
			public uid: number | null;

			/** UserPlayBilliardDataReq ballcount */
			public ballcount: number[] | null;

		}

		/** Properties of a UserPlayBilliardData. */
		interface IUserPlayBilliardData{

			/** UserPlayBilliardData gamePlay */
			gamePlay?: (number | null);

			/** UserPlayBilliardData matchTimes */
			matchTimes?: (number | null);

			/** UserPlayBilliardData winTimes */
			winTimes?: (number | null);

			/** UserPlayBilliardData winningStreak */
			winningStreak?: (number | null);

			/** UserPlayBilliardData sticksTimes */
			sticksTimes?: (number | null);

			/** UserPlayBilliardData goalCount */
			goalCount?: (number | null);

			/** UserPlayBilliardData oneShotClearing */
			oneShotClearing?: (number | null);

		}

		/** Represents a UserPlayBilliardData. */
		class UserPlayBilliardData implements IUserPlayBilliardData {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IUserPlayBilliardData);

			/** UserPlayBilliardData gamePlay */
			public gamePlay: number | null;

			/** UserPlayBilliardData matchTimes */
			public matchTimes: number | null;

			/** UserPlayBilliardData winTimes */
			public winTimes: number | null;

			/** UserPlayBilliardData winningStreak */
			public winningStreak: number | null;

			/** UserPlayBilliardData sticksTimes */
			public sticksTimes: number | null;

			/** UserPlayBilliardData goalCount */
			public goalCount: number | null;

			/** UserPlayBilliardData oneShotClearing */
			public oneShotClearing: number | null;

		}

		/** Properties of a UserPlayBilliardDataRsp. */
		interface IUserPlayBilliardDataRsp{

			/** UserPlayBilliardDataRsp uid */
			uid?: (number | null);

			/** UserPlayBilliardDataRsp nick */
			nick?: (string | null);

			/** UserPlayBilliardDataRsp icon */
			icon?: (string | null);

			/** UserPlayBilliardDataRsp Gid */
			Gid?: (number | null);

			/** UserPlayBilliardDataRsp datalist */
			datalist?: (UserPlayBilliardData[] | null);

		}

		/** Represents a UserPlayBilliardDataRsp. */
		class UserPlayBilliardDataRsp implements IUserPlayBilliardDataRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IUserPlayBilliardDataRsp);

			/** UserPlayBilliardDataRsp uid */
			public uid: number | null;

			/** UserPlayBilliardDataRsp nick */
			public nick: string | null;

			/** UserPlayBilliardDataRsp icon */
			public icon: string | null;

			/** UserPlayBilliardDataRsp Gid */
			public Gid: number | null;

			/** UserPlayBilliardDataRsp datalist */
			public datalist: UserPlayBilliardData[] | null;

		}

		/** Properties of a LogProtocol. */
		interface ILogProtocol{

			/** LogProtocol proid */
			proid?: (number | null);

			/** LogProtocol proname */
			proname?: (string | null);

			/** LogProtocol msg */
			msg?: (Uint8Array | null);

		}

		/** Represents a LogProtocol. */
		class LogProtocol implements ILogProtocol {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.ILogProtocol);

			/** LogProtocol proid */
			public proid: number | null;

			/** LogProtocol proname */
			public proname: string | null;

			/** LogProtocol msg */
			public msg: Uint8Array | null;

		}

		/** Properties of a LogPlayer. */
		interface ILogPlayer{

			/** LogPlayer uid */
			uid?: (number | null);

			/** LogPlayer nick */
			nick?: (string | null);

			/** LogPlayer icon */
			icon?: (string | null);

			/** LogPlayer gender */
			gender?: (number | null);

			/** LogPlayer chips */
			chips?: (number | Long | null);

			/** LogPlayer cid */
			cid?: (number | null);

		}

		/** Represents a LogPlayer. */
		class LogPlayer implements ILogPlayer {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.ILogPlayer);

			/** LogPlayer uid */
			public uid: number | null;

			/** LogPlayer nick */
			public nick: string | null;

			/** LogPlayer icon */
			public icon: string | null;

			/** LogPlayer gender */
			public gender: number | null;

			/** LogPlayer chips */
			public chips: number | Long | null;

			/** LogPlayer cid */
			public cid: number | null;

		}

		/** Properties of a LogMsg. */
		interface ILogMsg{

			/** LogMsg playerlist */
			playerlist?: (LogPlayer[] | null);

			/** LogMsg prolist */
			prolist?: (LogProtocol[] | null);

		}

		/** Represents a LogMsg. */
		class LogMsg implements ILogMsg {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.ILogMsg);

			/** LogMsg playerlist */
			public playerlist: LogPlayer[] | null;

			/** LogMsg prolist */
			public prolist: LogProtocol[] | null;

		}

	}
}
export {};