<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
                        <el-breadcrumb-item>医生审核</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="4">
                    <el-input v-model="params.name" placeholder="医生姓名"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="params.orgName" placeholder="机构名称"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-input v-model="params.phoneNo" placeholder="联系电话"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-date-picker v-model="params.start" type="date" placeholder="申请开始时间" @change="dateformat" format="yyyy-MM-dd">
                    </el-date-picker>
                </el-col>
                <el-col :span="4">
                    <el-date-picker v-model="params.end" type="date" placeholder="申请结束时间" @change="dateformat2" format="yyyy-MM-dd">
                    </el-date-picker>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="医生">
            </el-table-column>
            <el-table-column prop="phoneNo" label="联系电话">
            </el-table-column>
            <el-table-column prop="idCard" label="身份证号">
            </el-table-column>
            <el-table-column prop="orgName" label="机构">
            </el-table-column>
            <el-table-column prop="docTypeText" label="医生类别">
            </el-table-column>
            <el-table-column prop="checkStatusText" label="状态">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" @click="lookorreview(scope.$index, scope.row)" v-if="scope.row.checkStatus==1||scope.row.checkStatus==2">查看</el-button>
                    <el-button size="small" type="primary" @click="lookorreview(scope.$index, scope.row)" v-if="scope.row.checkStatus==0">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtit" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <h2 class="account-title">
                    <span>申请信息</span>
                </h2>
                <el-form-item label="医生" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="formdata.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phoneNo">
                    <el-input v-model="formdata.phoneNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idCard">
                    <el-input v-model="formdata.idCard" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                    <el-select v-model="formdata.sex" placeholder="请选择性别" disabled>
                        <el-option v-for="item in dictionary.gender" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构" :label-width="formLabelWidth" prop="orgName">
                    <el-input v-model="formdata.orgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="科室" :label-width="formLabelWidth" prop="deptName">
                    <el-input v-model="formdata.deptName" disabled></el-input>
                </el-form-item>
                <el-form-item label="所在团队" :label-width="formLabelWidth" prop="teamNames">
                    <el-input v-model="formdata.teamNames" disabled></el-input>
                </el-form-item>
                <el-form-item label="医生类别" :label-width="formLabelWidth" prop="docTypeText">
                    <el-input v-model="formdata.docTypeText" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth" prop="roleNames">
                    <el-input v-model="formdata.roleNames" disabled></el-input>
                </el-form-item>
                <el-form-item label="工号" :label-width="formLabelWidth" prop="localDoctorId">
                    <el-input v-model="formdata.localDoctorId" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请时间" :label-width="formLabelWidth" prop="regTime" v-show="formdata.checkStatus==0">
                    <el-input v-model="formdata.regTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="资质证书" :label-width="formLabelWidth">
                    <div class="imguint" v-for="(item,index) in certifyPicsarr">
                        <img :src="item" @click="imgshow(item)" width="200" height="100">
                    </div>
                </el-form-item>
                <h2 class="account-title">
                    <span>审核信息</span>
                </h2>
                <el-form-item label="审核意见" prop="checkStatus" :label-width="formLabelWidth" v-show="formdata.checkStatus==0">
                    <el-radio-group v-model="subformdata.checkStatus" >
                        <el-radio label="1">通过</el-radio>
                        <el-radio label="2">未通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item label="审核意见" :label-width="formLabelWidth" prop="checkStatus" v-show="formdata.checkStatus!=0">
                   <el-radio-group v-model="formdata.checkStatus">
                        <el-radio label="1" disabled>通过</el-radio>
                        <el-radio label="2" disabled>未通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="checkInfo">
                    <el-input v-model="formdata.checkInfo" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="formdata.checkStatus!=0"></el-input>
                </el-form-item>

                <el-form-item label="审核人" :label-width="formLabelWidth" prop="checkUser" v-show="formdata.checkStatus!=0">
                    <el-input v-model="formdata.checkUser" :disabled="formdata.checkStatus!=0"></el-input>
                </el-form-item>
                <el-form-item label="审核时间" :label-width="formLabelWidth" prop="checkTime" v-show="formdata.checkStatus!=0">
                    <el-input v-model="formdata.checkTime" :disabled="formdata.checkStatus!=0"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot" v-show="formdata.checkStatus==0">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog v-model="imgshowdialog">
            <img :src="curimg" width="100%" height="100%" class="curimg">
        </el-dialog>
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
                // 通用
                formLabelWidth: '120px',
                // 列表常用的数据开始
                tableData: [],
                params: {
                    "end": "",
                    "orgName": "",
                    "pageNo": 1,
                    "pageSize": 10,
                    "phoneNo": "",
                    "start": "",
                    "tenantId": sessionStorage.getItem('tenantId')
                },
                 //字典查询数据
                dictionary: {
                    gender: [],
                },
                total: "",
                dialogtit: "",
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "doctorRegId": 0,
                    "tenantId": "",
                    "userId": "",
                    "name": "",
                    "sex": "",
                    "idCard": "",
                    "localDoctorId": "",
                    "docType": "",
                    "roleIds": "",
                    "orgId": "",
                    "orgName": "",
                    "deptId": "",
                    "deptName": "",
                    "teamIds": "",
                    "teamNames": "",
                    "certifyPics": "",
                    "regTime": "",
                    "checkStatus": 0,
                    "status": "",
                    "checkStatusText": "",
                    "phoneNo": "",
                    "docTypeText": "",
                    "roleName": "",
                    "checkTime": "",
                    "checkUser":"",

                },
                subformdata: {
                    "checkStatus":"",
                },
                formrules: { //表单验证规则
                    checkInfo: [{
                        required: true,
                        message: '请输入不通过备注',
                        trigger: 'blur'
                    }]
                },
                dialogImageUrl: '',
                imgshowdialog: false,
                certifyPicsarr: [],
                curimg: "",



            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
             dateformat(val) {
                    this.params.start = val
                },
                dateformat2(val) {
                    this.params.end = val
                },
            // 查看
            lookorreview(index, row) {
                        this.dialogFormVisible = true;
                        this.dialogtit = row.name + "的相关信息";
                        this.formdata = {
                            "doctorRegId": row.doctorRegId,
                            "tenantId": row.tenantId,
                            "userId": row.userId,
                            "name": row.name,
                            "sex": row.sex,
                            "idCard": row.idCard,
                            "localDoctorId": row.localDoctorId,
                            "docType": row.docType,
                            "roleIds": row.roleIds,
                            "orgId": row.orgId,
                            "orgName": row.orgName,
                            "deptId": row.deptId,
                            "deptName": row.deptName,
                            "teamIds": row.teamIds,
                            "teamNames": row.teamNames,
                            "certifyPics": row.certifyPics,
                            "regTime": row.regTime,
                            "checkStatus": row.checkStatus,
                            "status": row.status,
                            "checkStatusText": row.checkStatusText,
                            "checkInfo": row.checkInfo ? row.checkInfo : "",
                            "phoneNo": row.phoneNo,
                            "docTypeText": row.docTypeText,
                            "roleNames": row.roleNames,
                            "checkTime": row.checkTime,
                            "checkUser":row.checkUser,
                        }
                        if (row.certifyPics) {
                            let temarr = row.certifyPics.split(",");
                            let newtemarr = [];
                            $.each(temarr, function(index, el) {
                                newtemarr.push(imgview + el)
                            });
                            this.certifyPicsarr = newtemarr;
                        }
                },
                //获取列表数据
                getTableData() {
                    commonAjax("cas.doctorService", "pageDoctorInfoRegList", '[' + JSON.stringify(this.params) + ']').then(res => {
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
                    //获取字典
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_gender"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            var that = this;
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.gender = ele.items;
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
                // 列表常用的方法结束-------------------------------------------------------------------------------
                // 表单常用的方法开始
                //保存按钮提交数据
                submitForm(formName) {
                    if(this.subformdata.checkStatus==1){
                          let temobj = {
                                "checkStatus": this.subformdata.checkStatus,
                                "checkInfo": this.formdata.checkInfo,
                                "doctorRegId": this.formdata.doctorRegId,
                            }
                            commonAjax("cas.doctorService", "verifyDoctorInfoReg", '[' + JSON.stringify(temobj) + ']', ).then(res => {
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
                    }else{
                        this.$refs[formName].validate((valid) => {
                        if (valid) {
                            let temobj = {
                                "checkStatus": this.subformdata.checkStatus,
                                "checkInfo": this.formdata.checkInfo,
                                "doctorRegId": this.formdata.doctorRegId,
                            }
                            commonAjax("cas.doctorService", "verifyDoctorInfoReg", '[' + JSON.stringify(temobj) + ']', ).then(res => {
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
                    }
                    
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
                imgshow(item) {
                    this.imgshowdialog = true;
                    this.curimg = item;
                }
                // 表单常用的方法结束--------------------------------------------------------------------------

        },
        components: {

        },
        mounted() {
            this.getTableData();
            this.dictionaryRequest();
        },

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

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.imguint {
    width: 200px;
    height: 100px;
    float: left;
    padding: 0 10px 0 0;
    cursor: pointer;
}

.curimg {
    display: block;
    margin: 0 auto;
}
</style>
