<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>标准科室对照</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <!-- 标题 -->
                <div class="commontit">
                    <h2>选择科室</h2>
                </div>
                <div class="left-con">
                    <el-row :gutter="20" class="search_con">
                        <el-col :span="12">
                            <el-input v-model="params.content" :label-width="formLabelWidth" placeholder="科室拼音码"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" icon="search" @click="searchClick">查询</el-button>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" icon="search" @click="submitForm()">保存</el-button>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="search_con">
                        <el-col :span="24">
                            <el-select v-model="orgId" filterable placeholder="请选择机构名称">
                                <el-option v-for="item in orglist" :key="item.orgId" :label="item.orgFullName" :value="item.orgId">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-table :data="tableData" border style="width: 100%" class="dept" highlight-current-row @current-change="handleChange">
                        <el-table-column prop="deptName" label="医院行政科室">
                        </el-table-column>
                        <el-table-column prop="deptMnemonic" label="拼音代码">
                        </el-table-column>
                        <el-table-column prop="stardardDeptName" label="标准科室">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-show="scope.row.standardDeptId">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="commontit">
                    <h2>标准科室</h2>
                </div>
                <div class="right-con">
                    <el-row :gutter="20" class="search_con2">
                        <el-col :span="12">
                            <el-input v-model="params.content" :label-width="formLabelWidth" placeholder="科室拼音码"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" icon="search" @click="stdsearchClick">查询</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="stdtableData" border style="width: 100%" class="dept">
                        <el-table-column prop="stardardDeptName" label="标准科室">
                            <template scope="scope">
                                <div @dblclick="handleAdd(scope.$index, scope.row)">{{scope.row.stardardDeptName}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="stdtotal" :page-sizes="[10,20,50]" @size-change="stdhandleSizeChange" @current-change="stdhandleCurrentChange" :page-size="stdparams.pageSize">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
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
                orglist: [],
                orgId: "",
                currentRow: null,
                params: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                tableData: [],
                total: "",
                stdparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                stdtableData: [],
                stdtotal: "",


            }
        },
        computed: {

        },
        methods: {
            searchClick() {
                    this.getTableData(this.orgId);
                },
                //点击选中
                handleChange(val) {
                    this.currentRow = val;
                    console.log(this.currentRow);
                },
                submitForm() {

                    commonAjax("cas.standardDeptCampareService", "saveCampares", '[' + JSON.stringify(this.tableData) + ']').then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "保存成功"
                            });
                            this.getTableData(this.orgId);
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            });
                        }
                    });
                },
                //获取当前选中机构下的科室列表数据
                getTableData(val) {
                    let params = `['${val}','${this.params.content}',${this.params.pageNo},${this.params.pageSize}]`;
                    commonAjax("cas.standardDeptCampareService", "getDeptList", params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.items, function(index, el) {
                                el.index = index;
                            });
                            this.tableData = res.body.items;
                            this.total = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            });
                        }
                    });
                },
                handleDelete(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.deptName)
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
                            let params = `['${row.deptId}']`;

                            commonAjax("cas.standardDeptCampareService", "deleteCampare", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.getTableData(this.orgId);
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
                //获取标准科室列表数据
                stdgetTableData() {
                    let params = `['${this.stdparams.content}',${this.stdparams.pageNo},${this.stdparams.pageSize}]`;
                    commonAjax("cas.standardDeptCampareService", "getStandardDeptList", params).then(res => {
                        if (res.code == 200) {
                            this.stdtableData = res.body.items;
                            this.stdtotal = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg
                            });
                        }
                    });
                },
                stdsearchClick() {
                    this.stdgetTableData();
                },
                handleAdd(index, row) {
                    this.currentRow.standardDeptId = row.stardardDeptId;
                    this.currentRow.stardardDeptName = row.stardardDeptName;
                    this.tableData.splice(this.currentRow.index, 1, this.currentRow)
                },
                //页面显示的条数变化
                handleSizeChange(val) {
                    this.params.pageSize = val;
                    this.getTableData(this.orgId);
                },
                // 输入框翻页效果
                handleCurrentChange(val) {
                    this.params.pageNo = val;
                    this.getTableData(this.orgId);
                },
                //页面显示的条数变化
                stdhandleSizeChange(val) {
                    this.stdparams.pageSize = val;
                    this.stdgetTableData()
                },
                // 输入框翻页效果
                stdhandleCurrentChange(val) {
                    this.stdparams.pageNo = val;
                    this.stdgetTableData()
                },
        },
        components: {

        },
        mounted() {
            //获取机构列表
            let params = `[null,1,500]`;
            commonAjax("cas.standardDeptCampareService", "getOrgList", params).then(res => {
                if (res.code == 200) {
                    this.orglist = res.body.data;
                    if (this.orglist[0]) {
                        this.orgId = this.orglist[0].id
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
            // let params = [{}];
            // commonAjax("cas.departmentService", "deptTree", params).then(res => {
            //     if (res.code == 200) {
            //         this.orglist = res.body.info;
            //         this.orgId= this.orglist[0].id
            //     } else {
            //         this.$message({
            //             type: 'error',
            //             message: res.msg
            //         });
            //     }
            // });
            this.stdgetTableData();
        },
        watch: {
            'orgId' (val, oldval) {
                this.getTableData(val);
            }
        }
}
</script>
<style type="text/css" scoped>
.left-con,
.right-con {
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 10px
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.dept {
    margin-top: 20px
}

.search_con .el-select {
    width: 100%
}

.search_con2 {
    margin-top: 75px
}
</style>
