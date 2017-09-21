<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="5" class="addorg">
                    <el-select v-model="params.tenantId" placeholder="请选择租户" filterable>
                        <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" class="addorg">
                    <el-input v-model="params.loginName" placeholder="请输入登录名"></el-input>
                </el-col>
                <el-col :span="5" class="addorg">
                    <el-input v-model="params.name" placeholder="请输入用户名"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
                <el-col :span="4" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit">新增</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="loginName" label="登录名">
            </el-table-column>
            <el-table-column prop="name" label="用户名">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="createDt" label="注册时间">
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template scope="scope">
                    <p v-show="scope.row.status==1">可用</p>
                    <p v-show="scope.row.status==0">不可用</p>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="userDisable(scope.$index, scope.row)" v-if="scope.row.status==1">禁用</el-button>
                    <el-button size="small" type="success" @click="userDisable(scope.$index, scope.row)" v-if=" scope.row.status==0">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-form-item label="登录名" :label-width="formLabelWidth" prop="loginName">
                    <el-input v-model="formdata.loginName"></el-input>
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="formdata.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                    <el-row>
                        <el-col :span="16">
                            <el-input type="password" v-model="formdata.password" auto-complete="off" :disabled="ispwedit"></el-input>
                        </el-col>
                        <el-col :span="5" >
                            <el-button type="primary" @click="pwedit" v-show="ispwedit">编辑密码</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item label="确认密码" prop="checkPass" :label-width="formLabelWidth">
                    <el-input type="password" v-model="formdata.checkPass" auto-complete="off" :disabled="ispwedit"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="formdata.email"></el-input>
                </el-form-item>
                <h2 class="account-title">
                    <span>角色列表</span>
                      <el-button size="small" type="primary" @click="handleEdit2" icon="plus">添加角色</el-button>
                </h2>
                <el-table :data="temlist" border style="width: 100%">
                    <el-table-column prop="tenantId" label="租户id">
                    </el-table-column>
                    <el-table-column prop="roleId" label="角色id">
                    </el-table-column>
                    <el-table-column prop="dataAuthorityType" label="数据权限级别">
                        <template scope="scope">
                            <p v-if="scope.row.dataAuthorityType==='00'">所有</p>
                            <p v-if="scope.row.dataAuthorityType==='01'">租户</p>
                            <p v-if="scope.row.dataAuthorityType==='02'">机构</p>
                            <p v-if="scope.row.dataAuthorityType==='04'">团队</p>
                            <p v-if="scope.row.dataAuthorityType==='05'">本人</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dataAuthorityValue" label="数据权限值">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogtitle2" v-model="dialogFormVisible2" @close="resetForm('adinfoForm2')">
            <el-form :model="formdata2" :rules="formrules2" ref="adinfoForm2" auto-complete="off" id="adinfoForm2">
                <el-form-item label="所属租户" :label-width="formLabelWidth" prop="tenantId">
                    <el-select v-model="formdata2.tenantId" placeholder="请选择租户" filterable @change="changetenantId">
                        <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth" prop="roleId">
                    <el-select v-model="formdata2.roleId" placeholder="请选择" filterable>
                        <el-option v-for="item in rolelist" :key="item.roleId" :label="item.name" :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限级别" prop="dataAuthorityType" :label-width="formLabelWidth">
                    <el-select v-model="formdata2.dataAuthorityType" placeholder="请选择" @change="changedataAuthorityType">
                        <el-option v-for="item in dictionary.dataAuthorityLevel" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限值" prop="dataAuthorityValue" :label-width="formLabelWidth" v-show="isshow">
                    <el-select v-model="formdata2.dataAuthorityValue" placeholder="请选择租户" filterable multiple>
                        <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限值" prop="dataAuthorityValue" :label-width="formLabelWidth" v-show="!isshow">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-input v-model="formdata2.dataAuthorityValue" disabled v-show="formdata2.dataAuthorityType!== '02'||formdata2.dataAuthorityType !== '04'"></el-input>
                             <el-input v-model="formdata2.curdataAuthorityValuetext" disabled v-show="formdata2.dataAuthorityType === '02'||formdata2.dataAuthorityType === '04'"></el-input>
                        </el-col>
                        <el-col :span="5" v-show="isshow2">
                            <el-button type="primary" @click="selectAuthorityValue" v-show="formdata2.dataAuthorityValue!=1">请选择</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
               <!--  <el-form-item label="权限值" :label-width="formLabelWidth" prop="curdataAuthorityValuetext" v-show="formdata2.dataAuthorityType === '02'||formdata2.dataAuthorityType === '04'">
                    <el-input v-model="formdata2.curdataAuthorityValuetext" disabled></el-input>
                </el-form-item> -->
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal2('adinfoForm2')">取 消</el-button>
                <el-button type="primary" @click="submitForm2('adinfoForm2')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 机构列表选择 -->
        <el-dialog title="机构列表" v-model="orgdialog">
            <el-row class="search_con2" :gutter="20">
                <el-col :span="4" class="addorg" :offset="19">
                    <el-button type="primary" @click="confirmselect">确定</el-button>
                </el-col>
            </el-row>
            <el-table :data="orglist" border style="width: 100%">
                <el-table-column prop="" label="选择" width="130">
                    <template scope="scope">
                        <input type="checkbox" :name="scope.$index" v-model="scope.row.checked" @change="orgCheckedChange(scope.row)">
                    </template>
                </el-table-column>
                <el-table-column prop="orgFullName" label="医院名称">
                </el-table-column>
                <el-table-column prop="orgId" label="机构id">
                </el-table-column>
                <!-- <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="orgselect(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="orgtotal" :page-sizes="[10,20,50]" @size-change="orghandleSizeChange" @current-change="orghandleCurrentChange" :page-size="orgparams.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 团队列表 -->
        <el-dialog title="团队列表" v-model="teamdialog">
            <el-row class="search_con2" :gutter="20">
                <el-col :span="4" class="addorg" :offset="19">
                    <el-button type="primary" @click="confirmselect">确定</el-button>
                </el-col>
            </el-row>
            <el-table :data="teamlist" border style="width: 100%">
                <el-table-column prop="" label="选择" width="130">
                    <template scope="scope">
                        <input type="checkbox" :name="scope.$index" v-model="scope.row.checked" @change="teamCheckedChange(scope.row)">
                    </template>
                </el-table-column>
                <el-table-column prop="teamName" label="团队名称">
                </el-table-column>
                <el-table-column prop="teamId" label="团队id">
                </el-table-column>
                <el-table-column prop="teamLeaderName" label="团队长">
                </el-table-column>
                <!--  <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="orgselect(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="teamtotal" :page-sizes="[10,20,50]" @size-change="teamhandleSizeChange" @current-change="teamhandleCurrentChange" :page-size="teamparams.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax
}
from '../../api/api';
import md5 from 'md5';
export default {
    data() {
            var validatePass = (rule, value, callback) => {

                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (value.length > 20 || value.length < 6) {
                        callback(new Error('请输入6-20个字符的密码'));
                    } else {
                        if (this.formdata.checkPass !== '') {
                            this.$refs.adinfoForm.validateField('checkPass');
                        }
                        callback();
                    }

                }
            };


            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formdata.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                // 通用
                formLabelWidth: '120px',
                // 列表常用的数据开始
                tableData: [],
                params: {
                    "loginName": "",
                    "name": "",
                    "pageNo": 1,
                    "pageSize": 10,
                    "tenantId": ""
                },
                total: "",
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "email": "",
                    "id": undefined,
                    "loginName": "",
                    "name": "",
                    "password": "",
                    checkPass: "",
                    "userRoleTokens": []
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    loginName: [{
                        required: true,
                        message: '请输入登录名',
                        trigger: 'blur'
                    }, {
                        max: 32,
                        message: '最多32个字符',
                        trigger: 'blur'
                    }],
                    name: [{
                        max: 50,
                        message: '最多50个字符',
                        trigger: 'blur'
                    },{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    email: [{
                        max: 45,
                        message: '最多45个字符',
                        trigger: 'blur'
                    }],
                    password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },{
                        validator: validatePass,
                        trigger: 'blur'
                    }],
                    checkPass: [{
                        required: true,
                        message: '请再次输入密码',
                        trigger: 'blur'
                    },{
                        validator: validatePass2,
                        trigger: 'blur'
                    }],
                },
                dialogFormVisible2: false, //模态框显示隐藏用
                formdata2: { //表单绑定数据用
                    "dataAuthorityType": "",
                    "dataAuthorityValue": [],
                    "id": undefined,
                    "roleId": "",
                    "tenantId": undefined,
                    "dataAuthorityValuetext": [],
                    "curdataAuthorityValuetext":"",
                },

                dialogtitle2: "", //模态框动态标题
                formrules2: { //表单验证规则
                    dataAuthorityType: [{
                        required: true,
                        message: '请选择',
                    }],
                    dataAuthorityValue: [{
                        required: true,
                        message: '请选择',

                    }],
                    roleId: [{
                        required: true,
                        message: '请选择',

                    }],
                    tenantId: [{
                        required: true,
                        message: '请选择',

                    }],
                },
                //字典查询数据
                dictionary: {
                    dataAuthorityLevel: [], //广告位置

                },
                rolelist: [],
                tenantData: [], //租户列表
                teamlist: [], //家医团队的列表
                teamdialog: false,
                teamtotal: "",
                teamparams: {
                    pageNo: 1,
                    pageSize: 10,
                },
                orglist: [],
                orgdialog: false,
                orgtotal: "",
                orgparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                isshow: false,
                isshow2: false, //请选择按钮的显示和隐藏
                // isdisabled: false,
                orgobject: {},
                teamobject: {},
                temlist: [],//角色列表临时存储的数组
                ispwedit:false,//编辑用户的时候显示是否修改密码
                
            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
            //点击编辑的方法

            handleEdit(index, row) {
                    this.dialogFormVisible = true;
                    if (row) {
                        this.dialogtitle = "编辑用户";
                        this.ispwedit=true;
                        this.formdata = {
                            "email": row.email,
                            "id": row.id,
                            "loginName": row.loginName,
                            "name": row.name,
                            "password": "",
                            checkPass: "",
                            "userRoleTokens": row.userRoleTokens,
                        }

                        commonAjax("cas.userManageService", "userDetail", `['${row.id}']`).then(res => {
                            if (res.code == 200) {
                                this.temlist = res.body[1]

                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });


                    } else {
                        this.dialogtitle = "新增用户";
                         this.ispwedit=false;
                        this.formdata = {
                            "email": "",
                            "id": undefined,
                            "loginName": "",
                            "name": "",
                            "password": "",
                            "userRoleTokens": []
                        }
                        this.temlist = [];


                    }

                },
                //添加角色
                handleEdit2() {
                    this.dialogFormVisible2 = true;
                    this.dialogtitle2 = "添加角色";
                    this.formdata2 = { //表单绑定数据用
                        "dataAuthorityType": "",
                        "dataAuthorityValue": [],
                        "dataAuthorityValuetext": [],
                        "id": undefined,
                        "roleId": "",
                        "tenantId": ""
                    };
                    this.orgobject = {};
                    this.teamobject = {};
                    let temarr1 = [],
                        temarr2 = [];
                    $.each(this.orglist, function(index, el) {
                        el.checked = false;
                        temarr1.push(el)
                    });
                    $.each(this.teamlist, function(index, el) {
                        el.checked = false;
                        temarr2.push(el)
                    });
                    this.orglist = temarr1;
                    this.teamlist = temarr2;
                },
                // 禁用用户
                userDisable(index, row) {
                    const h = this.$createElement;
                    let textstatus="";
                    if(row.status==1){
                        textstatus="禁用"
                    }else{
                        textstatus="启用"
                    }
                    this.$msgbox({
                        title: '确认'+textstatus,
                        message: h('p', null, [
                            h('span', null, '是否'+textstatus),
                            h('i', {
                                style: 'color: teal'
                            }, row.loginName + "(" + row.name + ")")
                        ]),
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = '执行中...';
                                setTimeout(() => {
                                    done();
                                    setTimeout(() => {
                                        instance.confirmButtonLoading = false;
                                    }, 300);
                                }, 1000);
                            } else {
                                done();
                            }
                        }
                    }).then(action => {
                        if (action == 'cancel') {
                            this.$message({
                                type: 'info',
                                message: "取消保存"
                            });
                        } else {
                            let status = row.status == 0 ? "1" : "0"
                            let params = `['${row.id}','${status}']`;
                            commonAjax("cas.userManageService", "userStatusUpdated", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.getTableData();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg
                                    });
                                }
                            });
                        }

                    })
                },
                // 删除角色列表中的一条数据
                handleDelete(index, row) {
                    // this.$message.error('删除第' + (index + 1) + '行');
                    const h = this.$createElement;

                    this.$msgbox({
                            title: '确认删除',
                            message: h('p', null, [
                                h('span', null, '是否删除 '),
                                h('i', {
                                    style: 'color: teal'
                                }, "请确认是否删除")
                            ]),
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            beforeClose: (action, instance, done) => {
                                if (action === 'confirm') {
                                    instance.confirmButtonLoading = true;
                                    instance.confirmButtonText = '执行中...';
                                    setTimeout(() => {
                                        done();
                                        setTimeout(() => {
                                            instance.confirmButtonLoading = false;
                                        }, 300);
                                    }, 300);
                                } else {
                                    done();
                                }
                            }
                        })
                        .then(action => {
                            if (action == 'cancel') {
                                this.$message({
                                    type: 'info',
                                    message: "取消删除"
                                });
                            } else {
                                this.temlist.splice(index, 1)
                                this.$message({
                                    type: 'success',
                                    message: "删除成功"
                                });
                            }

                        })
                },

                //获取用户列表数据
                getTableData() {
                    commonAjax("cas.userManageService", "userList", '[' + JSON.stringify(this.params) + ']').then(res => {
                        if (res.code == 200) {
                            this.tableData = res.body.data;
                            this.total = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //改变分页显示的数量
                handleSizeChange(val) {
                    this.params.pageSize = val;
                    this.getTableData()
                },
                //跳转到分页输入框中页码的页面
                handleCurrentChange(val) {
                    this.params.pageNo = val;
                    this.getTableData()
                },
                //搜索按钮点击
                searchClick() {
                    this.getTableData();
                },
                // 列表常用的方法结束-------------------------------------------------------------------------------
                // 表单常用的方法开始
                //保存按钮提交数据
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (this.formdata.id) { //编辑的时候
                            if (this.formdata.password != '') { //编辑的时候输入密码
                                if (valid) {
                                    this.formdata.password = md5(this.formdata.password);
                                }
                            } else { //编辑的时候不输入密码
                                this.formdata.password = undefined;
                            }
                        } else { //新增
                            if (valid) {
                                this.formdata.password = md5(this.formdata.password);
                            }
                        }
                        this.submitajax()
                    });
                },
                //点击可编辑编辑密码
                pwedit(){
                    this.ispwedit=false;
                },
                // 点击请求的方法
                submitajax() {
                    if(this.temlist.length==0){
                         this.$message({
                                type: 'info',
                                message: "请添加角色"
                            });
                         this.formdata.password=this.formdata.checkPass;
                         return
                    }
                    commonAjax("cas.userManageService", "userSaved", '[' + JSON.stringify(this.formdata) + ',' + JSON.stringify(this.temlist) + ']').then(res => {
                        if (res.code == 200) {
                            this.dialogFormVisible = false;
                            this.$message({
                                type: 'success',
                                message: "保存成功"
                            });
                            this.getTableData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //保存新增的角色
            submitForm2(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {

                            this.dialogFormVisible2 = false;
                            let temarr = [];
                            if (this.formdata2.dataAuthorityType !== "01") {
                                this.formdata2.dataAuthorityValue = JSON.parse(this.formdata2.dataAuthorityValue);
                            }
                            $.each(this.formdata2.dataAuthorityValue, function(index, el) { //多个值分成多条数据存储到角色列表中
                                var temobj = {
                                    "dataAuthorityType": this.formdata2.dataAuthorityType,
                                    "dataAuthorityValue": el,
                                    "roleId": this.formdata2.roleId,
                                    "tenantId": this.formdata2.tenantId
                                    "dataAuthorityValuetext": this.formdata2.dataAuthorityValuetext[el],
                                }
                                temarr.push(temobj);
                            }.bind(this));
                            this.temlist = this.temlist.concat(temarr);

                        }
                    });
                },
                //点击取消的时候关闭
                closemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.dialogFormVisible = false;
                },
                closemodal2(formName) {
                    this.$refs[formName].resetFields();
                    this.dialogFormVisible2 = false;
                },
                //点击模态框关闭或者取消的时候重置表单
                resetForm(formName) {
                    this.$refs[formName].resetFields();

                },

                //获取数据权限的列表
                dictionaryRequest() {
                    commonAjax("cas.userManageService", "dataAuthorityLevel", '[]').then(res => {
                        if (res.code == 200) {
                          this.dictionary.dataAuthorityLevel=res.body

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 表单常用的方法结束--------------------------------------------------------------------------
                //获取搜索下拉框的租户列表
                gettenantData() {
                    let params = {
                        pageSize: 300,
                        pageNo: 1,
                    };
                    commonAjax("cas.tenantManageService", "tenantList", '[' + JSON.stringify(params) + ']').then(res => {
                        if (res.code == 200) {
                            this.tenantData = res.body.data;
                            this.params.tenantId=res.body.data[0].tenantId
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },

                //获取角色列表数据
                getroleTableData() {
                    let param = {
                        "roleId": "",
                        "name": "",
                        pageNo: 1,
                        pageSize: 300,
                        "tenantId": this.formdata2.tenantId,
                        editableFlag: "0"
                    }
                    commonAjax("cas.roleManageService", "roleList", '[' + JSON.stringify(param) + ']').then(res => {
                        if (res.code == 200) {
                            this.rolelist = res.body.data;

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取团队列表数据
                getteamtData() {
                    let {
                        pageSize, pageNo
                    } = this.teamparams;
                    let params = `[${pageNo},${pageSize}]`;
                    commonAjax("cas.teamManageService", "findTeamInfos", params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.items, function(index, el) {
                                el.checked = false
                                for (let key in this.teamobject) {
                                    if (key == el.teamId) {
                                        el.checked = true
                                    }
                                }
                            }.bind(this));
                            this.teamlist = res.body.items;
                            this.teamtotal = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                teamhandleSizeChange(val) {
                    this.teamparams.pageSize = val;
                    this.getteamData()
                },
                teamhandleCurrentChange(val) {
                    this.teamparams.pageNo = val;
                    this.getteamData()
                },
                //获取机构列表数据
                getorgData() {
                    let {
                        content, pageNo, pageSize
                    } = this.orgparams;
                    let params = `['${content}','',${pageNo},${pageSize}]`;
                    commonAjax("cas.orgService", "orgInfoList", params).then(res => {
                        if (res.code == 200) {
                            this.orglist = res.body.items;
                            this.orgtotal = res.body.total;
                            $.each(res.body.items, function(index, el) {
                                el.checked = false
                                for (let key in this.orgobject) {
                                    if (key == el.orgId) {
                                        el.checked = true
                                    }
                                }
                            }.bind(this));
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                orghandleSizeChange(val) {
                    this.orgparams.pageSize = val;
                    this.getorgData()
                },
                orghandleCurrentChange(val) {
                    this.orgparams.pageNo = val;
                    this.getorgData()
                },
                // 所属租户改变对应的角色列表也改变
                changetenantId(val) {
                    this.formdata2.tenantId = val;
                    this.getroleTableData();
                },
                //权限类型变化的时候
                changedataAuthorityType(val) {
                    if (val === "05" || val === "00") {
                        this.formdata2.dataAuthorityValue = JSON.stringify(["1"]);
                        this.isshow = false;
                        this.isshow2 = false;
                    } else if (val === "01") {
                        this.formdata2.dataAuthorityValue = [];
                        this.isshow = true
                    } else {
                        this.formdata2.dataAuthorityValue = [];
                        this.isshow = false;
                        this.isshow2 = true;

                    }
                },
                //改变机构列表的chenckbox时候修改对象属性
                orgCheckedChange(row) {
                    if (row.checked) {
                        this.orgobject[row.orgId]=row.orgFullName;
                    } else {
                        delete this.orgobject[row.orgId]
                    }
                },
                //改变团队列表的chenckbox时候修改对象属性
                teamCheckedChange(row) {
                    if (row.checked) {
                        this.teamobject[row.teamId] = row.teamName;
                    } else {
                        delete this.teamobject[row.teamId]
                    }
                },
                //点击选择数据权限值
                selectAuthorityValue() {
                    if (this.formdata2.dataAuthorityType === "02") {
                        this.orgdialog = true
                    }
                    if (this.formdata2.dataAuthorityType === "04") {
                        this.teamdialog = true
                    }
                },
                // 机构和团队确定选中的
                confirmselect() {
                     var temarr=[],temarr2=[];//防止再选的时候重复
                    if (this.formdata2.dataAuthorityType === "02") {
                        this.orgdialog = false
                       
                        for (let key in this.orgobject) {
                            temarr.push(key)
                             // console.log(this.orgobject[key])
                            temarr2.push(this.orgobject[key])

                        }
                    }
                    if (this.formdata2.dataAuthorityType === "04") {
                        this.teamdialog = false
                       
                        for (let key in this.teamobject) {
                             temarr.push(key)
                            temarr2.push(this.teamobject[key])
                        }

                    }
                    console.log(temarr2)
                      this.formdata2.dataAuthorityValue=temarr;
                      this.formdata2.dataAuthorityValuetext=temarr2
                    // this.formdata2.dataAuthorityValue = JSON.stringify(this.formdata2.dataAuthorityValue);
                    this.formdata2.curdataAuthorityValuetext= JSON.stringify(this.formdata2.dataAuthorityValuetext);
                    // this.curdataAuthorityValue=JSON.stringify(this.formdata2.dataAuthorityValue);
                    // if(this.formdata2.dataAuthorityValue.length>1){
                    //      this.formdata2.dataAuthorityValue = this.formdata2.dataAuthorityValue.join(",")
                    // }

                }

        },
        components: {

        },
        mounted() {
            this.dictionaryRequest();
            this.gettenantData();
            this.getteamtData();
            this.getorgData();
        },
        watch:{
            'params.tenantId'(val,oldval){
                 this.getTableData();
            }
        }

}
</script>
<style type="text/css" scoped>
.addorg button {
    float: right;
}

h2.account-title {
    font-size: 16px;
    border-bottom: 2px #EEE solid;
    padding: 5px 5%;
    margin-bottom: 20px;
    height: 40px;
}

h2.account-title button {
    float: right;
}

#adinfoForm {
    margin-bottom: 20px
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.search_con2 {
    margin-bottom: 20px;
}
</style>
