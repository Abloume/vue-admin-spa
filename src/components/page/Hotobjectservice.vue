<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>热门对象管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="18">
                    <el-select v-model="params.type" placeholder="请选择热门对象类别">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="机构" value="021"></el-option>
                        <el-option label="医生" value="031"></el-option>
                        <!-- <el-option v-for="item in dictionary.objectType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option> -->
                    </el-select>
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="plus" @click="handleEdit">添加</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="hotObjType" label="热门对象类别">
            </el-table-column>
            <el-table-column prop="hotObjName" label="对象名称">
            </el-table-column>
            <el-table-column prop="hotObjCnt" label="统计数量">
            </el-table-column>
            <el-table-column prop="enableDate" label="启用时间">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-row :gutter="20" class="search_con">
                <el-col :span="6">
                    <el-select v-model="params2.type" placeholder="请选择对象类别" :label-width="formLabelWidth">
                        <!-- <el-option label="全部" value=""></el-option> -->
                        <el-option label="机构" value="021"></el-option>
                        <el-option label="医生" value="031"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="12">
                    <el-input v-model="params2.content" :label-width="formLabelWidth"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="search" @click="searchClick2">搜索</el-button>
                </el-col>
            </el-row>
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-row :gutter="20" class="search_con">
                    <el-col :span="12">
                        <el-form-item label="统计数量" :label-width="formLabelWidth" prop="hotObjCnt">
                            <el-input v-model="formdata.hotObjCnt"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="enableDate" label="开始日期" required :label-width="formLabelWidth">
                            <el-date-picker type="date" placeholder="选择日期" v-model="formdata.enableDate" style="width: 100%;" @change="dateformat"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="tableData2" border style="width: 100%">
                <el-table-column prop="doctorName" label="结果">
                </el-table-column>
                <el-table-column prop="orgName" label="机构">
                </el-table-column>
                <el-table-column prop="deptName" label="科室">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit2(scope.$index, scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total2" :page-sizes="[10,20,50]" @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :page-size="params2.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, adAjaxAdd
}
from '../../api/api';
export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
                date1: "",
                // 列表常用的数据开始
                tableData: [],
                params: {
                    type: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                params2: {
                    type: "",
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                total2: "",
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "hotObjCnt": "", //统计数量
                    "enableDate": "", //启用时间
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    hotObjCnt: [{
                        required: true,
                        message: '请输入统计数量',
                        trigger: 'blur'
                    }],
                    enableDate: [{
                        required: true,
                        message: '请输入启用时间',
                    }],
                },
                //字典查询数据
                // dictionary: {
                //     objectType: [], //
                //     objectType2: [{
                //         key: "021",
                //         text: "机构",
                //         leaf: true,
                //         index: 0,
                //         mcode: "jg"
                //     }, {
                //         key: "031",
                //         text: "医生",
                //         leaf: true,
                //         index: 0,
                //         mcode: "ys"
                //     }]
                // },
                protableData: [],
                tableData2: [],
            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
            //点击编辑的方法
            handleEdit(index, row) {
                    this.dialogFormVisible = true;
                    this.dialogtitle = "新增热门对象";

                },
                //点击所有对象里面的列表的添加按钮
                handleEdit2(index, row) {
                   
                    let temparams = "";
                    if (this.params2.type == '021') {
                        temparams = `['${this.params2.type}','${row.orgId}','${row.orgName}',${this.formdata.hotObjCnt},'${this.formdata.enableDate}']`;
                    } else {
                        temparams = `['${this.params2.type}','${row.doctorId}','${row.doctorName}',${this.formdata.hotObjCnt},'${this.formdata.enableDate}']`;
                    }
                    this.$refs['adinfoForm'].validate((valid) => {
                        if (valid) {
                             commonAjax("cas.hotObjectService", "addHotObject", temparams).then(res => {
                                if (res.code == 200) {
                                     this.dialogFormVisible = false;
                                     this.getTableData()
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
                dateformat(val) {
                    this.formdata.enableDate = val
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
                                }, row.hotObjName)
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
                        })
                        .then(action => {
                            if (action == 'cancel') {
                                this.$message({
                                    type: 'info',
                                    message: "取消删除"
                                });
                            } else {
                                let params = `['${row.id}']`;
                                commonAjax("cas.hotObjectService", "deleteHotObject", params).then(res => {
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
                        });
                },
                //获取热门对象列表数据
                getTableData() {
                    let temparams = `['${this.params.type}',${this.params.pageNo},${this.params.pageSize}]`;
                    commonAjax("cas.hotObjectService", "hotObjectsList", temparams).then(res => {
                        if (res.code == 200) {
                            this.tableData = res.body.list;
                            this.total = res.body.count;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取所有对象列表数据
                getTableData2() {
                    var temparams = `['${this.params2.type}','${this.params2.content}',${this.params2.pageNo},${this.params2.pageSize}]`;
                    commonAjax("cas.hotObjectService", "getObjectList", temparams).then(res => {
                        if (res.code == 200) {
                            this.tableData2 = res.body.list;
                            this.total2 = res.body.count;
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
                //改变分页显示的数量
                handleSizeChange2(val) {
                    this.params2.pageSize = val;
                    this.getTableData2()
                },
                //跳转到分页输入框中页码的页面
                handleCurrentChange2(val) {
                    this.params2.pageNo = val;
                    this.getTableData2()
                },
                //搜索按钮点击
                searchClick2() {
                    this.getTableData2();
                },
                // 列表常用的方法结束-------------------------------------------------------------------------------
                // 表单常用的方法开始
                //保存按钮提交数据
                //点击模态框关闭或者取消的时候重置表单
                resetForm(formName) {
                    this.$refs[formName].resetFields();

                },
                //获取字典
                // dictionaryRequest() {
                //     let arr = ["cfs.dic.base_objectType"];
                //     commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                //         if (res.code == 200) {
                //             var that = this;
                //             res.body.forEach(function(ele, index) {
                //                 if (ele.dicId == arr[0]) {
                //                     that.dictionary.objectType = ele.items;
                //                 }


                //             })

                //         } else {
                //             this.$message({
                //                 type: 'error',
                //                 message: res.msg
                //             });
                //         }
                //     });
                // },
                // 表单常用的方法结束--------------------------------------------------------------------------

        },
        components: {

        },
        mounted() {
            this.params2.type = "021";
            this.getTableData();
            this.getTableData2();
            // this.dictionaryRequest();
        },

}
</script>
<style type="text/css" scoped>
.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}
</style>
