<template>
    <div class="login-wrap">
        <div class="ms-title">HCN3.0管理平台</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.lock="loading">登录</el-button>
                    <!--   <div class="selectrole" id="selectrole">
                        <h3>请选择一个登录角色</h3>
                        <ul>
                            <li :class="{'maindoc':item.roleId=='main_doctor','choicdoc':item.roleId=='chronic_doctor','healthdoc':item.roleId=='health_doctor'}" @click="getrid(item)" v-for="(item,index) in role_list">
                                <p></p>
                                <p>{{item.roleName}}</p>
                            </li>
                        </ul>
                    </div> -->
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import {
    requestrolelist, requestLoginon
}
from '../../api/api';
import md5 from 'md5';
export default {
    data: function() {
        return {
            ruleForm: {
                username: 'hcn.admin',
                password: 'qwerty'
            },
            rules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]
            },
            loading: false
        }
    },
    methods: {
        // 点击登录按钮，如果只有一个角色（过滤掉APP中病人的角色），直接根据角色ID登录
        submitForm(formName) {
                this.loading = true;
                var  tenantId="";
                let url = window.location.href;
                 console.log(url);
                if (url.length > 0) {
                    let paramStr= url.substring(url.indexOf('=') + 1);
                     let paramStr2= url.substring(url.indexOf('?'));
                     console.log(paramStr2);
                    sessionStorage.setItem('loginurl', paramStr2)
                    sessionStorage.setItem('peoCode', paramStr);
                    let temarr=paramStr.split(".");
                    if(temarr.length==3){
                        tenantId=temarr[0]+"."+temarr[1]
                    }else{
                        tenantId=temarr[0]
                    }
                }

                let loginParams = {
                    tenantId: tenantId,
                    loginName: this.ruleForm.username,
                    pwd: md5(this.ruleForm.password),
                    forAccessToken: true
                }

                // let tenantIdIndex=url.indexof(".",-1)

                //桐乡租户
                // let loginParams = {
                //    "tenantId":"hcn.tongxiang","loginName":"hcn.tongxiang.admin","pwd":"d8578edf8458ce06fbc5bb76a58c5ca4","forAccessToken":true
                // }

                // let loginParams = {
                //    "tenantId":"hcn.tongxiang","loginName":"15924139771","pwd":md5("qwerty"),"forAccessToken":true
                // }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        requestLoginon(loginParams).then(res => {
                            if (res.code == 200) {
                                this.loading = false;
                                sessionStorage.setItem('accessToken', res.properties.accessToken);
                                sessionStorage.setItem('tenantId', res.body.tenantId);
                                sessionStorage.setItem('userId', res.body.userId);
                                sessionStorage.setItem('userName', res.body.userName);
                                sessionStorage.setItem('userAvatar', res.body.userAvatar); //用户图像
                                // sessionStorage.setItem('roleIds', "01,02,03,04,05,06,admin"); //数据权限
                                this.$router.push('/readme');
                            } else if (res.code == 501) {
                                this.loading = false;
                                this.$message({
                                    type: 'error',
                                    message: "密码不正确"
                                });
                            } else if (res.code == 404) {
                                this.loading = false;
                                this.$message({
                                    type: 'error',
                                    message: "用户ID不存在"
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: "登录失败，请确认账号密码是否正确！"
                                });
                            }
                        })
                    } else {
                        this.loading = false;
                        return false;
                    }
                });
            },
            // 点击角色列表中的某个角色
            // getrid(item) {
            //     this.loading = true;
            //     this.loginon(item.roleId)
            // },
            // 获取角色ID登录
            // loginon(roleId) {
            //     let temopt = {
            //         tenantId: 'coms.xiangtan',
            //         loginName: this.ruleForm.username,
            //         rid: roleId,
            //         pwd: md5(this.ruleForm.password),
            //         forAccessToken: true
            //     };
            //     requestLoginon(temopt).then((res) => {
            //         this.loading = false;
            //         if (res.code == 200) {
            //             sessionStorage.setItem('accessToken', res.properties.accessToken);
            //             sessionStorage.setItem('userName', res.body.userName);
            //             sessionStorage.setItem('rid', res.body.roleId);
            //             this.$router.push('/readme');
            //         } else {
            //             this.$message({
            //                 type: 'error',
            //                 message: ""
            //             });
            //         }

            //     })
            // }
    },
    mounted(){

        
    }
}
</script>
<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}

.login-btn {
    text-align: center;
    position: relative;
}

.login-btn button {
    width: 100%;
    height: 36px;
}


/*.selectrole {
    width: 300px;
    height: 240px;
    position: absolute;
    top: -157px;
    left: -344px;
    border-radius: 5px 0 0 5px;
    z-index: 99;
    background: rgba(29, 196, 153, 0.8);
    display: none;
}

.selectrole h3 {
    color: #fff;
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    font-weight: normal;
}

.selectrole ul {
    width: 270px;
    margin: 0 auto;
}

.selectrole ul li {
    padding: 10px 0 10px;
    width: 80px;
    height: 120px;
    float: left;
    color: #fff;
    margin-left: 10px;
    border-radius: 5px;
}

.selectrole ul li p {
    line-height: 30px;
    height: 30px;
    text-align: center;
}

.selectrole ul li.maindoc p:nth-child(1) {
    height: 80px;
    background: url(../../assets/img/maindoc.png) no-repeat center center;
}

.selectrole ul li.choicdoc p:nth-child(1) {
    height: 80px;
    background: url(../../assets/img/choicdoc.png) no-repeat center center;
}

.selectrole ul li.healthdoc p:nth-child(1) {
    height: 80px;
    background: url(../../assets/img/healthdoc.png) no-repeat center center;
}

.selectrole ul li:hover {
    background: rgba(255, 255, 255, 0.7);
    color: #0677eb
}*/
</style>
