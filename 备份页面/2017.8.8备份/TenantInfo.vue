<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
                        <el-breadcrumb-item>{{tenantOption.tenantId?'编辑租户':'新增租户'}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12" class="return_prev">
                    <router-link to="/tenantManage"> <span class="return"><img src="../../assets/img/return.png"></span>返回上一级</router-link>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <el-tabs type="card" :active-name="tenantOption.activeName" @tab-click="tabHandleClick">
                <el-tab-pane label="基本信息" name="baseInfo" class="eltabpane">
                    <el-form :model="formdata" :rules="tenantinformrules" ref="tenantinfoForm" auto-complete="off">
                        <el-form-item label="租户标识" :label-width="formLabelWidth" prop="tenantFullName">
                            <el-input v-model="formdata.tenantFullName" :disabled="tenantOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" :label-width="formLabelWidth" prop="tenantClassify">
                            <el-select v-model="formdata.tenantClassify" placeholder="请选类型" :disabled="tenantOption.isdisabled">
                                <el-option v-for="item in dictionary.tenantClassify" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="名称" :label-width="formLabelWidth" prop="tenantShortName">
                            <el-input v-model="formdata.tenantShortName" :disabled="tenantOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="服务热线" :label-width="formLabelWidth" prop="medicaltenantId">
                            <el-input v-model="formdata.medicaltenantId" :disabled="tenantOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="服务说明" :label-width="formLabelWidth" prop="localtenantId">
                            <el-input v-model="formdata.localtenantId" :disabled="tenantOption.isdisabled"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="center-foot">
                        <el-button @click="closetenantmodal('tenantinfoForm')">取 消</el-button>
                        <el-button type="primary" @click="submitForm('tenantinfoForm')" v-if="!tenantOption.isdisabled">保 存</el-button>
                        <el-button type="primary" @click="editForm()" v-if="tenantOption.isdisabled">我要编辑</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="机构列表" name="tenantnavigation" class="eltabpane" v-if="tenantOption.ishowtab">
                    <el-row class="addbtn">
                        <el-col :span="12">
                            <!--  <el-input placeholder="请输入医院名称" icon="search" v-model="params.content" :on-icon-click="searchClick">
                            </el-input> -->
                            <el-input placeholder="请输入医院名称" icon="search">
                            </el-input>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="primary" icon="plus" @click="addorg">新建机构</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="orgtableData" border style="width: 100%">
                        <el-table-column prop="id" label="序号">
                        </el-table-column>
                        <el-table-column prop="name" label="机构名称">
                        </el-table-column>
                        <el-table-column prop="prevName" label="上级机构">
                                <template scope="scope" >
                                    <div v-if="scope.row.prevName==''" class="green"><i class="el-icon-plus"  @click="addprevorgtolist(scope.$index, scope.row)"></i>添加</div>
                                     <div v-if="scope.row.prevName!=''">{{scope.row.prevName}}<i class="el-icon-close red" @click="deleprevorgtolist(scope.$index, scope.row)"></i></div>
                                </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" type="danger" @click="navhandleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="navtotal" :page-sizes="[10,20,50]" @size-change="navhandleSizeChange" @current-change="navhandleCurrentChange" :page-size="navparams.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="产品列表" name="reportDes" class="eltabpane" v-if="tenantOption.ishowtab">
                    <el-row class="addbtn">
                        <el-col :span="24">
                            <el-button type="primary" icon="plus" @click="rephandleEdit">新建报告说明</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="reptableData" border style="width: 100%">
                        <el-table-column prop="bigtype" label="序号">
                        </el-table-column>
                        <el-table-column prop="type" label="租户产品标识">
                        </el-table-column>
                        <el-table-column prop="destit" label="租户产品名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="rephandleEdit(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" type="danger" @click="rephandleDelete(scope.$index, scope.row)">禁用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="navtotal" :page-sizes="[10,20,50]" @size-change="navhandleSizeChange" @current-change="navhandleCurrentChange" :page-size="navparams.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="服务列表" name="serviceList" class="eltabpane" v-if="tenantOption.ishowtab">
                    <el-row class="addbtn">
                        <el-col :span="24">
                            <el-button type="primary" icon="plus" @click="serhandleEdit">新建服务</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="sertableData" border style="width: 100%">
                        <el-table-column prop="xm" label="服务项目">
                        </el-table-column>
                        <el-table-column prop="code" label="服务编码" width="200">
                        </el-table-column>
                        <el-table-column prop="isshow" label="启用标记" width="200">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="serhandleEdit(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" type="warning" @click="serhandleExtend(scope.$index, scope.row)">扩展属性</el-button>
                                <el-button size="small" type="danger" @click="serhandleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="sertotal" :page-sizes="[10,20,50]" @size-change="serhandleSizeChange" @current-change="serhandleCurrentChange" :page-size="serparams.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-row>
        <!-- 添加医院模态框 -->
        <el-dialog :title="dialogtitle" v-model="orgdialogFormVisible" @close="resetForm('navinfoForm')">
            <el-row class="addbtn">
                        <el-col :span="12">
                            <!--  <el-input placeholder="请输入医院名称" icon="search" v-model="params.content" :on-icon-click="searchClick">
                            </el-input> -->
                            <el-input placeholder="请输入医院名称" icon="search">
                            </el-input>
                        </el-col>
                        <el-col :span="12">
                           <!--  <el-button type="primary" icon="plus" @click="addorg">新建机构</el-button> -->
                        </el-col>
                    </el-row>
                    <el-table :data="orgtableData" border style="width: 100%">
                        <el-table-column prop="id" label="序号">
                        </el-table-column>
                        <el-table-column prop="name" label="机构名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                   <el-button size="small" @click="addorgtolist(scope.$index, scope.row,'reportDes')">添加</el-button>
                                  <!--  <el-button size="small" @click="addprevorgtolist(scope.$index, scope.row,'reportDes')">添加</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="navtotal" :page-sizes="[10,20,50]" @size-change="navhandleSizeChange" @current-change="navhandleCurrentChange" :page-size="navparams.pageSize">
                        </el-pagination>
                    </div>
        </el-dialog>
        <!-- 报告说明模态框 -->
        <el-dialog :title="dialogtitle" v-model="repdialogFormVisible" @close="resetForm('repinfoForm')">
            <el-form :model="repformdata" :rules="repformdata.tenantinforules" ref="repinfoForm" auto-complete="off">
                <el-form-item label="租户产品标识" :label-width="formLabelWidth" prop="tenantFullName">
                    <el-input v-model="repformdata.tenantFullName" disabled></el-input>
                </el-form-item>
                  <el-form-item label="租户产品名称" :label-width="formLabelWidth" prop="tenantFullName">
                    <el-input v-model="repformdata.tenantFullName" disabled></el-input>
                </el-form-item>
                 <el-form-item label="租户名称" :label-width="formLabelWidth" prop="tenantFullName">
                    <el-input v-model="repformdata.tenantFullName" disabled></el-input>
                </el-form-item>
                <el-form-item label="一级产品" :label-width="formLabelWidth" prop="tenantShortName">
                    <el-select v-model="ruleForm" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品类型" :label-width="formLabelWidth" prop="medicaltenantId">
                    <el-select v-model="ruleForm" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="说明" :label-width="formLabelWidth" prop="medicaltenantId">
                    <el-input v-model="repformdata.medicaltenantId"></el-input>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="resetForm('repinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="repsubmitForm('repinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 服务新增修改模态框 -->
        <el-dialog :title="dialogtitle" v-model="serformdata.serdialogFormVisible" @close="resetForm('serinfoForm')">
            <el-form :model="serformdata" :rules="serformdata.tenantinforules" ref="serinfoForm" auto-complete="off">
                <el-form-item label="服务项目" prop="">
                    <el-select v-model="ruleForm" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模块编码" :label-width="formLabelWidth" prop="tenantShortName">
                    <el-input v-model="serformdata.tenantShortName"></el-input>
                </el-form-item>
                <el-form-item label="服务说明" :label-width="formLabelWidth" prop="medicaltenantId">
                    <el-input v-model="serformdata.medicaltenantId"></el-input>
                </el-form-item>
                <el-form-item label="开通服务对象类别" :label-width="formLabelWidth" prop="medicaltenantId">
                    <el-select v-model="ruleForm" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务主体标志" prop="">
                    <el-radio-group v-model="ruleForm">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效标志" prop="">
                    <el-radio-group v-model="ruleForm">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="resetForm('serinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="sersubmitForm('serinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 服务扩展属性列表模态框 -->
        <el-dialog :title="dialogtitle" v-model="serextdialogFormVisible">
            <el-row class="addbtn">
                <el-col :span="24">
                    <el-button type="primary" icon="plus" @click="handleEdit('','','baseInfo')">新建服务</el-button>
                </el-col>
            </el-row>
            <el-table :data="serexttableData" border style="width: 100%">
                <el-table-column prop="sx" label="属性">
                </el-table-column>
                <el-table-column prop="sxv" label="属性值">
                </el-table-column>
                <el-table-column prop="isshow" label="有效标识">
                </el-table-column>
                <el-table-column prop="xgr" label="最后修改人">
                </el-table-column>
                <el-table-column prop="xgt" label="最后修改时间">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button size="small" @click="serexthandleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="serexthandleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 服务扩展属性新增编辑模态框 -->
        <el-dialog :title="dialogtitle2" v-model="addserextdialogFormVisible" @close="resetForm('serextinfoForm')">
            <el-form :model="serextformdata" :rules="serextformdata.tenantinforules" ref="serextinfoForm" auto-complete="off">
                <el-form-item label="属性代码" prop="" :label-width="formLabelWidth">
                    <el-select v-model="ruleForm" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性类型" :label-width="formLabelWidth" prop="medicaltenantId">
                    <el-select v-model="ruleForm" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性值" :label-width="formLabelWidth" prop="tenantShortName">
                    <el-input v-model="serextformdata.tenantShortName"></el-input>
                </el-form-item>
                <el-form-item label="有效标志" prop="" :label-width="formLabelWidth">
                    <el-radio-group v-model="ruleForm">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="dialog-footer center-foot">
                    <el-button @click="resetForm('serextinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="serextsubmitForm('serextinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import BMap from 'BMap'
import {
    commonAjax, imguploadurl, imgview
}
from '../../api/api';
import {
    mapState
}
from 'vuex';
import AreaText from '../common/Area.vue';
export default {
    data() {
            return {
                //通用

                formLabelWidth: '120px',
                dialogtitle: "",
                imguploadurl: imguploadurl,
                headers: {
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                //机构基本信息开始
                imageUrl: "",
                tenantinformrules: {
                    tenantFullName: [{
                        required: true,
                        message: '请输入机构全称',
                        trigger: 'blur'
                    }],
                    province: [{
                        required: true,
                        message: '请选择省',
                        trigger: 'blur'
                    }],
                    tenantAddress: [{
                        required: true,
                        message: '请填写地址',
                        trigger: 'blur'
                    }],
                    trafficDesc: [{
                        required: true,
                        message: '请填写交通说明',
                        trigger: 'blur'
                    }],
                    longitude: [{
                        required: true,
                        message: '请填写经度',
                        trigger: 'blur'
                    }],
                    latitude: [{
                        required: true,
                        message: '请填写维度',
                        trigger: 'blur'
                    }],
                },
                formdata: {
                    tenantId: "", //机构Id,新增时候不传
                    consultNo: "", //咨询电话
                    tenantFullName: "", //机构全称
                    fax: "", //传真
                    tenantAddress: "", //机构地址
                    tenantShortName: "", //简称
                    street: "", //街道编码
                    emergencyNo: "", //紧急电话
                    medicaltenantId: "", //机构医保局id
                    postcode: "", //邮政编码
                    localtenantId: "", //机构代码
                    city: "", //地址（市）
                    avatarField: "", //机构照片地址id
                    parentId: "", //上级机构Id
                    tenantNature: "", //机构性质
                    trafficDesc: "", //交通说明
                    province: "", //地址（省）
                    tenantClassify: "", //机构分类
                    longitude: "", //经度
                    latitude: "", //维度
                    district: "", //地址（区、县）
                    tenantLevel: "", //机构级别
                    parenttenantName: "",
                },
                mapsearchtext: "", //百度地图搜索关键字


                //字典查询数据
                dictionary: {
                    tenantClassify: [], //机构分类base_tenantanizationType
                    tenantNature: [], //机构性质base_mechanismProperties
                    tenantLevel: [], //机构等级base_tenantanizationGrade
                },
                defaultarea: { //地区组件父组件传值
                    province: "",
                    city: "",
                    district: "",
                    street: "",
                },
                //机构基本信息结束--------------------------------------------------

                //机构开始
                navimageUrl: "",
                orgtableData: [{
                    id: 1,
                    name: "杭州人民医院",
                    prevName: "浙一"
                }, {
                    id: 2,
                    name: "杭州人民医院1",
                    prevName: ""
                }],
                navparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                navtotal: 2,
                orgdialogFormVisible: false,
                navformdata: {

                },
                navinformrules: {
                    tenantFullName: [{
                        required: true,
                        message: '请输入导航图名称',
                        trigger: 'blur'
                    }]
                },

                //机构导航结束--------------------------------------------------

                //服务列表开始

                sertableData: [{
                    xm: "预约挂号",
                    code: "0101",
                    isshow: "是"
                }, {
                    xm: "签约取号",
                    code: "0102",
                    isshow: "是"
                }],
                serparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                sertotal: 2,
                serformdata: {

                },
                //服务属性扩展开始
                serexttableData: [{
                    sx: "预约挂号",
                    sxv: "预约挂号实名制",
                    isshow: "是",
                    xgr: "",
                    xgt: "",

                }, {
                    sx: "预约挂号",
                    sxv: "预约挂号实名制",
                    isshow: "是",
                    xgr: "",
                    xgt: "",
                }],
                serextparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },

                serexttotal: "",
                serextdialogFormVisible: false,
                addserextdialogFormVisible: false,
                serextformdata: {

                },
                dialogtitle2: "", //服务属性扩展的标题
                //服务属性扩展结束
                //服务列表结束--------------------------------------------------
                //报告查询开始
                repimageUrl: "",
                reptableData: [{
                    bigtype: "检查",
                    type: "超声",
                    destit: "检查报告说明"
                }, {
                    bigtype: "检验",
                    type: "常规报告",
                    destit: "检验报告说明"
                }],
                repparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                reptotal: "",
                repdialogFormVisible: false,
                repformdata: {

                },
                repinformrules: {
                    tenantFullName: [{
                        required: true,
                        message: '请输入机构全称',
                        trigger: 'blur'
                    }]
                },
                //报告查询结束-------------------------------------------------
                // 账号信息开始
                countinformrules: {
                    tenantFullName: [{
                        required: true,
                        message: '请输入机构全称',
                        trigger: 'blur'
                    }]
                },
                countformdata: {
                    AliPay: {
                        'aliPublicKey': "",
                        'tenantId': "",
                        'appId': "",
                        'privateKey': "",
                        'partnerId': "",
                        'accountType': "02",
                        'account': "",
                        'recordId': ""
                    },
                    wechatPay: {
                        'aliPublicKey': "",
                        'tenantId': "",
                        'appId': "",
                        'privateKey': "",
                        'partnerId': "",
                        'accountType': "03",
                        'account': "",
                        'recordId': ""
                    },
                    bankPay: {
                        'aliPublicKey': "",
                        'tenantId': "",
                        'appId': "",
                        'privateKey': "",
                        'partnerId': "",
                        'accountType': "04",
                        'account': "",
                        'recordId': "",
                    },
                    ZhongFu: {
                        'tenantId': "",
                        'account': '',
                        'partnerId': '',
                        'accountType': '06'
                    },
                },
                fileList3: []
                    // 账号信息结束--------------------------------------------------
                    // 机构二维码开始

                // 账号信息结束--------------------------------------------------
            }
        },
        computed: {
            ...mapState(['tenantOption']),

        },
        methods: {
            // 通用
            tabHandleClick(tab, event) {
                    let ishowtab = event.target.innerHTML;
                    let temtenantOption = {
                        tenantId: this.tenantOption.tenantId,
                        activeName: tab.name,
                        ishowtab: ishowtab == "基本信息" && !this.tenantOption.tenantId ? false : true,
                        isdisabled: this.tenantOption.isdisabled,
                    };
                    this.$store.dispatch('tenantOption', temtenantOption)
                },
                beforeAvatarUpload(file) { //上传图片之前

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
                //重置标单
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                },
                //租户基本信息开始
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {

                            commonAjax("base.systenantanizationService", "savetenant", '[' + JSON.stringify(this.formdata) + ']', ).then(res => {

                                if (res.code == 200) {
                                    this.dialogFormVisible = false;
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg
                                    });
                                }
                            });
                            // alert('submit!');
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
                handleAvatarSuccess(res, file) { //上传图片成功后
                    this.imageUrl = imgview + res.id;
                    this.formdata.avatarField = res.id;

                },
                //获取字典
                dictionaryRequest() {
                    var that = this;
                    let arr = ["base.dictionary.base_tenantanizationType", "base.dictionary.base_mechanismProperties", "base.dictionary.base_tenantanizationGrade"];
                    commonAjax("coms.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        // 
                        if (res.code == 200) {
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.tenantClassify = ele.items;
                                }
                                if (ele.dicId == arr[1]) {
                                    that.dictionary.tenantNature = ele.items;
                                }
                                if (ele.dicId == arr[2]) {
                                    that.dictionary.tenantLevel = ele.items;
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
                editForm() {
                    this.tenantOption.isdisabled = false;
                },
                //机构基本信息结束---------------------------------------------------------
                //机构导航开始
                navhandleDelete(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.tenantFullName)
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
                                }, 3000);
                            } else {
                                done();
                            }
                        }
                    }).then(action => {
                        if (action == 'cancel') {
                            this.$message({
                                type: 'info',
                                message: "取消删除"
                            });
                        } else {
                            this.$message({
                                type: 'success',
                                message: "删除成功"
                            });
                        }

                    })
                },
                addorg() {
                    this.dialogtitle="添加医院";
                    this.orgdialogFormVisible = true;
                    if (row) {

                    } else {

                    }

                },
                //给租户添加医院
                addorgtolist(index, row){

                },
                //给机构添加上级医院
                addprevorgtolist(index, row){

                },
                //删除机构的上级医院
                deleprevorgtolist(index, row){

                },
                navsubmitForm(formName) {

                },
                //获取医院导航列表数据
                navgetTableData() {
                    // 
                    // let params = this.navparams;
                    // commonAjax( "base.systenantanizationService", "list",'[' + JSON.stringify(params) + ']').then(res => {
                    //     
                    //     if (res.code == 200) {
                    //         res.body.list.forEach(function(el, index) {
                    //             el.number = index + 1;
                    //         })
                    //         this.orgtableData = res.body.list;
                    //         this.navtotal = res.body.total;
                    //     } else {
                    //         this.$message({
                    //             type: 'error',
                    //             message: res.msg
                    //         });
                    //     }



                    // });
                },
                navhandleSizeChange(val) {
                    // this.navparams.pageSize = val;
                    // this.navgetTableData()
                },
                navhandleCurrentChange(val) {
                    // this.navparams.pageNo = val;
                    // this.navgetTableData()
                },


                navhandleAvatarSuccess(res, file) { //上传图片成功后
                    this.imageUrl = imgview + res.id;
                    this.formdata.avatarField = res.id;

                },

                //机构导航结束---------------------------------------------------------

                //服务列表开始
                serhandleDelete(index, row) {
                    this.$message.error('删除第' + (index + 1) + '行');
                },
                serhandleEdit(index, row) {
                    if (row) {


                    } else {

                    }

                },

                sergetTableData() {

                },
                serhandleSizeChange(val) {
                    // this.serparams.pageSize = val;
                    // this.sergetTableData()
                },
                serhandleCurrentChange(val) {
                    // this.serparams.pageNo = val;
                    // this.sergetTableData()
                },

                serhandleExtend() {
                    this.serextdialogFormVisible = true;
                },
                sersubmitForm(formName) {},

                // 服务扩展属性方法
                serexthandleDelete(index, row) {
                    this.$message.error('删除第' + (index + 1) + '行');
                },
                serexthandleEdit(index, row) {
                    if (row) {
                        this.addserextdialogFormVisible = true;
                        this.dialogtitle2 = "编辑扩展属性"

                    } else {
                        this.dialogtitle2 = "新增扩展属性"
                    }

                },

                serextgetTableData() {

                },
                serexthandleSizeChange(val) {
                    // this.serextparams.pageSize = val;
                    // this.serextgetTableData()
                },
                serexthandleCurrentChange(val) {
                    // this.serextparams.pageNo = val;
                    // this.serextgetTableData()
                },

                serextsubmitForm(formName) {},
                //服务列表结束---------------------------------------------------------
                //报告查询开始
                rephandleDelete(index, row) {
                    this.$message.error('删除第' + (index + 1) + '行');
                },
                rephandleEdit(index, row) {
                    if (row) {
                        this.repdialogFormVisible = true;
                        this.dialogtitle = "编辑机构导航";
                        // 
                        // commonAjax( "base.systenantanizationService", "getDetail",`['${row.tenantId}']`).then(res => {
                        //     
                        //     if (res.code == 200) {
                        //         this.formdata = res.body;
                        //         this.defaultarea = {
                        //             province: this.formdata.province ? this.formdata.province : "",
                        //             city: this.formdata.city ? this.formdata.city : "",
                        //             district: this.formdata.district ? this.formdata.district : "",
                        //             street: this.formdata.street ? this.formdata.street : "",
                        //         }
                        //         this.imageUrl = imgview + this.formdata.avatarField;
                        //         this.baiduMap(this.formdata.longitude, this.formdata.latitude);
                        //     } else {
                        //         this.$message({
                        //             type: 'error',
                        //             message: res.msg
                        //         });
                        //     }
                        // });


                    } else {
                        this.repimageUrl = "";
                        this.repdialogFormVisible = true;
                        this.dialogtitle = "新增机构导航";

                    }

                },
                //获取医院导航列表数据
                repgetTableData() {
                    // 
                    // let params = this.repparams;
                    // commonAjax( "base.systenantanizationService", "list",'[' + JSON.stringify(params) + ']').then(res => {
                    //     
                    //     if (res.code == 200) {
                    //         res.body.list.forEach(function(el, index) {
                    //             el.number = index + 1;
                    //         })
                    //         this.reptableData = res.body.list;
                    //         this.reptotal = res.body.total;
                    //     } else {
                    //         this.$message({
                    //             type: 'error',
                    //             message: res.msg
                    //         });
                    //     }



                    // });
                },
                rephandleSizeChange(val) {
                    // this.repparams.pageSize = val;
                    // this.repgetTableData()
                },
                rephandleCurrentChange(val) {
                    // this.repparams.pageNo = val;
                    // this.repgetTableData()
                },

                repsubmitForm(formName) {

                },
                rephandleAvatarSuccess(res, file) { //上传图片成功后
                    this.imageUrl = imgview + res.id;
                    this.formdata.avatarField = res.id;

                },
                //报告查询结束---------------------------------------------------------

                //账号管理开始
                bankPayhandleChange(file, fileList) {
                    console.log(fileList);
                    this.fileList3 = fileList.slice(-3);
                }

            //账号管理结束---------------------------------------------------------

        },
        components: {
            AreaText
        },
        mounted() {
            // this.tenantId=this.$route.query.tenantId;
            // this.activeName=this.$route.query.activeName;
            // console.log( this.tenantOption)

            this.baiduMap('', '')
        },
        beforeMount() {
            this.navgetTableData();
            this.dictionaryRequest();

        },

}
</script>
<style type="text/css">
.grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding-top: 3px;
}

.grid-content p {
    border-left: 3px solid #00C484;
    height: 24px;
    line-height: 24px;
    padding: 3px 0 0 5px;
}

.addtenant button {
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

#allmap {
    /*width: 900px;*/
    height: 400px;
    overflow: hidden;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.eltabpane {
    margin: 0 auto;
}

h2.account-title {
    font-size: 16px;
    background: #EEE;
    padding: 5px 5%;
    margin-bottom: 20px
}

.el-upload-list__item.is-success:hover .el-icon-close {
    position: absolute;
    top: 5px;
    right: 10px;
}

.explains {
    font-size: 12px;
    color: rgb(131, 164, 165);
    line-height: 36px;
}

.addbtn {
    margin: 0 0 20px;
    text-align: right;
}
.red{color: #ff4949;font-size: 14px;margin-left: 10px;cursor: pointer;}

.green{color: #00d1b2;font-size: 14px;cursor: pointer;}
.green i{margin-right: 10px;}
</style>
