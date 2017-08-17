<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>科室管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 标题 -->
                <div class="commontit">
                    <h2>科室管理</h2>
                </div>
                <div class="left-con">
                    <ul id="hospitalLists" class="ztree" style="width:240px"></ul>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="commontit">
                    <h2>科室详细信息</h2>
                </div>
                <div class="right-con">
                    <el-form :model="formdata" :rules="departformrules" ref="departForm" auto-complete="">
                        <el-form-item label="机构名称" :label-width="formLabelWidth" prop="rootName">
                            <el-input v-model="rootName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="上级科室" :label-width="formLabelWidth" prop="localDeptPid">
                            <el-input v-model="prevDept" disabled></el-input>
                            <!--  <el-input v-model="formdata.localDeptPid" type='hidden'></el-input> -->
                        </el-form-item>
                        <el-form-item label="科室名称" :label-width="formLabelWidth" prop="deptName">
                            <el-input v-model="formdata.deptName" :disabled="eventOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="科室代码" :label-width="formLabelWidth" prop="localDeptId">
                            <el-input v-model="formdata.localDeptId" :disabled="eventOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="科室类型" :label-width="formLabelWidth" prop="deptType">
                            <el-select v-model="formdata.deptType" placeholder="请选择科室类型" :disabled="eventOrg">
                                <el-option v-for="item in dictionary.departmentType" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="标准科室" :label-width="formLabelWidth" prop="standardDeptId">
                            <el-select v-model="formdata.standardDeptId" placeholder="请选择标准科室" :disabled="eventOrg">
                                <el-option v-for="item in stdtableData" :key="item.stardardDeptId" :label="item.stardardDeptName" :value="item.stardardDeptId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="中西标志" :label-width="formLabelWidth" prop="zxFlag">
                            <el-select v-model="formdata.zxFlag" placeholder="请选择中西标志" :disabled="eventOrg">
                                <el-option label="中医" value="1"></el-option>
                                <el-option label="西医" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="重点科室" :label-width="formLabelWidth" prop="important">
                            <el-select v-model="formdata.important" placeholder="请选择重点科室" :disabled="eventOrg">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="门诊使用" :label-width="formLabelWidth" prop="outpatientUse">
                            <el-select v-model="formdata.outpatientUse" placeholder="请选择门诊使用" :disabled="eventOrg">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="住院使用" :label-width="formLabelWidth" prop="inpatientUse">
                            <el-select v-model="formdata.inpatientUse" placeholder="请选择住院使用" :disabled="eventOrg">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="病区使用" :label-width="formLabelWidth" prop="inpatientPlaceUse">
                            <el-select v-model="formdata.inpatientPlaceUse" placeholder="请选择病区使用" :disabled="eventOrg">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="医技使用" :label-width="formLabelWidth" prop="technologyUse">
                            <el-select v-model="formdata.technologyUse" placeholder="请选择医技使用" :disabled="eventOrg">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="其他使用" :label-width="formLabelWidth" prop="otherUse">
                            <el-select v-model="formdata.otherUse" placeholder="请选择其他使用" :disabled="eventOrg">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="病房位置" :label-width="formLabelWidth" prop="inPatientAddr">
                            <el-input v-model="formdata.inPatientAddr" placeholder="病房位置" :disabled="eventOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="门诊位置" :label-width="formLabelWidth" prop="outPatientAddr">
                            <el-input v-model="formdata.outPatientAddr" placeholder="门诊位置" :disabled="eventOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="contactNo">
                            <el-input v-model="formdata.contactNo" placeholder="联系电话" :disabled="eventOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="邮件地址" :label-width="formLabelWidth" prop="email">
                            <el-input v-model="formdata.email" placeholder="邮件地址" :disabled="eventOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="科室介绍" :label-width="formLabelWidth" prop="description">
                            <el-input v-model="formdata.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="eventOrg" placeholder="科室介绍"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="center-foot" v-if="!eventOrg">
                        <el-button @click="closeorgmodal('departForm')">取 消</el-button>
                        <el-button type="primary" @click="submitForm('departForm')">保 存</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div id="rMenu">
            <ul>
                <li id="m_add" @click="addTreeNode">新增下级</li>
                <li id="m_del" @click="removeTreeNode">删除</li>
            </ul>
        </div>
    </div>
</template>
<script>
import {
    commonAjax, commonurl
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
            return {
                //通用
                formLabelWidth: '120px',
                //科室详情数据
                formdata: {
                    deptId: "",
                    deptName: "", //科室名称
                    localDeptPid: "", //上级科室Id
                    technologyUse: "", //医技使用
                    deptType: "", //科室类型,base_departmentType
                    outpatientUse: "", //门诊使用
                    important: "", //重点科室标签
                    orgId: "",
                    standardDeptId: "", //标注科室id
                    inpatientPlaceUse: "", //病区使用
                    email: "", //
                    description: "", //描述
                    otherUse: "", //其他使用
                    contactNo: "", //联系电话
                    outPatientAddr: "", //门诊位置
                    localDeptId: "", //科室代码
                    inPatientAddr: "", //住院位置
                    zxFlag: "", //中西标志,0西医 1中医
                    inpatientUse: "", //住院使用
                    localOrgId: "", //医院代码
                    "deptMnemonic": "",
                    "important": "",
                    "technologyUse": "",

                },
                // 表单验证
                departformrules: {
                    deptName: [{
                        required: true,
                        message: '请输入科室全称',
                        trigger: 'blur'
                    }],
                    localDeptId: [{
                        required: true,
                        message: '请输入科室代码',
                        trigger: 'blur'
                    }],
                    deptType: [{
                        required: true,
                        message: '请选择科室类型',
                        trigger: 'blur'
                    }],
                    description: [{
                        required: true,
                        message: '请填写科室介绍',
                        trigger: 'blur'
                    }],
                    standardDeptId: [{
                        required: true,
                        message: '请选择标准科室',
                        trigger: 'blur'
                    }],
                },
                //字典请求
                dictionary: {
                    departmentType: {}, //科室类型base_departmentType
                },

                //标准科室
                stdtableData: [],

                prevDept: '无',
                //父节点（机构）
                rootName: '',
                curDeptId: '',
                //是否触发机构点击
                eventOrg: 'disabled',
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
            }
        },
        computed: {

        },
        methods: {
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
                    if (treeNode.nodeType == "1") {
                        this.eventOrg = true;
                        this.clearBindDataEvent();
                    } else {
                        this.eventOrg = false;
                        this.rootName = treeNode.orgFullName;
                        this.formdata.orgId = treeNode.orgId;
                        let slectedNodes = this.zTree.getSelectedNodes();
                        let parentNode = slectedNodes[0].getParentNode();
                        if (parentNode.nodeType == "1") {
                            this.prevDept = "无";
                        } else {
                            this.prevDept = parentNode.name;
                        }
                        commonAjax('cas.departmentService', 'getDepartment', `['${treeNode.id}']`).then((res) => {
                            if (res.code == 200) {
                                let data = res.body;
                                this.formdata = {
                                    deptId: data.deptId ? data.deptId : "",
                                    deptName: data.deptName ? data.deptName : "", //科室名称
                                    localDeptPid: data.localDeptPid ? data.localDeptPid : "", //上级科室Id
                                    technologyUse: data.technologyUse ? data.technologyUse : "", //医技使用
                                    deptType: data.deptType ? data.deptType : "", //科室类型,base_departmentType
                                    outpatientUse: data.outpatientUse ? data.outpatientUse : "", //门诊使用
                                    important: data.important ? data.important : "", //重点科室标签
                                    orgId: data.orgId ? data.orgId : "",
                                    standardDeptId: data.standardDeptId ? data.standardDeptId : "", //标注科室id
                                    inpatientPlaceUse: data.inpatientPlaceUse ? data.inpatientPlaceUse : "", //病区使用
                                    email: data.email ? data.email : "", //
                                    description: data.description ? data.description : "", //描述
                                    otherUse: data.otherUse ? data.otherUse : "", //其他使用
                                    contactNo: data.contactNo ? data.contactNo : "", //联系电话
                                    outPatientAddr: data.outPatientAddr ? data.outPatientAddr : "", //门诊位置
                                    localDeptId: data.localDeptId ? data.localDeptId : "", //科室代码
                                    inPatientAddr: data.inPatientAddr ? data.inPatientAddr : "", //住院位置
                                    zxFlag: data.zxFlag ? data.zxFlag : "", //中西标志,0西医 1中医
                                    inpatientUse: data.inpatientUse ? data.inpatientUse : "", //住院使用
                                    localOrgId: data.localOrgId ? data.localOrgId : "", //医院代码
                                    "deptMnemonic": data.deptMnemonic ? data.deptMnemonic : "",
                                    "important": data.important ? data.important : "",
                                    "technologyUse": data.technologyUse ? data.technologyUse : "",

                                };

                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }

                        });
                    }
                },
                //树状节点右击
                OnRightClick(event, treeId, treeNode) {
                    this.clearBindDataEvent();
                    if (treeNode.nodeType == "1") {
                        this.rootName = treeNode.orgFullName;
                        this.formdata.orgId = treeNode.id;
                        // this.formdata.localOrgId="";
                        this.curDeptId = '';
                        // this.formdata.localDeptPid = '';//上级科室id
                        this.prevDept = "无"; //上级科室名称
                        this.eventOrg = true;
                        this.showRMenu("root", event.clientX, event.clientY);
                    } else {
                        this.rootName = treeNode.orgFullName;
                        this.formdata.orgId = treeNode.orgId;
                        this.eventOrg = false;
                        this.showRMenu("node", event.clientX, event.clientY);
                        this.prevDept = treeNode.name;
                        this.curDeptId = treeNode.id;//删除的时候要用到this.curDeptId
                        this.formdata.localDeptPid = treeNode.localDeptId;
                    }
                    this.zTree.selectNode(treeNode);
                },
                //获取标准科室列表数据
                stdgetTableData() {
                    let params = `['',1,300]`;
                    commonAjax("cas.standardDeptCampareService", "getStandardDeptList", params).then(res => {
                        if (res.code == 200) {
                            this.stdtableData = res.body.items;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //字典请求
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_departmentType"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then((res) => {
                        if (res.code == 200) {
                            var that = this;
                            $.each(res.body, function(index, el) {
                                if (el.dicId == arr[0]) {
                                    that.dictionary.departmentType = el.items;
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

                //右键菜单部分
                showRMenu(type, x, y) {
                    $("#rMenu ul").show();
                    if (type == "root") {
                        $("#m_del").hide();
                        $("#m_add").show();
                    } else if (type == "noadd") {
                        $("#m_del").show();
                        $("#m_add").hide();

                    } else {
                        $("#m_del").show();
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

                //清空绑定数据
                clearBindDataEvent() {
                    this.formdata = {
                        deptId: "",
                        deptName: "", //科室名称
                        localDeptPid: "", //上级科室Id
                        technologyUse: "", //医技使用
                        deptType: "", //科室类型,base_departmentType
                        outpatientUse: "", //门诊使用
                        important: "", //重点科室标签
                        orgId: "",
                        standardDeptId: "", //标注科室id
                        inpatientPlaceUse: "", //病区使用
                        email: "", //
                        description: "", //描述
                        otherUse: "", //其他使用
                        contactNo: "", //联系电话
                        outPatientAddr: "", //门诊位置
                        localDeptId: "", //科室代码
                        inPatientAddr: "", //住院位置
                        zxFlag: "", //中西标志,0西医 1中医
                        inpatientUse: "", //住院使用
                        localOrgId: "", //医院代码
                        "deptMnemonic": "",
                        "important": "",
                        "technologyUse": "",
                    }
                },
                //添加科室
                addTreeNode() {
                    this.hideRMenu();
                    this.eventOrg = false;
                    // 后台返回了localDeptId所以下面的请求不用了
                    // if (this.curDeptId != '') {
                    //     commonAjax('cas.departmentService', 'getDepartment', `['${this.curDeptId}']`).then((res) => {
                    //         if (res.code == 200) {
                    //             this.formdata.localDeptPid = res.body.localDeptId;
                    //             // this.formdata.localOrgId=res.body.localOrgId;
                    //         } else {
                    //             this.$message({
                    //                 type: 'error',
                    //                 message: res.msg
                    //             });
                    //         }

                    //     });
                    // }

                },
                closeorgmodal(formName) {
                    this.$refs[formName].resetFields();
                },
                //确认--新增/修改（更新）科室  
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax('cas.departmentService', 'addOrUpdateDeptInfo', '[' + JSON.stringify(this.formdata) + ']').then(res => {
                                if (res.code == 200) {
                                    if (this.formdata.deptId != '') {
                                        this.zTree.getSelectedNodes()[0].name = this.formdata.deptName;
                                        this.zTree.updateNode(this.zTree.getSelectedNodes()[0]);
                                    } else {
                                        this.zTree.reAsyncChildNodes(this.zTree.getSelectedNodes()[0], "refresh"); //新增的时候直接更新选中节点的子节点
                                    }
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

                //删除科室
                removeTreeNode() {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, this.prevDept)
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
                                message: "取消删除"
                            });
                        } else {
                            commonAjax("cas.departmentService", "deleteDeptInfo", `['${this.curDeptId}']`).then(res => {
                                if (res.code == 200) {
                                    this.zTree.removeNode(this.zTree.getSelectedNodes()[0]);
                                    this.clearBindDataEvent();
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
                // }
        },
        components: {

        },
        mounted() {

            //初始化科室列表
            $.fn.zTree.init($("#hospitalLists"), this.setting);
            this.zTree = $.fn.zTree.getZTreeObj("hospitalLists");
            // var sidebarH=$(".sidebar").height()-165;
            // $(".left-con").height(sidebarH).css({
            //     overflow: 'auto',
            // });
            //标准科室
            this.stdgetTableData();
            // //字典请求
            this.dictionaryRequest();
        },
        beforeMount() {


        },

}
</script>
<style type="text/css" scoped>
.left-con,
.right-con {
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 10px;
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
</style>
