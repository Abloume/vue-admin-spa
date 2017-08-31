<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" unique-opened=true router>
            <el-menu-item index="readme">
                <i class="el-icon-menu"></i>主页
            </el-menu-item>
          <!--   <el-menu-item index="doctorsignset">
                <i class="el-icon-menu"></i>家医签约配置
            </el-menu-item> -->
            <!--  <el-menu-item index="BaseTable">
                <i class="el-icon-menu"></i>租户管理
            </el-menu-item> -->
            <!-- <el-submenu index="33333">
                <template slot="title"><i class="el-icon-menu"></i>租户管理</template>
                <el-menu-item index="organizationList">机构管理</el-menu-item>
                <el-menu-item index="departManage">科室管理</el-menu-item>
                <el-menu-item index="doctorManage">医生管理</el-menu-item>
                  <el-menu-item index="tenantManage">租户维护</el-menu-item>
                <el-menu-item index="menuSet">菜单管理</el-menu-item>
                <el-menu-item index="moduleSet">模块管理</el-menu-item>
                <el-menu-item index="proandModule">产品与模块关系</el-menu-item>
                 <el-menu-item index="roleSet">角色管理</el-menu-item>
                <el-menu-item index="productSet">产品版本管理</el-menu-item>
                 <el-menu-item index="userSet">用户管理</el-menu-item>
                <el-menu-item index="proandRole">产品与角色关系</el-menu-item>
                <el-menu-item index="bannerSet">广告管理</el-menu-item>
                <el-menu-item index="hotobjectservice">热门对象</el-menu-item>
                <el-menu-item index="standarddept">标准科室对照</el-menu-item>
                <el-menu-item index="messagerecord">医讯管理</el-menu-item>
                <el-menu-item index="healtNnews">健康资讯</el-menu-item>
                <el-menu-item index="healthNewsType">健康资讯类别</el-menu-item>
                <el-menu-item index="doctorTeam">家医团队</el-menu-item>
            </el-submenu> -->
             <template v-for="(item,index) in rolemenulists">
                <!-- <el-menu-item :index="item.linkedUrl" v-if="item.pId=='m_-1'">
                    <i class="el-icon-menu"></i>{{item.name}}
                </el-menu-item> -->
                <el-submenu :index="item.id">
                    <template slot="title"><i class="el-icon-menu"></i>{{item.name}}</template>
                    <el-menu-item :index="sitem.linkedUrl" v-for="(sitem,sindex) in item.child">{{sitem.name}}</el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>
<script>
import {
    commonAjax
}
from '../../api/api';
import {
    mapState
}
from 'vuex';
export default {
    data() {
            return {
               

            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            },
             ...mapState(['rolemenulists']),
        },
        mounted() {
            console.log(this.rolemenulists);
            //获取菜单数据
            // console.log(this.userrolelist);
            // let rolelist=JSON.stringify(this.userrolelist);
            // let param=`[${rolelist},'hcn.admin_pc']`;
            // commonAjax( "cas.menuManageService", "getRoleMenuTree",param).then(res => {
            //     if (res.code == 200) {
            //         // res.body.forEach(function(el) {
            //         //     if (el.linkedUrl) {
            //         //         var suoyin = el.linkedUrl.lastIndexOf("/");
            //         //         var suoyin2 = el.linkedUrl.indexOf(".html");
            //         //         var routerindex = el.linkedUrl.substring(suoyin + 1, suoyin2)
            //         //         el.linkedUrl = routerindex;
            //         //     }
            //         //     if (el.child) {
            //         //         el.child.forEach(function(el2) {
            //         //             if (el2.linkedUrl) {
            //         //                 var suoyin3 = el2.linkedUrl.lastIndexOf("/");
            //         //                 var suoyin33 = el2.linkedUrl.indexOf(".html");
            //         //                 var routerindex2 = el2.linkedUrl.substring(suoyin3 + 1, suoyin33)
            //         //                 el2.linkedUrl = routerindex2;
            //         //             }
            //         //         })
            //         //     }
            //         // })
            //         this.menulists = res.body;
            //     } else {
            //         this.$message({
            //             type: 'error',
            //             message: res.msg
            //         });
            //     }

            // });
        }
}
</script>
<style scoped>
.sidebar {
    display: block;
    position: absolute;
    width: 250px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
}

.sidebar > ul {
    min-height: 100%;
}
</style>
