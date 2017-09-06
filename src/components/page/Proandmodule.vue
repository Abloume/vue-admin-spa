<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>产品与模块的关系管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 标题 -->
                <div class="commontit">
                    <h2>产品列表</h2>
                </div>
                <div class="left-con">
                    <ul class="productslist">
                        <li v-for="(item,index) in prolists" @click="clickitem(item,index)" :class="{'cur':item.cur==true||index==0}">{{item.name}}
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="commontit">
                    <h2>模块列表</h2>
                </div>
                <div class="right-con">
                    <el-row class="search_con" :gutter="20">
                        <el-col :span="8">
                            <el-input v-model="params.keyWord" placeholder="请输入模块名称或模块编码"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                        </el-col>
                        <el-col :span="6" class="addorg" >
                            <el-button type="primary" @click="submitForm">保存</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column prop="number" label="选择" width="130">
                            <template scope="scope">
                                <input type="checkbox" :name="scope.$index" v-model="scope.row.checked" @change="handleCheckedChange(scope.row)">
                            </template>
                        </el-table-column>
                        <el-table-column prop="moduleCode" label="模块编码">
                        </el-table-column>
                        <el-table-column prop="moduleName" label="模块名称">
                        </el-table-column>
                        <el-table-column prop="moduleDesc" label="备注">
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {
    commonAjax, commonurl
}
from '../../api/api';
export default {
    data() {
            return {
                prolists: [],
                tableData: [],
                params: {
                    "keyWord": "",
                    "productCode": "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                productModules: [], //产品对应的模块
                objectlist: {

                },
                curproductCode: "",

            }
        },
        computed: {

        },
        components: {

        },
        mounted() {
            this.getprolists();
        },
        methods: {
            // //获取产品列表数据
            getprolists() {
                    commonAjax("cas.productRelatedService", "productSecondLevelList", '[]').then(res => {
                        if (res.code == 200) {
                            this.prolists = res.body;
                            this.clickitem(this.prolists[0], 0);
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 点击左侧产品列表
                clickitem(item, index) {
                    $(".productslist").find('li').eq(index).addClass('cur').siblings('li').removeClass('cur');
                    this.curproductCode = item.code;
                    this.getproductModules();

                },
                //获取产品对应的模块
                getproductModules() {
                    commonAjax("cas.productRelatedService", "moduleSelected", `['${this.curproductCode}']`).then(res => {
                        if (res.code == 200) {
                            this.objectlist = {};
                            $.each(res.body, function(index, el) {
                                this.objectlist[el] = "test"
                            }.bind(this));
                            this.getTableData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //改变chenckbox时候修改对象属性
                handleCheckedChange(row) {
                    if (row.checked) {
                        this.objectlist[row.moduleId] = "test";
                    } else {
                        delete this.objectlist[row.moduleId]
                    }
                },
                //获取模块列表数据
                getTableData() {
                    commonAjax("cas.productRelatedService", "moduleList", '[' + JSON.stringify(this.params) + ']').then(res => {
                        if (res.code == 200) {
                            this.tableData = res.body.data;
                            this.total = res.body.total;
                            $.each(res.body.data, function(index, el) {
                                el.checked = false
                                for (let key in this.objectlist) {
                                    if (key == el.moduleId) {
                                        el.checked = true
                                    }
                                }
                            }.bind(this));
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //保存对应模块
                submitForm() {
                    let param = {
                        "productCode": this.curproductCode,
                        "moduleIds": []
                    }
                    for (let key in this.objectlist) {
                        param.moduleIds.push(key)
                    }
                  if(param.moduleIds.length>0){
                    commonAjax("cas.productRelatedService", "productModuleSaved", '[' + JSON.stringify(param) + ']').then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "保存成功"
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                  }else{
                     this.$message({
                                type: 'error',
                                message: "请至少选择一个模块"
                         });
                  }

                },
                //页面显示的条数变化
                handleSizeChange(val) {
                    this.params.pageSize = val;
                    this.getTableData();
                },
                // 输入框翻页效果
                handleCurrentChange(val) {
                    this.params.pageNo = val;
                    this.getTableData()
                },
                searchClick() {
                    this.getTableData();
                },

        },

        watch: {

        }
}
</script>
<style scoped>
.left-con,
.right-con {
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 10px
}

.search_con {
    margin-top: 0;
    margin-bottom: 20px;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.productslist {
    padding-left: 20px;
}

.productslist li {
    line-height: 30px;
    font-size: 14px;
    padding-left: 20px;
}

.productslist li:hover {
    cursor: pointer;
}

.productslist li.cur {
    background: #00d1b2;
    color: #fff
}
</style>
