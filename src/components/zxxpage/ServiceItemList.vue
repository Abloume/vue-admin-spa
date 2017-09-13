<template>
    <div class="SIList">
        <!--标题-->
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>服务管理</el-breadcrumb-item>
                        <el-breadcrumb-item>服务项</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con">
                <el-col :span="24" class="addServItem">
                    <el-button type="primary" icon="plus" @click="addServiceItem">添加服务项</el-button>
                </el-col>
            </el-row>
            <el-row class="search_line">
                <el-col :span="20">
                    <el-form :inline="true" :model="searchContent" class="demo-form-inline">
                        <el-form-item label="服务名称:">
                            <el-input class="serv_name" v-model="searchContent.name"></el-input>
                        </el-form-item>
                        <el-form-item label="编号:">
                            <el-input class="number" v-model="searchContent.no" autosize disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="启用状态">
                            <el-select class="status" v-model="searchContent.status" placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="启用" value="1"></el-option>
                                <el-option label="停用" value="0"></el-option>
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
        <el-table :data="servItemData" border style="width: 100%">
            <el-table-column label="编号" prop="serviceCode" width="80"></el-table-column>
            <el-table-column label="服务名称" prop="serviceName" width="120"></el-table-column>
            <el-table-column label="简介" prop="serviceDesc" width="220"></el-table-column>
            <el-table-column label="上限价格(元)" prop="upperPrice" width="80"></el-table-column>
            <el-table-column label="下限价格(元)" prop="lowerPrice" width="80"></el-table-column>
            <el-table-column label="价格(元)" prop="price" width="80"></el-table-column>
            <el-table-column label="状态" width="70">
                <template scope="scope">
                    <span v-if='scope.row.status==1'>已启用</span>
                    <span v-if='scope.row.status==0'>已停用</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="checkServItem(scope.row)">查看</el-button>
                    <el-button size="small" @click="editServItem(scope.row)">编辑</el-button>
                    <el-button v-show="scope.row.status==0" size="small" type="success" @click="switchStatus(scope.$index, scope.row)">启用</el-button>
                    <el-button v-show="scope.row.status==1" size="small" type="danger" @click="switchStatus(scope.$index, scope.row)">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10, 20, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="page.pageSize">
            </el-pagination>
        </div>

        <!-- 新增服务项详情对话框 -->
        <el-dialog :title="dialogTitle" v-model="dialogFormVisible" @close="closeDialog">
            <el-form :model="addServItemForm" :rules="addItemRules" ref="addItemForm" auto-complete="off" id="addItemForm">
                <el-form-item label="服务项名称" class="as_inline" :label-width="formLabelWidth" prop="serviceName">
                    <el-input class="serv_no" v-model="addServItemForm.serviceName" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="服务项编号" class="as_inline" :label-width="formLabelWidth" prop="">
                    <el-input class="serv_no" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="价格上限(元)" class="as_inline min_width" :label-width="formLabelWidth" prop="upperPrice">
                    <el-input class="serv_no" v-model.number="addServItemForm.upperPrice" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="价格下限(元)" class="as_inline min_width" :label-width="formLabelWidth" prop="lowerPrice">
                    <el-input class="serv_no" v-model.number="addServItemForm.lowerPrice" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="默认价格(元)" class="as_inline" :label-width="formLabelWidth" prop="price">
                    <el-input class="serv_no" v-model.number="addServItemForm.price" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="关联模块" class="as_inline" :label-width="formLabelWidth" prop="correlation">
                    <el-select placeholder="无" v-model="addServItemForm.correlation" disabled="true">
                        <el-option v-for="item in dictionary.hyperLink" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效期(天)" class="as_inline min_width" :label-width="formLabelWidth" prop="validPeriod">
                    <el-input placeholder="0" class="serv_no" v-model.number="addServItemForm.validPeriod" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="关联评价" class="as_inline min_width" :label-width="formLabelWidth" prop="evaluationTplId">
                    <el-select placeholder="无" v-model="addServItemForm.evaluationTplId" disabled="true">
                        <el-option v-for="item in dictionary.hyperLink" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="执行机构" class="as_inline" :label-width="formLabelWidth" prop="actOrgType">
                    <el-select placeholder="无" class="serv_name" v-model="addServItemForm.actOrgType" :disabled="isReadOnly">
                        <el-option v-for="item in dictionary.organizationType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="补助系数(%)" class="as_inline" :label-width="formLabelWidth" prop="allowanceRatio">
                    <el-input class="serv_no" v-model="addServItemForm.allowanceRatio" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="关联表单" class="as_inline min_width" :label-width="formLabelWidth" prop="relateFormId">
                    <el-select placeholder="无" v-model="addServItemForm.relateFormId" disabled="true">
                        <el-option v-for="item in dictionary.bannerPostion" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否生成计划" prop="generatePlanFlag">
                    <el-radio-group v-model="addServItemForm.generatePlanFlag" @change='chooseItem' :disabled="isReadOnly">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-show='isGenePlan' label="计划开始时间" prop="generatePlanTime">
                    <el-radio-group class="plan_start" v-model="addServItemForm.generatePlanTime" :disabled="isReadOnly">
                        <el-radio label="1">签约生效日期</el-radio>
                        <el-radio label="0">签约生效后</el-radio>
                        <el-input class="day" v-model="addServItemForm.generatePlanTime"></el-input>
                    </el-radio-group>
                    <span class="days">天</span>
                </el-form-item>
                <el-form-item label="简介" :label-width="formLabelWidth" prop="serviceDesc">
                    <el-input v-model="addServItemForm.serviceDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="服务指导" :label-width="formLabelWidth" prop="helpDoc">
                    <el-input v-model="addServItemForm.helpDoc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="isReadOnly"></el-input>
                </el-form-item>
            </el-form>
            <div class="serv_explain">
                <span class="serv_explain_label">服务说明模块</span>
                <el-button class="copy_other" type="info" size="mini" @click='copyOtherTpl'>复制其他模版项</el-button>
                <el-button type="info" size="mini" @click='addServExplModule'>添加</el-button>
            </div>
            <div class="serv_expl_module">
                <div v-for="item in servExplModule" :key="item">
                    <span class="serv_content">{{item}}</span>
                    <el-button type="danger" size="mini" @click='delExplModule'>删除</el-button>
                </div>
            </div>
            <div class="dialog-footer center-foot bottom_btn">
                <el-button v-if='!isReadOnly' @click="closeDialog">取 消</el-button>
                <el-button v-if='!isReadOnly' type="primary" @click="saveFormData('addItemForm')">保 存</el-button>
            </div>
        </el-dialog>
        
        <!-- 复制其他模板项 -->
        <el-dialog :title="dialogTitle" v-model="copyOtherFormVisible" @close="closeCopyDialog">
            <el-form :model="copyTplForm" ref="otherTplForm" auto-complete="off" id="otherTplForm">
                <el-form-item label="请选择模板项:" label-width="150px" class="as_inline" prop="name">
                    <el-select v-model="copyTplForm.option" placeholder="请选择">
                        <el-option v-for="item in copyTplFormOption" :key="item.tmplId" :label="item.content" :value="item.tmplId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot bottom_btn">
                <el-button @click="closeCopyDialog">取 消</el-button>
                <el-button type="primary" @click="saveCopyTplData('otherTplForm')">确 认</el-button>
            </div>
        </el-dialog>

        <!-- 添加模板项 -->
        <el-dialog :title="dialogTitle" v-model="addTplFormVisible" @close="closeAddTplDialog">
            <el-form :model="addTplForm" ref="addTpl" auto-complete="off" id="addTpl">
                <el-form-item label="模板内容:" class="as_inline" label-width="150px" prop="name">
                    <el-input class="serv_no" v-model="addTplForm.content" placeholder="请输入模板内容"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot bottom_btn">
                <el-button @click="closeAddTplDialog">取 消</el-button>
                <el-button type="primary" @click="saveAddTplData('addTpl')">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { commonAjax } from '../../api/api';
export default {
    data() {
        return {
            // 通用
            formLabelWidth: '90px',
            dialogTitle: '',
            dialogFormVisible: false,
            isAddOrEdit: '',          // 1表示添加，2表示编辑
            dictionary: {
                bannerPostion: [{       
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }],
                organizationType: [{    // 执行机构
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }]
            },
            page: {
                pageNo: 1,
                pageSize: 10
            },
            total: '',
            addItemRules: {
                serviceName: [{
                    required: true,
                    message:'名称不能为空'
                }],
                upperPrice: [{
                    required: true,
                    message: '价格上限不能为空'
                }, {
                    type: 'number',
                    message: '价格为数字！'
                }],
                lowerPrice: [{
                    required: true,
                    message: '价格下限不能为空'
                }, {
                    type: 'number',
                    message: '价格为数字'
                }],
                price: [{
                    required: true,
                    message: '默认价格不能为空'
                }, {
                    type: 'number',
                    message: '价格为数字'
                }],
                validPeriod: [{
                    required: true,
                    message: '有效期不能为空'
                }, {
                    type: 'number',
                    message: '有效期为数字'
                }],
                // allowanceRatio: [{
                //     required: false,
                //     message: '',
                //     trigger: 'blur'
                // }, {
                //     type: 'number',
                //     message: '请输入数字',
                //     trigger: 'blur'
                // }],
                serviceDesc: [{
                    required: true,
                    message: '简介不能为空'
                }]
            },

            // 列表查看
            searchContent: {
                name: '',
                no: '',
                status: ''
            },
            servExplModule: [],             // 服务说明模块数组
            servItemData: [],               // 本页列表数据源
            servItemData2: [{               // 本页列表模拟数据源
                "serviceCode": "071",       // 服务项编码
                "serviceName": "电子档案",   // 服务项目名称
                "serviceDesc": "这里是简介", // 简介
                "upperPrice": 20,
                "lowerPrice": 5,
                "price": 15,
                "status": "已启用",
                "serviceId": 1,
                "tenantId": "hcn"
            }],
            
            // 复制
            copyOtherFormVisible: false,
            copyTplFormOption: [],
            curTplFormOption: {},     // 复制其他模板项当前项
            copyTplForm: {            // 复制其他模板项表单
                option: ''
            },    
            
            // 服务项新增
            addTplFormVisible: false,
            isReadOnly: false,        // 查看状态
            isGenePlan: false,
            createUser: '3c41b79e-6484-11e7-8229-005056c00008',
            addServItemForm: {        // 新增服务项详情表单
                serviceName: '',      // 服务项目名称
                upperPrice: 0,       // 价格上限
                lowerPrice: 0,       // 价格下限
                price: 0,            // 价格
                correlation: '',      // 关联模块
                validPeriod: '',      // 有效期
                evaluationTplId: 0,  // 关联评价
                actOrgType: '',       // 执行机构分类
                // allowanceRatio: '',   // 补助系数
                relateFormId: 0,     // 关联表单 
                generatePlanFlag: '', // 是否生成计划
                generatePlanTime: 0,  // 生成计划时机
                serviceDesc: '',      // 简介
                helpDoc: '',          // 服务指导
                tenantId: '',      // 租户ID
                createUser: '3c41b79e-6484-11e7-8229-005056c00008' // 登录用户ID
            },
            addTplForm: {             // 添加服务说明模板表单
                content: ''
            }
        }
    },
    activated() {
        this.init();
    },
    methods: {
        /**
         *  通用 
         */ 
        // 获取字典
        dictionaryRequest() {
            // 参数
            var that = this;
            let arr = [
                "cfs.dic.base_organizationType"  // 执行机构
            ]; 
            // 调用服务
            commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                if (res.code == 200) {
                    res.body.forEach(function (ele, index) {
                        if (ele.dicId == arr[0]) {
                            that.dictionary.organizationType = ele.items;
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
            this.page.pageSize = val;
            this.getServItemList();
        },
        // 当前页变化
        handleCurrentChange(val) {
            this.page.pageNo = val;
            this.getServItemList();
        },
        // 单选按钮
        chooseItem(val) {
            if (val == 1) {
                this.isGenePlan = true;
                this.addServItemForm.generatePlanTime = '';
            } else {
                this.isGenePlan = false;
            }
        },
        // 关闭窗口
        closeDialog() {
            this.dialogFormVisible = false;
        },
        closeCopyDialog() {
            this.copyOtherFormVisible = false;
        },
        closeAddTplDialog() {
            this.addTplFormVisible = false;
        },


        /**
         *  查看 
         */ 
        // 获取服务项列表
        getServItemList() {
            if (this.searchContent.name==""&&this.searchContent.status=="") {
                var params = [{
                    tenantId: sessionStorage.getItem('tenantId'),
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize
                }];
            } else {
                var params = [{
                    tenantId: sessionStorage.getItem('tenantId'),
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize,
                    serviceName: this.searchContent.name,
                    status: this.searchContent.status
                }];
            }

            commonAjax('cas.baseServiceService', 'getBaseServiceitemsList', params).then(res => {
                if (res.code == 200) {
                    this.servItemData = res.body.items;
                    this.total = res.body.total;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 查看
        checkServItem(row) {
            let params = [row.serviceId];

            commonAjax('cas.baseServiceService', 'getServiceItemInfo', params).then(res => {
                if (res.code == 200) {
                    this.addServItemForm = res.body;
                    this.isReadOnly = true;
                    this.dialogFormVisible = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 重置表单
        resetAddServItemForm() {
            this.addServItemForm.serviceName = ''; // 服务项目名称
            this.addServItemForm.upperPrice = 0;  // 价格上限
            this.addServItemForm.lowerPrice = 0;  // 价格下限
            this.addServItemForm.price = 0;       // 价格
            this.addServItemForm.correlation = ''; // 关联模块
            this.addServItemForm.validPeriod = 0; // 有效期
            
            this.addServItemForm.actOrgType = '';      // 执行机构分类
            // this.addServItemForm.allowanceRatio = '';  // 补助系数
            this.addServItemForm.serviceDesc = '';     // 简介
            this.addServItemForm.helpDoc = '';         // 服务指导
            this.addServItemForm.serviceName = '';
            // this.addServItemForm.evaluationTplId = ''; // 关联评价
            // this.addServItemForm.relateFormId = '';    // 关联表单 
            // generatePlanFlag: '', // 是否生成计划
            // generatePlanTime: 0,  // 生成计划时机
            // tenantId: 'hcn',      // 租户ID
            // createUser: '3c41b79e-6484-11e7-8229-005056c00008' // 登录用户ID
        },
        

        /**
         *  编辑 
         */ 
        // 清除
        clear() {
            this.searchContent.name = '';
            this.searchContent.no = '';
            this.searchContent.status = '';
        },
        // 搜索
        search() {
            this.getServItemList();        
        },
        // 编辑
        editServItem(row) {
            this.addServItemForm = row;
            this.isReadOnly = false;
            this.dialogTitle = '编辑服务项详情';
            this.dialogFormVisible = true;
        },
        // 切换状态
        switchStatus(index, row) {
             if (row.status == 1) { // 禁用
                const h = this.$createElement;

                this.$msgbox({
                    title: '确认禁用？',
                    message: h('p', null, [
                        h('span', null, ''),
                        h('i', {
                            style: 'color: teal'
                        }, row.shortName)
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
                            message: "取消禁用"
                        });
                    } else {
                        // 禁用服务
                        commonAjax('cas.baseServiceService', 'updateItemStatus', [row.serviceId, "0"]).then(res => {
                            if (res.code == 200) {
                                row.status = 0;
                                this.$message({
                                    type: 'success',
                                    message: '禁用成功！'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                })
                            }
                        })
                    }
                })
            } else { // 启用
                const h = this.$createElement;

                this.$msgbox({
                    title: '确认启用？',
                    message: h('p', null, [
                        h('span', null, ''),
                        h('i', {
                            style: 'color: teal'
                        }, row.shortName)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...',
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
                    if (action === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: "取消启用"
                        });
                    } else {
                        // 启用服务
                        commonAjax('cas.baseServiceService', 'updateItemStatus', [row.serviceId, "1"]).then(res => {
                            if (res.code == 200) {
                                row.status = 1;
                                this.$message({
                                    type: 'success',
                                    message: '启用成功！'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                })
                            }
                        })
                    }
                });
            }
        },
        // 复制其他模版
        copyOtherTpl() {
            this.dialogTitle = '复制其它模板项';
            this.copyOtherFormVisible = true;

            commonAjax('cas.baseServiceService', 'getServiceitemTmplList', []).then(res => {
                if (res.code == 200) {
                    this.copyTplFormOption = res.body;
                }
            });
        },
        // 删除服务说明模块
        delExplModule() {
            alert('删除该执行模块！？')
        },


        /**
         *  添加
         */ 
        // 添加服务
        addServiceItem() {
            this.resetAddServItemForm();
            this.dialogTitle = '新增服务项详情';
            this.isGenePlan = false;
            this.isAddOrEdit = 1;
            this.dialogFormVisible = true;
        },
        // 添加
        addServExplModule() {
            this.dialogTitle = '添加服务说明模版';
            this.addTplFormVisible = true;
        },
        // 保存新增服务项表单数据
        saveFormData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.isAddOrEdit == 1) { // 添加数据
                        this.addServItemForm.tenantId = sessionStorage.getItem('tenantId');
                        this.addServItemForm.content = this.servExplModule; // 服务说明模板内容
                        if (this.addServItemForm.allowanceRatio) {
                            this.addServItemForm.allowanceRatio = parseInt(this.addServItemForm.allowanceRatio);
                        }
                        this.addServItemForm.generatePlanTime = parseFloat(this.addServItemForm.generatePlanTime);
                        this.addServItemForm.lowerPrice = parseFloat(this.addServItemForm.lowerPrice);
                        this.addServItemForm.price = parseFloat(this.addServItemForm.price);
                        this.addServItemForm.upperPrice = parseFloat(this.addServItemForm.upperPrice);
                        this.addServItemForm.validPeriod = parseInt(this.addServItemForm.validPeriod);

                        commonAjax('cas.baseServiceService', 'saveServeItems', [this.addServItemForm]).then(res => {
                            if (res.code == 200) {
                                this.getServItemList(); // 刷新列表
                                this.dialogFormVisible = false;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    } else {  // 编辑数据 
                        this.isAddOrEdit = 2;
                        this.addServItemForm.allowanceRatio = parseInt(this.addServItemForm.allowanceRatio);
                        this.addServItemForm.generatePlanTime = parseFloat(this.addServItemForm.generatePlanTime);
                        this.addServItemForm.lowerPrice = parseFloat(this.addServItemForm.lowerPrice);
                        this.addServItemForm.price = parseFloat(this.addServItemForm.price);
                        this.addServItemForm.upperPrice = parseFloat(this.addServItemForm.upperPrice);
                        this.addServItemForm.validPeriod = parseInt(this.addServItemForm.validPeriod);

                        commonAjax('cas.baseServiceService', 'editServeItems', [this.addServItemForm]).then(res => {
                            if (res.code == 200) {
                                this.getServItemList(); // 刷新列表
                                this.dialogFormVisible = false;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    }
                } else {
                    // alert('请检查所有必填项~')
                }
            })
        },
        // 保存'复制其他模板项'表单
        saveCopyTplData(val) {
            debugger
            // if (this.isAddOrEdit == 1) {
            if (false) {
                this.servExplModule.push(this.copyTplForm.option);
            } else {
                // 保存到表
                var curOption = this.copyTplForm.option;
                var curOptionObj = {};
                $.each(this.copyTplFormOption, function(index, el) {
                    if (el.tmplId == curOption) {
                        curOptionObj = el;
                    }
                });

                let params = {
                    content: curOptionObj.content,
                    serviceId: this.addServItemForm.serviceId,
                    createUser: this.createUser
                };
                commonAjax('cas.baseServiceService', 'addServiceitemTmpl', [params]).then(res => {
                    if (res.code == 200) {
                        console.log('添加成功！');
                        this.servExplModule.push(curOptionObj.content);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                });
            }
            
            this.copyOtherFormVisible = false;
        },
        // 保存手录的模板
        saveAddTplData() {
            if (this.isAddOrEdit == 1) { // 添加
                this.servExplModule.push(this.addTplForm.content);
            } else { // 编辑
                // 保存到表
                let params = {
                    content: this.addTplForm.content,
                    serviceId: this.addServItemForm.serviceId,
                    createUser: this.createUser
                };
                commonAjax('cas.baseServiceService', 'addServiceitemTmpl', [params]).then(res => {
                    if (res.code == 200) {
                        console.log('添加成功！');
                        this.servExplModule.push(this.addTplForm.content);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                });
            }

            this.addTplFormVisible = false;
        },

        init() {
            this.dictionaryRequest();
            this.getServItemList();
        }
    }
}
</script>
<style type="text/css" scoped>
.addServItem button {
    float: right;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.search_line {
    margin-top: 10px;
}

.serv_name,
.number,
.status {
    width: 130px;
}

.oper_btn {
    text-align: right;
}

.serv_name,
.serv_no {
    width: 175px;
}

.as_inline {
    display: inline-block;
}

.min_width {
    width: 265px;
}

.serv_explain {
    margin-bottom: 10px;
}

.serv_explain_label {
    color: #00d1b2;
    margin-left: 15px;
}

.copy_other {
    margin-left: 320px;
}

.serv_content {
    display: inline-block;
    width: 86%;
    margin-left: 15px;
}

.bottom_btn {
    margin-top: 20px;
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

.serv_expl_item {
    margin-left: 15px;
}
</style>
<style>
.SIList .day > input {
    width: 55px;
}
</style>
