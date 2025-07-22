export interface NpContextT {
	adminId: number
	defaultNode: string
	defaultNodeId: number
	mediapath: string
	npBrief: string
	npCode: string
	npId: number | string
	npTitle: string
	npLastpublish: number
	npListPoster: string

	npNbClick: number
	npNbVisit: number
	npNbVote: number
	npParams: {
		Z3D: NpParamsT // Z3D is specifically of type NpParamsT
		NodeInitData: NodeInitDataT
		NodeNavData: NodeNavDataItem[]
		floorNodeList: {
			[key: string]: string []
		}
	}
	npQrcodeFile: string
	npRoomNb: number
	npRootpath: string
	npShareType: number
	npType: string
	npVotable: number
	npWeixinLogo: string
	npsId: number
	posterMobile: string
	posterPc: string
	userId: number
	voteEndDate: string
	voteType: number
	npGroupType?: string
	plan_cur_point_anim: number
	//非接口返回
	hasEnterPage: boolean
	enterPage?: string
	picHeight?: number

	nodePath: string
	autoVrCoverPage: boolean // 自动布展封面


	hasFooterMenu?: boolean
	z3dFooterHeight: number
	js_action_after_loadpano?: Function
	gCurFloor: number
	language?: string
}

export interface NpParamsT {
	EXHI_VER: string
	PLAN_COORDINATE_YOFFSET: string
	app_title: string
	big_plan_360: string
	big_plan_360_key_nb: string
	big_plan_default_x: string
	big_plan_default_y: string
	big_plan_has_index_box: string
	big_plan_height: string
	big_plan_width: string
	default_node: string
	has_big_plan: string
	mmi_has_plan: string
	mmi_skin_type: string
	mobile_has_plan_internal: string
	module_affair: string
	module_guide: string
	// np_room_max: string;
	// np_room_nb: string;
	plan_x_hided: string
	plan_x_show: string
	showtext_type: string
}

export interface NodeInitDataT {
	[key: string]: NodeInitDataItem
}

interface NodeInitDataItem {
	ath: number
	atv: number
	fov: number
	hrad: number
	fmin: number
	fmax: number
	hmin: number
	hmax: number
	vmin: number
	vmax: number
	floor: string
	alt: string
}

interface NodeNavDataItem {
	from: string
	to: string
	style: string
	ath: string | number
	atv: string | number
	alt: string
	lookh: string | number
	lookv: string | number
	fov: number
	dest_h: string | number
	dest_v: string | number
	turn_h: string | number
	turn_v: string | number
	onclick: string
}

export interface NodeContextT {
	bgSoundList: Array<any>
	enterVoiceList: Array<any>
	imageDynamicList: Array<any>
	imageStaticList: Array<any>
	materialList: Array<any>
	posterList: Array<any>
	textDynList: Array<any>
	videoList: Array<any>
	videoViList: Array<any>
	nodeNbVisit: number
	nodeQrcodeFile: string
	nodeTitle: string
	nodeType: number
	nodesListData: Array<any>
	nodeId: number
	votableNb: number
	nodeName: string
	isBack: boolean
	z3d_loadpano_from_std_plan: boolean
	extra_hs: Array<any>
	has_extra_hs: boolean
	node_template: string
	mmi_pos: string
	isPano: boolean
	nb_hs: number
	video_can_play: boolean
	newpano_turn_h: number
	newpano_turn_v: number
	back_ath: number
	back_atv: number
	previewNodeName: string
}

export interface PreviewNodeT {
	nodeName: string
	nodeId: number
	isPano: boolean
}

export interface PanoViewT {
	ZOOM_RATIO99: number
	mmi_hsv3: number
	main_btns_all: string[]
	main_btns: string[]
	main_btns_order: {
		[key: string]: number
	}
	main_btns_mob: string[]
	main_btns_mob_order: {
		[key: string]: number
	}
	big_img_width: number
	big_img_height: number
	gLicenseType: number
	z3d_mouseIsDown: boolean
	mouseCoordinates: any
	cur_onsize_action: any
	z3d_autoplay_on: boolean
	nodeEnterTextAnimSecond: number
	z3d_stageWidth: number
	z3d_stageHeight: number
	z3d_screenWidth: number
	z3d_screenHeight: number
	z3d_stageScale: number
	z3d_screenVertial: number
	baseLength: number
	z3d_unityHeight: number
}

export interface Menu {
	id: string | number
	name: string
	title: string
}

export interface PanoFunctionalStatusT {
	mosaicOn: boolean
	autoPlayOn: boolean // 是否处于自动播放状态
	planOpened: boolean
	guidedModeOn: boolean
	webvrOn: boolean
	mosaicLoaded: boolean
}

export interface NodeTemplateContextT {
	linkedNpsId: number
	nodetCode: string
	nodetCustId: number
	nodetGroup: string
	nodetId: number
	nodetOrder: number
	nodetThumb: string
	nodetTitle: string
	nodetType: boolean
	nodetVersion: number
	extInfo?: {
		video_pos_nb?: number;
		video?: {
			type?: string;
		};
		coins?: string;
	};
}
