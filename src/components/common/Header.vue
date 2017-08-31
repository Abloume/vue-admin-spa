<template>
    <div class="header">
        <div class="logo">HCN3.0管理平台</div>

        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                     <img class="user-logo" :src="userimg">
                   <!--  <img class="user-logo" src="../../assets/img/img.jpg"> -->
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="user-info">
            <el-select v-model="selectroles" multiple filterable allow-create placeholder="请选择角色" :width="300" @change="selectchange">
                <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <!--  <div class="user-info">
            <el-select v-model="selectroles" multiple filterable allow-create placeholder="请选择租户" :width="300" @change="selectchange">
                <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </div> -->
    </div>
</template>
<script>
import {
    commonAjax, imgview
}
from '../../api/api';
export default {
    data() {
            return {
                userAvatar: 0,
                name: 'admin',
                rolelist: [],
                selectroles: [],
            }
        },
        computed: {
            username() {
                    let username = sessionStorage.getItem('userName');
                    return username ? username : this.name;
                },
                userimg() {
                    let userAvatar = sessionStorage.getItem('userAvatar');
                    return userAvatar ? imgview + userAvatar : imgview + this.userAvatar;
                }
        },
        methods: {
            handleCommand(command) {
                    if (command == 'loginout') {
                        sessionStorage.removeItem('accessToken')
                        sessionStorage.removeItem('userName')
                       var urlopt=sessionStorage.getItem('loginurl')
                        this.$router.push('/login'+urlopt);
                    }
                },
                getrolelist() {
                    let userId = sessionStorage.getItem('userId');
                    let proCode= sessionStorage.getItem('peoCode');
                    let param = `['${userId}','${proCode}']`;
                    commonAjax("cas.roleManageService", "roleByUserIdAndProductCode", param).then(res => {
                        if (res.code == 200) {
                            this.rolelist = res.body;
                            this.selectroles = [];
                            $.each(this.rolelist, function(index, el) {
                                this.selectroles.push(el.id)
                            }.bind(this));
                            sessionStorage.setItem('roleIds', this.selectroles.join(",")); //数据权限
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                getmenu() {
                    let rolelist = JSON.stringify(this.selectroles);
                    let proCode= sessionStorage.getItem('peoCode');
                    let param = `[${rolelist},'${proCode}']`;
                    // let rolelist = JSON.stringify(["patient","hcn.tongxiang.admin"]);
                    // let param = `[${rolelist},'hcn.tongxiang']`;
                    commonAjax("cas.menuManageService", "getRoleMenuTree", param).then(res => {
                        if (res.code == 200) {
                            $.each(res.body,function(index, el) {
                                el.child=[];
                                $.each(res.body,function(index2, el2) {
                                    if(el.id==el2.pId){
                                        el.child.push(el2)
                                    }
                                });
                            });
                             res.body= res.body.filter(function(el) {
                                 return el.child.length>0;
                             });
                             this.$store.dispatch('rolemenulists', res.body)
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }

                    });
                },
            selectchange(val) {
                this.getmenu();
            }
        },
        mounted() {
            this.getrolelist()
        }
}
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    line-height: 70px;
    color: #fff;
}

.header .logo {
    float: left;
    width: 250px;
    text-align: center;
}

.user-info {
    float: right;
    padding-right: 50px;
    font-size: 16px;
    color: #fff;
}

.user-info .el-dropdown-link {
    position: relative;
    display: inline-block;
    padding-left: 50px;
    color: #fff;
    cursor: pointer;
    vertical-align: middle;
}

.user-info .user-logo {
    position: absolute;
    left: 0;
    top: 15px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.el-dropdown-menu__item {
    text-align: center;
}

.el-select {
    width: 600px;
}
</style>
