<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <!--  <el-col :span="12" class="return_prev">
                    <router-link to="/"> <span class="return"><img src="../../assets/img/return.png"></span>返回上一级</router-link>
                </el-col> -->
            </el-row>
            <el-row class="search_con">
                <el-col :span="12">
                    <el-input placeholder="请输入医院名称" icon="search" v-model="params.content" :on-icon-click="searchClick">
                    </el-input>
                </el-col>
                <el-col :span="12" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit('','','baseInfo')">新建机构</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="number" label="序号" width="120">
            </el-table-column>
            <el-table-column prop="orgFullName" label="医院名称" width="300">
            </el-table-column>
            <el-table-column prop="orgShortName" label="简称" width="200">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'baseInfo')">编辑</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'orgnavigation')">医院导航</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'reportDes')">报告说明</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'countInfo')">账号信息</el-button>
                    <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row,'qrCode')">二维码</el-button> -->
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'serviceList')">服务列表</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                tableData: [],
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
        mounted() {
            this.getTableData();
        },
        methods: {
            handleEdit(index, row, activeName) { //第三个参数是为了到orgInfo组件的tab传参
                    let temorgOption = {
                        orgId: row ? row.orgId : '',
                        activeName: activeName, //tab面板定位
                        isdisabled: row ? true : false, //是否可编辑
                        ishowtab: row ? true : false,
                        "parentId": row && row.parentId ? row.parentId : "",
                        "qrCode": row && row.qrCode ? row.qrCode : "", //二维码
                        "qrAvatarFileId": row && row.qrAvatarFileId ? row.qrAvatarFileId : 0, //二维码图片id
                        "medicalOrgId": row && row.medicalOrgId ? row.medicalOrgId : "", //机构医保局id
                        "localOrgId": row && row.localOrgId ? row.localOrgId : "", //机构代码
                        "orgFullName": row && row.orgFullName ? row.orgFullName : "", //机构全称
                        "orgShortName": row && row.orgShortName ? row.orgShortName : "", //简称
                        "orgClassify": row && row.orgClassify ? row.orgClassify : "", //机构分类
                        // "area": row&&row.area?row.area:"",
                        "orgNature": row && row.orgNature ? row.orgNature : "", //机构性质
                        "orgLevel": row && row.orgLevel ? row.orgLevel : "", //机构级别
                        "orgMnemonic": row && row.orgMnemonic ? row.orgMnemonic : "",
                        "createDt": row && row.createDt ? row.createDt : "",
                        // "status": row&&row.status?row.status:"",
                        "avatarField": row && row.avatarField ? row.avatarField : 0, //机构照片地址id
                        "homepage": row && row.homepage ? row.homepage : "",
                        "description": row && row.description ? row.description : "",
                        "orgAddress": row && row.orgAddress ? row.orgAddress : "", //机构地址
                        "consultNo": row && row.consultNo ? row.consultNo : "", //咨询电话
                        "emergencyNo": row && row.emergencyNo ? row.emergencyNo : "", //紧急电话
                        "contactNo": row && row.contactNo ? row.contactNo : "",
                        "postcode": row && row.postcode ? row.postcode : "", //邮政编码
                        "trafficDesc": row && row.trafficDesc ? row.trafficDesc : "", //交通说明
                        "longitude": row && row.longitude ? row.longitude : "", //经度
                        "latitude": row && row.latitude ? row.latitude : "", //维度
                        "fax": row && row.fax ? row.fax : "", //传真
                        "province": row && row.province ? row.province : "", //地址（省）
                        "provinceText": row && row.provinceText ? row.provinceText : "",
                        "city": row && row.city ? row.city : "", //地址（市）
                        "cityText": row && row.cityText ? row.cityText : "",
                        "district": row && row.district ? row.district : "", //地址（区、县）
                        "districtText": row && row.districtText ? row.districtText : "",
                        "street": row && row.street ? row.street : "", //街道编码
                        "streetText": row && row.streetText ? row.streetText : "",
                    };
                    this.$store.dispatch('orgOption', temorgOption);
                    this.$router.push('orgInfo')
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
                                let params = `['${row.orgId}']`;
                                commonAjax("cas.orgService", "deleteOrgInfo", params).then(res => {
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
                //获取机构列表数据
                getTableData() {
                    let {
                        content, pageNo, pageSize
                    } = this.params;
                    let params = `['${content}',${pageNo},${pageSize}]`;
                    commonAjax("cas.orgService", "orgInfoList", params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.items, function(index, el) {
                                el.number = (index + 1) + (pageNo - 1) * pageSize;
                            });
                            this.tableData = res.body.items;
                            this.total = res.body.total;
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
        },
        components: {},
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.getTableData();
            })
        },
        // watch: {
        //     // 如果路由有变化，会再次执行该方法
        //     '$route': 'getTableData'
        // },

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
