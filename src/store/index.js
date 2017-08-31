import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
export default new Vuex.Store({
	state: {
		orgOption: {
			orgId: "", //传列表的orgId
			activeName: "", //传列表tab定位
			isdisabled: false, //传列表是否可以编辑
			ishowtab: false, //新增的时候不显示除基本信息外的tab
			"parentId": "",
			"qrCode": "", //二维码
			"qrAvatarFileId": 0, //二维码图片id
			"medicalOrgId": "", //机构医保局id
			"localOrgId": "", //机构代码
			"orgFullName": "", //机构全称
			"orgShortName": "", //简称
			"orgClassify": "", //机构分类
			"area": "",
			"orgNature": "", //机构性质
			"orgLevel": "", //机构级别
			"orgMnemonic": "",
			"createDt": "",
			"status": "1",
			"avatarField": 0, //机构照片地址id
			"homepage": "",
			"description": "",
			"orgAddress": "", //机构地址
			"consultNo": "", //咨询电话
			"emergencyNo": "", //紧急电话
			"contactNo": "",
			"postcode": "", //邮政编码
			"trafficDesc": "", //交通说明
			"longitude": "", //经度
			"latitude": "", //维度
			"fax": "", //传真
			// "orgNatureText": "",
			// "orgLevelText": "",
			// "orgClassifyText": "",
			"province": "", //地址（省）
			provinceText: "",
			"city": "", //地址（市）
			cityText: "",
			"district": "", //地址（区、县）
			districtText: "",
			"street": "", //街道编码
			streetText: "",
		},
		tenantOption: { //租户编辑
			tenantId: "", //传列表的orgId
			isdisabled: false, //传列表是否可以编辑
			activeName: "", //传列表tab定位
			ishowtab: false //新增的时候不显示除基本信息外的tab
		},
		rolemenulists: [],
	},
	getters: {
		// isdisable: state => {
		// 	return state.orgOption.orgId == '' ? false : true
		// }
	},
	mutations: {
		//机构列表传值到机构维护组件
		orgOption(state, orgOption) {
			state.orgOption = orgOption
		},
		//租户列表传值到机构维护组件
		tenantOption(state, tenantOption) {
			state.tenantOption = tenantOption
		},
		//头部角色列表
		rolemenulists(state, rolemenulists) {
			state.rolemenulists = rolemenulists
		},
	},
	actions: {
		//机构列表传值到机构维护组件
		orgOption({
			commit
		}, orgOption) {
			commit("orgOption", orgOption)
		},
		//租户列表传值到机构维护组件
		tenantOption({
			commit
		}, tenantOption) {
			commit("tenantOption", tenantOption)
		},
		//头部角色列表
		rolemenulists({
			commit
		}, rolemenulists) {
			commit("rolemenulists", rolemenulists)
		},

	}
})