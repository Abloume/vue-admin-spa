<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>签约服务</el-breadcrumb-item>
                        <el-breadcrumb-item>签约申请</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12" class="addorg fr">
                    <el-select v-model="params.tenantId" placeholder="请选择租户">
                        <el-option v-for="item in tenantIdtableData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="3">
                    <el-input v-model="params.personName" placeholder="居民姓名"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="params.tel" placeholder="联系电话"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="params.orgName" placeholder="签约机构名称"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="params.teamName" placeholder="签约团队"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-input v-model="params.teamLeaderName" placeholder="团队长"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="params.signState" placeholder="状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待确认" value="11"></el-option>
                        <el-option label="已取消" value="12"></el-option>
                        <el-option label="已签约" value="13"></el-option>
                        <el-option label="未通过" value="14"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="personName" label="居民姓名">
            </el-table-column>
            <el-table-column prop="tel" label="联系电话">
            </el-table-column>
            <el-table-column prop="orgName" label="签约机构名称">
            </el-table-column>
            <el-table-column prop="teamName" label="签约团队">
            </el-table-column>
            <el-table-column prop="teamLeaderName" label="团队长">
            </el-table-column>
            <el-table-column prop="createAt" label="申请时间">
            </el-table-column>
            <el-table-column prop="signState" label="状态">
                <template scope="scope">
                    <p v-show="scope.row.signState==12">已取消</p>
                    <p v-show="scope.row.signState==13">已签约</p>
                    <p v-show="scope.row.signState==14">未通过</p>
                    <p v-show="scope.row.signState==11">待确认</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" @click="confirmapply(scope.$index, scope.row)" v-if=" scope.row.signState!=11">查看</el-button>
                    <el-button size="small" type="success" @click="confirmapply(scope.$index, scope.row)" v-if=" scope.row.signState==11">确认</el-button>
                    <el-button size="small" @click.native="print(scope.$index, scope.row)">打印</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <h2 class="account-title">
                    <span>居民信息</span>
                </h2>
                <el-form-item label="头像" :label-width="formLabelWidth">
                    <img :src="imgview+formdata.personHeader" width="100" height="150">
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="personName">
                    <el-input v-model="formdata.personName" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                    <el-select v-model="formdata.sex" placeholder="请选择性别" disabled>
                        <el-option v-for="item in dictionary.gender" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国籍" :label-width="formLabelWidth" prop="nationality">
                    <el-select v-model="formdata.nationality" placeholder="请选择国籍" disabled>
                        <el-option v-for="item in dictionary.nationality" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期" :label-width="formLabelWidth" prop="dob">
                    <el-input v-model="formdata.dob" disabled></el-input>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="idCardType">
                    <el-select v-model="formdata.idCardType" placeholder="请选择证件类型" disabled>
                        <el-option v-for="item in dictionary.certificateType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth" prop="idCard">
                    <el-input v-model="formdata.idCard" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="tel">
                    <el-input v-model="formdata.tel" disabled></el-input>
                </el-form-item>
                <h2 class="account-title">
                    <span>签约信息</span>
                </h2>
                <el-form-item label="签约机构" :label-width="formLabelWidth" prop="orgName">
                    <el-input v-model="formdata.orgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="签约团队" :label-width="formLabelWidth" prop="teamName">
                    <el-input v-model="formdata.teamName" disabled></el-input>
                </el-form-item>
                <el-form-item label="团队长" :label-width="formLabelWidth" prop="teamLeaderName">
                    <el-input v-model="formdata.teamLeaderName" disabled></el-input>
                </el-form-item>
                <el-form-item label="签约周期" :label-width="formLabelWidth" prop="signCycle">
                    <el-input v-model="formdata.signCycle" disabled></el-input>
                </el-form-item>
                <el-form-item label="服务包" :label-width="formLabelWidth" prop="packages">
                    <el-select v-model="formdata.packages" multiple filterable allow-create placeholder="请选择标签" :disabled="islook">
                        <el-option v-for="item in packageslist" :key="item.spPackId" :label="item.spPackName" :value="item.spPackId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间" :label-width="formLabelWidth" prop="createAt">
                    <el-input v-model="formdata.createAt" disabled></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" prop="teamNames">
                    <el-select v-model="formdata.signState" placeholder="" disabled>
                        <el-option label="待确认" value="11"></el-option>
                        <el-option label="已取消" value="12"></el-option>
                        <el-option label="已签约" value="13"></el-option>
                        <el-option label="未通过" value="14"></el-option>
                    </el-select>
                </el-form-item>
                <h2 class="account-title">
                    <span>签约确认</span>
                </h2>
                <el-form-item label="确认意见" prop="signState2" :label-width="formLabelWidth">
                    <el-select v-model="formdata.signState2" placeholder="请选择产品" :disabled="islook">
                        <el-option label="同意" value="13"></el-option>
                        <el-option label="不同意" value="14"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="确认方式" :label-width="formLabelWidth" prop="checkWay">
                    <el-select v-model="formdata.checkWay" placeholder="请选择确认方式" :disabled="islook">
                        <el-option v-for="item in dictionary.channelType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约生效日期" :label-width="formLabelWidth" prop="signValidDate">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formdata.signValidDate" style="width: 100%;" @change="dateformat" format="yyyy-MM-dd" :disabled="islook"></el-date-picker>
                </el-form-item>
                <el-form-item label="管理类型" :label-width="formLabelWidth" prop="personGroup">
                    <el-select v-model="formdata.personGroup" placeholder="请选择管理类型" :disabled="islook">
                        <el-option v-for="item in dictionary.group" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区级医院" :label-width="formLabelWidth" prop="districtOrgName" v-if="formdata.openOneFlag==1">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-input v-model="formdata.districtOrgName" disabled></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="primary" @click="districtshow" :disabled="islook">请选择</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="市级医院" :label-width="formLabelWidth" prop="cityOrgName" v-if="formdata.openOneFlag==1">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-input v-model="formdata.cityOrgName" disabled></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="primary" @click="cityshow" :disabled="islook">请选择</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="operInfo">
                    <el-input v-model="formdata.operInfo" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="islook"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal('adinfoForm')" v-show="!islook">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')" v-show="!islook">确 定</el-button>
                <el-button type="info" @click="lookprotoco">查看协议</el-button>
            </div>
        </el-dialog>
        <el-dialog title="查看协议" v-model="curprotocoldialog">
            <div v-html="curprotocolcontent"></div>
        </el-dialog>
        <!-- cityOrglist -->
        <el-dialog title="" v-model="cityOrglistdialog">
            <el-table :data="cityOrglist" border style="width: 100%">
                <el-table-column prop="orgId" label="机构ID">
                </el-table-column>
                <el-table-column prop="orgFullName" label="机构名称">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button size="small" @click="selectcityOrg(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- districtOrglist -->
        <el-dialog title="" v-model="districtOrglistdialog">
            <el-table :data="districtOrglist" border style="width: 100%">
                <el-table-column prop="orgId" label="机构ID">
                </el-table-column>
                <el-table-column prop="orgFullName" label="机构名称">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button size="small" @click="selectdistrictOrg(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, imgview
}
from '../../api/api';
import 'assets/lib/print/jquery.jqprint-0.3.js';
import 'assets/lib/print/jquery-migrate-1.2.1.min.js';

export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
                imgview: imgview,
                // 列表常用的数据开始
                tableData: [],
                params: {
                    "orgName": "",
                    "pageNo": 1,
                    "pageSize": 10,
                    "personName": "",
                    "signState": "",
                    "teamLeaderName": "",
                    "teamName": "",
                    "tel": "",
                    "tenantId": ""
                },
                total: 1,
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "packages": [],
                    "teamLeaderName": "",
                    "address": "",
                    "teamId": 0,
                    "teamName": "",
                    "orgId": "",
                    "orgName": "",
                    "signCycle": 1,
                    "contactName": "",
                    "contactPhone": "",
                    "protocolId": 0,
                    "signId": 0,
                    "mpiId": "",
                    "idCardType": "",
                    "idCard": "",
                    "personHeader": 0,
                    "personName": "",
                    "sex": "",
                    "dob": "",
                    "tel": "",
                    "operPersonType": "",
                    "operPersonName": "",
                    "operTime": "",
                    "operInfo": "",
                    "createAt": "",
                    "checkWay": "",
                    "cityOrgId": "",
                    "cityOrgName": "",
                    "districtOrgId": "",
                    "districtOrgName": "",
                    "openOneFlag": "",
                    "personGroup": "",
                    "signState": "",
                    "signValidDate": "",
                    "signState2": "", //确认方式绑定
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    packages: [{
                        required: true,
                        message: '请选择服务包',

                    }],
                    checkWay: [{
                        required: true,
                        message: '请选择确认方式',
                        trigger: 'blur'
                    }],
                    cityOrgName: [{
                        required: true,
                        message: '请选择市医院',

                    }],
                    districtOrgName: [{
                        required: true,
                        message: '请选择区医院',
                    }],
                    signValidDate: [{
                        required: true,
                        message: '请选择签约生效日期',

                    }],
                    personGroup: [{
                        required: true,
                        message: '请选择管理类型',

                    }],
                    signState2: [{
                        required: true,
                        message: '请选择确认意见',
                    }]
                },
                imageUrl: "", //文件或者图片上传预览图片的src地址
                //字典查询数据
                dictionary: {
                    channelType: [],
                    nationality: [],
                    certificateType: [],
                    gender: [],
                    group: [],
                },
                tenantIdtableData: [],
                islook: false,
                packageslist: [],
                curteamId: "",
                cursignId: "",
                curorgId: "",
                curprotocolcontent: "",
                curprotocoldialog: false,
                "cityOrglist": [],
                "districtOrglist": [],
                cityOrglistdialog: false,
                districtOrglistdialog: false,
            }
        },
        computed: {

        },
        methods: {

            dateformat(val) {
                    this.formdata.signValidDate = val
                },
                print(index, row) {
                    var params = `[${row.signId}]`
                    commonAjax("cas.signService", "signedProtocolContent", params).then(res => {
                        if (res.code == 200) {
                            var temcont = `'<div>${res.body}</div>'`;
                            $(temcont).jqprint();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });

                },
                confirmapply(index, row) {
                    this.cursignId = row.signId;
                    this.curorgId = row.orgId;
                    this.curteamId = row.teamId;
                    this.getpackageslist()
                    if (row.signState == 11) {
                        this.islook = false;
                        this.dialogtitle = "签约确认";
                    } else {
                        this.dialogtitle = "签约查看"
                        this.islook = true
                    }
                    let param = `[${row.signId}]`;
                    commonAjax("cas.signService", "signDetail", param).then(res => {
                        if (res.code == 200) {
                            this.dialogFormVisible = true;

                            let temarr = [];
                            $.each(res.body.packages, function(index, el) {
                                temarr.push(el.spPackId);
                            });
                            this.formdata = { //表单绑定数据用
                                "packages": temarr,
                                "address": res.body.address,
                                "teamId": res.body.teamId,
                                "teamName": res.body.teamName,
                                "teamLeaderName": res.body.teamLeaderName,
                                "orgId": res.body.orgId,
                                "orgName": res.body.orgName,
                                "signCycle": res.body.signCycle,
                                "contactName": res.body.contactName,
                                "contactPhone": res.body.contactPhone,
                                "protocolId": res.body.protocolId,
                                "signId": res.body.signId,
                                "mpiId": res.body.mpiId,
                                "idCardType": res.body.idCardType,
                                "idCard": res.body.idCard,
                                "personHeader": res.body.personHeader,
                                "personName": res.body.personName,
                                "sex": res.body.sex,
                                "dob": res.body.dob,
                                "tel": res.body.tel,
                                "operPersonType": res.body.operPersonType,
                                "operPersonName": res.body.operPersonName,
                                "operTime": res.body.operTime,
                                "operInfo": res.body.operInfo,
                                "createAt": res.body.createAt,
                                "signState": res.body.signState, 
                                "checkWay": this.islook ? res.body.checkWay : "",
                                "cityOrgId": this.islook ? res.body.cityOrgId : "",
                                "cityOrgName": this.islook ? res.body.cityOrgName : "",
                                "districtOrgId": this.islook ? res.body.districtOrgId : "",
                                "districtOrgName": this.islook ? res.body.districtOrgName : "",
                                "openOneFlag": this.islook ? res.body.openOneFlag : "",
                                "personGroup": this.islook ? res.body.personGroup : "",
                                "signValidDate": this.islook ? res.body.signValidDate : "",
                                "signState2": this.islook ? res.body.signState : "",
                            }
                            if (row.signState == 11) {
                                this.getsign111()
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });

                },

                //获取搜索下拉框的租户列表
                gettenantIdlist() {
                    let params = {
                        "pageNo": 1,
                        "pageSize": 300,
                    }
                    commonAjax("cas.tenantManageService", "tenantList", '[' + JSON.stringify(params) + ']', ).then(res => {
                        if (res.code == 200) {
                            this.tenantIdtableData = res.body.data;
                            this.params.tenantId = res.body.data[0].tenantId
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取服务包下拉框
                getpackageslist() {
                    let params = `[${this.curteamId},${this.cursignId}]`
                    commonAjax("cas.signService", "spPackApplyChecked", params).then(res => {
                        if (res.code == 200) {
                            this.packageslist = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取是否有1+1+1签约
                getsign111() {
                    let params = `['${this.curorgId}']`
                    commonAjax("cas.signService", "hasService", params).then(res => {
                        if (res.code == 200) {
                            this.formdata.openOneFlag = res.body ? "1" : 0
                            if (this.formdata.openOneFlag == 1) {
                                this.getorgbelong(2);
                                this.getorgbelong(3);
                            }

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 查询市级医院或者区级医院
                getorgbelong(nubmerstr) {
                    let params = `['','${this.curorgId}','${nubmerstr}']`
                    commonAjax("cas.signService", "queryOrgInfoByAreaLevel", params).then(res => {
                        if (res.code == 200) {
                            if (nubmerstr == 2) {
                                this.districtOrglist = res.body
                            } else {
                                this.cityOrglist = res.body
                            }

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取列表数据
                getTableData() {
                    commonAjax("cas.signService", "signApplyList", '[' + JSON.stringify(this.params) + ']').then(res => {
                        if (res.code == 200) {
                            // $.each(res.body.list, function(index, el) {
                            //     el.valid_startDate = el.valid_startDate.substring(0, 10)
                            //     el.valid_endDate = el.valid_endDate.substring(0, 10)
                            // }.bind(this));
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
                        if (valid) {
                            let temarr = [];
                            let that=this;
                            $.each(this.packageslist, function(index, el) {
                                $.each(that.formdata.packages, function(index2, el2) {
                                    if (el.spPackId == el2) {
                                        temarr.push(el)
                                    }
                                });
                            });
                            let temsubmitdata = {
                                "checkWay": this.formdata.checkWay,
                                "cityOrgId": this.formdata.cityOrgId,
                                "cityOrgName": this.formdata.cityOrgName,
                                "districtOrgId": this.formdata.districtOrgId,
                                "districtOrgName": this.formdata.districtOrgName,
                                "openOneFlag": this.formdata.openOneFlag,
                                "operInfo": this.formdata.operInfo,
                                "packages": temarr,
                                "personGroup": this.formdata.personGroup,
                                "signId": this.formdata.signId,
                                "signState": this.formdata.signState2,
                                "signValidDate": this.formdata.signValidDate,
                            }
                            commonAjax("cas.signService", "signApplyConfirmed", '[' + JSON.stringify(temsubmitdata) + ']', ).then(res => {
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
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
                //点击取消的时候关闭
                closemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.dialogFormVisible = false;
                },
                //点击模态框关闭或者取消的时候重置表单
                resetForm(formName) {
                    this.$refs[formName].resetFields();

                },
                // //上传文件或者图片成功后
                // handleAvatarSuccess(res, file) {
                //     this.imageUrl = imgview + res.body;
                //     this.formdata.picture = res.body;
                //     this.$message.success('上传成功');
                // },
                // //上传上传文件或者图片之前
                // beforeAvatarUpload(file) {

                //     // const isJPG = file.type === 'image/jpeg';
                //     // const isLt2M = file.size / 1024 / 1024 < 2;

                //     // if (!isJPG) {
                //     //     this.$message.error('上传头像图片只能是 JPG 格式!');
                //     // }
                //     // if (!isLt2M) {
                //     //     this.$message.error('上传头像图片大小不能超过 2MB!');
                //     // }
                //     // return isJPG && isLt2M;

                // },
                //获取字典
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_channelType", "cfs.dic.base_nationality", "cfs.dic.base_certificateType", "cfs.dic.base_gender", "cfs.dic.base_group"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            var that = this;
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.channelType = ele.items;
                                }
                                if (ele.dicId == arr[1]) {
                                    that.dictionary.nationality = ele.items;
                                }
                                if (ele.dicId == arr[2]) {
                                    that.dictionary.certificateType = ele.items;
                                }
                                if (ele.dicId == arr[3]) {
                                    that.dictionary.gender = ele.items;
                                }
                                if (ele.dicId == arr[4]) {
                                    that.dictionary.group = ele.items;
                                }

                            })

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                lookprotoco() {
                    this.curprotocoldialog = true;
                    this.getprotococont();
                },
                getprotococont() {
                    var params = `[${this.cursignId}]`
                    commonAjax("cas.signService", "signedProtocolContent", params).then(res => {
                        if (res.code == 200) {
                            this.curprotocolcontent = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                selectdistrictOrg(index, row) {
                    this.formdata.districtOrgId = row.orgId;
                    this.formdata.districtOrgName = row.orgFullName;
                    this.districtOrglistdialog = false;
                },
                selectcityOrg(index, row) {
                    this.formdata.cityOrgId = row.orgId;
                    this.formdata.cityOrgName = row.orgFullName;
                    this.cityOrglistdialog = false
                },
                //地区医院选择列表弹框
                districtshow() {
                    this.districtOrglistdialog = true;
                },
                //市级医院选择列表弹框
                cityshow() {
                    this.cityOrglistdialog = true;
                },
                // 表单常用的方法结束--------------------------------------------------------------------------

        },
        components: {

        },
        mounted() {

            this.gettenantIdlist();
            this.dictionaryRequest();
        },
        watch: {
            'params.tenantId' (val, oldval) {
                this.getTableData();
            }
        }

}
</script>
<style type="text/css" scoped>
.addorg button {
    float: right;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 89px;
    height: 89px;
    line-height: 89px;
    text-align: center;
}

.avatar {
    width: 89px;
    height: 89px;
    display: block;
}

.el-upload--text {
    width: 90px;
    height: 90px;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.el-table td,
.el-table th {
    padding: 5px;
}

.fr {
    float: right
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
</style>
