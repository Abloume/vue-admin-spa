<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>医生管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 标题 -->
                <div class="commontit">
                    <h2>医院列表</h2>
                </div>
                <div class="left-con">
                    <ul id="hospitalLists2" class="ztree" style="width:240px"></ul>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="commontit commontit2">
                    <h2>医生列表</h2>
                </div>
                <div class="right-con">
                    <el-row class="search_con" :gutter="20">
                        <el-col :span="8">
                            <el-input placeholder="请输入医生姓名" v-model="param.doctorName">
                            </el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-input placeholder="请输入医生工号" v-model="param.localDoctorId">
                            </el-input>
                        </el-col>
                        <el-col :span="4" class="addbtn">
                            <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                        </el-col>
                        <el-col :span="4" class="addbtn">
                            <el-button type="info" icon="plus" @click="lookdoc(0)">添加医生信息</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column prop="doctorName" label="医生姓名">
                        </el-table-column>
                        <el-table-column prop="phoneNo" label="电话">
                        </el-table-column>
                        <el-table-column prop="doctorLevelText" label="职称">
                        </el-table-column>
                        <el-table-column prop="deptName" label="所属科室">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="addTreeNode(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="doclisttotal" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="param.pageSize">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div id="rMenu">
            <ul>
                <li id="m_add" @click="addTreeNode">添加医生</li>
            </ul>
        </div>
        <!-- 编辑医生 -->
        <el-dialog :title="dialogtitle" v-model="editDocdialogFormVisible" @close="resetForm('editDocinfoForm')">
            <el-form :model="editDocformdata" :rules="editDocrules" ref="editDocinfoForm" auto-complete="off">
                <el-row :gutter="20">
                    <el-col :span="18">
                        <el-form-item label="医生姓名" :label-width="formLabelWidth" prop="name">
                            <el-input v-model="editDocformdata.doctorName" disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="editDocformdata.id!=0">
                        <el-button type="primary" @click="lookdoc(editDocformdata.id)">查看医生信息</el-button>
                    </el-col>
                    <el-col :span="6" v-show="editDocformdata.id==0">
                        <el-button type="info" @click="selectdoc">选择医生</el-button>
                    </el-col>
                </el-row>
                <el-form-item label="员工代码" :label-width="formLabelWidth" prop="localDoctorId">
                    <el-input v-model="editDocformdata.localDoctorId" :disabled="infoisdisabled"></el-input>
                </el-form-item>
                <el-form-item label="机构名称" :label-width="formLabelWidth" prop="orgName" v-show="editDocformdata.id!=0">
                    <el-input v-model="editDocformdata.orgName" :disabled="infoisdisabled"></el-input>
                </el-form-item>
                <el-form-item label="科室名称" :label-width="formLabelWidth" prop="deptName" v-show="editDocformdata.id!=0">
                    <el-input v-model="editDocformdata.deptName" :disabled="infoisdisabled"></el-input>
                </el-form-item>
                <el-form-item label="专家标识（医生）" :label-width="formLabelWidth" prop="expertFlag">
                    <el-select placeholder="请选择" v-model="editDocformdata.expertFlag">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专家费用（医生）" :label-width="formLabelWidth" prop="expertFee">
                    <el-input v-model="editDocformdata.expertFee"></el-input>
                </el-form-item>
                <el-form-item label="主职业标识" :label-width="formLabelWidth" prop="mainFlag">
                    <el-select placeholder="请选择" v-model="editDocformdata.mainFlag">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closeeditDocinfo('editDocinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="editDocsubmitForm('editDocinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 选择医生 -->
        <el-dialog title="选择医生" v-model="selectdialogFormVisible">
            <el-row class="search_con" :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入医生姓名" v-model="selectparam.doctorName">
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-input placeholder="身份证号" v-model="selectparam.idCard">
                    </el-input>
                </el-col>
                <el-col :span="4" class="addbtn">
                    <el-button type="primary" icon="search" @click="selectsearchClick">搜索</el-button>
                </el-col>
                <!-- <el-col :span="4" class="addbtn">
                            <el-button type="info" icon="plus" @click="lookdoc(0)">添加医生</el-button>
                        </el-col> -->
            </el-row>
            <el-table :data="selectdoctableData" border style="width: 100%">
                <el-table-column prop="doctorName" label="医生姓名">
                </el-table-column>
                <el-table-column prop="idCard" label="身份证">
                </el-table-column>
                <el-table-column prop="sexText" label="性别">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="selecteddoctor(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="selectdoclisttotal" :page-sizes="[10,20,50]" @size-change="selectSizeChange" @current-change="selectCurrentChange" :page-size="selectparam.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 医生详细信息 -->
        <el-dialog title="医生详细信息" v-model="docdetaildialogFormVisible" @close="resetForm('editDocdetailinfoForm')">
            <el-form :model="editdetailDocformdata" :rules="editdetailDocinforules" ref="editDocdetailinfoForm" auto-complete="off">
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="imguploaddata">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="医生姓名" :label-width="formLabelWidth" prop="doctorName">
                            <el-input v-model="editdetailDocformdata.doctorName"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idCard">
                            <el-input v-model="editdetailDocformdata.idCard"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                            <el-select v-model="editdetailDocformdata.sex" placeholder="请选择">
                                <el-option v-for="item in dictionary.sex" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出生日期" :label-width="formLabelWidth" prop="dob">
                            <el-date-picker type="date" placeholder="选择日期" v-model="editdetailDocformdata.dob" style="width: 100%;" :picker-options="pickerOptions0" @change="dateformat2"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="国籍" :label-width="formLabelWidth" prop="nationality">
                            <el-select v-model="editdetailDocformdata.nationality" placeholder="请选择">
                                <el-option v-for="item in dictionary.nationality" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="民族" :label-width="formLabelWidth" prop="nation">
                            <el-select v-model="editdetailDocformdata.nation" placeholder="请选择">
                                <el-option v-for="item in dictionary.nation" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phoneNo">
                            <el-input v-model="editdetailDocformdata.phoneNo"></el-input>
                        </el-form-item>
                        <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
                            <el-input v-model="editdetailDocformdata.email"></el-input>
                        </el-form-item>
                        <el-form-item label="学历" :label-width="formLabelWidth" prop="academic">
                            <el-select v-model="editdetailDocformdata.academic" placeholder="请选择">
                                <el-option v-for="item in dictionary.education" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="医师级别" :label-width="formLabelWidth" prop="doctorLevel">
                            <el-select v-model="editdetailDocformdata.doctorLevel" placeholder="请选择">
                                <el-option v-for="item in dictionary.doctorTitle" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="执业类别" :label-width="formLabelWidth" prop="certifiy">
                            <el-select v-model="editdetailDocformdata.certifiy" placeholder="请选择">
                                <el-option v-for="item in dictionary.practiceCategory" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-row :gutter="20">
                            <el-col :span="18">
                                <el-form-item label="执业证书编号" :label-width="formLabelWidth" prop="certifiyNo">
                                    <el-input v-model="editdetailDocformdata.certifiyNo"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" v-show="editDocformdata.doctorId">
                                <el-button @click="showcertifiy">查看证书</el-button>
                            </el-col>
                        </el-row>
                        <el-form-item label="执业地点" :label-width="formLabelWidth" prop="certifiyAddress">
                            <el-input v-model="editdetailDocformdata.certifiyAddress"></el-input>
                        </el-form-item>
                        <el-form-item label="执业范围" :label-width="formLabelWidth" prop="certifiyScope">
                            <el-input v-model="editdetailDocformdata.certifiyScope"></el-input>
                        </el-form-item>
                        <el-form-item label="发证机构" :label-width="formLabelWidth" prop="checkOrg">
                            <el-input v-model="editdetailDocformdata.checkOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="医生介绍" :label-width="formLabelWidth" prop="introduce">
                            <el-input v-model="editdetailDocformdata.introduce" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                        </el-form-item>
                        <el-form-item label="医生专长" :label-width="formLabelWidth" prop="speciality">
                            <el-input v-model="editdetailDocformdata.speciality"></el-input>
                        </el-form-item>
                        <el-form-item label="擅长疾病名称" :label-width="formLabelWidth" prop="diseaseName">
                            <el-input v-model="editdetailDocformdata.diseaseName" placeholder="多个擅长疾病，用英文逗号隔开"></el-input>
                        </el-form-item>
                        <!--  <el-form-item label="综合评价" :label-width="formLabelWidth" prop="summary">
                            <el-input v-model="editdetailDocformdata.summary" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" ></el-input>
                        </el-form-item> -->
                    </el-col>
                </el-row>
                <div class="center-foot">
                    <el-button @click="closeeditdetailDocinfo('editDocdetailinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="editdetailDocsubmitForm('editDocdetailinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 证书弹框 -->
        <el-dialog title="执业证书" v-model="certifiyFormVisible" class="certifiy">
            <img :src="imgview+editdetailDocformdata.certificateHead" />
            <img :src="imgview+editdetailDocformdata.certificateBack" />
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, commonurl, imguploadurl, imgview
}
from '../../api/api';
import 'assets/lib/zTree/img/metro.gif';
import 'assets/lib/zTree/img/metro.png';
import 'assets/lib/zTree/img/line_conn.png';

import 'assets/lib/zTree/metroStyle.css';
import 'assets/lib/zTree/js/jquery.ztree.core.js';
import 'assets/lib/zTree/js/jquery.ztree.exedit.min.js';

export default {
    data() {
            // var checkidCard = (rule, value, callback) => {
            //     // let idCardreg = /( ^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
            //     let idCardreg18 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            //     let idCardreg15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
            //     if (value.length == 18) {
            //         if (idCardreg18.test(value) === false) {
            //             return callback(new Error('身份证填写错误'));
            //         } else {
            //             callback()
            //         }
            //     } else if (value.length == 15) {
            //         if (idCardreg15.test(value) === false) {
            //             return callback(new Error('身份证填写错误'));
            //         } else {
            //             callback()
            //         }
            //     } else {
            //         return callback(new Error('身份证填写错误'));
            //     }
            // }
            // var checkidCard = (rule, value, callback) => {
            //     let reg = /^(\d{6})(19|20)(\d{2})(1[0-2]|0[1-9])(0[1-9]|[1-2][0-9]|3[0-1])(\d{3})(\d|X|x)?$/;
            //     if(reg.test(value)===false){
            //          return callback(new Error('身份证填写错误'));
            //     }else{
            //        callback(); 
            //     }
               
            // }
            return {
                //通用
                imgview:imgview,
                formLabelWidth: '160px',
                dialogtitle: "",
                //字典查询数据
                dictionary: {
                    sex: [], //性别,字典base_sex
                    nation: [], //民族base_nation
                    education: [], //学历base_education
                    nationality: [], //国籍base_nationality
                    doctorTitle: [], //医生级别base_doctorTitle
                    practiceCategory: [], //执业类别base_practiceCategory
                },
                //医生列表开始
                param: {
                    doctorName: "",
                    localDoctorId: "",
                    pageNo: 1,
                    pageSize: 10,
                    orgId: "",
                    deptId: "",
                },
                curorgName: "",
                doclisttotal: 1,
                infoisdisabled: false, //医生姓名、员工代码、机构名称、科室名称：是否无法修改
                tableData: [],
                // 医生列表结束--------------------------------------------------
                //医生添加编辑与机构关系开始----------------------------
                editDocdialogFormVisible: false,
                editDocformdata: {
                    "orgId": "",
                    "deptId": "",
                    "doctorId": "",
                    "localDeptId": "",
                    "localDoctorId": "",
                    "expertFlag": "",
                    "expertFee": "",
                    "mainFlag": "",
                    "id": 0, //新增为0
                    "doctorName": "",
                    "deptName": "",
                    "orgName": "",
                },
                editDocrules: [],
                //选择医生列表开始--------------------------------
                selectdoctableData: [],
                selectdialogFormVisible: false,
                selectdoclisttotal: 1,
                selectparam: {
                    idCard: "",
                    doctorName: "",
                    pageNo: 1,
                    pageSize: 10
                },
                // 医生详细信息
                docdetaildialogFormVisible: false,
                editdetailDocinforules: {
                    doctorName: [{
                        required: true,
                        message: '请输入医生姓名',
                        trigger: 'blur'
                    }],
                    sex: [{
                        required: true,
                        message: '请选择出生日期',
                        trigger: 'change'
                    }],
                    dob: [{
                        required: true,
                        message: '请选择出生日期',
                        trigger: 'change'
                    }],
                    certifiyNo: [{
                        required: true,
                        message: '请输入证书编号',
                        trigger: 'blur'
                    }],
                    // idCard: [{//身份证验证
                    //     validator: checkidCard,
                    //     trigger: 'blur'
                    // }],
                    //  idCard: [{
                    //     required: true,
                    //     message: '请输入身份证号',
                    //     trigger: 'blur'
                    // }],

                    // summary: [{
                    //     required: true,
                    //     message: '请输入综合评价',
                    //     trigger: 'blur'
                    // }],
                },
                editdetailDocformdata: {
                    "doctorId": "",
                    "doctorName": "",
                    "sex": "",
                    "idCard": "",
                    "dob": "",
                    "phoneNo": "",
                    "nation": "",
                    "nationality": "",
                    "email": "",
                    "academic": "",
                    "avatarFileId": 0,
                    "introduce": "",
                    "speciality": "",
                    "doctorLevel": "",
                    "certifiy": "",
                    "certifiyNo": "",
                    "certifiyAddress": "",
                    "certifiyScope": "",
                    "checkOrg": "",
                    "diseaseName": "",
                    "certificateHead":"",
                    "certificateBack":""
                    // "summary":"",
                },
                // 医生详细信息结束-------------------------------------------------
                //上传图像用
                imguploadurl: imguploadurl,
                imageUrl: "",
                imguploaddata: {
                    catalog: "avater" //头像:avater,意见反馈:feedback,机构:org,产品广告:banner,机构布局:orglayout
                },
                headers: {
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                //出生日期限制在今天之前
                pickerOptions0: {
                    disabledDate(time) {
                        console.log(time);
                        return time.getTime() > Date.now() - 8.64e7;
                    }
                },

                setting: {
                    async: {
                        enable: true,
                        type: "post",
                        url: commonurl,
                        dataType: "JSON",
                        headers: {
                            "X-Access-Token": sessionStorage.getItem('accessToken'),
                            "X-Service-Id": "cas.departmentService",
                            "X-Service-Method": 'deptTree',
                            "Content-Type": "application/json",
                            "roleIds": sessionStorage.getItem("roleIds"),
                        },
                        dataFilter: this.ajaxDataFilter,
                        // otherParam: {"id":"","nodeType":""},
                        autoParam: ["id", "nodeType=nodeType", "orgId=orgId"],
                    },
                    callback: {
                        onRightClick: this.OnRightClick,
                        onClick: this.zTreeOnClick
                    }
                },
                zTree: {},
                zNodes: [],
                certifiyFormVisible:false,
            }
        },
        computed: {

        },
        methods: {
            //选择医生弹框获取所有医生列表
            getalldoc() {
                    let params = `['${this.selectparam.idCard}','${this.selectparam.doctorName}',${this.selectparam.pageNo},${this.selectparam.pageSize}]`;
                    commonAjax("cas.doctorService", "listDoctorBySearch", params).then(res => {
                        if (res.code == 200) {
                            this.selectdoctableData = res.body.items;
                            this.selectdoclisttotal = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //根据科室获取医生列表数据
                getTableData() {
                    commonAjax("cas.doctorService", "queryDoctorByOrgIdAndDeptId", '[' + JSON.stringify(this.param) + ']').then(res => {
                        if (res.code == 200) {
                            this.tableData = res.body.items;
                            this.doclisttotal = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //添加编辑医生
                addTreeNode(index, row) {
                    console.log(row);
                    this.hideRMenu();
                    this.editDocdialogFormVisible = true;
                    if (row) {
                        this.infoisdisabled = true;
                        this.dialogtitle = "编辑医生";
                        let params = `['${this.param.orgId}','${row.deptId}','${row.doctorId}']`;
                        commonAjax("cas.doctorService", "getDoctorOrgs", params).then(res => {
                            if (res.code == 200) {
                                this.editDocformdata = {
                                    "orgId": res.body.orgId,
                                    "deptId": res.body.deptId,
                                    "doctorId": res.body.doctorId,
                                    "localDeptId": res.body.localDeptId,
                                    "localDoctorId": res.body.localDoctorId,
                                    "expertFlag": res.body.expertFlag,
                                    "expertFee": res.body.expertFee,
                                    "mainFlag": res.body.mainFlag,
                                    "id": res.body.id, //新增为0
                                    "doctorName": row.doctorName,
                                    "deptName": res.body.deptName,
                                    "orgName": res.body.orgFullName,
                                }
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });

                    } else {
                        this.infoisdisabled = false;
                        this.dialogtitle = "添加医生";
                        this.editDocformdata.doctorId = "";
                        this.editDocformdata.localDoctorId = "";
                        this.editDocformdata.expertFlag = "";
                        this.editDocformdata.expertFee = "";
                        this.editDocformdata.mainFlag = "";
                        this.editDocformdata.id = 0;
                        this.editDocformdata.doctorName = "";
                        this.editDocformdata.doctorId = "";
                    }
                    console.log( this.editDocformdata.id);
                },

                //点击选择医生
                selectdoc() {
                    this.selectdialogFormVisible = true;

                },
                // 点击医生列表选择医生
                selecteddoctor(index, row) {
                    this.editDocformdata.doctorId = row.doctorId
                        // this.editDocformdata.localDoctorId = row.localDoctorId
                    this.editDocformdata.doctorName = row.doctorName;
                    this.selectdialogFormVisible = false;
                },

                //医生列表页面显示的条数变化
                handleSizeChange(val) {
                    this.param.pageSize = val;
                    this.getTableData()
                },
                // 医生列表输入框翻页效果
                handleCurrentChange(val) {
                    this.param.pageNo = val;
                    this.getTableData()
                },
                //医生列表搜索按钮点击
                searchClick() {
                    this.getTableData();
                },
                //新增和编辑医生
                editDocsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax('cas.doctorService', 'addOrUpdateDoctorOrgs', '[' + JSON.stringify(this.editDocformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.editDocdialogFormVisible = false;
                                    this.param.orgId = this.editDocformdata.orgId;
                                    this.param.deptId = this.editDocformdata.deptId;
                                    this.getTableData();
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg
                                    });
                                };
                            })
                        } else {
                            return false;
                        }
                    });
                },
                closeeditDocinfo(formName) {
                    this.$refs[formName].resetFields();
                    this.editDocdialogFormVisible = false;
                },
                // 删除列表中的一条数据
                handleDelete(index, row) {
                    // this.$message.error('删除第' + (index + 1) + '行');
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.doctorName)
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
                            commonAjax("cas.doctorService", "deleteDoctorOrg", `['${row.id}']`).then(res => {
                                if (res.code == 200) {
                                    this.param.deptId = row.deptId;
                                    this.getTableData();
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });

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
                //选择医生
                selectSizeChange(val) {
                    this.selectparam.pageSize = val;
                    this.getalldoc()
                },
                selectCurrentChange(val) {
                    this.selectparam.pageNo = val;
                    this.getalldoc()
                },
                selectsearchClick() {
                    this.getalldoc();
                },
                // 医生详细信息
                lookdoc(id) {
                    this.docdetaildialogFormVisible = true;
                    if (id != 0) {
                        let params = `['${this.editDocformdata.doctorId}']`;
                        commonAjax("cas.doctorService", "getDoctorInfo", params).then(res => {
                            if (res.code == 200) {
                                this.imageUrl = res.body.avatarFileId ?imgview + res.body.avatarFileId : "";
                                this.editdetailDocformdata = {
                                    "doctorId": res.body.doctorId,
                                    "doctorName": res.body.doctorName,
                                    "sex": res.body.sex,
                                    "idCard": res.body.idCard,
                                    "dob": res.body.dob,
                                    "phoneNo": res.body.phoneNo ? res.body.phoneNo : "",
                                    "nation": res.body.nation ? res.body.nation : "",
                                    "nationality": res.body.nationality ? res.body.nationality : "",
                                    "email": res.body.email ? res.body.email : "",
                                    "academic": res.body.academic ? res.body.academic : "",
                                    "avatarFileId": res.body.avatarFileId ? res.body.avatarFileId : 0,
                                    "introduce": res.body.introduce ? res.body.introduce : "",
                                    "speciality": res.body.speciality ? res.body.speciality : "",
                                    "doctorLevel": res.body.doctorLevel ? res.body.doctorLevel : "",
                                    "certifiy": res.body.certifiy ? res.body.certifiy : "",
                                    "certifiyNo": res.body.certifiyNo,
                                    "certifiyAddress": res.body.certifiyAddress ? res.body.certifiyAddress : "",
                                    "certifiyScope": res.body.certifiyScope ? res.body.certifiyScope : "",
                                    "checkOrg": res.body.checkOrg ? res.body.checkOrg : "",
                                    "diseaseName": res.body.diseaseName ? res.body.diseaseName : "",
                                    "certificateHead" :res.body.certificateHead ? res.body.certificateHead : "",
                                    "certificateBack":res.body.certificateBack ? res.body.certificateBack : "",
                                    // "summary":res.body.summary
                                }

                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });

                    } else {
                        this.imageUrl = ""
                        this.editdetailDocformdata = {
                            "doctorId": "",
                            "doctorName": "",
                            "sex": "",
                            "idCard": "",
                            "dob": "",
                            "phoneNo": "",
                            "nation": "",
                            "nationality": "",
                            "email": "",
                            "academic": "",
                            "avatarFileId": 0,
                            "introduce": "",
                            "speciality": "",
                            "doctorLevel": "",
                            "certifiy": "",
                            "certifiyNo": "",
                            "certifiyAddress": "",
                            "certifiyScope": "",
                            "checkOrg": "",
                            "diseaseName": "",
                            "certificateHead" : "",
                            "certificateBack":"",
                            // "summary":""
                        }
                    }
                },
                //医生信息信息提交
                editdetailDocsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax('cas.doctorService', 'addOrUpdateDoctor', '[' + JSON.stringify(this.editdetailDocformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.docdetaildialogFormVisible = false;
                                    this.param.orgId = this.editdetailDocformdata.orgId;
                                    this.param.deptId = this.editdetailDocformdata.deptId;
                                    this.getTableData();
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg
                                    });
                                };
                            })
                        } else {
                            return false;
                        }
                    });
                },
                closeeditdetailDocinfo(formName) {
                    this.$refs[formName].resetFields();
                    this.docdetaildialogFormVisible = false;
                },
                dateformat2(val) {
                    this.editdetailDocformdata.dob = val
                },
                //通用的
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                },
                //字典请求
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_sex", "cfs.dic.base_nation", "cfs.dic.base_nationality", "cfs.dic.base_education", "cfs.dic.base_doctorTitle", "cfs.dic.base_practiceCategory"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then((res) => {
                        if (res.code == 200) {
                            var that = this;
                            $.each(res.body, function(index, el) {
                                if (el.dicId == arr[0]) {
                                    that.dictionary.sex = el.items;
                                }
                                if (el.dicId == arr[1]) {
                                    that.dictionary.nation = el.items;
                                }
                                if (el.dicId == arr[2]) {
                                    that.dictionary.nationality = el.items;
                                }
                                if (el.dicId == arr[3]) {
                                    that.dictionary.education = el.items;
                                }
                                if (el.dicId == arr[4]) {
                                    that.dictionary.doctorTitle = el.items;
                                }
                                if (el.dicId == arr[5]) {
                                    that.dictionary.practiceCategory = el.items;
                                }
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //数据请求并且赋值
                ajaxDataFilter(treeId, parentNode, responseData) {
                    responseData = responseData.body.info;
                    if (parentNode) {
                        $.each(responseData, function(index, el) {
                            el.name = el.deptName;
                            el.isParent = true;
                            el.nodeType = "2"
                        })
                    } else {
                        $.each(responseData, function(index, el) {
                            el.name = el.orgFullName;
                            el.isParent = true;
                            el.nodeType = "1"
                        })
                    }

                    return responseData;
                },
                //树状节点左击
                zTreeOnClick(event, treeId, treeNode, msg) {
                    //清空查询条件
                    this.param.doctorName = '';
                    this.param.localDoctorId = '';
                    this.curorgName = treeNode.orgFullName
                    if (treeNode.nodeType == "1") {
                        this.param.orgId = treeNode.id;
                        this.param.deptId = "";
                    } else {
                        this.param.orgId = treeNode.orgId;
                        this.param.deptId = treeNode.id;
                    }
                    this.getTableData();

                },
                //树状节点右击
                OnRightClick(event, treeId, treeNode) {
                    //不能为机构直接添加医生
                    if (treeNode.nodeType == '1') {
                        this.$message({
                            type: 'error',
                            message: '请选择科室进行添加医生'
                        });
                        return false;
                    } else {
                        this.editDocformdata.orgId = treeNode.orgId;
                        this.editDocformdata.deptId = treeNode.id; //deptId后台已经赋值给id
                        this.editDocformdata.localDeptId = treeNode.localDeptId;
                        this.showRMenu("node", event.clientX, event.clientY);
                        this.zTree.selectNode(treeNode);
                    }
                },

                //右键菜单部分
                showRMenu(type, x, y) {
                    $("#rMenu ul").show();
                    if (type == "root") {
                        // $("#m_del").hide();
                        $("#m_add").show();
                    } else if (type == "noadd") {
                        // $("#m_del").show();
                        $("#m_add").hide();

                    } else {
                        // $("#m_del").show();
                        $("#m_add").show();

                    }
                    $("#rMenu").css({
                        "top": y + "px",
                        "left": x + "px",
                        "visibility": "visible"
                    });

                    $("body").bind("mousedown", this.onBodyMouseDown);
                },

                hideRMenu() {
                    $("#rMenu").css({
                        "visibility": "hidden"
                    })
                    $("body").unbind("mousedown", this.onBodyMouseDown);
                },

                onBodyMouseDown(event) {
                    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
                        $("#rMenu").css({
                            "visibility": "hidden"
                        });
                    }
                },
                handleAvatarSuccess(res, file) { //上传图片成功后
                    this.imageUrl = imgview + res.body;
                    this.editdetailDocformdata.avatarFileId = res.body;

                },
                beforeAvatarUpload(file) { //上传图片之前通用
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
                // 点击查看证书
                showcertifiy(){
                    this.certifiyFormVisible=true;
                },
                //验证
                // validationData() {
                //     $('.msg-without-complete').modal('show');
                //     //必填验证
                //     let name = this.formdata.deptName;
                //     let code = this.formdata.localDeptId;
                //     let type = this.formdata.deptType;
                //     let dscp = this.formdata.description;
                //     let code_exp = /^[0-9a-zA-Z]+$/;
                //     if (name == '') {
                //         this.subErrorMsg = "请填写科室名称!";
                //         return false
                //     }
                //     if (code_exp.test(code) != true) {
                //         this.subErrorMsg = "科室代码只能为数字或字母!";
                //         return false
                //     }
                //     if (type == '') {
                //         this.subErrorMsg = "请选择科室类型!";
                //         return false
                //     }
                //     if (dscp == '') {
                //         this.subErrorMsg = "请填写科室介绍!";
                //         return false
                //     }
                //     //选择性验证
                //     let telp = this.formdata.contactNo;
                //     let email = this.formdata.email;
                //     let telp_exp = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
                //     let email_exp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                //     if (telp != '') {
                //         if (telp_exp.test(telp) != true) {
                //             this.subErrorMsg = "电话号码格式不正确!";
                //             return false
                //         }
                //     }
                //     if (email != '') {
                //         if (email_exp.test(email) != true) {
                //             this.subErrorMsg = "邮箱格式不正确!";
                //             return false
                //         }
                //     }
                // },

        },
        components: {

        },
        mounted() {

            //初始化科室列表
            $.fn.zTree.init($("#hospitalLists2"), this.setting);
            this.zTree = $.fn.zTree.getZTreeObj("hospitalLists2");
            //标准科室
            this.getalldoc();
            // //字典请求
            this.dictionaryRequest();
        },
        beforeMount() {


        },

}
</script>
<style type="text/css">
.left-con,
.right-con {
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 10px
}


/*右键*/

div#rMenu {
    position: fixed;
    visibility: hidden;
    top: 0;
    background-color: #fafafa;
    text-align: left;
    padding: 2px;
    border: 1px solid #e6e6e6;
    padding: 5px
}

div#rMenu ul {
    margin-bottom: 0;
}

div#rMenu ul li {
    margin: 1px 0;
    padding: 5px 10px;
    cursor: pointer;
    list-style: none outside none;
}

div#rMenu ul li:nth-child(1) {
    background: url(../../assets/img/add2.png) no-repeat 10px center;
    padding-left: 35px;
    cursor: pointer;
    border-bottom: 1px solid #1DC499;
}

div#rMenu ul li:nth-child(2) {
    background: url(../../assets/img/dele3.png) no-repeat 10px center;
    padding-left: 35px;
    cursor: pointer;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.addbtn {
    margin: 0 0 20px;
    text-align: left;
}

.el-upload--text {
    width: 140px;
    height: 160px;
    line-height: 180px
}

.el-picker-panel__icon-btn {
    margin-left: 20px
}
.certifiy img {display: block;margin:20px auto; width: 100%; height: auto}
</style>
