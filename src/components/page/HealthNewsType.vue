<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>健康宣教</el-breadcrumb-item>
                        <el-breadcrumb-item>资讯类别</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con">
                <el-col :span="6" class="addorg" :offset="18">
                    <el-button type="primary" icon="plus" @click="handleAdd">添加资讯类别</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="typeName" label="标签类">
            </el-table-column>
            <el-table-column prop="tagName" label="标签名称">
            </el-table-column>
            <el-table-column prop="tagCode" label="标签代码">
            </el-table-column>
            <el-table-column label="状态操作">
                <template scope="scope">
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if=" scope.row.isEnable==1">禁用</el-button>
                    <el-button size="small" type="success" @click="handleDelete(scope.$index, scope.row)" v-if=" scope.row.isEnable==0">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增资讯类别" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-form-item label="标签类" :label-width="formLabelWidth" prop="typeCode">
                    <el-select v-model="formdata.typeCode" placeholder="请选择">
                        <el-option v-for="item in tagData" :key="item.typeCode" :label="item.typeName" :value="item.typeCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名称" :label-width="formLabelWidth" prop="tagName">
                    <el-input v-model="formdata.tagName"></el-input>
                </el-form-item>
                <el-form-item label="标签代码" :label-width="formLabelWidth" prop="tagCode">
                    <el-input v-model="formdata.tagCode"></el-input>
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
    commonAjax
}
from '../../api/api';
export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
                // 列表常用的数据开始
                tableData: [],
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "typeCode": "", //标签类型代码
                    "tagCode": "", //标签代码
                    "tagName": "", //标签名称
                    "isEnable": "1" //是否可用     1 可用  ；  0 不可用
                },
                tagData:[],
                formrules: { //表单验证规则
                    typeCode: [{
                        required: true,
                        message: '请选择标签类',
                    }],
                    tagName: [{
                        required: true,
                        message: '请输入标签名称',
                    }],
                    tagCode: [{
                        required: true,
                        message: '请输入标签代码',
                    }],
                },
            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
            //点击编辑的方法
            handleAdd() {
                    this.dialogFormVisible = true;
                    this.dialogtitle = "编辑广告";
                    this.formdata = {
                        "typeCode": "", //标签类型代码
                        "tagCode": "", //标签代码
                        "tagName": "", //标签名称
                        "isEnable": "1" //是否可用  
                    }
                },
                // 删除列表中的一条数据
                handleDelete(index, row) {
                    let status=row.isEnable==1?0:1;
                    let params = `['${status}',${row.tagId}]`;
                    commonAjax("cas.healthNewService", "updateTag", params).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "操作成功"
                            });
                            this.getTableData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取标签类别
                gettagData() {
                    commonAjax("cas.healthNewService", "getTagsByTenantId", '[]', ).then(res => {
                        if (res.code == 200) {
                            this.tagData = res.body;
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
                    commonAjax("cas.healthNewService", "getTagsList", '[]').then(res => {
                        if (res.code == 200) {
                            this.tableData = res.body;
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
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.healthNewService", "saveTag", '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
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
                // 表单常用的方法结束--------------------------------------------------------------------------

        },
        components: {

        },
        mounted() {
            this.getTableData();
            this.gettagData();
        },

}
</script>
<style type="text/css" scoped>
.addorg button {
    float: right;
}
.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}
</style>
