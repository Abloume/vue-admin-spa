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
                <div class="left-con products">
                    <ul id="productslist">
                        <li v-for="(item,index) in prolists">
                            <p @click.stop="getrelatemodule(item,$event)" :class="{cur:index==0}">{{item.name}}</p>
                            <dl>
                                <dd @click.stop="getrelatemodule(sitem,$event)" v-for="(sitem,sindex) in item.childList">{{sitem.name}}</dd>
                            </dl>
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="commontit">
                    <h2>模块列表</h2>
                </div>
                <div class="right-con">
                    <el-table :data="modulelists" border style="width: 100%">
                        <el-table-column prop="number" label="选择" >
                            <template scope="scope">
                                <el-checkbox v-model="checked"></el-checkbox>
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
import 'assets/lib/zTree/img/metro.gif';
import 'assets/lib/zTree/img/metro.png';
import 'assets/lib/zTree/img/line_conn.png';
import 'assets/lib/zTree/metroStyle.css';
import 'assets/lib/zTree/js/jquery.ztree.core.js';
import 'assets/lib/zTree/js/jquery.ztree.exedit.min.js';
export default {
    data() {
            return {
                prolists: [{
                    "name": "健康湘潭.医生版",
                    "childList": [{
                        "name": "健康湘潭.医生版APP.android",
                        "code": "coms.xiangtan.doctor_android"
                    }, {
                        "name": "健康湘潭.医生版APP.ios",
                        "code": "coms.xiangtan.doctor_ios"
                    }, {
                        "name": "健康湘潭.医生版PC",
                        "code": "coms.xiangtan.doctor_pc"
                    }],
                    "code": "coms.xiangtan.doctor"
                }, {
                    "name": "健康湘潭.大众版",
                    "childList": [{
                        "name": "健康湘潭.大众版APP.android",
                        "code": "coms.xiangtan.patient_android"
                    }, {
                        "name": "健康湘潭.大众版APP.ios",
                        "code": "coms.xiangtan.patient_ios"
                    }],
                    "code": "coms.xiangtan.patient"
                }],
                modulelists: [{
                    moduleCode: 1,
                    moduleName: "test",
                    moduleDesc: "1111111"
                }],
                lenArr: [10, 20, 50], // 每页显示长度设置
                pageLen: 5, // 可显示的分页数
                headersparam: {
                    "X-Service-Id": "base.moduleService",
                    "X-Service-Method": "queryModuleRelationByProductCode",
                },
                param: {
                    code: ""
                },
                ishide: false,
                params: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: 1,

            }
        },
        computed: {

        },
        components: {

        },
        mounted() {

            //获取产品名称列表 
            // commonAjax("base.tenantProductsService", "findProducts", "[]")
            //     .then(res=> {
            //         if (res.code == 200) {
            //             this.prolists = res.body;
            //             this.param.code = this.prolists[0].code;
            //             this.getrelatemodule();
            //         }
            //     });
        },
        methods: {

            // 列表页面刷新按钮
            getrelatemodule(item, event) {
                    if (event) {
                        this.param.code = item.code;
                        $(event.target).closest('ul').find("p,dd").removeClass('cur').end().end().addClass("cur");

                    }

                    if (this.ishide) {
                        this.refresh();
                    } else {
                        this.ishide = true;
                    }


                },
                changeSelected(item) {
                    console.log(item.isSelected);
                    var temobj = {
                        "status": item.isSelected ? "0" : "1",
                        "moduleId": item.moduleId, //moduleId
                        "productCode": this.param.code //productCode产品编码

                    };
                    commonAjax("base.moduleService", "saveProductModuleRel", "[" + JSON.stringify(temobj) + "]")

                    .then(res => {
                        if (res.code == 200) {
                            Public.ajaxPrompt("保存成功");
                        } else {
                            Public.ajaxPrompt(res.msg);
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


/*右键*/

div#rMenu {
    position: absolute;
    visibility: hidden;
    top: 0;
    background-color: #fafafa;
    text-align: left;
    padding: 2px;
    border: 1px solid #e6e6e6;
    padding: 5px
}

div#rMenu ul {
    margin-bottom: 0;
}

div#rMenu ul li {
    margin: 1px 0;
    padding: 5px 10px;
    cursor: pointer;
    list-style: none outside none;
}

div#rMenu ul li:nth-child(1) {
    background: url(../../assets/img/add2.png) no-repeat 10px center;
    padding-left: 35px;
    cursor: pointer;
    border-bottom: 1px solid #1DC499;
}

div#rMenu ul li:nth-child(2) {
    background: url(../../assets/img/dele3.png) no-repeat 10px center;
    padding-left: 35px;
    cursor: pointer;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.menuset_con {
    width: 950px;
    min-height: 644px;
    height: auto!important;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    padding-top: 30px;
    background-color: #fff;
}

.menuset_con_left {
    border-radius: 0 0 10px 0;
    max-height: 600px;
    overflow: auto
}

.menuset_con_right {
    border-radius: 0 0 10px 0;
    max-height: 600px;
    overflow: auto;
}

.products .tit {
    background: #f8f8f8;
    padding: 10px 20px
}

.products .tit h2 {
    border-left: 5px solid #00c484;
    line-height: 20px;
    font-size: 16px;
    padding: 0 10px;
    height: 20px;
}

.products,
.modules {
    border: 1px solid #e6e6e6;
   border-top:none;
   font-size: 14px;

}

.products ul {
    padding: 20px;
}

.products li {
    background: url(../../assets/img/drop.png) no-repeat left 8px;
    padding-left: 15px;
}

.products li dl {
    margin-left: 20px;
}

.products li dd,
.products li p {
    line-height: 28px;
    height: 28px;
}

.products li dd.cur,
.products li p.cur {
    background: #ccc
}

.products li dd:hover,
.products li p:hover {
    cursor: pointer;
}

.modules table th:nth-child(1) {
    text-align: center
}

.modules table td:nth-child(1) {
    width: 50px;
    text-align: center
}

.modules table td:nth-child(2) {
    width: 100px;
}

.modules table td:nth-child(3) {
    width: 100px;
}

.modules table td:nth-child(4) {
    width: 50px;
}
</style>
