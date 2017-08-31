<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="18">
                    <el-select v-model="params.bannerPostion" placeholder="请选择广告位置">
                        <el-option v-for="item in dictionary.bannerPostion" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                    <el-select v-model="params.proCode" placeholder="请选择产品">
                        <el-option v-for="item in protableData" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                    <el-select v-model="params.isEnable" placeholder="启用情况">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
                <el-col :span="6" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit">添加广告</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="productName" label="产品">
            </el-table-column>
            <el-table-column prop="positionText" label="广告位置">
            </el-table-column>
            <el-table-column prop="name" label="广告名称">
            </el-table-column>
            <el-table-column prop="linkTypeText" label="连接类型">
            </el-table-column>
            <el-table-column prop="valid_startDate" label="开始有效期">
            </el-table-column>
            <el-table-column prop="valid_endDate" label="结束有效期">
            </el-table-column>
            <el-table-column prop="defaultFlag" label="是否默认">
                <template scope="scope">
                    <p v-show="scope.row.defaultFlag==1">是</p>
                    <p v-show="scope.row.defaultFlag==0">否</p>
                </template>
            </el-table-column>
            <el-table-column prop="hitCount" label="点击统计" >
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if=" scope.row.status==1">禁用</el-button>
                    <el-button size="small" type="success" @click="handleDelete(scope.$index, scope.row)" v-if=" scope.row.status==0">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-form-item label="app名称" :label-width="formLabelWidth" prop="productCode">
                    <el-select v-model="formdata.productCode" placeholder="请选择" >
                        <el-option v-for="item in protableData" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="formdata.name"></el-input>
                </el-form-item>
                <el-form-item label="广告位置" :label-width="formLabelWidth" prop="position">
                    <el-select v-model="formdata.position" placeholder="请选择">
                        <el-option v-for="item in dictionary.bannerPostion" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传图片" :label-width="formLabelWidth" prop="picture">
                    <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="imguploaddata">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="链接类型" :label-width="formLabelWidth" prop="linkType">
                    <el-select v-model="formdata.linkType" placeholder="请选择">
                        <el-option v-for="item in dictionary.hyperLink" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="链接地址" :label-width="formLabelWidth" prop="linkAddress">
                    <el-input v-model="formdata.linkAddress"></el-input>
                </el-form-item>
                <el-form-item label="正文" :label-width="formLabelWidth" prop="linkText">
                    <el-input v-model="formdata.linkText" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
                <el-form-item label="默认标识" prop="defaultFlag" :label-width="formLabelWidth">
                    <el-radio-group v-model="formdata.defaultFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="valid_startDate" label="开始日期" required :label-width="formLabelWidth">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formdata.valid_startDate" style="width: 100%;" @change="dateformat" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item prop="valid_endDate" label="结束日期" required :label-width="formLabelWidth">
                    <el-date-picker type="date" format="yyyy-MM-dd" placeholder="选择日期" v-model="formdata.valid_endDate" style="width: 100%;" @change="dateformat2"></el-date-picker>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth" prop="orderNo">
                    <el-input v-model="formdata.orderNo"></el-input>
                </el-form-item>
                <el-form-item label="广告备注" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="formdata.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, imguploadurl, imgview
}
from '../../api/api';
export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
                // 列表常用的数据开始
                tableData: [],
                params: {
                    bannerPostion: "",
                    proCode: "",
                    isEnable: "1",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "productCode": "", //产品编码
                    "name": "", //广告名称
                    "position": "", //广告位置
                    "linkType": "", //链接类型
                    "linkAddress": "", //链接地址
                    "linkText": "", //链接文本
                    "defaultFlag": "", //默认标识
                    "valid_startDate": "",
                    "valid_endDate": "", //结束日期 格式yyyy-MM-dd
                    "orderNo": 0, //排序
                    "description": "", //备注
                    id: 0,
                    "picture":0,
                },
                imguploaddata: {
                    catalog: "banner"
                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    productCode: [{
                        required: true,
                        message: '请选择产品名称',
                       
                    }],
                    name: [{
                        required: true,
                        message: '请输入广告名称',
                        trigger: 'blur'
                    }],
                    position: [{
                        required: true,
                        message: '请选择广告位置',
                       
                    }],
                    linkType: [{
                        required: true,
                        message: '请选择链接类型',
                       
                    }],
                    linkAddress: [{
                        required: true,
                        message: '请输入链接地址',
                       
                    }],
                    picture: [{
                        required: true,
                        message: '请上传图片',
                       
                    }],
                    valid_startDate: [{
                        required: true,
                        message: '请选择开始日期',
                       
                    }],
                    valid_endDate: [{
                        required: true,
                        message: '请选择结束日期',
                       
                    }],
                },
                imguploadurl: imguploadurl, //文件或者图片上传的url
                headers: { //文件或者图片上传的headers
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                imageUrl: "", //文件或者图片上传预览图片的src地址
                //字典查询数据
                dictionary: {
                    bannerPostion: [], //广告位置
                    hyperLink: [], //链接类型
                },
                protableData: [],
                fileformdata: "",
            }
        },
        computed: {

        },
        methods: {
            // 列表常用的方法开始
            //点击编辑的方法
            dateformat(val) {
                    this.formdata.valid_startDate = val
                },
                dateformat2(val) {
                    this.formdata.valid_endDate = val
                },
                handleEdit(index, row) {
                    this.dialogFormVisible = true;
                    if (row) {
                        this.dialogtitle = "编辑广告";
                        this.formdata = {
                            "id": row.id, //广告id
                            "productCode": row.productCode ? row.productCode : "", //产品编码
                            "name": row.name ? row.name : "", //广告名称
                            "position": row.position ? row.position : "", //广告位置
                            "linkType": row.linkType ? row.linkType : "", //链接类型
                            "linkAddress": row.linkAddress ? row.linkAddress : "", //链接地址
                            "linkText": row.linkText ? row.linkText : "", //链接文本
                            "defaultFlag": row.defaultFlag ? row.defaultFlag : "", //默认标识
                            "valid_startDate": row.valid_startDate ? row.valid_startDate : "",
                            "valid_endDate": row.valid_endDate ? row.valid_endDate : "", //结束日期 格式yyyy-MM-dd
                            "orderNo": row.orderNo ? row.orderNo : 0, //排序
                            "description": row.description ? row.description : "", //备注
                            "picture": row.picture ? row.picture : 0,
                        }
                         this.imageUrl = imgview + this.formdata.picture;

                    } else {
                        this.dialogtitle = "新增广告";
                        this.formdata = {
                            "productCode": "", //产品编码
                            "name": "", //广告名称
                            "position": "", //广告位置
                            "linkType": "", //链接类型
                            "linkAddress": "", //链接地址
                            "linkText": "", //链接文本
                            "defaultFlag": "", //默认标识
                            "valid_startDate": "",
                            "valid_endDate": "", //结束日期 格式yyyy-MM-dd
                            "orderNo": 0, //排序
                            "description": "", //备注
                            "id": 0,
                            "picture": "",
                        }
                         this.imageUrl = ""
                    }
                   
                },
                // 删除列表中的一条数据
                handleDelete(index, row) {
                    // this.$message.error('删除第' + (index + 1) + '行');
                    const h = this.$createElement;
                    this.$msgbox({
                            title: '确认删除',
                            message: h('p', null, [
                                h('span', null, '是否删除 '),
                                h('i', {
                                    style: 'color: teal'
                                }, row.name)
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
                                let params = `[${row.id}]`;
                                commonAjax("cas.productbannerService", "banProductbanner", params).then(res => {
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

                        })
                },
                //获取搜索下拉框的产品列表
                getproTableData() {
                    commonAjax("cas.productbannerService", "productList", '[]', ).then(res => {
                        if (res.code == 200) {
                            this.protableData = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取banner列表数据
                getTableData() {
                    var temparams = `['${this.params.bannerPostion}','${this.params.proCode}','${this.params.isEnable}',${this.params.pageNo},${this.params.pageSize}]`;
                    commonAjax("cas.productbannerService", "searchProductBannerList", temparams).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.list,function(index, el) {
                                el.valid_startDate=el.valid_startDate.substring(0,10)
                                el.valid_endDate=el.valid_endDate.substring(0,10)
                            }.bind(this));
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
                // 列表常用的方法结束-------------------------------------------------------------------------------
                // 表单常用的方法开始
                //保存按钮提交数据
                submitForm(formName) {
                    if(!this.formdata.picture){
                          this.$message({
                                        type: 'error',
                                        message:"请上传图片"
                                    });
                    }
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.productbannerService", "addAndUpdate", '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
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
                //上传文件或者图片成功后
                handleAvatarSuccess(res, file) {
                    this.imageUrl = imgview + res.body;
                    this.formdata.picture = res.body;
                     this.$message.success('上传成功');
                },
                //上传上传文件或者图片之前
                beforeAvatarUpload(file) {

                    // const isJPG = file.type === 'image/jpeg';
                    // const isLt2M = file.size / 1024 / 1024 < 2;

                    // if (!isJPG) {
                    //     this.$message.error('上传头像图片只能是 JPG 格式!');
                    // }
                    // if (!isLt2M) {
                    //     this.$message.error('上传头像图片大小不能超过 2MB!');
                    // }
                    // return isJPG && isLt2M;

                },
                //获取字典
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_bannerPostion", "cfs.dic.base_hyperLink"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            var that = this;
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.bannerPostion = ele.items;
                                }
                                if (ele.dicId == arr[1]) {
                                    that.dictionary.hyperLink = ele.items;
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

        },
        mounted() {
            this.getTableData();
            this.getproTableData();
            this.dictionaryRequest();
        },

}
</script>
<style type="text/css" scoped>
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

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}
.el-table td, .el-table th{padding: 5px;}

</style>
