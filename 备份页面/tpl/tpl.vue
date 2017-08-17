<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12" class="return_prev">
                    <router-link to="/"> <span class="return"><img src="../../assets/img/return.png"></span>返回上一级</router-link>
                </el-col>
            </el-row>
            <el-row class="search_con">
                <el-col :span="12">
                    <el-input placeholder="请输入医院名称" icon="search" v-model="params.content" :on-icon-click="searchClick">
                    </el-input>
                </el-col>
                <el-col :span="12" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit">新建机构</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="number" label="序号" width="100">
            </el-table-column>
            <el-table-column prop="orgFullName" label="医院名称" width="300">
            </el-table-column>
            <el-table-column prop="orgShortName" label="简称" width="200">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" @click="orgnavigation(scope.$index, scope.row)">医院导航</el-button>
                    <el-button size="small" @click="orgReport(scope.$index, scope.row)">报告说明</el-button>
                    <!--   <el-button size="small" @click="handleEdit(scope.$index, scope.row)">账户信息</el-button>
                     <el-button size="small" @click="handleEdit(scope.$index, scope.row)">二维码</el-button> -->
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('orginfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="orginfoForm" auto-complete="off">
                <el-form-item label="机构全称" :label-width="formLabelWidth" prop="orgFullName">
                    <el-input v-model="formdata.orgFullName"></el-input>
                </el-form-item>
                <el-form-item label="上传图片" :label-width="formLabelWidth" prop="">
                    <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="imguploaddata">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="上级机构" :label-width="formLabelWidth" prop="parentId">
                            <el-select v-model="formdata.parentId" placeholder="请选择上级机构" filterable>
                                <el-option v-for="item in tableData" :key="item.orgId" :label="item.orgFullName" :value="item.orgId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="医院等级" :label-width="formLabelWidth" prop="orgLevel">
                            <el-select v-model="formdata.orgLevel" placeholder="请选择医院等级">
                                <el-option v-for="item in dictionary.orgLevel" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="机构介绍" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="formdata.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
                <el-form-item label="活动时间" required>
                    <el-row>
                        <el-col :span="11">
                            <el-form-item prop="date1">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-form-item prop="date2">
                                <el-time-picker type="fixed-time" placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="活动性质" prop="type">
                    <el-checkbox-group v-model="ruleForm.type">
                        <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                        <el-checkbox label="地推活动" name="type"></el-checkbox>
                        <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                        <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <!-- <Area-Text v-on:getareadata="getareadata" :defaultarea="defaultarea"></Area-Text> -->
                <el-form-item label="特殊资源" prop="resource">
                    <el-radio-group v-model="ruleForm.resource">
                        <el-radio label="线上品牌商赞助"></el-radio>
                        <el-radio label="线下场地免费"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal('orginfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('orginfoForm')">确 定</el-button>
            </div>
           
        </el-dialog>
    </div>
</template>
<script>

import {
    commonAjax, imguploadurl, imgview
}
// import AreaText from '../common/Area.vue';
export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
                // 列表常用的数据开始
                tableData: [],
                params: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    orgFullName: [{
                        required: true,
                        message: '请输入机构全称',
                        trigger: 'blur'
                    }],
                    province: [{
                        required: true,
                        message: '请选择省',
                        trigger: 'blur'
                    }],
                },
                imguploadurl: imguploadurl, //文件或者图片上传的url
                imguploaddata: "",
                headers: { //文件或者图片上传的headers
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                imageUrl: "", //文件或者图片上传预览图片的src地址
                //字典查询数据
                dictionary: {
                    orgClassify: [], //机构分类base_organizationType
                    orgNature: [], //机构性质base_mechanismProperties
                    orgLevel: [], //机构等级base_organizationGrade
                },
                //传给地区组件的值                
                // defaultarea: { //地区组件父组件传值
                //     province: "",
                //     city: "",
                //     district: "",
                //     street: "",
                // },
            }
        },
        computed: {

        },
        methods: {
            //通用表单清除----------------------------------------------
            resetForm(formName) {
                    this.$refs[formName].resetFields();

                },
                //点击取消的时候
                closemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.dialogFormVisible = false;
                },
                //获取字典
                 dictionaryRequest() {
                    var that = this;
                    let arr = ["cfs.dic.base_organizationType", "cfs.dic.base_mechanismProperties", "cfs.dic.base_organizationGrade", "cfs.dic.base_reportType", "cfs.dic.base_inspectionReportType", "cfs.dic.base_objectType", "cfs.dic.base_svrOpenProperty", "cfs.dic.base_baseDataType"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        // 
                        if (res.code == 200) {
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.orgClassify = ele.items;
                                }
                                if (ele.dicId == arr[1]) {
                                    that.dictionary.orgNature = ele.items;
                                }
                                if (ele.dicId == arr[2]) {
                                    that.dictionary.orgLevel = ele.items;
                                }
                                if (ele.dicId == arr[3]) {
                                    that.dictionary.reportType = ele.items;
                                }
                                if (ele.dicId == arr[4]) {
                                    that.dictionary.medicalCombType = ele.items;
                                }
                                if (ele.dicId == arr[5]) {
                                    that.dictionary.objectType = ele.items;
                                }
                                if (ele.dicId == arr[6]) {
                                    that.dictionary.svrOpenProperty = ele.items;
                                }
                                if (ele.dicId == arr[7]) {
                                    that.dictionary.baseDataType = ele.items;
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
                // 列表常用的方法开始
                // 列表专用开始---------------------------------------------------
                //点击编辑的方法
                //获取列表数据
                getTableData() {
                    commonAjax("cas.sysOrganizationService", "list", '[' + JSON.stringify(this.params) + ']').then(res => {
                        if (res.code == 200) {
                            res.body.list.forEach(function(el, index) {
                                el.number = index + 1;
                            })
                            this.tableData = res.body.list;
                            this.total = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                handleEdit(index, row) {
                      this.dialogFormVisible = true;
                    if (row) {
                        this.dialogtitle = "编辑机构";
                        commonAjax("cas.sysOrganizationService", "getDetail", `['${row.orgId}']`).then(res => {

                            if (res.code == 200) {
                                this.formdata = res.body;
                                this.imageUrl = imgview + this.formdata.avatarField;
                                this.baiduMap(this.formdata.longitude, this.formdata.latitude);
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    } else {
                        this.imageUrl = "";
                      
                        this.dialogtitle = "新增机构";
                        this.formdata = {
                            orgId: "", //机构Id,新增时候不传
                            consultNo: "", //咨询电话
                            orgFullName: "", //机构全称
                            fax: "", //传真
                            orgAddress: "", //机构地址
                            orgShortName: "", //简称
                            street: "", //街道编码
                            emergencyNo: "", //紧急电话
                            medicalOrgId: "", //机构医保局id
                            postcode: "", //邮政编码
                            localOrgId: "", //机构代码
                            city: "", //地址（市）
                            avatarField: "", //机构照片地址id
                            parentId: "", //上级机构Id
                            orgNature: "", //机构性质
                            trafficDesc: "", //交通说明
                            province: "", //地址（省）
                            orgClassify: "", //机构分类
                            longitude: "", //经度
                            latitude: "", //维度
                            district: "", //地址（区、县）
                            orgLevel: "", //机构级别
                            parentOrgName: "",
                        }
                    }
                    
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
                                message: "取消删除"
                            });
                        } else {
                            let params = `[${row.id}]`;
                            commonAjax("cas.orgService", "deleteOrgLayout", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.navgetTableData();
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
                //列表专用结束------------------------------------------------------------------------------------

                // 表单常用的方法开始-----------------------------------------------------------------------
                //保存按钮提交数据
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {

                            commonAjax("cas.sysOrganizationService", "saveOrg", '[' + JSON.stringify(this.formdata) + ']').then(res => {

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
                            // alert('submit!');
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
              

                //图片专用------------------------------------
                //上传文件或者图片成功后
                handleAvatarSuccess(res, file) {
                    this.imageUrl = imgview + res.id;
                    this.formdata.avatarField = res.id;
                    this.loading.close();
                },
                //上传上传文件或者图片之前
                beforeAvatarUpload(file) {

                },

                // 表单常用的方法结束--------------------------------------------------------------------------

                // 获取地区信息代码绑定地区插件用------------------------------------------
                // getareadata(editarea) {
                //     this.formdata.province = editarea.province;
                //     this.formdata.city = editarea.city;
                //     this.formdata.district = editarea.district;
                //     this.formdata.street = editarea.street;
                // },


        },
        components: {
            // AreaText
        },
        mounted() {
            this.getTableData();
            this.dictionaryRequest();
        },
        // beforeRouteEnter(to, from, next) { //进入组件之前就赋值给地区组件
        //     next(vm => {
        //         vm.defaultarea = {
        //             province: this.orgOption.province,
        //             city: this.orgOption.city,
        //             district: this.orgOption.district,
        //             street: this.orgOption.street,
        //         };
        //     })
        // }

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
    float: right;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 89px;
    height: 89px;
    line-height: 89px;
    text-align: center;
}

.avatar {
    width: 89px;
    height: 89px;
    display: block;
}

.el-upload--text {
    width: 90px;
    height: 90px;
}

#allmap {
    /*width: 900px;*/
    height: 400px;
    overflow: hidden;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}
</style>
