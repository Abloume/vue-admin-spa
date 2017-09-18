<template>
    <div>
        <!--标题-->
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>租户维护</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con">
                <el-col :span="24" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleAddOrCheck('', '', 1)">添加租户</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <el-table :data="tenantListData" border style="width: 100%">
            <el-table-column label="序号" prop="number"></el-table-column>
            <el-table-column label="租户标识" prop="tenantId"></el-table-column>
            <el-table-column label="类型" prop="tenantTypeText"></el-table-column>
            <el-table-column label="名称" prop="tenantName"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleAddOrCheck(scope.$index, scope.row, 2)">查看</el-button>
                    <el-button v-show="scope.row.status==0" size="small" type="success" @click="handleForbidden(scope.$index, scope.row)">启用</el-button>
                    <el-button v-show="scope.row.status==1" size="small" type="danger" @click="handleForbidden(scope.$index, scope.row)">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { commonAjax } from '../../api/api';
export default {
    data() {
        return {
            dictionary: { // 字典查询数据
                medicalCombType: [{ // 租户维护-基本信息-类型
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }]
            },
            tenantListData: [],   // 租户列表
            total: "",            // 条数
            isEnaleStatus: false, // 禁用和启用按钮
            params: {
                content: "",
                pageNo: 1,
                pageSize: 10,
            }
        }
    },
    activated() {
        this.init();
    },
    methods: {
        // 获取字典
        dictionaryRequest() {
            var that = this;
            let arr = [
                "cfs.dic.base_medicalCombType" // 租户维护-基本信息-类型
            ];

            commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                if (res.code == 200) {
                    res.body.forEach(function(ele, index) {
                        if (ele.dicId == arr[0]) {
                            that.dictionary.medicalCombType = ele.items;
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
        //获取租户列表数据
        getTenantListData() {
            let params = [{
                pageNo: this.params.pageNo,
                pageSize: this.params.pageSize
                 // tenantId: 'hcn.zhongshan',  // 非必传
            }];
            
            commonAjax("cas.tenantManageService", "tenantList", params).then(res => {
                if (res.code == 200) {
                    $.each(res.body.data, function(index, el) {
                        el.number = (index + 1) + (params[0].pageNo - 1) * (params[0].pageSize);
                    });
                    // $.each(res.body.data, function(index, el) {
                    //     if (res.body.data.tenantType == '01') {
                    //         res.body.data.tenantType = '集团化医院';
                    //     } else if (res.body.data.tenantType == '02') {
                    //         res.body.data.tenantType = '医疗中心';
                    //     } else if (res.body.data.tenantType == '03') {
                    //         res.body.data.tenantType = '城市级医联';
                    //     } else {
                    //         res.body.data.tenantType = '互联网医联';
                    //     }
                    // });
                    
                    this.tenantListData = res.body.data;
                    this.total = res.body.total;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },

        //添加租户或者查看租户
        handleAddOrCheck(index, row, type) { // 第三个参数是为了到orgInfo组件的tab传参;type表示1新增或者2查看
            var tenantId = row.tenantId;
            var type = type;
            
            this.$router.push({
                name: 'TenantInfo',
                params: {
                    id: tenantId,
                    type: type
                }
            });
        },

        //禁用和启用按钮
        handleForbidden(index, row, status) {
            if (row.status == 1) { // 禁用
                const h = this.$createElement;

                this.$msgbox({
                    title: '确认禁用？',
                    message: h('p', null, [
                        h('span', null, ''),
                        h('i', {
                            style: 'color: teal'
                        }, row.shortName)
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
                            message: "取消禁用"
                        });
                    } else {
                        // 禁用服务
                        commonAjax('cas.tenantManageService', 'tenantDisable', [row.tenantId, 0]).then(res => {
                            if (res.code == 200) {
                                row.status = 0;
                                this.$message({
                                    type: 'success',
                                    message: '禁用成功！'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                })
                            }
                        })
                    }
                })
            } else {    // 啓用
                const h = this.$createElement;

                this.$msgbox({
                    title: '确认启用？',
                    message: h('p', null, [
                        h('span', null, ''),
                        h('i', {
                            style: 'color: teal'
                        }, row.shortName)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...',
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
                    if (action === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: "取消启用"
                        });
                    } else { // 启用服务
                        commonAjax('cas.tenantManageService', 'tenantDisable', [row.tenantId, 1]).then(res => {
                            if (res.code == 200) {
                                row.status = 1;
                                this.$message({
                                    type: 'success',
                                    message: '启用成功！'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                })
                            }
                        })
                    }
                });
            }
        },

        // 页面显示的条数变化
        handleSizeChange(val) {
            this.params.pageSize = val;
            this.getTenantListData();
        },

        // 输入框翻页效果
        handleCurrentChange(val) {
            this.params.pageNo = val;
            this.getTenantListData();
        },

        init() {
            this.dictionaryRequest();
            this.getTenantListData();
        }
    },
    components: {},
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // vm.getTableData();
        })
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
