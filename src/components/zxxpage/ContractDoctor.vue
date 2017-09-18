<template>
    <div class="feedback">
        <!--标题-->
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>签约服务</el-breadcrumb-item>
                        <el-breadcrumb-item>预约家医</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12" class="range">
                    <el-select v-model="searchContent.tenantId" placeholder="请选择" :disabled="isCheckPattern">
                        <el-option v-for="item in this.tenantNameList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row v-show="!isCheckPattern" class="search_line">
                <el-col :span="20">
                    <el-form :inline="true" :model="searchContent" class="demo-form-inline">
                        <el-form-item class="fb_ctnt">
                            <el-input placeholder="服务对象" v-model="searchContent.personName" class="fb_ctnt_val"></el-input>
                        </el-form-item>
                        <el-form-item class="fb_ctnt">
                            <el-input placeholder="联系电话" v-model="searchContent.tel" class="fb_ctnt_val"></el-input>
                        </el-form-item>
                        <el-form-item class="fb_ctnt">
                            <el-input placeholder="服务项" v-model="searchContent.serviceName" class="fb_ctnt_val"></el-input>
                        </el-form-item>
                        <el-form-item class="fb_ctnt">
                            <el-input placeholder="预约团队" v-model="searchContent.teamName" class="fb_ctnt_val"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select class="status" v-model="searchContent.classify" placeholder="全部">
                                <el-option v-for="item in dictionary.state" :key="item.key" :label="item.text" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item> 
                    </el-form>
                </el-col>
                <el-col :span="4" class="oper_btn">
                    <el-button type="warning" @click="clear">清除</el-button>
                    <el-button type="success" @click="search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <el-table v-show="!isCheckPattern" :data="patientListArr" border style="width: 100%">
            <el-table-column label="服务对象" prop="personName"></el-table-column>
            <el-table-column label="联系电话" prop="contact"></el-table-column>
            <el-table-column label="服务包" prop="packName"></el-table-column>
            <el-table-column label="服务项" prop="serviceName"></el-table-column>
            <el-table-column label="预约团队" prop="teamName"></el-table-column>
            <el-table-column label="申请时间" prop="apptDt"></el-table-column>
            <el-table-column label="状态">
                <template scope="scope">
                    <span v-if='scope.row.apptStatus==1'>待确认</span>
                    <span v-if='scope.row.apptStatus==2'>已取消</span>
                    <span v-if='scope.row.apptStatus==3'>已确认</span>
                    <span v-if='scope.row.apptStatus==4'>未通过</span>
                    <span v-if='scope.row.apptStatus==5'>已执行</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="success" v-if="scope.row.apptStatus==1" size="small" @click="confirmReser(scope.row)">确认</el-button>
                    <el-button type="success" v-if="(scope.row.apptStatus==2)||(scope.row.apptStatus==3)||(scope.row.apptStatus==4)||(scope.row.apptStatus==5)" 
                        size="small" @click="chkSrvDtl(scope.row)">查看</el-button>
                    <el-button type="danger" v-if="scope.row.apptStatus==3" size="small" @click="cancelReser(scope.row)">取消</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div v-show="!isCheckPattern" class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10, 20, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="searchContent.pageSize">
            </el-pagination>
        </div>

        <!-- 反馈详情页面 -->
        <el-form v-show="isCheckPattern" ref="fbForm" :model="fbDetailTableData" label-width="130px">
            <el-form-item label="用户:">
                <el-input class="form_item_width" v-model="fbDetailTableData.name" label-width="200px" disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系方式:">
                <el-input class="form_item_width" v-model="fbDetailTableData.phoneNo" label-width="200px" disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="基本信息:">
                <p>{{fbDetailTableData.productCode}}</p>
            </el-form-item>
            <el-form-item label="是否接收电话回访:">
                <p v-show="fbDetailTableData.flag==1">接受</p>
                <p v-show="fbDetailTableData.flag==0">不接受</p>
            </el-form-item>
            <el-form-item label="反馈类型:">
                <el-input class="form_item_width" v-model="fbDetailTableData.statusType" label-width="200px" disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="反馈内容:">
                <el-input class="form_item_width" type="textarea" v-model="fbDetailTableData.replyContent" label-width="200px" disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="图片:">
                <span v-for="imgUrl in imgUrls" :key='imgUrl'>
                    <img v-show="imgUrl" :src="imgview+imgUrl" />
                </span>
            </el-form-item>
            <el-form-item label="提交时间:">
                <el-input class="form_item_width" v-model="fbDetailTableData.createDt" label-width="200px" disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="处理意见:">
                <el-input class="form_item_width" type="textarea" v-model="fbDetailTableData.replyContent" label-width="200px" :disabled="isReadOnly"></el-input>
            </el-form-item>
            <el-form-item v-show="saveSuccessTime" label="保存时间:">
                {{saveSuccessTimeVal}}
            </el-form-item>
            <div>
                <el-button class="goBack" @click="goback">返回</el-button>
                <el-button v-show="!isReadOnly" type="primary" @click="submitForm">提交</el-button>
            </div>
        </el-form>

        <!-- 取消对话框 -->
        <el-dialog :title="cancelTitle" v-model="cancelReserVisible" @close="closeDialog">
            <el-row>
                <el-col :span="12">
                    <label>取消原因</label>
                </el-col :span="12">
                <el-col :span="12">
                    <div><el-radio class="radio" v-model="radio" label="1">临时有急事不能提供服务</el-radio></div>
                    <div><el-radio class="radio" v-model="radio" label="2">已经线下完成服务</el-radio></div>
                    <div><el-radio class="radio" v-model="radio" label="2">近阶段不能提供该项服务</el-radio></div>
                    <div><el-radio class="radio" v-model="radio" label="2">其他</el-radio><el-input></el-input></div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { commonAjax, imgview } from '../../api/api';
export default {
    data() {
        return {
            /**
             *  通用
             */ 
            isCheckPattern: false,
            isReadOnly: false,
            saveSuccessTime: false,
            total: '',
            imgview: imgview,
            imgUrl: '',
            imgUrls: '',
            dictionary: {
                state: [{            // 状态
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }]
            },
            isConfirmBtn: false,
            isCheckBtn: false,
            isCancelBtn: false,


            /**
             *  反馈列表页面数据
             */
            searchContent: {    // 搜索关键字
                classify: '',
                personName: '',
                pageNo: 1,
                pageSize: 10,
                serviceName: '',
                tel: '',
                teamName: '',
                tenantId: ''
            },
            tenantNameList: [],   // 租户名称数组
            patientListArr: [],   // 反馈内容列表数据源

            
            /**
             *  反馈详情页面数据 
             */ 
            fbDetailTableData: [],// 反馈详情数组


            /**
             * 取消对话框
             */
            cancelTitle: '取消预约',
            cancelReserVisible: false
        }
    },
    mounted() {
         this.init();
    },
    methods: {
        /**
         *  通用 
         */ 
        // 获取字典
        dictionaryRequest() {
            var that = this;
            let arr = [
                "cfs.dic.base_appointmentState"    // 状态
            ];
           
            commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                if (res.code == 200) {
                    res.body.forEach(function (ele, index) {
                        if (ele.dicId == arr[0]) {
                            that.dictionary.state = ele.items;
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
        // 条数变化
        handleSizeChange(val) {
            this.searchContent.pageSize = val;
            this.getPatientList();
        },
        // 当前页变化
        handleCurrentChange(val) {
            this.searchContent.pageNo = val;
            this.getPatientList();
        },
        // 选择日期
        dateChange(val) {
            this.searchContent.startDate = val.substr(0, 10);
            this.searchContent.endDate = val.substr(-10);
        },
        // 清除
        clear() {
            this.searchContent.personName = '';
            this.searchContent.tel = '';
            this.searchContent.serviceName = '';
            this.searchContent.teamName = '';
        },
        // 关闭对话框
        closeDialog() {
            this.srvRcdFormVisible = false;
        },


        /**
         *  预约处理
         */
        // 取消预约
        cancelReser() {
            this.cancelTitle = '取消预约';
            this.cancelReserVisible = true;
        },
        // 确认预约
        confirmReser() {
            console.log( 11 )
        },


        /**
         *  患者列表页面 
         */
        // 获取租户名字
        getTenantName() {
            let params = [{
                pageNo: 1,
                pageSize: 1000
            }];

            commonAjax('cas.tenantManageService', 'tenantList', params).then(res => {
                if (res.code == 200) {
                    this.tenantNameList = res.body.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 搜索
        search() {
            this.getPatientList();        
        },
        // 获取患者列表
        getPatientList() {
            this.searchContent.tenantId = sessionStorage.getItem('tenantId');
            // this.searchContent.tenantId = 'hcn.tongxiang'; // Tmp
            let params = [this.searchContent];

            commonAjax('cas.signorderAdminsService', 'queryApptFamilyDoctorList', params).then(res => {
                if (res.code == 200) {
                    this.patientListArr = res.body.data;
                    this.total = res.body.count;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },


        /**
         *  服务详情页面
         */
        // 查看服务详情
        chkSrvDtl(row) {
            if (row.statusType == 0) {  // 未处理
                this.isReadOnly = false;
            } else { // 已处理
                this.isReadOnly = true;
            }

            let params = [row.id];

            commonAjax('cas.feedBackService', 'getFeedBackInfo', params).then(res => {
                if (res.code == 200) {
                    if (this.isReadOnly==false && res.body.replyContent.length!==0) {
                        res.body.replyContent = '';
                    }
                    this.imgUrls = res.body.avatar.split(',');
                    this.fbDetailTableData = res.body;
                    this.isCheckPattern = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 提交表单
        submitForm() {
            let params = [{
                id: this.fbDetailTableData.id,
                replyContent: this.fbDetailTableData.replyContent
            }];

            commonAjax('cas.feedBackService', 'replyFeedBack', params).then(res => {
                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '保存成功！'
                    });
                    this.isReadOnly = true;
                    this.saveSuccessTime = true;
                    this.saveSuccessTimeVal = this.getNowFormatDate();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 返回
        goback() {
            this.isCheckPattern = false;
            this.getPatientList();
        },
        // 获取当前时间
        getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2 + date.getMinutes()
                    + seperator2 + date.getSeconds();
            return currentdate;
        },


        // 初始化
        init() {
            this.getTenantName();
            this.dictionaryRequest();
            this.getPatientList();
        }
    }
}
</script>
<style type="text/css" scoped>
.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.newRrv {
    text-align: right;
    padding-right: 10px;
}

.search_line {
    margin-top: 10px;
}

.status {
    width: 130px;
}

.oper_btn {
    text-align: right;
}

.form_item_width {
    width: 600px;
}

.range {
    text-align: right;
}

.fb_ctnt {
    width: 10%;
    margin-right: 0;
}

.fb_time {
    width: 34%;
}

.fb_status {
    width: 20%;
}

.goBack {
    margin-left: 130px;
}

img {
    width: 30%;
}

.fb_ctnt {
    width: 130px;
}

.fb_ctnt_val {
    width: 125px;
}
</style>
<style>
.feedback .fb_ctnt > div {
    width: 62%;
}   
/* .feedback .fb_ctnt_val > input {
    width: 80px;
} */
</style>
