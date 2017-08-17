<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>模块管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <!--  <el-col :span="12" class="return_prev">
                    <router-link to="/"> <span class="return"><img src="../../assets/img/return.png"></span>返回上一级</router-link>
                </el-col> -->
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="8">
                    <el-input v-model="params.moduleName" placeholder="请输入模块名称或模块编码" @blur="getserchval"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
                <el-col :span="6" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit">新建模块</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="moduleCode" label="模块编码">
            </el-table-column>
            <el-table-column prop="moduleName" label="模块名称">
            </el-table-column>
            <el-table-column prop="linkedUrl" label="模块URL">
            </el-table-column>
            <el-table-column prop="linkedTypeText" label="链接类型">
            </el-table-column>
            <el-table-column prop="moduleOrder" label="排序">
            </el-table-column>
            <el-table-column prop="moduleDesc" label="备注">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('orginfoForm')" before-close="beforeclose">
            <el-form :model="formdata" :rules="formrules" ref="orginfoForm" auto-complete="off">
                <el-form-item label="模块编码" :label-width="formLabelWidth" prop="moduleCode">
                    <el-input v-model="formdata.moduleCode"></el-input>
                </el-form-item>
                <el-form-item label="模块名称" :label-width="formLabelWidth" prop="moduleName">
                    <el-input v-model="formdata.moduleName"></el-input>
                </el-form-item>
                <el-form-item label="链接类型" :label-width="formLabelWidth" prop="linkedType">
                    <el-select v-model="formdata.linkedType" placeholder="请选择医院分类">
                        <el-option v-for="item in dictionary.linkedTypes" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="链接URL" :label-width="formLabelWidth" prop="linkedUrl">
                    <el-input v-model="formdata.linkedUrl"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth" prop="moduleOrder">
                    <el-input v-model="formdata.moduleOrder"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="moduleDesc">
                    <el-input v-model="formdata.moduleDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
                <el-form-item label="模块权限" prop="selectaction" :label-width="formLabelWidth">
                    <el-checkbox-group v-model="selectaction">
                        <el-checkbox :label="item.actionValue" name="action" v-for="item in allAction">{{item.actionName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal('orginfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('orginfoForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax
}
from '../../api/api';
import {
    mapActions
}
from 'vuex';
export default {
    data() {
            return {
                formLabelWidth: '120px',
                tableData: [],
                params: {
                    "moduleCode": "",
                    "moduleName": "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "moduleId": undefined,
                    "moduleCode": "",
                    "moduleName": "",
                    "linkedType": "",
                    "linkedUrl": "",
                    "moduleOrder": undefined,
                    "moduleDesc": "",
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    moduleName: [{
                        required: true,
                        message: '请填写模块名称',
                        trigger: 'blur'
                    }, {
                        max: 100,
                        message: '最长50字符',
                        trigger: 'blur'
                    }],
                    moduleCode: [{
                        required: true,
                        message: '请填写模块编码',
                        trigger: 'blur'
                    }, {
                        max: 100,
                        message: '最长30字符',
                        trigger: 'blur'
                    }],
                    linkedType: [{
                        required: true,
                        message: '请填选择连接类型',
                        trigger: 'blur'
                    }],
                    linkedUrl: [{
                        max: 100,
                        message: '最长100字符',
                        trigger: 'blur'
                    }],
                    moduleDesc: [{
                        max: 100,
                        message: '最长100字符',
                        trigger: 'blur'
                    }],
                },
                allAction: [],
                selectaction: [],
                dictionary: {
                    linkedTypes: []
                },

            }

        },
        computed: {

        },
        methods: {
            //搜索框赋值
            getserchval() {
                    this.params.moduleCode = this.params.moduleName
                },

                handleEdit(index, row) {
                    this.dialogFormVisible = true;
                    if (row) {
                        this.dialogtitle = "编辑模块";
                        this.formdata = {
                            "moduleId": row.moduleId,
                            "moduleCode": row.moduleCode,
                            "moduleName": row.moduleName,
                            "linkedType": row.linkedType,
                            "linkedUrl": row.linkedUrl,
                            "moduleOrder": row.moduleOrder,
                            "moduleDesc": row.moduleDesc,
                        }
                        commonAjax("cas.productRelatedService", "actionValueByModuleId", `['${row.moduleId}']`).then(res => {
                            if (res.code == 200) {
                                this.selectaction = res.body;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });


                    } else {
                        this.selectaction = [];
                        this.dialogtitle = "新增模块";
                        this.formdata = {
                            "moduleId": undefined,
                            "moduleCode": "",
                            "moduleName": "",
                            "linkedType": "",
                            "linkedUrl": "",
                            "moduleOrder": undefined,
                            "moduleDesc": "",
                        }
                    }

                },
                // 删除列表中的一条数据
                handleDelete(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.moduleName)
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
                            let params = `['${row.moduleId}']`;
                            commonAjax("cas.productRelatedService", "moduleDeleted", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.getTableData();
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
                //获取列表数据
                getTableData() {
                    commonAjax("cas.productRelatedService", "moduleList", '[' + JSON.stringify(this.params) + ']').then(res => {
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
                //获取列表数据
                getallAction() {
                    commonAjax("cas.productRelatedService", "allActionInfoList", '[]').then(res => {
                        if (res.code == 200) {
                            this.allAction = res.body
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //页面显示的条数变化
                handleSizeChange(val) {
                    this.params.pageSize = val;
                    this.getTableData()
                },
                // 输入框翻页效果
                handleCurrentChange(val) {
                    this.params.pageNo = val;
                    this.getTableData()
                },
                //搜索按钮点击
                searchClick() {
                    this.getTableData();
                },

                resetForm(formName) {
                    this.$refs[formName].resetFields();

                },
                //点击取消的时候
                closemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.dialogFormVisible = false;
                },
                dictionaryRequest() {
                    var that = this;
                    let arr = ["cfs.dic.base_hyperLink"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        // 
                        if (res.code == 200) {
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.linkedTypes = ele.items;
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
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.productRelatedService", "moduleaddedOrUpdated", '[' + JSON.stringify(this.formdata) + ','+JSON.stringify(this.selectaction)+']').then(res => {
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
                            // alert('submit!');
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }
        },
        components: {},
        mounted() {
            this.dictionaryRequest();
            this.getallAction();
            this.getTableData();
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

.addorg button {
    float: right;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}
</style>
