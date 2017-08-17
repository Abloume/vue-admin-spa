<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>产品与角色关系管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="10">
                    <el-select v-model="curprocode" placeholder="请选择产品">
                        <el-option v-for="item in prolist" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit">新增</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="productCode" label="产品编码">
            </el-table-column>
            <el-table-column prop="productName" label="产品名称">
            </el-table-column>
            <el-table-column prop="roleId" label="角色编码">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="isDefault" label="是否默认">
                <template scope="scope">
                    <p v-show="scope.row.isDefault==1">是</p>
                    <p v-show="scope.row.isDefault==0">否</p>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--  <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div> -->
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-form-item label="产品名称" :label-width="formLabelWidth" prop="productCode">
                    <el-select v-model="formdata.productCode" placeholder="请选择">
                        <el-option v-for="item in prolist" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品编码" :label-width="formLabelWidth" prop="productCode">
                    <el-select v-model="formdata.productCode" placeholder="请选择" disabled>
                        <el-option v-for="item in prolist" :key="item.code" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleId">
                    <el-select v-model="formdata.roleId" placeholder="请选择">
                        <el-option v-for="item in rolelist" :key="item.roleId" :label="item.name" :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色编码" :label-width="formLabelWidth" prop="productCode">
                    <el-select v-model="formdata.roleId" placeholder="请选择">
                        <el-option v-for="item in rolelist" :key="item.roleId" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="默认标识" prop="isDefault" :label-width="formLabelWidth">
                    <el-radio-group v-model="formdata.isDefault">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
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
                // params: {
                //     pageNo: 1,
                //     pageSize: 10,
                // },
                // total: "",
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "relationId": "",
                    "productCode": "",
                    "roleId": "",
                    "isDefault": "",
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    productCode: [{
                        required: true,
                        message: '请选择产品',

                    }],
                    roleId: [{
                        required: true,
                        message: '请选择角色',

                    }],
                },
                prolist: [],
                curprocode: "",
                rolelist: [],
            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
            handleEdit(index, row) {
                    if (row) {
                        this.dialogFormVisible = true;
                        this.dialogtitle = "编辑产品与角色关系";
                        this.formdata = {
                            "relationId": row.relationId,
                            "productCode":  row.productCode,
                            "roleId":  row.roleId,
                            "isDefault": row.isDefault,
                        }

                    } else {
                        this.dialogFormVisible = true;
                        this.dialogtitle = "新增产品与角色关系";
                        this.formdata = {
                            "relationId": "",
                            "productCode": "",
                            "roleId": "",
                            "isDefault": "",
                        }
                    }

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
                                }, row.productName+'的'+row.roleName+'角色？')
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
                        })
                        .then(action => {
                            if (action == 'cancel') {
                                this.$message({
                                    type: 'info',
                                    message: "取消删除"
                                });
                            } else {
                                let params = `[${row.relationId}]`;
                                commonAjax("cas.productRelatedService", "productRoleDeleted", params).then(res => {
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
                //获取搜索下拉框的一级产品列表
                getprolist() {
                    let pararm = sessionStorage.getItem('tenantId')
                    commonAjax('cas.tenantManageService', 'productFirstLevel', `['${pararm}']`).then(res => {
                        if (res.code == 200) {
                            this.prolist = res.body;
                            this.curprocode = this.prolist[0].code;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        };
                    })
                },
                //获取列表数据
                getTableData() {
                    commonAjax("cas.productRelatedService", "productRoleList", `['${this.curprocode}']`).then(res => {
                        if (res.code == 200) {
                            this.tableData = res.body;
                            // this.total = res.body.count;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取角色列表数据
                getroleTableData() {
                    let param = {
                        "roleId": "",
                        "name": "",
                        pageNo: 1,
                        pageSize: 300,
                    }
                    commonAjax("cas.roleManageService", "roleList", '[' + JSON.stringify(param) + ']').then(res => {
                        if (res.code == 200) {
                            this.rolelist = res.body.data;

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //改变分页显示的数量
                // handleSizeChange(val) {
                //     this.params.pageSize = val;
                //     this.getTableData()
                // },
                // //跳转到分页输入框中页码的页面
                // handleCurrentChange(val) {
                //     this.params.pageNo = val;
                //     this.getTableData()
                // },
                //搜索按钮点击
                searchClick() {
                    this.getTableData();
                },
                // 列表常用的方法结束-------------------------------------------------------------------------------
                // 表单常用的方法开始
                //保存按钮提交数据
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.productRelatedService", "productRoleAddedOrUpdated", '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
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
            this.getprolist();
            this.getroleTableData();
        },
        watch: {
            'curprocode' (val, oldval) {
                this.curprocode = val;
                this.getTableData();

            }
        }
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
