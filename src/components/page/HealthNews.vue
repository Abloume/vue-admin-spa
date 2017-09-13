<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>健康宣教</el-breadcrumb-item>
                        <el-breadcrumb-item>健康资讯</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="18">
                    <el-select v-model="params.category" placeholder="请选择类别">
                        <el-option label="全部" value="0"></el-option>
                        <el-option v-for="item in typetableData" :key="item.tagCode" :label="item.tagName" :value="item.tagCode">
                        </el-option>
                    </el-select>
                    <el-select v-model="params.newsStatus" placeholder="状态">
                        <el-option label="全部" value="3"></el-option>
                        <el-option label="已发布" value="1"></el-option>
                        <el-option label="未发布" value="0"></el-option>
                    </el-select>
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
                <el-col :span="6" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit">添加资讯</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="title" label="资讯标题">
            </el-table-column>
            <el-table-column prop="tagName" label="类别">
            </el-table-column>
            <el-table-column prop="created" label="保存时间">
            </el-table-column>
            <el-table-column prop="readCount" label="阅读量">
            </el-table-column>
            <el-table-column prop="praiseCount" label="点赞数">
            </el-table-column>
            <el-table-column prop="collectCount" label="收藏数">
            </el-table-column>
            <el-table-column prop="shareCount" label="分享数">
            </el-table-column>
            <el-table-column prop="newsStatus" label="状态">
                <template scope="scope">
                    <p v-show="scope.row.newsStatus==1">已经发布</p>
                    <p v-show="scope.row.newsStatus==0">未发布</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="260">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'look')" v-if=" scope.row.newsStatus==1">查看</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'edit')" v-if="scope.row.newsStatus==0">编辑</el-button>
                    <el-button size="small" type="success" @click="publish(scope.$index, scope.row)" v-if=" scope.row.newsStatus==0">发布</el-button>
                    <el-button size="small" type="danger" @click="publish(scope.$index, scope.row)" v-if=" scope.row.newsStatus==1">取消发布</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if=" scope.row.newsStatus==0">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <el-form-item label="资讯标题" :label-width="formLabelWidth" prop="title">
                    <el-input v-model="formdata.title" :disabled="islook"></el-input>
                </el-form-item>
                <el-form-item label="资讯标题图片" :label-width="formLabelWidth" prop="">
                    <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="imguploaddata"  :disabled="islook">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="资讯类别" :label-width="formLabelWidth" prop="category">
                    <el-select v-model="formdata.category" placeholder="请选择"  :disabled="islook">
                        <el-option v-for="item in typetableData" :key="item.tagCode" :label="item.tagName" :value="item.tagCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适合人群" :label-width="formLabelWidth" prop="peopleClassifyIds">
                    <el-select v-model="formdata.peopleClassifyIds" multiple filterable allow-create placeholder="请选择标签" :disabled="islook">
                        <el-option v-for="item in dictionary.peopleClassify" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资讯内容" :label-width="formLabelWidth" prop="newsdesc" >
                    <quill-editor ref="myTextEditor" v-model="formdata.newsdesc" :config="editorOption" @showImageUI="imageHandler" @change="onEditorChange">
                    </quill-editor>
                    <!-- 必须带上这个input 上传图片用-->
                    <input type="file" name="file" id="fileinput" @change="customimgupload($event)" style="display:none">
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot" v-show="!islook">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, imguploadurl, imgview, imguploadAjax
}
from '../../api/api';
import quillEditor from '../common/editor.vue';
export default {
    data() {
            return {
                // 通用
                formLabelWidth: '120px',
                date1: "",
                // 列表常用的数据开始
                editorOption: {
                    placeholder: '',
                    theme: 'snow',
                },
                tableData: [],
                params: {
                    category: "0",
                    newsStatus: "3",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                // 表单数据开始
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "id": 0, //健康资讯id,当为新增时不传,修改时必传
                    "title": "", //标题
                    "category": 0, //资讯类型
                    "listpic": "", //列表图片
                    "newsdesc": "", //详细描述
                    "peopleClassifyIds": [], //人群分类id
                    "peopleClassifyNames": [] //人群分类
                },
                imguploaddata: {
                    catalog: "consult"
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
                headers: { //文件或者图片上传的headers
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                imageUrl: "", //文件或者图片上传预览图片的src地址
                //字典查询数据
                dictionary: {
                    peopleClassify: [], //资讯类别

                },
                typetableData: [],
                fileformdata: "",
                islook:true
            }
        },
        computed: {
            editor() {
                return this.$refs.myTextEditor.quillEditor;
            }
        },
        methods: {
            // 列表常用的方法开始
            //点击编辑的方法
            handleEdit(index, row,str) {
                    if (row) {
                        this.dialogFormVisible = true;
                        this.dialogtitle = "编辑新闻";
                        if(str=='look'){
                            this.islook=true
                        }else{
                            this.islook=false
                        }
                        commonAjax("cas.healthNewService", "getHealthNews", `[${row.id}]`, ).then(res => {
                            if (res.code == 200) {
                                this.formdata = {
                                    "id": res.body.id, //健康资讯id,当为新增时不传,修改时必传
                                    "title": res.body.title, //标题
                                    "category": res.body.category+"", //资讯类型
                                    "listpic": res.body.listpic, //列表图片
                                    "newsdesc": res.body.newsdesc, //详细描述
                                    "peopleClassifyIds": res.body.peopleClassifyIds.split(","), //人群分类id
                                    "peopleClassifyNames": [], //人群分类
                                }

                                this.imageUrl = imgview + this.formdata.listpic;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });

                    } else {
                        this.islook=false;
                        this.imageUrl = "";
                        this.dialogFormVisible = true;
                        this.dialogtitle = "新增广告";
                        this.formdata = {
                            "id": undefined, //健康资讯id,当为新增时不传,修改时必传
                            "title": "", //标题
                            "category": "", //资讯类型
                            "listpic": "", //列表图片
                            "newsdesc": "", //详细描述
                            "peopleClassifyIds": [], //人群分类id
                            "peopleClassifyNames": [] //人群分类
                        }
                        this.imageUrl = "";
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
                                }, row.title)
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
                                commonAjax("cas.healthNewService", "deleteHealthNews", params).then(res => {
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
                publish(index, row) {
                    let status = row.newsStatus == 1 ? 0 : 1;
                                let params = `[${row.id},${status}]`;
                                commonAjax("cas.healthNewService", "updateNewsStatus", params).then(res => {
                                    if (res.code == 200) {
                                        this.$message({
                                            type: 'success',
                                            message: "修改成功"
                                        });
                                        this.getTableData();
                                    } else {
                                        this.$message({
                                            type: 'error',
                                            message: res.msg
                                        });
                                    }
                                });
                },
                //获取搜索下拉框的资讯类别
                gettypeTableData() {
                    commonAjax("cas.healthNewService", "findList", '[]', ).then(res => {
                        if (res.code == 200) {
                            this.typetableData = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取列表数据
                getTableData() {
                    commonAjax("cas.healthNewService", "findHealthNewsList", "[" + JSON.stringify(this.params) + "]").then(res => {
                        if (res.code == 200) {
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
                //搜索按钮点击
                searchClick() {
                    this.getTableData();
                },
                // 列表常用的方法结束-------------------------------------------------------------------------------
                // 表单常用的方法开始
                //保存按钮提交数据
                submitForm(formName) {
                    console.log(this.formdata);
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            var that = this;
                            $.each(this.formdata.peopleClassifyIds, function(index, el) {
                                $.each(that.dictionary.peopleClassify, function(index2, el2) {
                                    if (el == el2.key) {
                                        that.formdata.peopleClassifyNames.push(el2.text)
                                    }
                                });
                            });
                            this.formdata.peopleClassifyNames = this.formdata.peopleClassifyNames.join(",");
                            this.formdata.peopleClassifyIds = this.formdata.peopleClassifyIds.join(",");
                            commonAjax("cas.healthNewService", "saveOrUpdateHealthNews", '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
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
                    this.formdata.listpic = res.body;
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
                    let arr = ["cfs.dic.base_group"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            var that = this;
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.peopleClassify = ele.items;
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
                onEditorChange({
                    editor, html, text
                }) {
                    // this.content = html;
                    // console.log(this.content);
                },

                // changeedit() {
                //     this.editor.enable(true);

                // },
                imageHandler() {
                    fileinput.click();
                },
                customimgupload() {
                    // var that=this;
                    var formData = new FormData();
                    formData.append('file', fileinput.files[0]);
                    if (fileinput.files[0]) {
                        imguploadAjax(formData).then(res => {
                            var imageUrl = `${imgview+res.body}`
                            var range = this.$refs.myTextEditor.quillEditor.getSelection();
                            var length = range.index;
                            this.$refs.myTextEditor.quillEditor.insertEmbed(length, 'image', imageUrl);
                        }).catch(err => {
                            console.log(err)
                        })
                    }


                }

        },
        components: {
            quillEditor
        },
        mounted() {
            this.getTableData();
            this.gettypeTableData();
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
