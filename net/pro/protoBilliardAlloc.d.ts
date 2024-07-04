declare global {

	/** Namespace protoBilliardAlloc. */
	export namespace protoBilliardAlloc {

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
			constructor(properties?: protoBilliardAlloc.ICommonRsp);

			/** CommonRsp code */
			public code: number | null;

			/** CommonRsp msg */
			public msg: string | null;

		}

		/** Properties of a UserInfo. */
		interface IUserInfo{

			/** UserInfo uid */
			uid?: (number | null);

			/** UserInfo oldTid */
			oldTid?: (number | Long | null);

			/** UserInfo newTid */
			newTid?: (number | Long | null);

			/** UserInfo score */
			score?: (number | Long | null);

		}

		/** Represents a UserInfo. */
		class UserInfo implements IUserInfo {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IUserInfo);

			/** UserInfo uid */
			public uid: number | null;

			/** UserInfo oldTid */
			public oldTid: number | Long | null;

			/** UserInfo newTid */
			public newTid: number | Long | null;

			/** UserInfo score */
			public score: number | Long | null;

		}

		/** Properties of a TableInfo. */
		interface ITableInfo{

			/** TableInfo tid */
			tid?: (number | Long | null);

			/** TableInfo playingNumber */
			playingNumber?: (number | null);

			/** TableInfo status */
			status?: (number | null);

			/** TableInfo startTime */
			startTime?: (number | Long | null);

			/** TableInfo minCarry */
			minCarry?: (number | Long | null);

			/** TableInfo maxCarry */
			maxCarry?: (number | Long | null);

			/** TableInfo seatNumber */
			seatNumber?: (number | null);

			/** TableInfo uids */
			uids?: (number[] | null);

			/** TableInfo configId */
			configId?: (number | null);

			/** TableInfo userNumber */
			userNumber?: (number | null);

			/** TableInfo maxRealUserNum */
			maxRealUserNum?: (number | null);

			/** TableInfo realUserNum */
			realUserNum?: (number | null);

			/** TableInfo app */
			app?: (number | null);

			/** TableInfo straddle */
			straddle?: (number | Long | null);

			/** TableInfo profile */
			profile?: (string | null);

			/** TableInfo tableName */
			tableName?: (string | null);

			/** TableInfo Level */
			Level?: (number | null);

			/** TableInfo BallCount */
			BallCount?: (number | null);

			/** TableInfo userInfo */
			userInfo?: (UserInfo[] | null);

			/** TableInfo LeaveUList */
			LeaveUList?: (number[] | null);

			/** TableInfo CanStartGame */
			CanStartGame?: (boolean | null);

		}

		/** Represents a TableInfo. */
		class TableInfo implements ITableInfo {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.ITableInfo);

			/** TableInfo tid */
			public tid: number | Long | null;

			/** TableInfo playingNumber */
			public playingNumber: number | null;

			/** TableInfo status */
			public status: number | null;

			/** TableInfo startTime */
			public startTime: number | Long | null;

			/** TableInfo minCarry */
			public minCarry: number | Long | null;

			/** TableInfo maxCarry */
			public maxCarry: number | Long | null;

			/** TableInfo seatNumber */
			public seatNumber: number | null;

			/** TableInfo uids */
			public uids: number[] | null;

			/** TableInfo configId */
			public configId: number | null;

			/** TableInfo userNumber */
			public userNumber: number | null;

			/** TableInfo maxRealUserNum */
			public maxRealUserNum: number | null;

			/** TableInfo realUserNum */
			public realUserNum: number | null;

			/** TableInfo app */
			public app: number | null;

			/** TableInfo straddle */
			public straddle: number | Long | null;

			/** TableInfo profile */
			public profile: string | null;

			/** TableInfo tableName */
			public tableName: string | null;

			/** TableInfo Level */
			public Level: number | null;

			/** TableInfo BallCount */
			public BallCount: number | null;

			/** TableInfo userInfo */
			public userInfo: UserInfo[] | null;

			/** TableInfo LeaveUList */
			public LeaveUList: number[] | null;

			/** TableInfo CanStartGame */
			public CanStartGame: boolean | null;

		}

		/** Properties of a ReportReq. */
		interface IReportReq{

			/** ReportReq tables */
			tables?: (TableInfo[] | null);

			/** ReportReq srvID */
			srvID?: (number | null);

			/** ReportReq isNew */
			isNew?: (boolean | null);

		}

		/** Represents a ReportReq. */
		class ReportReq implements IReportReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IReportReq);

			/** ReportReq tables */
			public tables: TableInfo[] | null;

			/** ReportReq srvID */
			public srvID: number | null;

			/** ReportReq isNew */
			public isNew: boolean | null;

		}

		/** Properties of a UpdateReq. */
		interface IUpdateReq{

			/** UpdateReq tableInfo */
			tableInfo?: (TableInfo | null);

			/** UpdateReq srvID */
			srvID?: (number | null);

			/** UpdateReq isNew */
			isNew?: (boolean | null);

		}

		/** Represents a UpdateReq. */
		class UpdateReq implements IUpdateReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IUpdateReq);

			/** UpdateReq tableInfo */
			public tableInfo: TableInfo | null;

			/** UpdateReq srvID */
			public srvID: number | null;

			/** UpdateReq isNew */
			public isNew: boolean | null;

		}

		/** Properties of a RetireGameServerReq. */
		interface IRetireGameServerReq{

			/** RetireGameServerReq srvID */
			srvID?: (number | null);

			/** RetireGameServerReq isNew */
			isNew?: (boolean | null);

		}

		/** Represents a RetireGameServerReq. */
		class RetireGameServerReq implements IRetireGameServerReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IRetireGameServerReq);

			/** RetireGameServerReq srvID */
			public srvID: number | null;

			/** RetireGameServerReq isNew */
			public isNew: boolean | null;

		}

		/** Properties of a UpdateConfigReq. */
		interface IUpdateConfigReq{

			/** UpdateConfigReq srvId */
			srvId?: (number | null);

		}

		/** Represents a UpdateConfigReq. */
		class UpdateConfigReq implements IUpdateConfigReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IUpdateConfigReq);

			/** UpdateConfigReq srvId */
			public srvId: number | null;

		}

		/** Properties of a QueryGameServersReq. */
		interface IQueryGameServersReq{

			/** QueryGameServersReq gid */
			gid?: (number | null);

		}

		/** Represents a QueryGameServersReq. */
		class QueryGameServersReq implements IQueryGameServersReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryGameServersReq);

			/** QueryGameServersReq gid */
			public gid: number | null;

		}

		/** Properties of a QueryGameServersRsp. */
		interface IQueryGameServersRsp{

			/** QueryGameServersRsp code */
			code?: (number | null);

			/** QueryGameServersRsp msg */
			msg?: (string | null);

			/** QueryGameServersRsp servers */
			servers?: (number[] | null);

		}

		/** Represents a QueryGameServersRsp. */
		class QueryGameServersRsp implements IQueryGameServersRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryGameServersRsp);

			/** QueryGameServersRsp code */
			public code: number | null;

			/** QueryGameServersRsp msg */
			public msg: string | null;

			/** QueryGameServersRsp servers */
			public servers: number[] | null;

		}

		/** Properties of a QueryGameTableInfoReq. */
		interface IQueryGameTableInfoReq{

			/** QueryGameTableInfoReq gid */
			gid?: (number | null);

		}

		/** Represents a QueryGameTableInfoReq. */
		class QueryGameTableInfoReq implements IQueryGameTableInfoReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryGameTableInfoReq);

			/** QueryGameTableInfoReq gid */
			public gid: number | null;

		}

		/** Properties of a QueryGameTableByTableMoneyItem. */
		interface IQueryGameTableByTableMoneyItem{

			/** QueryGameTableByTableMoneyItem tableMoney */
			tableMoney?: (number | Long | null);

			/** QueryGameTableByTableMoneyItem total */
			total?: (number | null);

			/** QueryGameTableByTableMoneyItem free */
			free?: (number | null);

		}

		/** Represents a QueryGameTableByTableMoneyItem. */
		class QueryGameTableByTableMoneyItem implements IQueryGameTableByTableMoneyItem {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryGameTableByTableMoneyItem);

			/** QueryGameTableByTableMoneyItem tableMoney */
			public tableMoney: number | Long | null;

			/** QueryGameTableByTableMoneyItem total */
			public total: number | null;

			/** QueryGameTableByTableMoneyItem free */
			public free: number | null;

		}

		/** Properties of a QueryGameTableBySerItem. */
		interface IQueryGameTableBySerItem{

			/** QueryGameTableBySerItem sid */
			sid?: (number | null);

			/** QueryGameTableBySerItem total */
			total?: (number | null);

			/** QueryGameTableBySerItem free */
			free?: (number | null);

			/** QueryGameTableBySerItem tableMoneyInfo */
			tableMoneyInfo?: (QueryGameTableByTableMoneyItem[] | null);

		}

		/** Represents a QueryGameTableBySerItem. */
		class QueryGameTableBySerItem implements IQueryGameTableBySerItem {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryGameTableBySerItem);

			/** QueryGameTableBySerItem sid */
			public sid: number | null;

			/** QueryGameTableBySerItem total */
			public total: number | null;

			/** QueryGameTableBySerItem free */
			public free: number | null;

			/** QueryGameTableBySerItem tableMoneyInfo */
			public tableMoneyInfo: QueryGameTableByTableMoneyItem[] | null;

		}

		/** Properties of a QueryGameTableInfoRsp. */
		interface IQueryGameTableInfoRsp{

			/** QueryGameTableInfoRsp code */
			code?: (number | null);

			/** QueryGameTableInfoRsp msg */
			msg?: (string | null);

			/** QueryGameTableInfoRsp ser */
			ser?: (QueryGameTableBySerItem[] | null);

		}

		/** Represents a QueryGameTableInfoRsp. */
		class QueryGameTableInfoRsp implements IQueryGameTableInfoRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryGameTableInfoRsp);

			/** QueryGameTableInfoRsp code */
			public code: number | null;

			/** QueryGameTableInfoRsp msg */
			public msg: string | null;

			/** QueryGameTableInfoRsp ser */
			public ser: QueryGameTableBySerItem[] | null;

		}

		/** Properties of a QueryGamePlayingTableReq. */
		interface IQueryGamePlayingTableReq{

			/** QueryGamePlayingTableReq app */
			app?: (number[] | null);

			/** QueryGamePlayingTableReq gid */
			gid?: (number | null);

		}

		/** Represents a QueryGamePlayingTableReq. */
		class QueryGamePlayingTableReq implements IQueryGamePlayingTableReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryGamePlayingTableReq);

			/** QueryGamePlayingTableReq app */
			public app: number[] | null;

			/** QueryGamePlayingTableReq gid */
			public gid: number | null;

		}

		/** Properties of a QueryPlayingTableItem. */
		interface IQueryPlayingTableItem{

			/** QueryPlayingTableItem tid */
			tid?: (number | Long | null);

			/** QueryPlayingTableItem tableMoney */
			tableMoney?: (number | Long | null);

			/** QueryPlayingTableItem app */
			app?: (number | null);

			/** QueryPlayingTableItem playing */
			playing?: (number | null);

			/** QueryPlayingTableItem sitNum */
			sitNum?: (number | null);

			/** QueryPlayingTableItem robotNum */
			robotNum?: (number | null);

			/** QueryPlayingTableItem robotSitNum */
			robotSitNum?: (number | null);

		}

		/** Represents a QueryPlayingTableItem. */
		class QueryPlayingTableItem implements IQueryPlayingTableItem {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryPlayingTableItem);

			/** QueryPlayingTableItem tid */
			public tid: number | Long | null;

			/** QueryPlayingTableItem tableMoney */
			public tableMoney: number | Long | null;

			/** QueryPlayingTableItem app */
			public app: number | null;

			/** QueryPlayingTableItem playing */
			public playing: number | null;

			/** QueryPlayingTableItem sitNum */
			public sitNum: number | null;

			/** QueryPlayingTableItem robotNum */
			public robotNum: number | null;

			/** QueryPlayingTableItem robotSitNum */
			public robotSitNum: number | null;

		}

		/** Properties of a QueryPlayingTableBySerItem. */
		interface IQueryPlayingTableBySerItem{

			/** QueryPlayingTableBySerItem sid */
			sid?: (number | null);

			/** QueryPlayingTableBySerItem tables */
			tables?: (QueryPlayingTableItem[] | null);

		}

		/** Represents a QueryPlayingTableBySerItem. */
		class QueryPlayingTableBySerItem implements IQueryPlayingTableBySerItem {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryPlayingTableBySerItem);

			/** QueryPlayingTableBySerItem sid */
			public sid: number | null;

			/** QueryPlayingTableBySerItem tables */
			public tables: QueryPlayingTableItem[] | null;

		}

		/** Properties of a QueryGamePlayingTableRsp. */
		interface IQueryGamePlayingTableRsp{

			/** QueryGamePlayingTableRsp code */
			code?: (number | null);

			/** QueryGamePlayingTableRsp msg */
			msg?: (string | null);

			/** QueryGamePlayingTableRsp ser */
			ser?: (QueryPlayingTableBySerItem[] | null);

		}

		/** Represents a QueryGamePlayingTableRsp. */
		class QueryGamePlayingTableRsp implements IQueryGamePlayingTableRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IQueryGamePlayingTableRsp);

			/** QueryGamePlayingTableRsp code */
			public code: number | null;

			/** QueryGamePlayingTableRsp msg */
			public msg: string | null;

			/** QueryGamePlayingTableRsp ser */
			public ser: QueryPlayingTableBySerItem[] | null;

		}

		/** Properties of a TableLevelParams. */
		interface ITableLevelParams{

			/** TableLevelParams tableMoney */
			tableMoney?: (number | Long | null);

			/** TableLevelParams maxSeatCnt */
			maxSeatCnt?: (number | null);

			/** TableLevelParams BallCount */
			BallCount?: (number | Long | null);

			/** TableLevelParams Straddle */
			Straddle?: (number | Long | null);

			/** TableLevelParams MatchingUserCnt */
			MatchingUserCnt?: (number | null);

			/** TableLevelParams CarryLower */
			CarryLower?: (number | Long | null);

			/** TableLevelParams CarryUpper */
			CarryUpper?: (number | Long | null);

		}

		/** Represents a TableLevelParams. */
		class TableLevelParams implements ITableLevelParams {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.ITableLevelParams);

			/** TableLevelParams tableMoney */
			public tableMoney: number | Long | null;

			/** TableLevelParams maxSeatCnt */
			public maxSeatCnt: number | null;

			/** TableLevelParams BallCount */
			public BallCount: number | Long | null;

			/** TableLevelParams Straddle */
			public Straddle: number | Long | null;

			/** TableLevelParams MatchingUserCnt */
			public MatchingUserCnt: number | null;

			/** TableLevelParams CarryLower */
			public CarryLower: number | Long | null;

			/** TableLevelParams CarryUpper */
			public CarryUpper: number | Long | null;

		}

		/** Properties of a GetTableListReq. */
		interface IGetTableListReq{

			/** GetTableListReq levels */
			levels?: (TableLevelParams[] | null);

			/** GetTableListReq filterParam */
			filterParam?: (number | null);

		}

		/** Represents a GetTableListReq. */
		class GetTableListReq implements IGetTableListReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IGetTableListReq);

			/** GetTableListReq levels */
			public levels: TableLevelParams[] | null;

			/** GetTableListReq filterParam */
			public filterParam: number | null;

		}

		/** Properties of a OneTableInfo. */
		interface IOneTableInfo{

			/** OneTableInfo tid */
			tid?: (number | Long | null);

			/** OneTableInfo tableMoney */
			tableMoney?: (number | Long | null);

			/** OneTableInfo maxSeatCnt */
			maxSeatCnt?: (number | null);

			/** OneTableInfo currPlayerCnt */
			currPlayerCnt?: (number | null);

			/** OneTableInfo CarryLower */
			CarryLower?: (number | Long | null);

			/** OneTableInfo CarryUpper */
			CarryUpper?: (number | Long | null);

			/** OneTableInfo Straddle */
			Straddle?: (number | Long | null);

			/** OneTableInfo profile */
			profile?: (string | null);

			/** OneTableInfo TableName */
			TableName?: (string | null);

			/** OneTableInfo Level */
			Level?: (number | null);

			/** OneTableInfo BallCount */
			BallCount?: (number | null);

		}

		/** Represents a OneTableInfo. */
		class OneTableInfo implements IOneTableInfo {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IOneTableInfo);

			/** OneTableInfo tid */
			public tid: number | Long | null;

			/** OneTableInfo tableMoney */
			public tableMoney: number | Long | null;

			/** OneTableInfo maxSeatCnt */
			public maxSeatCnt: number | null;

			/** OneTableInfo currPlayerCnt */
			public currPlayerCnt: number | null;

			/** OneTableInfo CarryLower */
			public CarryLower: number | Long | null;

			/** OneTableInfo CarryUpper */
			public CarryUpper: number | Long | null;

			/** OneTableInfo Straddle */
			public Straddle: number | Long | null;

			/** OneTableInfo profile */
			public profile: string | null;

			/** OneTableInfo TableName */
			public TableName: string | null;

			/** OneTableInfo Level */
			public Level: number | null;

			/** OneTableInfo BallCount */
			public BallCount: number | null;

		}

		/** Properties of a GetTableListRsp. */
		interface IGetTableListRsp{

			/** GetTableListRsp code */
			code?: (number | null);

			/** GetTableListRsp tables */
			tables?: (OneTableInfo[] | null);

		}

		/** Represents a GetTableListRsp. */
		class GetTableListRsp implements IGetTableListRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IGetTableListRsp);

			/** GetTableListRsp code */
			public code: number | null;

			/** GetTableListRsp tables */
			public tables: OneTableInfo[] | null;

		}

		/** Properties of a EnterTableSetCookieReq. */
		interface IEnterTableSetCookieReq{

			/** EnterTableSetCookieReq tid */
			tid?: (number | Long | null);

			/** EnterTableSetCookieReq matchId */
			matchId?: (number | null);

		}

		/** Represents a EnterTableSetCookieReq. */
		class EnterTableSetCookieReq implements IEnterTableSetCookieReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IEnterTableSetCookieReq);

			/** EnterTableSetCookieReq tid */
			public tid: number | Long | null;

			/** EnterTableSetCookieReq matchId */
			public matchId: number | null;

		}

		/** Properties of a EnterTableSetCookieRsp. */
		interface IEnterTableSetCookieRsp{

			/** EnterTableSetCookieRsp code */
			code?: (number | null);

			/** EnterTableSetCookieRsp gameId */
			gameId?: (number | null);

			/** EnterTableSetCookieRsp gameSerId */
			gameSerId?: (number | null);

			/** EnterTableSetCookieRsp tid */
			tid?: (number | Long | null);

			/** EnterTableSetCookieRsp RoomLevel */
			RoomLevel?: (number | null);

			/** EnterTableSetCookieRsp matchId */
			matchId?: (number | null);

		}

		/** Represents a EnterTableSetCookieRsp. */
		class EnterTableSetCookieRsp implements IEnterTableSetCookieRsp {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IEnterTableSetCookieRsp);

			/** EnterTableSetCookieRsp code */
			public code: number | null;

			/** EnterTableSetCookieRsp gameId */
			public gameId: number | null;

			/** EnterTableSetCookieRsp gameSerId */
			public gameSerId: number | null;

			/** EnterTableSetCookieRsp tid */
			public tid: number | Long | null;

			/** EnterTableSetCookieRsp RoomLevel */
			public RoomLevel: number | null;

			/** EnterTableSetCookieRsp matchId */
			public matchId: number | null;

		}

		/** Properties of a ReportTableDataReq. */
		interface IReportTableDataReq{

			/** ReportTableDataReq serId */
			serId?: (number | null);

		}

		/** Represents a ReportTableDataReq. */
		class ReportTableDataReq implements IReportTableDataReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IReportTableDataReq);

			/** ReportTableDataReq serId */
			public serId: number | null;

		}

		/** Properties of a UpdateTableReq. */
		interface IUpdateTableReq{

			/** UpdateTableReq tableInfo */
			tableInfo?: (TableInfo[] | null);

			/** UpdateTableReq srvID */
			srvID?: (number | null);

			/** UpdateTableReq isNew */
			isNew?: (boolean | null);

		}

		/** Represents a UpdateTableReq. */
		class UpdateTableReq implements IUpdateTableReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IUpdateTableReq);

			/** UpdateTableReq tableInfo */
			public tableInfo: TableInfo[] | null;

			/** UpdateTableReq srvID */
			public srvID: number | null;

			/** UpdateTableReq isNew */
			public isNew: boolean | null;

		}

		/** Properties of a ChangeTableReq. */
		interface IChangeTableReq{

			/** ChangeTableReq userInfo */
			userInfo?: (UserInfo[] | null);

			/** ChangeTableReq srvID */
			srvID?: (number | null);

			/** ChangeTableReq isNew */
			isNew?: (boolean | null);

		}

		/** Represents a ChangeTableReq. */
		class ChangeTableReq implements IChangeTableReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IChangeTableReq);

			/** ChangeTableReq userInfo */
			public userInfo: UserInfo[] | null;

			/** ChangeTableReq srvID */
			public srvID: number | null;

			/** ChangeTableReq isNew */
			public isNew: boolean | null;

		}

		/** Properties of a StartTableReq. */
		interface IStartTableReq{

			/** StartTableReq tableInfo */
			tableInfo?: (TableInfo[] | null);

			/** StartTableReq srvID */
			srvID?: (number | null);

			/** StartTableReq isNew */
			isNew?: (boolean | null);

		}

		/** Represents a StartTableReq. */
		class StartTableReq implements IStartTableReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IStartTableReq);

			/** StartTableReq tableInfo */
			public tableInfo: TableInfo[] | null;

			/** StartTableReq srvID */
			public srvID: number | null;

			/** StartTableReq isNew */
			public isNew: boolean | null;

		}

		/** Properties of a DisbandTableReq. */
		interface IDisbandTableReq{

			/** DisbandTableReq tableInfo */
			tableInfo?: (TableInfo[] | null);

			/** DisbandTableReq srvID */
			srvID?: (number | null);

			/** DisbandTableReq isNew */
			isNew?: (boolean | null);

		}

		/** Represents a DisbandTableReq. */
		class DisbandTableReq implements IDisbandTableReq {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IDisbandTableReq);

			/** DisbandTableReq tableInfo */
			public tableInfo: TableInfo[] | null;

			/** DisbandTableReq srvID */
			public srvID: number | null;

			/** DisbandTableReq isNew */
			public isNew: boolean | null;

		}

		/** Properties of a MatchingUserInfo. */
		interface IMatchingUserInfo{

			/** MatchingUserInfo uid */
			uid?: (number | null);

			/** MatchingUserInfo nick */
			nick?: (string | null);

			/** MatchingUserInfo icon */
			icon?: (string | null);

			/** MatchingUserInfo score */
			score?: (number | Long | null);

		}

		/** Represents a MatchingUserInfo. */
		class MatchingUserInfo implements IMatchingUserInfo {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IMatchingUserInfo);

			/** MatchingUserInfo uid */
			public uid: number | null;

			/** MatchingUserInfo nick */
			public nick: string | null;

			/** MatchingUserInfo icon */
			public icon: string | null;

			/** MatchingUserInfo score */
			public score: number | Long | null;

		}

		/** Properties of a MatchingTableMsg. */
		interface IMatchingTableMsg{

			/** MatchingTableMsg tid */
			tid?: (number | Long | null);

			/** MatchingTableMsg minCarry */
			minCarry?: (number | Long | null);

			/** MatchingTableMsg maxCarry */
			maxCarry?: (number | Long | null);

			/** MatchingTableMsg userList */
			userList?: (MatchingUserInfo[] | null);

			/** MatchingTableMsg tableName */
			tableName?: (string | null);

			/** MatchingTableMsg level */
			level?: (number | null);

			/** MatchingTableMsg ballCount */
			ballCount?: (number | null);

			/** MatchingTableMsg basescore */
			basescore?: (number | null);

		}

		/** Represents a MatchingTableMsg. */
		class MatchingTableMsg implements IMatchingTableMsg {

			/**
			* Constructs a new %s.
			* @param [properties] Properties to set
			*/
			constructor(properties?: protoBilliardAlloc.IMatchingTableMsg);

			/** MatchingTableMsg tid */
			public tid: number | Long | null;

			/** MatchingTableMsg minCarry */
			public minCarry: number | Long | null;

			/** MatchingTableMsg maxCarry */
			public maxCarry: number | Long | null;

			/** MatchingTableMsg userList */
			public userList: MatchingUserInfo[] | null;

			/** MatchingTableMsg tableName */
			public tableName: string | null;

			/** MatchingTableMsg level */
			public level: number | null;

			/** MatchingTableMsg ballCount */
			public ballCount: number | null;

			/** MatchingTableMsg basescore */
			public basescore: number | null;

		}

	}
}
export {};