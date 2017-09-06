<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>个性需求</el-breadcrumb-item>
                        <el-breadcrumb-item>医讯列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-row class="search_con" :gutter="20">
                    <el-col :span="6" class="addorg" :offset="18">
                        <el-button type="primary" icon="plus" @click="handleEdit">添加医讯</el-button>
                    </el-col>
                </el-row>
                <el-tabs type="card" :active-name="activeName" @tab-click="tabHandleClick">
                    <el-tab-pane label="当前生效" name="messagerecord" class="eltabpane">
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column prop="number" label="序号">
                            </el-table-column>
                            <el-table-column prop="orgFullName" label="发布医院">
                            </el-table-column>
                            <el-table-column prop="validBeginDate" label="生效日期">
                            </el-table-column>
                            <el-table-column prop="validEndDate" label="失效日期">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="历史记录" name="historymessagerecord" class="eltabpane">
                        <el-table :data="historytableData" border style="width: 100%">
                            <el-table-column prop="number" label="序号">
                            </el-table-column>
                            <el-table-column prop="orgFullName" label="发布医院">
                            </el-table-column>
                            <el-table-column prop="validBeginDate" label="生效日期">
                            </el-table-column>
                            <el-table-column prop="validEndDate" label="失效日期">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="historytotal" :page-sizes="[10,20,50]" @size-change="historyhandleSizeChange" @current-change="historyhandleCurrentChange" :page-size="historyparams.pageSize">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-form-item label="发布医院" :label-width="formLabelWidth" prop="orgFullName">
                    <el-select v-model="formdata.orgFullName" filterable placeholder="请选择机构名称" :disabled="isdisabled||isedit">
                        <el-option v-for="item in orglist" :key="item.orgId" :label="item.orgFullName" :value="item.orgFullName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传文件" :label-width="formLabelWidth" prop="">
                    <!--  <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="imguploaddata">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload> -->
                    <el-row>
                        <el-col :span="6">
                            <el-upload class="upload-demo" :action="imguploadurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" >
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-col>
                        <el-col :span="18">
                            <div class="el-upload__tip">仅支持office2003版本Excel上传，文件大小：小于1M</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <a v-show="fileName!=''" :href="filesrc">{{fileName}}</a>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="开始日期" required :label-width="formLabelWidth" prop="validBeginDate">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formdata.validBeginDate" style="width: 100%;" @change="dateformat" format="yyyy-MM-dd" :disabled="isdisabled"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" required :label-width="formLabelWidth" prop="validEndDate">
                    <el-date-picker type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="formdata.validEndDate" style="width: 100%;" @change="dateformat2" :disabled="isdisabled"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
                    <el-input v-model="formdata.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="isdisabled"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot" v-show="!isdisabled">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, imguploadurl, imgview,filedowned
}
from '../../api/api';
export default {
    data() {
            // 验证结束日期大于开始日期
            var checkvalidEndDate = (rule, value, callback) => {
                
                if(value==""){
                     return callback(new Error('请选择结束日期'));
                }else{
                   
                    if(this.formdata.validEndDate>this.formdata.validBeginDate){
                        callback();
                    }else{
                        return callback(new Error('结束日期必须大于开始日期'));
                    }
                    
                }
               
            }
            return {
                // 通用
                formLabelWidth: '120px',
                date1: "",
                // 列表常用的数据开始
                orglist: [],
                fileList3: [],
                tableData: [],
                params: {
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                // 列表历史数据开始
                historytotal: "",
                historytableData: [],
                historyparams: {
                    pageNo: 1,
                    pageSize: 10,
                },
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "orgFullName": "", //发布机构
                    "validBeginDate": "", //开始时间
                    "validEndDate": "", //结束时间
                    "fileId": "", //excel文件id
                    "remark": "", //备注
                    "recordId": 0 //记录id
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    validEndDate: [{
                        validator: checkvalidEndDate,
                      
                    }],
                    validBeginDate: [{
                        required: true,
                        message: '请选择开始日期',
                    }],
                },
                imguploadurl: imguploadurl, //文件或者图片上传的url
                headers: { //文件或者图片上传的headers
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                fileName: "", //文件名称
                filesrc:"",//文件的src地址
                isdisabled: false,
                activeName: "messagerecord",
                isedit:false
            }
        },
        computed: {

        },
        methods: {
            tabHandleClick(tab, event) {
                    this.activeName = tab.name;
                    if (this.activeName == "messagerecord") {
                        this.isdisabled = false;

                    } else {
                        this.isdisabled = true;
                    }
                },
                // 列表常用的方法开始
                dateformat(val) {
                    this.formdata.validBeginDate = val
                },
                dateformat2(val) {
                    this.formdata.validEndDate = val
                },
                //点击编辑的方法
                handleEdit(index, row) {
                    this.isedit=true;
                    if (row) {
                        this.dialogFormVisible = true;
                        this.dialogtitle = "查看医讯";

                        this.formdata = {
                            "orgFullName": row.orgFullName ? row.orgFullName : "", //发布机构
                            "validBeginDate": row.validBeginDate ? row.validBeginDate : "", //开始时间
                            "validEndDate": row.validEndDate ? row.validEndDate : "", //结束时间
                            "fileId": row.fileId ? row.fileId : "", //excel文件id
                            "remark": row.remark ? row.remark : "", //备注
                            "recordId": row.recordId //记录id
                        }
                        this.fileName = "下载文件";
                        this.filesrc = filedowned + this.formdata.fileId;
                      
                    } else {
                        this.isedit=false;
                        this.fileName = "";
                        this.dialogFormVisible = true;
                        this.dialogtitle = "新增医讯";
                        this.isdisabled = false;
                        this.formdata = {
                            "orgFullName": "", //发布机构
                            "validBeginDate": "", //开始时间
                            "validEndDate": "", //结束时间
                            "fileId": 0, //excel文件id
                            "remark": "", //备注
                            "recordId": 0 //记录id
                        }
                        this.filesrc = ""
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
                                let params = `[${row.recordId}]`;
                                commonAjax("cas.doctormessagerecordService", "deleteDoctormessagerecord", params).then(res => {
                                    if (res.code == 200) {
                                        this.$message({
                                            type: 'success',
                                            message: "删除成功"
                                        });
                                        if (this.activeName == "messagerecord") {
                                            this.getTableData();
                                        } else {
                                            this.historygetTableData()
                                        }
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
                //获取医讯有效列表数据
                getTableData() {
                    let {
                        pageNo, pageSize
                    } = this.params;
                    var temparams = `[${this.params.pageNo},${this.params.pageSize},false]`;
                    commonAjax("cas.doctormessagerecordService", "findDoctormessagerecords", temparams).then(res => {
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
                //获取历史列表数据
                historygetTableData() {
                     let {
                        pageNo, pageSize
                    } = this.params;
                    var temparams = `[${this.params.pageNo},${this.params.pageSize},true]`;
                    commonAjax("cas.doctormessagerecordService", "findDoctormessagerecords", temparams).then(res => {
                        if (res.code == 200) {
                             $.each(res.body.items, function(index, el) {
                                el.number = (index + 1) + (pageNo - 1) * pageSize;
                            });
                            this.historytableData = res.body.items;
                            this.historytotal = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //改变分页显示的数量
                historyhandleSizeChange(val) {
                    this.historyparams.pageSize = val;
                    this.historygetTableData()
                },
                //跳转到分页输入框中页码的页面
                historyhandleCurrentChange(val) {
                    this.historyparams.pageNo = val;
                    this.historygetTableData()
                },
                // 列表常用的方法结束-------------------------------------------------------------------------------
                // 表单常用的方法开始
                //保存按钮提交数据
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if(!this.filesrc){
                                this.$message({
                                        type: 'error',
                                        message: "请上传文件"
                                    });
                                return
                            }
                            commonAjax("cas.doctormessagerecordService", "addOrUpdateDoctormessagerecord", '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
                                if (res.code == 200) {
                                    this.dialogFormVisible = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    if (this.activeName == "messagerecord") {

                                        this.getTableData();
                                    } else {
                                        this.historygetTableData()
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
                    this.formdata.fileId = "";
                    this.fileName = "";
                },
                //点击模态框关闭或者取消的时候重置表单
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                     this.fileName = "";
                },
                //上传文件或者图片成功后
                handleAvatarSuccess(res, file) {
                    this.formdata.fileId = res.body;
                    this.$message.success('上传成功');
                    this.fileName = file.name;
                    this.filesrc = filedowned + this.formdata.fileId;

                },
                //上传上传文件或者图片之前
                beforeAvatarUpload(file) {
                    const isExcel = file.name.indexOf(".xlsx");
                    const isLt1M = file.size / 1024 / 1024 < 1;

                    if (!isExcel) {
                        this.$message.error('上传文件只能是.xlsx格式!');
                    }
                    if (!isLt1M) {
                        this.$message.error('上传头像图片大小不能超过1MB!');
                    }
                    return isExcel && isLt1M;

                },

                // 表单常用的方法结束--------------------------------------------------------------------------

        },
        components: {

        },
        watch: {

        },
        mounted() {
            this.getTableData();
            this.historygetTableData();
            let params = `[]`;
            commonAjax("cas.doctormessagerecordService", "getOrgListByTenantId", params).then(res => {
                if (res.code == 200) {
                    this.orglist = res.body;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
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

</style>
