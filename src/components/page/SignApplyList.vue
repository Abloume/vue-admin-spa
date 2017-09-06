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
                        <el-option label="云平台管理" value="1"></el-option>
                        <el-option label="桐乡租户" value="0"></el-option>
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
                    <el-button size="small" @click="lookapply(scope.$index, scope.row)" v-if=" scope.row.signState!=11">查看</el-button>
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
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="formdata.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="phoneNo">
                    <el-input v-model="formdata.phoneNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="国籍" :label-width="formLabelWidth" prop="idCard">
                    <el-input v-model="formdata.idCard" disabled></el-input>
                </el-form-item>
                <el-form-item label="出生日期" :label-width="formLabelWidth" prop="sex">
                    <el-input v-model="formdata.sex" disabled></el-input>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="orgName">
                    <el-input v-model="formdata.orgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth" prop="deptName">
                    <el-input v-model="formdata.deptName" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="teamNames">
                    <el-input v-model="formdata.teamNames" disabled></el-input>
                </el-form-item>
                <h2 class="account-title">
                    <span>签约信息</span>
                </h2>
                <el-form-item label="签约机构" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="formdata.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="签约团队" :label-width="formLabelWidth" prop="phoneNo">
                    <el-input v-model="formdata.phoneNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="团队长" :label-width="formLabelWidth" prop="idCard">
                    <el-input v-model="formdata.idCard" disabled></el-input>
                </el-form-item>
                <el-form-item label="签约周期" :label-width="formLabelWidth" prop="sex">
                    <el-input v-model="formdata.sex" disabled></el-input>
                </el-form-item>
                <el-form-item label="服务包" :label-width="formLabelWidth" prop="orgName">
                    <el-input v-model="formdata.orgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请时间" :label-width="formLabelWidth" prop="deptName">
                    <el-input v-model="formdata.deptName" disabled></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" prop="teamNames">
                    <el-input v-model="formdata.teamNames" disabled></el-input>
                </el-form-item>
                 <h2 class="account-title">
                    <span>签约确认</span>
                </h2>
                <el-form-item label="确认意见" prop="checkStatus" :label-width="formLabelWidth" v-show="formdata.checkStatus==0">
                    <el-radio-group v-model="subformdata.checkStatus" >
                        <el-radio label="1">同意</el-radio>
                        <el-radio label="2">不同意</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item label="确认方式" :label-width="formLabelWidth" prop="checkStatus" v-show="formdata.checkStatus!=0">
                   <el-radio-group v-model="formdata.checkStatus">
                        <el-radio label="1" disabled>同意</el-radio>
                        <el-radio label="2" disabled>未通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item label="签约生效日期" :label-width="formLabelWidth" prop="checkTime" v-show="formdata.checkStatus!=0">
                    <el-input v-model="formdata.checkTime" :disabled="formdata.checkStatus!=0"></el-input>
                </el-form-item>
                <el-form-item label="管理类型：" :label-width="formLabelWidth" prop="checkUser" v-show="formdata.checkStatus!=0">
                    <el-input v-model="formdata.checkUser" :disabled="formdata.checkStatus!=0"></el-input>
                </el-form-item>
                  <el-form-item label="备注" :label-width="formLabelWidth" prop="checkInfo">
                    <el-input v-model="formdata.checkInfo" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="formdata.checkStatus!=0"></el-input>
                </el-form-item>
               
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, imguploadurl, imgview
}
from '../../api/api';
import 'assets/lib/print/jquery.jqprint-0.3.js';
import 'assets/lib/print/jquery-migrate-1.2.1.min.js';

export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
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
                    "tenantId": "hcn"
                },
                total: 1,
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "productCode": "", //产品编码
                    "name": "", //广告名称
                    "position": "", //广告位置
                    "linkType": "", //链接类型
                    "linkAddress": "", //链接地址
                    "linkText": "", //链接文本
                    "defaultFlag": "", //默认标识
                    "valid_startDate": "",
                    "valid_endDate": "", //结束日期 格式yyyy-MM-dd
                    "orderNo": 0, //排序
                    "description": "", //备注
                    id: 0,
                    "picture": 0,
                },
                imguploaddata: {
                    catalog: "banner"
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    productCode: [{
                        required: true,
                        message: '请选择产品名称',

                    }],
                    name: [{
                        required: true,
                        message: '请输入广告名称',
                        trigger: 'blur'
                    }],
                    position: [{
                        required: true,
                        message: '请选择广告位置',

                    }],
                    linkType: [{
                        required: true,
                        message: '请选择链接类型',

                    }],
                    linkAddress: [{
                        required: true,
                        message: '请输入链接地址',

                    }],
                    picture: [{
                        required: true,
                        message: '请上传图片',

                    }],
                    valid_startDate: [{
                        required: true,
                        message: '请选择开始日期',

                    }],
                    valid_endDate: [{
                        required: true,
                        message: '请选择结束日期',

                    }],
                },
                imguploadurl: imguploadurl, //文件或者图片上传的url
                headers: { //文件或者图片上传的headers
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                imageUrl: "", //文件或者图片上传预览图片的src地址
                //字典查询数据
                dictionary: {
                    bannerPostion: [], //广告位置
                    hyperLink: [], //链接类型
                },
                tenantIdtableData: [],
                fileformdata: "",

            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
            //点击编辑的方法
            dateformat(val) {
                    this.formdata.valid_startDate = val
                },
                dateformat2(val) {
                    this.formdata.valid_endDate = val
                },
                print(index, row) {
                    // $("#ddd").html("11111111111111111111111111")
                    $("<span>ninhao</span>").jqprint();
                },
                confirmapply() {

                },
                lookapply() {

                },
                // 删除列表中的一条数据
                // handleDelete(index, row) {
                //     // this.$message.error('删除第' + (index + 1) + '行');
                //     const h = this.$createElement;
                //     this.$msgbox({
                //             title: '确认删除',
                //             message: h('p', null, [
                //                 h('span', null, '是否删除 '),
                //                 h('i', {
                //                     style: 'color: teal'
                //                 }, row.name)
                //             ]),
                //             showCancelButton: true,
                //             confirmButtonText: '确定',
                //             cancelButtonText: '取消',
                //             beforeClose: (action, instance, done) => {
                //                 if (action === 'confirm') {
                //                     instance.confirmButtonLoading = true;
                //                     instance.confirmButtonText = '执行中...';
                //                     setTimeout(() => {
                //                         done();
                //                         setTimeout(() => {
                //                             instance.confirmButtonLoading = false;
                //                         }, 300);
                //                     }, 3000);
                //                 } else {
                //                     done();
                //                 }
                //             }
                //         })
                //         .then(action => {
                //             if (action == 'cancel') {
                //                 this.$message({
                //                     type: 'info',
                //                     message: "取消删除"
                //                 });
                //             } else {
                //                 let params = `[${row.id}]`;
                //                 commonAjax("cas.productbannerService", "banProductbanner", params).then(res => {
                //                     if (res.code == 200) {
                //                         this.$message({
                //                             type: 'success',
                //                             message: "删除成功"
                //                         });
                //                         this.getTableData();
                //                     } else {
                //                         this.$message({
                //                             type: 'error',
                //                             message: res.msg
                //                         });
                //                     }
                //                 });
                //             }

                //         })
                // },
                //获取搜索下拉框的租户列表
                gettenantIdlist() {
                    let params = {
                        "pageNo": 1,
                        "pageSize": 300,
                    }
                    commonAjax("cas.tenantManageService", "tenantList", '['+JSON.stringify(params)+']', ).then(res => {
                        if (res.code == 200) {
                            this.tenantIdtableData = res.body;
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
                            this.tableData = res.body;
                            this.total = res.body.count;
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
                    if (!this.formdata.picture) {
                        this.$message({
                            type: 'error',
                            message: "请上传图片"
                        });
                    }
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.productbannerService", "addAndUpdate", '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
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
                //上传文件或者图片成功后
                handleAvatarSuccess(res, file) {
                    this.imageUrl = imgview + res.body;
                    this.formdata.picture = res.body;
                    this.$message.success('上传成功');
                },
                //上传上传文件或者图片之前
                beforeAvatarUpload(file) {

                    // const isJPG = file.type === 'image/jpeg';
                    // const isLt2M = file.size / 1024 / 1024 < 2;

                    // if (!isJPG) {
                    //     this.$message.error('上传头像图片只能是 JPG 格式!');
                    // }
                    // if (!isLt2M) {
                    //     this.$message.error('上传头像图片大小不能超过 2MB!');
                    // }
                    // return isJPG && isLt2M;

                },
                //获取字典
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_bannerPostion", "cfs.dic.base_hyperLink"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            var that = this;
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.bannerPostion = ele.items;
                                }
                                if (ele.dicId == arr[1]) {
                                    that.dictionary.hyperLink = ele.items;
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
                // 表单常用的方法结束--------------------------------------------------------------------------

        },
        components: {

        },
        mounted() {
            this.getTableData();
            this.gettenantIdlist();
            this.dictionaryRequest();
        },

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
