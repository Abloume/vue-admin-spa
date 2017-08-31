<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="8">
                    <el-input v-model="params.name" placeholder="请输入角色名称或编码" @blur="getserchval"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
                <el-col :span="6" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit">添加角色</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="tenantId" label="租户id">
            </el-table-column>
            <el-table-column prop="roleTypeText" label="角色类别">
            </el-table-column>
            <el-table-column prop="roleId" label="角色编码">
            </el-table-column>
            <el-table-column prop="name" label="角色名称">
            </el-table-column>
            <el-table-column prop="description" label="描述">
            </el-table-column>
            <el-table-column label="操作" width="400">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'look')">查看</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.editableFlag==1">删除</el-button>
                    <el-button size="small" type="info" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.editableFlag==1">修改</el-button>
                    <el-button size="small" type="success" @click="empower(scope.$index, scope.row)" v-if="scope.row.editableFlag==1">授权</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-form-item label="所属租户" :label-width="formLabelWidth" prop="tenantId">
                    <el-select v-model="formdata.tenantId" placeholder="请选择" :disabled="isdisabled">
                        <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色类别" :label-width="formLabelWidth" prop="roleType">
                    <el-select v-model="formdata.roleType" placeholder="请选择" :disabled="isdisabled">
                        <el-option v-for="item in dictionary.roleType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="formdata.name" :disabled="!isshowsave"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" :label-width="formLabelWidth" prop="roleId">
                    <el-input v-model="formdata.roleId" :disabled="isdisabled"></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="formdata.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="!isshowsave"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')" v-show="isshowsave">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="角色授权" v-model="empowerdialogFormVisible">
            <el-row class="search_con2" :gutter="20">
                <el-col :span="10">
                    {{curroleName}}角色的授权
                </el-col>
                <el-col :span="10">
                    <el-select v-model="curprocode" placeholder="请选择产品">
                        <el-option v-for="item in prolist" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <ul id="treeDemo" class="ztree"></ul>
            <div class="dialog-footer center-foot">
                <el-button type="primary" @click="empowersubmitForm()">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax
}
from '../../api/api';

import 'assets/lib/zTree/img/metro.gif';
import 'assets/lib/zTree/img/metro.png';
import 'assets/lib/zTree/img/line_conn.png';

import 'assets/lib/zTree/metroStyle.css';
import 'assets/lib/zTree/js/jquery.ztree.core.js';
import 'assets/lib/zTree/js/jquery.ztree.exedit.min.js';
import 'assets/lib/ztree/js/jquery.ztree.excheck.js'
export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
                tableData: [],
                params: {
                    "roleId": "",
                    "name": "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "description": "",
                    "name": "",
                    "roleId": undefined,
                    "roleType": "",
                    "tenantId": "", //10 后台管理员、 20 医生、 30 患者

                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    roleId: [{
                        required: true,
                        message: '请输入角色编码',
                    }],
                    tenantId: [{
                        required: true,
                        message: '请选择租户ID',
                    }],
                    name: [{
                        required: true,
                        message: '请输入角色名称',
                    }],
                    roleType: [{
                        required: true,
                        message: '请选择角色类型',
                    }],
                },

                dictionary: {
                    roleType: [],

                },
                tenantData: [],
                isshowsave: false,
                isdisabled: false,
                // 角色授权开始
                curroleId: "",
                curroleName: "",
                empowerdialogFormVisible: false,
                prolist: [],
                curprocode: "",
                setting: {
                    check: {
                        enable: true,
                        chkStyle: "checkbox",
                        chkboxType: {
                            "Y": "ps",
                            "N": "s"
                        },

                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onCheck: this.zTreeOnCheck
                    },
                },
                zTree: {},
                zNodes: [],
                proitem: "",

            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
            //搜索框赋值
            getserchval() {
                    this.params.roleId = this.params.name
                },
                handleEdit(index, row, sign) {
                    if (row) {
                        this.isdisabled = true;
                        this.dialogFormVisible = true;
                        this.dialogtitle = "编辑角色";
                        this.formdata = {
                            "description": row.description,
                            "name": row.name,
                            "roleId": row.roleId,
                            "roleType": row.roleType,
                            "tenantId": row.tenantId,

                        }
                        if (sign) {
                            this.isshowsave = false;
                            this.dialogtitle = "查看角色";
                        } else {
                            this.isshowsave = true;
                        }
                    } else {
                        this.isdisabled = false;
                        this.isshowsave = true;
                        this.imageUrl = "";
                        this.dialogFormVisible = true;
                        this.dialogtitle = "新增角色";
                        this.formdata = {
                            "description": "",
                            "name": "",
                            "roleId": undefined,
                            "roleType": "",
                            "tenantId": "", //10 后台管理员、 20 医生、 30 患者

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
                                }, row.name)
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
                                let params = `['${row.roleId}']`;
                                commonAjax("cas.roleManageService", "roleDeleted", params).then(res => {
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
                //获取搜索下拉框的租户列表
                gettenantData() {
                    let params = {
                        pageSize: 300,
                        pageNo: 1,
                    };
                    commonAjax("cas.tenantManageService", "tenantList", '[' + JSON.stringify(params) + ']').then(res => {
                        if (res.code == 200) {
                            this.tenantData = res.body.data;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取角色列表数据
                getTableData() {
                    commonAjax("cas.roleManageService", "roleList", '[' + JSON.stringify(this.params) + ']').then(res => {
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
                //改变分页显示的数量
                handleSizeChange(val) {
                    this.params.pageSize = val;
                    this.getTableData()
                },
                //跳转到分页输入框中页码的页面
                handleCurrentChange(val) {
                    this.params.pageNo = val;
                    this.getTableData()
                },
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
                            var addoredit = this.isdisabled ? "roleUpdated" : "roleAdded"
                            commonAjax("cas.roleManageService", addoredit, '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
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
                //获取字典
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_roleType"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            var that = this;
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.roleType = ele.items;
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
                // 表单常用的方法结束--------------------------------------------------------------------------
                //角色授权开始--------------------------------------------------------------------------
                empower(index, row) {
                    this.empowerdialogFormVisible = true;
                    this.curroleName = row.name;
                    this.curroleId = row.roleId;
                    this.curprocode = this.prolist[0].code;
                },
                empowersubmitForm() {
                    // let checkedarr = this.zTree.getCheckedNodes(true);
                    // let temarr = [];
                    // $.each(checkedarr, function(index, el) {
                    //     if (el.actionValue != 1 || el.actionValue != 2 || el.actionValue != 4 || el.actionValue != 8 || el.actionValue != 16) {
                    //         let temobj = {
                    //             id: el.id,
                    //             actionValue: el.actionValue ? el.actionValue : "",
                    //         };
                    //         temarr.push(temobj);
                    //         console.log(111);
                    //     }
                    // }.bind(this));

                    // // temarr = JSON.stringify(temarr);
                    // temarr = JSON.stringify([{"id":"m_999"},{"id":"m_1000","actionValue":7}]);
                    // var temopt = `['${this.curroleId}',${temarr}]`;
                    let checkedarr = this.zTree.getCheckedNodes(true);
                    let checkedarr_act = checkedarr.filter(function(item) {
                        return item.actionValue;
                    });
                   
                    $.each(checkedarr, function(index, el) {
                        el.actionValue = 0;
                        $.each(checkedarr_act, function(index2, el2) {
                            el2.type = "action";
                            if (el.id == el2.pId) {
                                el.actionValue = parseInt(el.actionValue) + parseInt(el2.actionValue);
                            }

                        });
                    });
                    let temarr = [];
                    $.each(checkedarr, function(index, el) {
                        if (el.type != "action") {
                            let temobj = {
                                id: el.id,
                                actionValue: el.actionValue==0?"":el.actionValue,
                            };
                            temarr.push(temobj);
                        }
                    });
                    temarr = JSON.stringify(temarr);
                    let temopt = `['${this.curprocode}','${this.curroleId}',${temarr}]`;
                    console
                    commonAjax("cas.menuManageService", "saveRoleMenu", temopt).then(res => {
                        if (res.code == 200) {
                            this.dialogFormVisible = false;
                            this.$message({
                                type: 'success',
                                message: "保存成功"
                            });
                            // this.getTableData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });


                },
                getprolist() {
                    commonAjax('cas.productRelatedService', 'productSecondLevelList', '[]').then(res => {
                        if (res.code == 200) {
                            this.prolist = res.body;

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        };
                    })
                },
                // 选中或者取消勾选
                zTreeOnCheck(event, treeId, treeNode) {
                    // var node = treeNode.getParentNode();
                    // if (node && node.children) {
                    //     if (node.children[0].actionValue) {
                    //         var filtertedchildren = node.children.filter(function(item) {
                    //             return item.checked == true;
                    //         });
                    //         var actionValue = 0;
                    //         $.each(filtertedchildren, function(index, el) {
                    //             actionValue += el.actionValue
                    //         });
                    //         node.actionValue = actionValue;

                    //     }

                    // }


                },
        },
        components: {

        },
        mounted() {
            this.getTableData();
            this.gettenantData();
            this.dictionaryRequest();
            this.getprolist();
        },
        watch: {
            'curprocode' (val, oldval) {
                let param = `['${val}','${this.curroleId}']`;
                commonAjax('cas.menuManageService', 'productMenuMenuActionTree', param).then(res => {
                    if (res.code == 200) {
                        this.zNodes = res.body;
                        $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
                        this.zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    };
                })
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

.search_con2 {
    margin-bottom: 20px
}
</style>
