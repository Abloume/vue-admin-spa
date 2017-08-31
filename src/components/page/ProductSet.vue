<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>产品版本管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="productName" label="APP名称">
            </el-table-column>
            <el-table-column prop="platformtext" label="APP类型">
            </el-table-column>
            <el-table-column prop="version" label="APP版本">
            </el-table-column>
            <el-table-column prop="createDt" label="更新时间">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="gohistorylist(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row,'outadd')">新增</el-button>
                    <el-button size="small" @click="showqrcode(scope.$index, scope.row)">二维码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-form-item label="产品名称" :label-width="formLabelWidth" prop="productName">
                    <el-input v-model="formdata.productName" disabled></el-input>
                </el-form-item>
                <el-form-item label="产品编码" :label-width="formLabelWidth" prop="productCode">
                    <el-input v-model="formdata.productCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="平台类型" :label-width="formLabelWidth" prop="platform">
                    <el-select v-model="formdata.platform" placeholder="请选择" disabled>
                        <el-option v-for="item in dictionary.appPlatformType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本" :label-width="formLabelWidth" prop="version">
                    <el-input v-model="formdata.version" :disabled="statue=='look'"></el-input>
                </el-form-item>
                <el-form-item label="下载地址" :label-width="formLabelWidth" prop="url">
                    <el-input v-model="formdata.url" :disabled="statue=='look'"></el-input>
                </el-form-item>
                <el-form-item label="强制更新" prop="updateType" :label-width="formLabelWidth">
                    <el-radio-group v-model="formdata.updateType" :disabled="statue=='look'">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="版本说明" :label-width="formLabelWidth" prop="content">
                    <el-input v-model="formdata.content" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="statue=='look'"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot" v-show="statue!='look'">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="historydialogtitle" v-model="historydialogFormVisible">
            <el-row class="search_con" :gutter="20">
                <el-col :span="6" class="addorg" :offset="16">
                    <el-button type="primary" icon="plus" @click="handleEdit">新增</el-button>
                </el-col>
            </el-row>
            <el-table :data="historytableData" border style="width: 100%">
                <el-table-column prop="productCode" label="产品编码">
                </el-table-column>
                <el-table-column prop="productName" label="产品名称">
                </el-table-column>
                <el-table-column prop="platformtext" label="平台类型">
                </el-table-column>
                <el-table-column prop="version" label="版本">
                </el-table-column>
                <el-table-column prop="updateTypetext" label="强制更新">
                </el-table-column>
                <el-table-column prop="content" label="版本说明" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="操作" :width="230">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.enableFlag==1">查看</el-button>
                        <el-button size="small" v-show="scope.row.enableFlag==1" disabled>已发布</el-button>
                        <el-button size="small" type="success" @click="publish(scope.$index, scope.row)" v-show="scope.row.enableFlag!=1">发布</el-button>
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.enableFlag!=1">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 二维码显示 -->
        <el-dialog :title="qrcodetit" v-model="qrcodeVisible">
            <div id="qrcode">
                <vue-qrcode-component :text="qrcodevalue" size="200"></vue-qrcode-component>
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
    Base64
}
from 'assets/lib/qrcode/Base64';
import vueQrcodeComponent from 'vue-qrcode-component'
export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
                // 列表常用的数据开始
                tableData: [],

                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "id": undefined,
                    "content": "",
                    "platform": "",
                    "productCode": "",
                    "productName": "",
                    "updateType": "",
                    "url": "",
                    "version": ""
                },

                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    // orgFullName: [{
                    //     required: true,
                    //     message: '请输入机构全称',
                    //     trigger: 'blur'
                    // }],
                    // province: [{
                    //     required: true,
                    //     message: '请选择省',
                    //     trigger: 'blur'
                    // }],
                },
                dictionary: {
                    appPlatformType: [], //平台类型
                },
                protableData: [],
                historydialogtitle: "",
                params: {
                    "pageNo": 1,
                    "pageSize": 10,
                    "platform": "",
                    "productCode": ""
                },
                total: "",
                historydialogFormVisible: false,
                historytableData: [],
                curpro: null,
                statue: "add",
                qrcodeVisible: false,
                qrcodevalue: "",
                qrcodetit: "",
            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
            //点击编辑的方法
            handleEdit(index, row, sign) {
                    this.dialogFormVisible = true;
                    if (row) {
                        if (sign) {
                            this.statue = "add";
                            this.dialogtitle = "新增产品版本";
                            this.formdata = {
                                "id": undefined,
                                "content": "",
                                "platform": row.platform,
                                "productCode": row.productCode,
                                "productName": row.productName,
                                "updateType": "",
                                "url": "",
                                "version": ""
                            }
                        } else {
                            if (row.enableFlag != 1) {
                                this.dialogtitle = "编辑产品版本";
                                this.statue = "edit"
                            } else {
                                this.dialogtitle = "查看产品版本";
                                this.statue = "look"
                            }
                            this.formdata = {
                                "id": row.id,
                                "content": row.content,
                                "platform": row.platform,
                                "productCode": row.productCode,
                                "productName": row.productName,
                                "updateType": row.updateType,
                                "url": row.url,
                                "version": row.version
                            }
                        }




                    } else {
                        this.statue = "add"
                        this.dialogtitle = "新增产品版本";
                        this.formdata = {
                            "id": undefined,
                            "content": "",
                            "platform": this.curpro.platform,
                            "productCode": this.curpro.productCode,
                            "productName": this.curpro.productName,
                            "updateType": "",
                            "url": "",
                            "version": ""
                        }
                    }

                },

                // //获取搜索下拉框的产品列表 过滤掉pc端的选择
                // getproTableData() {
                //     commonAjax("cas.productRelatedService", "productSecondLevelList", '[]', ).then(res => {
                //         if (res.code == 200) {
                //             var temarr = [];
                //             $.each(res.body, function(index, el) {
                //                 if (el.name.indexOf("APP") != -1) {
                //                     temarr.push(el)
                //                 }
                //             });
                //             this.protableData = temarr;
                //         } else {
                //             this.$message({
                //                 type: 'error',
                //                 message: res.msg
                //             });
                //         }
                //     });
                // },
                //获取所有产品最新版本的列表数据
                getTableData() {
                    var temparams = {
                        "pageNo": 1,
                        "pageSize": 300,
                    };
                    commonAjax("cas.appVersionManageService", "latformLastestVersionList", '[' + JSON.stringify(temparams) + ']').then(res => {
                        if (res.code == 200) {
                            $.each(res.body.data, function(index, el) {
                                el.createDt = el.createDt.substring(0, 10);
                                el.platformtext = el.platform == 1 ? "IOS" : "Android"
                            });
                            this.tableData = res.body.data;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 点击生成二维码
                showqrcode(index, row) {
                    this.qrcodeVisible = true;
                    this.qrcodetit = row.productName;
                    let temobj = {
                        type: "4", //二维码类型，必传
                        pCode: row.productCode, //产品编码，必传
                    };
                    temobj = JSON.stringify(temobj);
                    let b = new Base64();
                    this.qrcodevalue = "https://app.bshcn.com.cn/download/apk/appdowmload.html?data=" + b.encode(temobj);
                    // this.qrcodevalue="http://wwww.baidu.com";
                    // let str = b.decode("eyJ0eXBlIjoiNCIsInBDb2RlIjoiaGNuLnRvbmd4aWFuZy5wYXRpZW50X2FuZHJvaWQifQ==");//解码
                    // alert(str);
                },
                //获取某个产品所有版本的列表数据
                gohistorylist(index, row) {
                    this.curpro = row;
                    this.params = {
                        "pageNo": 1,
                        "pageSize": 10,
                        "platform": row.platform,
                        "productCode": row.productCode,
                    }

                    this.historydialogFormVisible = true;
                    this.historydialogtitle = row.productName;
                    commonAjax("cas.appVersionManageService", "productHistoryVersionList", '[' + JSON.stringify(this.params) + ']').then(res => {
                        if (res.code == 200) {
                            $.each(res.body.data, function(index, el) {
                                el.updateTypetext = el.updateType == 1 ? "是" : "否";
                                el.platformtext = el.platform == 1 ? "IOS" : "Android";

                            });
                            this.historytableData = res.body.data;
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
                    this.gethistoryTableData()
                },
                //跳转到分页输入框中页码的页面
                handleCurrentChange(val) {
                    this.params.pageNo = val;
                    this.gethistoryTableData()
                },

                // 列表常用的方法结束-------------------------------------------------------------------------------
                // 表单常用的方法开始
                //保存按钮提交数据
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            var ajaxmd = this.statue == "add" ? 'verionAdded' : 'verionUpdated'
                            commonAjax("cas.appVersionManageService", ajaxmd, '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
                                if (res.code == 200) {
                                    this.dialogFormVisible = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    if (this.historydialogFormVisible) {
                                        this.gohistorylist('', this.curpro);
                                    } else {
                                        this.getTableData()
                                    }


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
                publish(index, row) {
                    let param = {
                        "enableFlag": "1",
                        "id": row.id
                    }
                    commonAjax("cas.appVersionManageService", "verionEnableFlagUpdated", '[' + JSON.stringify(param) + ']').then(res => {
                        if (res.code == 200) {
                            this.gohistorylist(index, row);
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取字典
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_appPlatformType"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            var that = this;
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.appPlatformType = ele.items;
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

        },
        components: {
            vueQrcodeComponent
        },
        mounted() {
            this.getTableData();
            // this.getproTableData();
            this.dictionaryRequest();
        },

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

.search_con {
    margin: 0 0 20px 0
}

#qrcode {
    width: 300px;
    height: 300px;
    margin: 30px auto;
}
</style>
