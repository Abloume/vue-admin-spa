<template>
    <div class="PMList">
        <!--标题-->
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>服务管理</el-breadcrumb-item>
                        <el-breadcrumb-item>协议管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12" class="range">
                    <el-select v-model="searchContent.tenantId" :disabled="isCheckPattern">
                        <el-option v-for="item in tenantNameList" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="search_con">
                <el-col :span="24" class="addServItem">
                    <el-button type="primary" icon="plus" @click="chkUnionProt">医联体协议</el-button>
                </el-col>
            </el-row>
            <el-row class="search_line">
                <el-col :span="20">
                    <el-form :inline="true" :model="searchContent" class="demo-form-inline">
                        <el-form-item label="机构:">
                            <el-input placeholder="机构名称" class="serv_name" v-model="searchContent.orgFullName"></el-input>
                        </el-form-item>
                        <el-form-item label="执行机构" class="as_inline" :label-width="formLabelWidth">
                            <el-select placeholder="无" class="serv_name" v-model="searchContent.orgClassify">
                                <el-option v-for="item in dictionary.organizationType" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
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
        <el-table :data="protOrgListData" border style="width: 100%">
            <el-table-column label="机构" prop="orgFullName" width="200"></el-table-column>
            <el-table-column label="分类" prop="orgClassify" width="200"></el-table-column>
            <el-table-column label="使用协议" prop="protocalName" width="200"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="editProtocol(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10, 20 ,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="page.pageSize">
            </el-pagination>
        </div>

        <!-- 编辑医联体协议对话框 -->
        <el-dialog :title="dialogTitle" :gutter="20" class="unionDialog" v-model="editUnionFormVisible" @close="closeDialog('unionProt')">
            <!-- 动态字段 -->
            <el-col :span="8">
                <div class="commontit">
                    <h2>动态字段</h2>
                </div>
                <el-table :data="dynamicFldFormData" border style="width: 100%">
                    <el-table-column label="字段内容" prop="paramName" width="160"></el-table-column>
                    <el-table-column label="字段名" prop="paramCode" width="160"></el-table-column>
                </el-table>
            </el-col>
            <!-- 医联体协议 -->
            <el-col :span="16">
                <div class="commontit">
                    <h2>医联体协议</h2>
                    <el-button class="btn_save" type="primary" size="small" @click="saveUnionProtocol">保存</el-button>
                </div>
                <div class="right-con">
                    <el-form :model="unionFormData" :rules="departformrules" ref="departForm" auto-complete="off">
                        <el-form-item :label-width="formLabelWidth" class="union_prot" prop="peopleClassifyIds">
                            <quill-editor ref="myTextEditor" v-model="unionFormData.protocalText" :config="editorOption" @showImageUI="imageHandler" @change="onEditorChange">
                            </quill-editor>
                            <!-- 必须带上这个input 上传图片用-->
                            <input type="file" name="file" id="fileinput" @change="customimgupload($event)" style="display:none">
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-dialog>

        <!-- 编辑机构协议对话框 -->
        <el-dialog :title="dialogTitle" :gutter="20" class="orgDialog" v-model="editOrgFormVisible" @close="closeDialog('orgProt')">
            <el-row>
                <el-col :span="12">
                    <el-form :model="orgFormData" :rules="formrules" ref="addItemForm" auto-complete="off" id="addItemForm">
                        <el-form-item label="使用协议" prop="protocalTypeCurrentUse">
                            <el-radio-group v-model="orgFormData.protocalTypeCurrentUse" @change='chsProt'>
                                <el-radio :label="1">使用医联体协议</el-radio>
                                <el-radio :label="2">使用本机构协议</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12" class="btn_save_org">
                    <el-button type="primary" @click='saveOrgProtocol'>保存</el-button>
                </el-col>
            </el-row>
            <!-- 动态字段 -->
            <el-col :span="8">
                <div class="commontit">
                    <h2>动态字段</h2>
                </div>
                <el-table :data="dynamicFldFormData" border style="width: 100%">
                    <el-table-column label="字段内容" prop="paramName" width="160"></el-table-column>
                    <el-table-column label="字段名" prop="paramCode" width="160"></el-table-column>
                </el-table>
            </el-col>
            <!-- 本机构协议 -->
            <el-col :span="16">
                <div class="commontit">
                    <h2>本机构协议<span v-show="isShowText" class="unionTip">&nbsp;&nbsp;(注意医联体协议无法修改)</span></h2>
                </div>
                <div class="right-con">
                    <el-form :model="orgFormData" :rules="departformrules" ref="departForm" auto-complete="off">
                        <el-form-item :label-width="formLabelWidth" class="org_prot" prop="peopleClassifyIds" >
                            <quill-editor ref="myTextEditor" v-model="orgFormData.protocalText" disabled="true" :config="editorOption" @showImageUI="imageHandler" @change="onEditorChange">
                            </quill-editor>
                            <!-- 必须带上这个input 上传图片用-->
                            <!-- <input type="file" name="file" id="fileinput" @change="customimgupload($event)" style="display:none"> -->
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-dialog>

    </div>
</template>
<script>
import { commonAjax } from '../../api/api';
import quillEditor from '../common/editor.vue';
export default {
    data() {
        return {
            formLabelWidth: '90px',
            tenantNameList: [],
            dictionary: {
                organizationType: [{  // 机构分类
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
            total: 0,
            searchContent: {
                tenantId: '',
                orgFullName: '',
                orgClassify: ''
            },
            protOrgListData: [],  // 本页列表数据源
            dialogTitle: '',
            curOrgProtTxt: '',  // 当前机构协议内容
            editUnionFormVisible: false,
            editOrgFormVisible: false,
            curOrgId: '',   // 当前机构ID
            dynamicFldFormData: [],
            editorOption: {
                placeholder: '',
                theme: 'snow',
            },
            addServItemForm: {
                generatePlanFlag: ''
            },
            isShowText: false,
            curProt: '',    // 当前协议
            // 医联体协议内容
            unionFormData: {
                protocalName: '医联体协议',  // 协议名称
                protocalText: "",           // 协议内容
                protocalObjType: 1,         // 协议主体类型
                protocalTypeCurrentUse: 1,  // 当前使用的协议类型
                tenantId: ''
            },
            // 机构协议内容
            orgFormData: {
                protocalName: '机构协议',    // 协议名称
                protocalText: "",           // 协议内容
                protocalObjType: 2,         // 协议主体类型
                protocalTypeCurrentUse: 2   // 当前使用的协议类型
            }
        }
    },
    components: {
        quillEditor
    },
    activated() {
        this.init();
    },
    methods: {
        /**
         *  通用
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
                    this.searchContent.tenantId = this.tenantNameList[0].tenantId;
                    this.searchContent.tenantName = this.tenantNameList[0].tenantName;
                    this.getProtocalList();  // 获取协议列表数据
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 获取字典
        dictionaryRequest() {
            var that = this;
            let arr = [
                "cfs.dic.base_organizationType"  // 机构分类
            ];

            commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                if (res.code == 200) {
                    res.body.forEach(function(ele, index) {
                        if (ele.dicId == arr[0]) {
                            // that.dictionary.organizationType = ele.items; //Only support three org types.
                            that.dictionary.organizationType.push(ele.items[1]);
                            that.dictionary.organizationType.push(ele.items[10]);
                            that.dictionary.organizationType.push(ele.items[11]);
                            that.dictionary.organizationType.splice(0, 1);
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
            this.getProtocalList();
        },
        // 当前页变化
        handleCurrentChange(val) {
            this.page.pageNo = val;
            this.getProtocalList();
        },
        // 清除
        clear() {
            this.searchContent.tenantId = '';
            this.searchContent.orgFullName = '';
            this.searchContent.orgClassify = '';
        },
        // 搜索
        search() {
            this.getProtocalList();
        },
        // 关闭对话框
        closeDialog(type) {
            this.editUnionFormVisible = false;
            if (type == 'orgProt') {
                this.orgFormData.protocalText = '';
            } else if (type == 'unionProt') {
                this.unionFormData.protocalText = '';
            }
        },


        /**
         * 获取协议列表
         */ 
        getProtocalList() {
            let tId = this.searchContent.tenantId;
            let name = this.searchContent.orgFullName;
            let type = this.searchContent.orgClassify;
            let params = [
                tId, 
                name, 
                type, 
                this.page.pageNo, 
                this.page.pageSize
            ];

            commonAjax('cas.protocalParamService', 'getProtocalList', params).then(res => {
                if (res.code == 200) {
                    $.each(res.body, function(idx, el) {
                        if (el.orgClassify == '02') {
                            el.orgClassify = '社区卫生服务中心';
                        } else if (el.orgClassify == '11') {
                            el.orgClassify = '卫生服务站';
                        } else if (el.orgClassify == '12') {
                            el.orgClassify = '村卫生室';
                        }
                    });
                    this.protOrgListData = res.body;
                    this.total = res.body.length;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },


        /**
         *  医联体协议
         */
        // 保存医联体协议
        saveUnionProtocol() {
            this.unionFormData.tenantId = this.searchContent.tenantId;
            let params = [this.unionFormData];

            commonAjax('cas.protocalParamService', 'saveorupdateprotocal', params).then(res => {
                if (res.code == 200) {
                    this.editUnionFormVisible = false;
                    this.getProtocalList();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 检查协议内容
        getUnionProt() {
            let params = [
                1,
                this.searchContent.tenantId
            ];

            commonAjax('cas.protocalParamService', 'getunionprotocal', params).then(res => {
                if (res.code == 200) {
                    if (this.curProt == 'orgProt') {
                        this.orgFormData.protocalText = res.body.protocalText;
                    } else {
                        this.unionFormData.protocalText = res.body.protocalText;
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 打开医联体协议
        chkUnionProt() {
            this.curProt = '';
            this.getUnionProt();
            this.dialogTitle = '编辑医联体协议';
            this.editUnionFormVisible = true;
        },
        // 编辑
        editProtocol(index, row) {
            this.curOrgId = row.orgId;
            this.orgFormData.protocalText = row.protocalText;
            this.curOrgProtTxt = row.protocalText;
            this.dialogTitle = "协议管理-编辑协议";
            this.editOrgFormVisible = true;
        },

        // 上传
        customimgupload() {
            // var that=this;
            var formData = new FormData();
            formData.append('file', fileinput.files[0]);
            if (fileinput.files[0]) {
                imguploadAjax(formData).then(res => {
                    var imageUrl = `${imgview + res.body}`
                    var range = this.$refs.myTextEditor.quillEditor.getSelection();
                    var length = range.index;
                    this.$refs.myTextEditor.quillEditor.insertEmbed(length, 'image', imageUrl);
                }).catch(err => {
                    console.log(err)
                })
            }
        },

        // onEditorChange({
        //     editor, html, text
        // }) {
        //     this.content = html;
        //     console.log(this.content);
        // },

        // 图片上传
        imageHandler() {
            fileinput.click();
        },

        // 获取动态字段
        getDynamicFields() {
            let params = [null];

            commonAjax('cas.protocalParamService', 'getParams', params).then(res => {
                if (res.code == 200) {
                    this.dynamicFldFormData = res.body;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },


        /**
         *  机构协议
         */
        // 选择协议类型
        chsProt(type) {
            let curType = type;
            if (type == 1) {
                this.orgFormData.protocalText = '';
                this.getUnionProt();
                this.curProt = 'orgProt';
                this.isShowText = true;
                this.$refs.myTextEditor.quillEditor.disable();
            } else if (type == 2) {
                this.orgFormData.protocalText = '';
                this.orgFormData.protocalText = this.curOrgProtTxt;
                this.isShowText = false;
                this.$refs.myTextEditor.quillEditor.enable();
            }
        },
        // 机构协议 - 保存协议
        saveOrgProtocol() {
            this.orgFormData.protocalObjId = this.curOrgId;
            let params = [this.orgFormData];

            commonAjax('cas.protocalParamService', 'updateprotocal', params).then(res => {
                if (res.code == 200) {
                    this.editOrgFormVisible = false;
                    this.getProtocalList();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },


        // 初始化
        init() {
            this.getTenantName();
            this.dictionaryRequest();
            this.getDynamicFields();
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

.serv_name {
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

.btn_save {
    position: absolute;
    margin-left: 114px;
    top: 75px;
    right: 34px;
}

.btn_save_org {
    text-align: right;
}

.range {
    text-align: right;
}

.unionTip {
    color: red;
}
</style>
<style>
.PMList .unionDialog>div,
.PMList .orgDialog>div {
    width: 79%;
}

.PMList .union_prot>div {
    margin-left: 25px !important;
}

.PMList .union_prot .quill-editor {
    height: 840px;
}

.PMList .org_prot>div {
    margin-left: 25px !important;
}

.PMList .org_prot .quill-editor {
    height: 840px;
}

.PMList .ql-container {
    height: 600px;
}
</style>
