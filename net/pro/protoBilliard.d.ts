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

		}

		/** Properties of a IStart. */
		interface IIStart{

			/** IStart balls */
			balls?: (IBall[] | null);

			/** IStart action */
			action?: (IAction | null);

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

			/** GameStatus actionUid */
			actionUid?: (number | null);

			/** GameStatus actionSeconds */
			actionSeconds?: (number | null);

			/** GameStatus balls */
			balls?: (IBall[] | null);

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

			/** GameStatus actionUid */
			public actionUid: number | null;

			/** GameStatus actionSeconds */
			public actionSeconds: number | null;

			/** GameStatus balls */
			public balls: IBall[] | null;

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

		/** Properties of a UserBroadcastReq. */
		interface IUserBroadcastReq{

			/** UserBroadcastReq senderUid */
			senderUid?: (number | null);

			/** UserBroadcastReq senderSeat */
			senderSeat?: (number | null);

			/** UserBroadcastReq senderLang */
			senderLang?: (string | null);

			/** UserBroadcastReq receiverSeat */
			receiverSeat?: (number | null);

			/** UserBroadcastReq msgType */
			msgType?: (number | null);

			/** UserBroadcastReq contentId */
			contentId?: (number | null);

			/** UserBroadcastReq contentData */
			contentData?: (string | null);

			/** UserBroadcastReq sendTime */
			sendTime?: (number | Long | null);

			/** UserBroadcastReq senderNick */
			senderNick?: (string | null);

			/** UserBroadcastReq senderIcon */
			senderIcon?: (string | null);

			/** UserBroadcastReq gameType */
			gameType?: (number | null);

			/** UserBroadcastReq tid */
			tid?: (number | Long | null);

			/** UserBroadcastReq receiverUid */
			receiverUid?: (number | null);

		}

		/** Represents a UserBroadcastReq. */
		class UserBroadcastReq implements IUserBroadcastReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IUserBroadcastReq);

			/** UserBroadcastReq senderUid */
			public senderUid: number | null;

			/** UserBroadcastReq senderSeat */
			public senderSeat: number | null;

			/** UserBroadcastReq senderLang */
			public senderLang: string | null;

			/** UserBroadcastReq receiverSeat */
			public receiverSeat: number | null;

			/** UserBroadcastReq msgType */
			public msgType: number | null;

			/** UserBroadcastReq contentId */
			public contentId: number | null;

			/** UserBroadcastReq contentData */
			public contentData: string | null;

			/** UserBroadcastReq sendTime */
			public sendTime: number | Long | null;

			/** UserBroadcastReq senderNick */
			public senderNick: string | null;

			/** UserBroadcastReq senderIcon */
			public senderIcon: string | null;

			/** UserBroadcastReq gameType */
			public gameType: number | null;

			/** UserBroadcastReq tid */
			public tid: number | Long | null;

			/** UserBroadcastReq receiverUid */
			public receiverUid: number | null;

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

		/** Properties of a BroadcastGameStart. */
		interface IBroadcastGameStart{

			/** BroadcastGameStart tid */
			tid?: (number | Long | null);

			/** BroadcastGameStart logId */
			logId?: (string | null);

			/** BroadcastGameStart seconds */
			seconds?: (number | null);

		}

		/** Represents a BroadcastGameStart. */
		class BroadcastGameStart implements IBroadcastGameStart {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastGameStart);

			/** BroadcastGameStart tid */
			public tid: number | Long | null;

			/** BroadcastGameStart logId */
			public logId: string | null;

			/** BroadcastGameStart seconds */
			public seconds: number | null;

		}

		/** Properties of a BroadcastStageUpdate. */
		interface IBroadcastStageUpdate{

			/** BroadcastStageUpdate stage */
			stage?: (number | null);

		}

		/** Represents a BroadcastStageUpdate. */
		class BroadcastStageUpdate implements IBroadcastStageUpdate {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastStageUpdate);

			/** BroadcastStageUpdate stage */
			public stage: number | null;

		}

		/** Properties of a BroadcastAskActionNotice. */
		interface IBroadcastAskActionNotice{

			/** BroadcastAskActionNotice uid */
			uid?: (number | null);

			/** BroadcastAskActionNotice seat */
			seat?: (number | null);

		}

		/** Represents a BroadcastAskActionNotice. */
		class BroadcastAskActionNotice implements IBroadcastAskActionNotice {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliard.IBroadcastAskActionNotice);

			/** BroadcastAskActionNotice uid */
			public uid: number | null;

			/** BroadcastAskActionNotice seat */
			public seat: number | null;

		}

		/** Properties of a BroadcastGameResult. */
		interface IBroadcastGameResult{

			/** BroadcastGameResult logId */
			logId?: (string | null);

			/** BroadcastGameResult playerResult */
			playerResult?: (PlayerResult[] | null);

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

			/** BroadcastGameResult playerResult */
			public playerResult: PlayerResult[] | null;

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

		/** BILLIARD_SubCmd enum. */
		enum BILLIARD_SubCmd {
			eBilliardReadyNotify = 0,
			eBilliardSynchroSceneNotify = 1,
			eBilliardBeginNotify = 2,
			eBilliardTokenNotify = 3,
			eBilliardFreeBallReq = 4,
			eBilliardFreeBallNotify = 5,
			eBilliardBallAngleReq = 6,
			eBilliardBallAngleNotify = 7,
			eBilliardHitBallReq = 8,
			eBilliardHitBallNotify = 9,
			eBilliardActionResultReq = 10,
			eBilliardActionResultNotify = 11,
			eBilliardResultNotify = 12,
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

	}
}
export {};