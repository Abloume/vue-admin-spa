import axios from 'axios';
import {
	Loading
} from 'element-ui';
// let base = '/cas-admin'; //生成产品用
let base = 'proxyapi'; //开发产品用

export const commonurl = `${base}/*.jsonRequest`; //通用的请求地址
// export const loginurl = `${base}/logon/login`; //登录地址
// export const logout = `${base}/logon/logout`; //退出地址
// export const rolesurl = `${base}/logon/myRoles`; //获取角色地址
// export const changepwd = `${base}/logon/changepwd`; //修改密码接口地址
export const imguploadurl = `${base}/file/upload`; //机构图片上传接口地址
export const imgview = "http://10.8.3.49:8020/cfs-file/upload/image/"; //图片预览地址
// export const imgview = "http://122.224.131.235:9097/cfs-file/upload/image/"; //图片预览地址
export const filedowned = "http://10.8.3.49:8020/cfs-file/download/"; //文件下载地址
// export const area_url = `${base}/coms.dictionary.coms_region.dic/`; //省市联动请求地址
// export const filedownload_url = "http://115.236.19.147:15981/coms-web/download/"; //文件下载地址
// 登录提交获取角色列表
export const requestrolelist = params => {
	let loadingInstance1 = Loading.service({
		fullscreen: false,
		target: "content"
	});
	return axios.post(`${base}/logon/myRoles`, params).then(res => {
		loadingInstance1.close();
		return res.data
	})
};
// 登录提交保存sessionStorage的accessToken
export const requestLoginon = params => {
		return axios.post(`${base}/logon/login`, params).then(res => res.data)
	}
	// 通用ajax请求方法
export const commonAjax = (ServiceId, ServiceMethod, params) => {
	let loadingInstance1 = Loading.service({
		fullscreen: false,
		target: "content"
	});
	var instance = axios.create({
		headers: {
			"X-Access-Token": sessionStorage.getItem("accessToken"),
			"X-Service-Id": ServiceId,
			"X-Service-Method": ServiceMethod,
			"Content-Type": "application/json",
			"roleIds": sessionStorage.getItem("roleIds"),
		}
	})
	return instance.post(`${base}/*.jsonRequest`, params).then(res => {
		loadingInstance1.close();
		return res.data
	})
}

// 测试通用ajax请求方法 以后去掉
// export const commonAjax2 = (ServiceId, ServiceMethod, params, roleIds) => {
// 		let loadingInstance1 = Loading.service({
// 			fullscreen: false,
// 			target: "content"
// 		});

// 		var instance = axios.create({
// 			headers: {
// 				"X-Access-Token": sessionStorage.getItem("accessToken"),
// 				"X-Service-Id": ServiceId,
// 				"X-Service-Method": ServiceMethod,
// 				"Content-Type": "application/json",
// 				"roleIds": roleIds,
// 			}
// 		})
// 		return instance.post(`${base}/*.jsonRequest`, params).then(res => {
// 			loadingInstance1.close();
// 			return res.data
// 		})
// 	}
// 用于编辑器的图片上传 
export const imguploadAjax = params => {
	let loadingInstance1 = Loading.service({
		fullscreen: false,
		target: "content"
	});
	var instance = axios.create({
		headers: {
			"X-Access-Token": sessionStorage.getItem("accessToken")
		}
	});
	return instance.post(`${base}/file/upload`, params).then(res => {
		loadingInstance1.close();
		return res.data
	})
};

// 地区的请求
export const areaAjax = (params) => {
	let loadingInstance1 = Loading.service({
		fullscreen: false,
		target: "content"
	});
	var instance = axios.create({
		headers: {
			"X-Access-Token": sessionStorage.getItem("accessToken"),
			"Content-Type": "application/json"
		},
		// method: 'get',
		params: params,
	});
	return instance.get(`${base}/cfs.dic.base_region.dic/`).then(res => {
		loadingInstance1.close();
		return res.data
	})
};

// export const requestLogin = params => {
// 	return axios.post(`${base}/login`, params).then(res => res.data);
// };

// export const getUserList = params => {
// 	return axios.get(`${base}/user/list`, {
// 		params: params
// 	});
// };

// export const getUserListPage = params => {
// 	return axios.get(`${base}/user/listpage`, {
// 		params: params
// 	});
// };

// export const removeUser = params => {
// 	return axios.get(`${base}/user/remove`, {
// 		params: params
// 	});
// };

// export const batchRemoveUser = params => {
// 	return axios.get(`${base}/user/batchremove`, {
// 		params: params
// 	});
// };

// export const editUser = params => {
// 	return axios.get(`${base}/user/edit`, {
// 		params: params
// 	});
// };

// export const addUser = params => {
// 	return axios.get(`${base}/user/add`, {
// 		params: params
// 	});
// };