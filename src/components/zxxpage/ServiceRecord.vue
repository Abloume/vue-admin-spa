<template>
    <div class="SrvRcd">
        <!--标题-->
        <div class="crumbs" v-if="isSrvRcdMain">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>签约服务</el-breadcrumb-item>
                        <el-breadcrumb-item>服务记录</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="8" class="newRrv">
                    <el-button type="primary" @click="addSrvRcd">添加记录</el-button>
                </el-col>
                <el-col :span="4" class="range">
                    <el-select v-model="searchContent.tenantId" placeholder="请选择" :disabled="isCheckPattern">
                        <el-option v-for="item in this.tenantNameList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row v-show="!isCheckPattern" class="search_line">
                <el-col :span="24">
                    <el-form :inline="true" :model="searchContent" class="demo-form-inline">
                        <el-form-item label='服务项目' class="fb_ctnt">
                            <el-input v-model="searchContent.serviceName" class="fb_ctnt_val"></el-input>
                        </el-form-item>
                        <el-form-item label='服务对象' class="srv_obj">
                            <el-input v-model="searchContent.personName" class="src_obj_val"></el-input>
                        </el-form-item>
                        <el-form-item label="服务方式">
                            <el-select class="status" v-model="searchContent.exeWay" placeholder="全部">
                                <el-option v-for="item in dictionary.channelType" :key="item.key" :label="item.text" :value="item.key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label='服务机构' class="srv_org">
                            <el-input v-model="searchContent.orgName" class="srv_org_val"></el-input>
                        </el-form-item>
                        <el-form-item label='服务团队' class="srv_team">
                            <el-input v-model="searchContent.teamName" class="srv_team_val"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row class="scnd_line">
                <el-col :span="20">
                    <el-form :inline="true" :model="searchContent" class="demo-form-inline">
                        <el-form-item label='服务医生' class="srv_dct">
                            <el-input v-model="searchContent.exeUserName" class="srv_dct_val"></el-input>
                        </el-form-item>
                        <el-form-item label="服务时间" class="srv_time">
                            <el-date-picker v-model="searchContent.date" type="daterange" placeholder="选择日期" @change="dateChange">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4">
                    <el-button type="warning" @click="clear">清除</el-button>
                    <el-button type="success" @click="search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <el-table v-show="isSrvRcdMain" :data="SrvRcdTableData" border style="width: 100%">
            <el-table-column label="服务时间" prop="createDt"></el-table-column>
            <el-table-column label="服务项目" prop="serviceName"></el-table-column>
            <el-table-column label="服务对象" prop="personName"></el-table-column>
            <el-table-column label="服务机构" prop="orgName"></el-table-column>
            <el-table-column label="服务团队" prop="teamName"></el-table-column>
            <el-table-column label="服务医生" prop="exeUserName"></el-table-column>
            <el-table-column label="服务方式" prop="exeWay"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="chkSrvRcdDetail(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div v-show="isSrvRcdMain" class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10, 20, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="searchContent.pageSize">
            </el-pagination>
        </div>

        <!-- 添加服务记录 -->
        <div v-show="!isSrvRcdMain" class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>签约服务</el-breadcrumb-item>
                        <el-breadcrumb-item>添加记录</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <div v-show="!isSrvRcdMain" :title="addSrvRcdDialogTitle" v-model="addSrvRcdFormVisible" @close="closeDialog">
            <el-form :model="addSrvRcdData" :rules="addItemRules" ref="addItemForm" auto-complete="off" id="addItemForm">
                <el-form-item label="服务对象" class="as_inline min_width" :label-width="formLabelWidth" prop="personName">
                    <el-input class="serv_no" v-model="addSrvRcdData.personName" placeholder="0" @focus='getResidents'></el-input>
                </el-form-item>
                <el-form-item label="服务包" class="as_inline min_width" :label-width="formLabelWidth" prop="signServiceId">
                    <el-input class="serv_no" v-model="addSrvRcdData.signServiceId" @focus='getSrvItem'></el-input>
                </el-form-item>
                <el-form-item label="服务项" class="as_inline min_width" :label-width="formLabelWidth" prop="serviceRecordType">
                    <el-input class="serv_no" v-model="addSrvRcdData.serviceRecordType" @focus='getSrvItem'></el-input>
                </el-form-item>
                <el-form-item label="服务人" class="as_inline min_width" :label-width="formLabelWidth" prop="exeUserName">
                    <el-select v-model="addSrvRcdData.exeUserId">
                        <el-option v-for="item in teamMmbArr" :key="item.memberObjId" :label="item.memberName" :value="item.memberObjId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务方式" class="as_inline min_width" :label-width="formLabelWidth" prop="exeWay">
                    <el-select class="status serv_no" v-model="addSrvRcdData.exeWay" placeholder="全部">
                        <el-option v-for="item in dictionary.channelType" :key="item.key" :label="item.text" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务时间" class="as_inline min_width" :label-width="formLabelWidth" prop="exeDt">
                    <el-date-picker placeholder="选择日期" class="serv_no" type="date" v-model="addSrvRcdData.exeDt" @change='setDateFormat'>
                    </el-date-picker>
                </el-form-item>
                <div id="distData">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="省级" :label-width="formLabelWidth" prop="province">
                                <el-select v-model="editarea.province" placeholder="请选择省">
                                    <el-option v-for="item in provincelist" :label="item.text" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="市级" :label-width="formLabelWidth" prop="city">
                                <el-select v-model="editarea.city" placeholder="请选择市">
                                    <el-option v-for="item in citylist" :label="item.text" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="地区" :label-width="formLabelWidth" prop="district">
                                <el-select v-model="editarea.district" placeholder="请选择地区">
                                    <el-option v-for="item in districtlist" :label="item.text" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="街道" :label-width="formLabelWidth" prop="city">
                                <el-select v-model="editarea.street" placeholder="请选择街道">
                                    <el-option v-for="item in streetlist" :label="item.text" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-form-item label="服务地址" class="as_inline" :label-width="formLabelWidth" prop="exeAddr">
                    <el-input placeholder="详细地址" v-model='addSrvRcdData.exeAddr' class="dtl_addr"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="exeDesc">
                    <el-input v-model="addSrvRcdData.exeDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" class="add_rcd_bakup"></el-input>
                    <el-button type="info" @click="chooseTpl" class="chsTpl">选择模板</el-button>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot bottom_btn">
                <el-button v-if='!isReadOnly' @click="addRcdBack">返回</el-button>
                <el-button v-if='!isReadOnly' type="primary" @click="saveSrvRcd('addItemForm')">提交</el-button>
            </div>
        </div>

        <!-- 服务记录详情 -->
        <el-dialog :title="srvRcdDialogTitle" v-model="srvRcdFormVisible" @close="closeDialog">
            <el-form :model="srvRcdFormData" :rules="addItemRules" ref="addItemForm" auto-complete="off" id="addItemForm">
                <el-form-item label="服务项目" class="as_inline" :label-width="formLabelWidth" prop="serviceName">
                    <el-input class="serv_no" v-model="srvRcdFormData.serviceName" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务包" class="as_inline" :label-width="formLabelWidth" prop="spPackName">
                    <el-input class="serv_no" v-model="srvRcdFormData.spPackName" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务时间" class="as_inline min_width" :label-width="formLabelWidth" prop="exeDt">
                    <el-input class="serv_no" v-model="srvRcdFormData.exeDt" placeholder="0" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务对象" class="as_inline min_width" :label-width="formLabelWidth" prop="personName">
                    <el-input class="serv_no" v-model="srvRcdFormData.personName" placeholder="0" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务方式" class="as_inline" :label-width="formLabelWidth" prop="exeWayText">
                    <el-input class="serv_no" v-model="srvRcdFormData.exeWayText" placeholder="0" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务人" class="as_inline" :label-width="formLabelWidth" prop="exeUserName">
                    <el-input class="serv_no" v-model="srvRcdFormData.exeUserName" placeholder="0" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="录入人" class="as_inline min_width" :label-width="formLabelWidth" prop="createUserName">
                    <el-input placeholder="0" class="serv_no" v-model="srvRcdFormData.createUserName" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="录入时间" class="as_inline min_width" :label-width="formLabelWidth" prop="createDt">
                    <el-input placeholder="0" class="serv_no" v-model="srvRcdFormData.createDt" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务地点" class="as_inline" :label-width="formLabelWidth" prop="exeAddr">
                    <el-input class="serv_no" v-model="srvRcdFormData.exeAddr" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务小结" :label-width="formLabelWidth" prop="exeDesc">
                    <el-input v-model="srvRcdFormData.exeDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" disabled="true"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 选择居民 -->
        <el-dialog :title="chsRsdtTitle" v-model="residentsListArrVisible" @close="closeDialog">
            <!-- 搜索 -->
            <el-row :gutter="20" class="rsdt_search">
                <el-col :span="8">
                    <el-input v-model="rsdtName"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="search" @click="searchRsdt">搜索</el-button>
                </el-col>
            </el-row>
            <!-- 列表 -->
            <el-table :data='residentsListArr' border style="width:100%">
                <el-table-column label="居民" prop="personName"></el-table-column>
                <el-table-column label="联系电话" prop="age"></el-table-column>
                <el-table-column label="居住地址" prop="address"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="makeSure(scope.$index, scope.row)">确定</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="residentsListArrNum" :page-sizes='[10, 20, 50]' @size-change="chsRsdtSizeChange" @current-change="chsRsdtCurrentChange" :page-size="page.pageSize">
                </el-pagination>
            </div>
        </el-dialog>

        <!-- 服务包和项 -->
        <el-dialog :title="chsSrvItemTitle" v-model="srvPackListArrVisible" @close="closeDialog">
            <div v-for="items in srvPackListArr">
                <el-row :gutter="20" class="srv_package">
                    <el-col :span="6">
                        <div class="">{{items.spName}}</div>
                    </el-col>
                    <el-col :span="6">
                        <div class="">{{items.spPackName}}</div>
                    </el-col>
                </el-row>
                <div v-for="item in items.signServiceslist">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <div class="">{{item.serviceName}}</div>
                        </el-col>
                        <el-col :span="6">
                            <div class="">剩余{{item.times}}次</div>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="primary" size="small" @click="chooseItem(item)">确定</el-button>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <div class="">{{item.serviceDesc}}</div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-dialog>

        <!-- 选择模板 -->
        <el-dialog :title="tplTtile" v-model="tplVisible" @close="closeDialog">
            <div v-for="item in tplsArr">
                <el-row class="rcd_tpl">
                    <el-col :span="20">{{item.content}}</el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="gotTpl(item)">确定</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { commonAjax, imgview, areaAjax } from '../../api/api';
// import VDistpicker from 'v-distpicker';
export default {
    data() {
        return {
            /**
             *  通用
             */
            formLabelWidth: '90px',
            isCheckPattern: false,
            isReadOnly: false,
            saveSuccessTime: false,
            total: '',
            imgview: imgview,
            imgUrl: '',
            imgUrls: '',
            dictionary: {
                channelType: [{ // 服务方式
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }]
            },


            /**
             *  服务记录主页
             */
            isSrvRcdMain: true,
            searchContent: {    // 搜索关键字
                date: '',
                endDate: "",
                exeUserName: "",
                exeWay: "",     //执行方法 cfs.dic.base_channelType
                orgName: "",    //机构名称
                pageNo: 1,
                pageSize: 10,
                personName: "", //服务对象名称
                serviceName: "",
                startDate: "",
                teamName: "",   //团队名称
                tenantId: "hcn",
            },
            tenantNameList: [],   // 租户名称数组
            SrvRcdTableData: [],      // 反馈内容列表数据源


            /**
             *  添加服务记录
             */
            addSrvRcdDialogTitle: '',
            addSrvRcdFormVisible: false,
            doctorId: '',               // 医生ID
            geneAddr: '',               // 生成地址
            editarea: {                 // 选择地址
                province: "",
                city: "",
                district: "",
                street: "",
            },
            provincelist: [],
            citylist: [],
            districtlist: [],
            streetlist: [],
            residentsListArr: '',       // 选择居民列表
            residentsListArrNum: '',
            chsRsdtTitle: '',
            residentsListArrVisible: false,// 居民列表对话框
            rsdtName: '',               // 居民搜索关键字
            page: {
                pageNo: 1,
                pageSize: 10
            },
            chsSrvItemTitle: '',        // 包项名称
            mpiId: '',                  // 服务对象
            srvPackListArrVisible: false,
            curSrvItemId: '',           // 当前服务项ID
            curTeamId: '',              // 当前团队ID
            teamMmbArr: [{              // 团队成员
                createDt: "",
                createUser: "",
                memberName: "",
                memberObjId: "1ebd4633-ef9f-43ae-bb18-2f16cac617af",
                memberRole: 1,
                memberRoleText: "",
                memberType: "01",
                memberTypeText: "",
                teamDocId: 0,
                teamId: 0,
                tenantId: "hcn"
            }],
            srvPackListArr: [],         // 包项数组
            srvPlansArr: [],            // 服务计划数组
            tplTtile: '',               // 模板标题
            tplVisible: false,          // 模板对话框
            tplsArr: [],                // 模板数组
            addSrvRcdData: {            // 表单数据
                apptId: 0,              // 预约id
                bussinessRecordId: 0,   // 如果服务记录类型为01或02时，该字段不需要传入
                exeAddr: "",            // 执行地点
                exeDesc: "",            // 执行说明
                exeDt: "",              // 执行时间
                exePlanId: 0,           // 服务计划id
                exeUserId: "",          // 执行人ID
                exeUserName: "",        // 执行人文本
                exeWay: "",             // 执行方式base_channelType
                serviceRecordType: "",// 服务记录类型id,01通用服务记录 02表单服务记录03 咨询互动记录-表单未完成，先按01
                signServiceId: '',
                teamId: 0               // 服务团队
            },


            /**
             *  服务记录详情
             */
            srvRcdFormVisible: false,
            srvRcdFormData: {
                actOrgType: '',      // 执行机构分类
                correlation: '',     // 关联模块
                createUser: '',      // 登录用户ID
                createUserName: '',  // 有效期
                exeAddr: '',         // 补助系数
                exeDesc: '',         // 简介
                exeDt: 0,            // 价格上限
                evaluationTplId: 0,  // 关联评价
                exeUserId: '',
                exeWayText: '',      // 价格
                generatePlanFlag: '', // 是否生成计划
                generatePlanTime: 0,  // 生成计划时机
                helpDoc: '',          // 服务指导
                personName: 0,       // 价格下限
                relateFormId: 0,     // 关联表单 
                serviceName: '',      // 服务项目名称
                tenantId: ''         // 租户ID
            }
        }
    },
    // components: {VDistpicker},
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
                "cfs.dic.base_channelType"    // 服务方式
            ];

            commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                if (res.code == 200) {
                    res.body.forEach(function(ele, index) {
                        if (ele.dicId == arr[0]) {
                            that.dictionary.channelType = ele.items;
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
            this.getSrvRcdList();
        },
        // 当前页变化
        handleCurrentChange(val) {
            this.searchContent.pageNo = val;
            this.getSrvRcdList();
        },
        // 选择日期
        dateChange(val) {
            this.searchContent.startDate = val.substr(0, 10);
            this.searchContent.endDate = val.substr(-10);
        },
        // 清除过滤条件
        clear() {
            this.searchContent = {};
        },
        // 搜索
        search() {
            this.getSrvRcdList();
        },
        // 关闭窗口
        closeDialog() {
            this.srvRcdFormVisible = false;
        },


        /**
         *  服务记录主页面 
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
        // 获取服务记录列表
        getSrvRcdList() {
            // this.searchContent.tenantId = 'hcn.tongxiang'; // Tmp
            this.searchContent.tenantId = sessionStorage.getItem('tenantId');
            let params = [this.searchContent];

            commonAjax('cas.serviceRecordService', 'queryServiceRecordBySearch', params).then(res => {
                if (res.code == 200) {
                    this.SrvRcdTableData = res.body.items;
                    this.total = res.body.total;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },


        /**
         *  服务记录详情页面
         */
        // 查看服务记录详情页面
        chkSrvRcdDetail(row) {
            let params = [row.exeId];

            commonAjax('cas.serviceRecordService', 'getServiceExec', params).then(res => {
                if (res.code == 200) {
                    this.srvRcdFormData = res.body;
                    this.srvRcdDialogTitle = "服务记录详情";
                    this.srvRcdFormVisible = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },


        /**
         *  添加服务记录
         */
        // 添加记录
        addSrvRcd() {
            this.addSrvRcdDialogTitle = '添加记录';
            // this.addSrvRcdFormVisible = true;
            this.isSrvRcdMain = false;
            this.getDoctorId();
        },
        // 日期格式化
        setDateFormat(dateVal) {
            this.addSrvRcdData.exeDt = dateVal;
        },
        // 获取地址数据
        getDistData(val, sign) {
            var params = {
                limit: 50,
                parentKey: val,
            };

            areaAjax(params).then(res => {
                if (sign == "city") {
                    this.citylist = res.items;
                } else if (sign == "district") {
                    this.districtlist = res.items;
                } else if (sign == "street") {
                    this.streetlist = res.items;
                } else {
                    this.provincelist = res.items;
                }
            });
        },
        // 获取医生Id
        getDoctorId() {
            commonAjax('cas.doctorService', 'getCurrentDoctorId', []).then(res => {
                if (res.code == 200) {
                    this.doctorId = res.body;
                    this.getDistData(null, 'province');
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 获取模板列表
        getTpls() {
            let params = [this.curSrvItemId];

            commonAjax('cas.serviceRecordService', 'queryServiceitemTmpl', params).then(res => {
                if (res.code == 200) {
                    this.tplsArr = res.body;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 选择模板
        chooseTpl() {
            if (this.curSrvItemId) {
                this.tplTtile = '选择模板';
                this.tplVisible = true;
                this.getTpls();
            } else {
                this.$message({
                    type: 'error',
                    message: '请先选择服务包！'
                });
            }
        },
        // 获取居民列表
        getResidentsList() {
            let params = [this.doctorId, this.rsdtName, this.page.pageNo, this.page.pageSize];
            commonAjax('cas.serviceRecordService', 'queryUnServiceResident', params).then(res => {
                if (res.code == 200) {
                    this.residentsListArr = res.body.items;
                    this.residentsListArrNum = res.body.total;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 选择居民
        getResidents() {
            this.chsRsdtTitle = '选择居民';
            this.residentsListArrVisible = true;
            this.getResidentsList();
        },
        // 搜索居民
        searchRsdt() {
            // this.rsdtName
            this.getResidentsList();
        },
        // 选定居民
        makeSure(index, row) {
            this.addSrvRcdData.personName = row.personName
            this.mpiId = row.mpiId;
            this.residentsListArrVisible = false;
        },
        // 获取包和项列表
        getSrvPackList() {
            let params = [this.mpiId];
            commonAjax('cas.serviceRecordService', 'querySpPackByMpiId', params).then(res => {
                if (res.code == 200) {
                    this.srvPackListArr = res.body;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 选择服务包、服务项
        getSrvItem() {
            if (this.mpiId) {
                this.chsSrvItemTitle = "选择服务";
                this.srvPackListArrVisible = true;
                this.getSrvPackList();
            } else {
                this.$message({
                    type: 'error',
                    message: '请先选择服务对象！'
                });
            }
        },
        // 查看团队成员
        getTeamMmb() {
            var self = this;
            let params = [this.curTeamId];
            commonAjax('cas.serviceRecordService', 'queryTeamDoct', params).then(res => {
                if (res.code == 200) {
                    self.teamMmbArr = res.body;
                } else {
                    self.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 选定服务项
        chooseItem(item) {
            this.curTeamId = item.spId;

            // 服务计划
            let params = [
                sessionStorage.getItem('tenantId'),
                item.signId,
                item.signServiceId
            ];
            commonAjax('cas.serviceRecordService', 'queryMpiServiceExecPlan', params).then(res => {
                if (res.code == 200) {
                    if (res.body.length != 0) {
                        this.srvPlansArr = res.body;
                    } else {
                        this.addSrvRcdData.signServiceId = item.spPackId;
                        this.addSrvRcdData.serviceRecordType = item.serviceName;
                        this.curSrvItemId = item.serviceId;
                        this.srvPackListArrVisible = false;
                    }
                    this.getTeamMmb();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 选定模板
        gotTpl(item) {
            this.addSrvRcdData.exeDesc = item.content;
            this.tplVisible = false;
        },
        // 条数更新
        chsRsdtSizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.getResidentsList();
        },
        // 页码更新
        chsRsdtCurrentChange(curPage) {
            this.page.pageNo = curPage;
            this.getResidentsList();
        },
        // 添加记录返回
        addRcdBack() {
            this.isSrvRcdMain = true;
        },
        // 生成地址
        geneDistAddr() {
            var myProvince = '',
                myCity = '',
                myDistrict = '',
                myStreet = '';
            var sProvince = this.editarea.province,
                sCity = this.editarea.city,
                sDistrict = this.editarea.district,
                sStreet = this.editarea.street;
            $.each(this.provincelist, function(idx, val) {
                if (sProvince == val.key) {
                    myProvince = val.text;
                }
            });
            $.each(this.citylist, function(idx, val) {
                if (sCity == val.key) {
                    myCity = val.text;
                }
            });
            $.each(this.districtlist, function(idx, val) {
                if (sDistrict == val.key) {
                    myDistrict = val.text;
                }
            });
            $.each(this.streetlist, function(idx, val) {
                if (sStreet == val.key) {
                    myStreet = val.text;
                }
            });
            this.geneAddr = myProvince + myCity + myDistrict + myStreet;
        },
        // 提交表单
        saveSrvRcd() {
            this.geneDistAddr();
            let self = this;
            $.each(self.teamMmbArr, function(index, item) {
                if (item.memberObjId == self.addSrvRcdData.exeUserId) {
                    self.addSrvRcdData.exeUserName = item.memberName;
                }
            });
            this.addSrvRcdData.serviceRecordType = '01';
            this.addSrvRcdData.teamId = this.curTeamId;
            this.addSrvRcdData.exeAddr = this.geneAddr + this.addSrvRcdData.exeAddr;
            let params = [this.addSrvRcdData];

            commonAjax('cas.serviceRecordService', 'addServiceExec', params).then(res => {
                if (res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '保存成功！'
                    });
                    this.isSrvRcdMain = true;
                    this.getSrvRcdList();
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
            this.getSrvRcdList();
        },


        // 初始化
        init() {
            this.getTenantName();
            this.dictionaryRequest();
            this.getSrvRcdList();
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.citylist = [];
            vm.districtlist = [];
            vm.streetlist = [];
        });
    },
    watch: {
        'editarea.province'(val, oldval) {
            if (val != "") {
                this.getDistData(val, "city");
            }
            //通过省获取市

            // if (oldval != "") {
            //     this.editarea.city = "";
            //     this.editarea.district = "";
            //     this.editarea.street = ""
            // }
        },
        'editarea.city'(val, oldval) {
            // //通过市区县
            if (val != "") {
                this.getDistData(val, "district");
            }

            // if (oldval != "") {
            //     this.editarea.district = "";
            //     this.editarea.street = ""
            // }
        },
        'editarea.district'(val, oldval) {
            // //通过区县获取街道

            if (val != "") {
                this.getDistData(val, "street");
            }
            // if (oldval != "") {
            //     this.editarea.street = ""
            // }
        },
        'editarea.street'(val, oldval) {
            if (val != "") {

            }
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
    width: 18%;
    margin-right: 0;
}

.fb_ctnt_val {
    width: 84px;
}

.srv_obj {
    width: 18%;
    margin-right: 0;
}

.srv_org {
    width: 18%;
    margin-right: 0;
}

.srv_team {
    width: 18%;
    margin-right: 0;
}

.fb_time {
    width: 34%;
}

.goBack {
    margin-left: 130px;
}

img {
    width: 30%;
}

.rcd_tpl {
    background-color: #CCC;
    padding: 10px 0 10px 10px;
}
</style>
<style>
.SrvRcd .fb_ctnt>div {
    width: 45%;
}

.SrvRcd .fb_ctnt_val>input {
    width: 80px;
}

.SrvRcd .srv_obj>div {
    width: 45%;
}

.SrvRcd .srv_org>div {
    width: 45%;
}

.SrvRcd .srv_team>div {
    width: 45%;
}

.as_inline {
    display: inline-block;
}

.serv_name,
.serv_no {
    width: 175px;
}

.min_width {
    width: 365px;
}

.plan_start {
    width: 239px;
}

.day {
    width: 10%;
}

.days {
    margin-left: 31px;
}

.rsdt_search {
    margin-bottom: 10px;
}

.srv_package {
    background-color: #F0F0F0;
    margin-bottom: 15px;
    padding-top: 3px;
    padding-bottom: 3px;
    color: #00d1b2;
}

.add_rcd_bakup {
    width: 85%;
}

.dtl_addr {}

.chsTpl {
    margin-bottom: 60px;
}
</style>
