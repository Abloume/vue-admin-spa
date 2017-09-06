import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            name: 'Redirect',
            redirect: '/login',
        },

        {
            path: '/readme',
            name: 'Home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                }, {
                    path: '/organizationManage',
                    component: resolve => require(['../components/page/OrganizationManage.vue'], resolve),
                    children: [{
                        path: '/',
                        name: 'OrganizationManage', //机构管理路由容器页面
                        meta: {
                            keepAlive: true
                        },
                        component: resolve => require(['../components/page/OrganizationList.vue'], resolve)
                    }, {
                        path: '/organizationList', //机构信列表
                        name: 'OrganizationList',
                        meta: {
                            keepAlive: true
                        },
                        component: resolve => require(['../components/page/OrganizationList.vue'], resolve)
                    }, {
                        path: '/orginfo', //机构信息维护
                        name: 'OrgInfo',
                        meta: {
                            keepAlive: false
                        },
                        component: resolve => require(['../components/page/OrgInfo.vue'], resolve),
                    }, ]
                }, {
                    path: '/departManage', //科室维护
                    name: 'DepartManage',
                    component: resolve => require(['../components/page/DepartManage.vue'], resolve)
                }, {
                    path: '/doctorManage', //医生维护
                    name: 'DoctorManage',
                    component: resolve => require(['../components/page/DoctorManage.vue'], resolve)
                }, {
                    path: '/tenantManage', //租户维护
                    component: resolve => require(['../components/zxxpage/TenantManage.vue'], resolve),
                    children: [{
                        path: '/',
                        name: 'TenantManage',
                        meta: {
                            keepAlive: true
                        },
                        component: resolve => require(['../components/zxxpage/TenantList.vue'], resolve)
                    }, {
                        path: '/tenantList',
                        name: 'TenantList',
                        meta: {
                            keepAlive: true
                        },
                        component: resolve => require(['../components/zxxpage/TenantList.vue'], resolve)
                    }, {
                        path: '/tenantinfo',
                        name: 'TenantInfo',
                        meta: {
                            keepAlive: false
                        },
                        component: resolve => require(['../components/zxxpage/TenantInfo.vue'], resolve),
                    }, ]
                }, {
                    path: '/userSet', //用户管理
                    name: 'UserSet',
                    component: resolve => require(['../components/page/UserSet.vue'], resolve)
                }, {
                    path: '/productSet', //产品版本管理
                    name: 'ProductSet',
                    component: resolve => require(['../components/page/ProductSet.vue'], resolve)
                }, {
                    path: '/menuSet', //菜单管理
                    name: 'MenuSet',
                    component: resolve => require(['../components/page/MenuSet.vue'], resolve)
                }, {
                    path: '/roleSet', //角色管理
                    name: 'RoleSet',
                    component: resolve => require(['../components/page/RoleSet.vue'], resolve)
                }, {
                    path: '/proandModule', //产品与模块关系
                    name: 'ProandModule',
                    component: resolve => require(['../components/page/ProandModule.vue'], resolve)
                }, {
                    path: '/proandRole', //产品与模块关系
                    name: 'ProandRole',
                    component: resolve => require(['../components/page/ProandRole.vue'], resolve)
                }, {
                    path: '/moduleSet', //模块管理
                    name: 'ModuleSet',
                    component: resolve => require(['../components/page/ModuleSet.vue'], resolve)
                }, {
                    path: '/bannerSet', //banner管理
                    name: 'BannerSet',
                    component: resolve => require(['../components/page/BannerSet.vue'], resolve)
                }, {
                    path: '/hotobjectservice', //热门对象管理
                    name: 'Hotobjectservice',
                    component: resolve => require(['../components/page/Hotobjectservice.vue'], resolve)
                }, {
                    path: '/standarddept', //标准科室
                    name: 'StandardDept',
                    component: resolve => require(['../components/page/StandardDept.vue'], resolve)
                }, {
                    path: '/messageRecord', //医讯管理
                    name: 'MessageRecord',
                    component: resolve => require(['../components/page/MessageRecord.vue'], resolve)
                }, {
                    path: '/healtNnews', //健康资讯
                    name: 'HealthNews',
                    component: resolve => require(['../components/page/HealthNews.vue'], resolve)
                }, {
                    path: '/healthNewsType', //健康资讯类别
                    name: 'HealthNewsType',
                    component: resolve => require(['../components/page/HealthNewsType.vue'], resolve)
                }, {
                    path: '/doctorTeam', //健康资讯类别
                    name: 'DoctorTeam',
                    component: resolve => require(['../components/page/DoctorTeam.vue'], resolve)
                }, {
                    path: '/doctorsignset', //健康资讯类别
                    name: 'DoctorSignSet',
                    component: resolve => require(['../components/page/DoctorSignSet.vue'], resolve)
                }, {
                    path: '/doctorReview', //医生审核
                    name: 'DoctorReview',
                    component: resolve => require(['../components/page/DoctorReview.vue'], resolve)
                }, { // 签约申请
                    path: '/signApplyList',
                    name: 'SignApplyList',
                    component: resolve => require(['../components/page/SignApplyList.vue'], resolve)
                }, {
                    path: '/serviceItem',
                    component: resolve => require(['../components/zxxpage/ServiceItem.vue'], resolve),
                    children: [{
                        path: '/',
                        name: 'ServiceItem',
                        meta: {
                            keepAlive: true
                        },
                        component: resolve => require(['../components/zxxpage/ServiceItemList.vue'], resolve)
                    }]
                }, { //服务管理
                    path: '/servicePackage',
                    component: resolve => require(['../components/zxxpage/ServicePackage.vue'], resolve),
                    children: [{
                        path: '/',
                        name: 'ServicePackage',
                        meta: {
                            keepAlive: true
                        },
                        component: resolve => require(['../components/zxxpage/ServicePackageList.vue'], resolve)
                    }]
                }, { //协议管理
                    path: '/protocolManage',
                    component: resolve => require(['../components/zxxpage/ProtocolManage.vue'], resolve),
                    children: [{
                        path: '/',
                        name: 'ProtocolManage',
                        meta: {
                            keepAlive: true
                        },
                        component: resolve => require(['../components/zxxpage/ProtocolManageList.vue'], resolve)
                    }]
                }, { // 意见反馈
                    path: '/feedback',
                    component: resolve => require(['../components/zxxpage/Feedback.vue'], resolve),
                    children: [{
                        path: '/',
                        name: 'Feedback',
                        meta: {
                            keepAlive: true
                        },
                        component: resolve => require(['../components/zxxpage/FeedbackList.vue'], resolve)
                    }]
                }

            ]
        }, {
            path: '/login',
            name: 'Login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },

    ]
})