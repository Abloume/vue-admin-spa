<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
                        <el-breadcrumb-item>租户维护</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <!--  <el-col :span="12" class="return_prev">
                    <router-link to="/"> <span class="return"><img src="../../assets/img/return.png"></span>返回上一级</router-link>
                </el-col> -->
            </el-row>
            <el-row class="search_con">
                <el-col :span="12">
                    <el-input placeholder="请输入医院名称"  v-model="params.content"  type="hidden">
                    </el-input>
                </el-col>
                <el-col :span="12" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit('','','baseInfo')">新建租户</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="number" label="序号" width="100">
            </el-table-column>
            <el-table-column prop="sign" label="租户标识" width="200">
            </el-table-column>
            <el-table-column prop="type" label="类型" width="200">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="300">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'baseInfo')">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">禁用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
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
                tableData: [{
                    number: 1,
                    sign: "hcn",
                    type: "gongyouyzuhu",
                    name:"zheyi",
                    tenantId:"222"

                }],
                params: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
            }
        },
        computed: {

        },
        methods: {
                handleEdit(index, row, activeName) { //第三个参数是为了到orgInfo组件的tab传参
                    let temtenantOption = {
                        tenantId: row ? row.tenantId : '',
                        activeName:"baseInfo",
                        isdisabled: row ? true : false,
                        ishowtab: row ? true : false,
                    };
                    console.log(temtenantOption);
                    this.$store.dispatch('tenantOption',temtenantOption);
                    this.$router.push('tenantInfo')

                },
                // 删除租户列表中的一条数据
                handleDelete(index, row) {
                    // this.$message.error('删除第' + (index + 1) + '行');
                    const h = this.$createElement;
                    this.$msgbox({
                            title: '确认删除',
                            message: h('p', null, [
                                h('span', null, '是否删除 '),
                                h('i', {
                                    style: 'color: teal'
                                }, row.orgFullName)
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
                                this.$message({
                                    type: 'success',
                                    message: "删除成功"
                                });
                            }
                        });
                },
                //获取租户列表数据
                getTableData() {

                    // let params = this.params;
                    // commonAjax("base.sysOrganizationService", "list", '[' + JSON.stringify(params) + ']').then(res => {

                    //     if (res.code == 200) {
                    //         res.body.list.forEach(function(el, index) {
                    //             el.number = index + 1;
                    //         })
                    //         this.tableData = res.body.list;
                    //         this.total = res.body.total;
                    //     } else {
                    //         this.$message({
                    //             type: 'error',
                    //             message: res.msg
                    //         });
                    //     }



                    // });
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


        },
        components: {},
        mounted() {

        },
        beforeMount() {
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
    float: right;text-align: right
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}
</style>
