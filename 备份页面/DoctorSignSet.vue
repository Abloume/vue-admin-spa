<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>家医签约配置</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <el-tabs type="card" :active-name="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="基础配置" name="baseset" class="eltabpane">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <!-- 标题 -->
                        <div class="commontit">
                            <h2>基础数据</h2>
                        </div>
                        <div class="left-con">
                            基础数据
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="commontit">
                            <h2>配置面板</h2>
                        </div>
                        <div class="right-con">
                            配置面板
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="评价模板" name="evaluationtpl" class="eltabpane">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <!-- 标题 -->
                        <div class="commontit">
                            <h2>评价模板</h2>
                        </div>
                        <div class="left-con">
                            评价模板
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="commontit">
                            <h2>基础信息</h2>
                        </div>
                        <div class="right-con">
                            评价模板
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="健康指标" name="healthtypendicators" class="eltabpane">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <!-- 标题 -->
                        <div class="commontit">
                            <h2>健康指标类型</h2>
                        </div>
                        <div class="left-con">
                            <el-row class="commonrow" v-for="(item,index) in healthtypelist" :class="{selectrow:item.selected}" @click.native="selecthealthtype(item)">
                                <el-col :span="12">
                                    <p>{{item.typeName}}</p>
                                </el-col>
                                <el-col :span="12" class="tr">
                                    <el-button @click="delehealthtype(item)" size="small" type="danger" class="fr">删除</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="commontit">
                            <h2>基础信息</h2>
                        </div>
                        <div class="right-con">
                            <el-row class="commonrow">
                                <el-col :span="4" class="tr">
                                    <p>名称：</p>
                                </el-col>
                                <el-col :span="18">
                                    <p>{{curhealthtypeformdata.typeName}}</p>
                                </el-col>
                            </el-row>
                            <el-row class="commonrow">
                                <el-col :span="4" class="tr">
                                    <p>启用状态：</p>
                                </el-col>
                                <el-col :span="18">
                                    <p class="orange">{{curhealthtypeformdata.status==0?"已禁用":"已启用"}}</p>
                                </el-col>
                            </el-row>
                            <el-row class="commonrow">
                                <el-col :span="4" class="tr">
                                    <p>代码</p>
                                </el-col>
                                <el-col :span="18">
                                    <p>{{curhealthtypeformdata.typeCode}}</p>
                                </el-col>
                            </el-row>
                            <el-row class="commonrow">
                                <el-col :span="4" class="tr">
                                    <p>单位</p>
                                </el-col>
                                <el-col :span="18">
                                    <p>{{curhealthtypeformdata.hpiUnit}}</p>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="commontit">
                            <h2>健康指标<span>(填入的数值在系统中允许等于)</span></h2>
                        </div>
                        <div class="right-con">
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="续约提醒" name="renewalreminder" class="eltabpane">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <!-- 标题 -->
                        <div class="commontit">
                            <h2>提醒时间</h2>
                        </div>
                        <div class="left-con">
                            提醒时间
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="commontit">
                            <h2>基础信息</h2>
                        </div>
                        <div class="right-con">
                            续约提醒
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="通知模板" name="notificationtpl" class="eltabpane">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <!-- 标题 -->
                        <div class="commontit">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <h2>通知模板</h2></el-col>
                                <el-col :span="12">
                                    <el-button @click="addNote" size="small" type="info" class="fr">添加</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="left-con">
                            <el-row class="commonrow" v-for="(item,index) in notelist" :class="{selectrow:item.selected}" @click.native="selectnote(item)">
                                <el-col :span="12">
                                    <p>{{item.notificationName}}</p>
                                </el-col>
                                <el-col :span="12" class="tr">
                                    <el-button @click="deleNote(item)" size="small" type="danger" class="fr">删除</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="commontit">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <h2>基础信息</h2></el-col>
                                <el-col :span="12">
                                    <el-button size="small" type="primary" @click="editNote" class="fr">编辑</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="right-con">
                            <el-row class="commonrow">
                                <el-col :span="4" class="tr">
                                    <p>模板名称：</p>
                                </el-col>
                                <el-col :span="18">
                                    <p>{{curnoteformdata.notificationName}}</p>
                                </el-col>
                            </el-row>
                            <el-row class="commonrow">
                                <el-col :span="4" class="tr">
                                    <p>启用状态：</p>
                                </el-col>
                                <el-col :span="18">
                                    <p class="orange">{{curnoteformdata.notificationName==0?"已禁用":"已启用"}}</p>
                                </el-col>
                            </el-row>
                            <el-row class="commonrow">
                                <el-col :span="4" class="tr">
                                    <p>模板类别：</p>
                                </el-col>
                                <el-col :span="18">
                                    <p>{{curnoteformdata.businessTypeText}}</p>
                                </el-col>
                            </el-row>
                            <el-row class="commonrow">
                                <el-col :span="4" class="tr">
                                    <p>提醒内容：</p>
                                </el-col>
                                <el-col :span="18">
                                    <p v-html="curnoteformdata.content"></p>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <!-- 通知模板编辑和添加 -->
        <el-dialog :title="dialogtitle" v-model="notedialog" @close="resetForm('noteForm')">
            <el-form :model="noteformdata" :rules="noteformrules" ref="noteForm" auto-complete="off" id="noteForm">
                <el-form-item label="模板名称" :label-width="formLabelWidth" prop="notificationName">
                    <el-input v-model="noteformdata.notificationName"></el-input>
                </el-form-item>
                <el-form-item label="通知类别" :label-width="formLabelWidth" prop="businessType">
                    <el-select v-model="noteformdata.businessType" placeholder="请选择">
                        <el-option v-for="item in notetypelist" :key="item.businessType" :label="item.businessName" :value="item.businessType">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
                    <el-select v-model="noteformdata.status">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提醒内容" :label-width="formLabelWidth" prop="content">
                    <quill-editor ref="myTextEditor" v-model="noteformdata.content" :config="editorOption" @showImageUI="imageHandler" @change="onEditorChange">
                    </quill-editor>
                    <!-- 必须带上这个input 上传图片用-->
                    <input type="file" name="file" id="fileinput" @change="customimgupload($event)" style="display:none">
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot" v-show="!isedit">
                <el-button @click="noteclosemodal('noteForm')">取 消</el-button>
                <el-button type="primary" @click="notesubmitForm('noteForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, imguploadAjax, imgview
}
from '../../api/api';
import quillEditor from '../common/editor.vue';
export default {
    data() {
            return {
                //通用
                formLabelWidth: '120px',
                activeName: "baseset",
                //字典请求
                dictionary: {
                    departmentType: {}, //
                },
                dialogtitle: "",
                //通知模板开始-----------------------------------------------------------------------------------------------
                notelist: [],
                notetypelist: [],
                noteformdata: {
                    "notificationDefineId": "",
                    "businessType": "",
                    "content": "",
                    "notificationName": "",
                    "status": "",
                    businessTypeText: "",
                },
                curnoteformdata: {
                    "notificationDefineId": "",
                    "businessType": "",
                    "content": "",
                    "notificationName": "",
                    "status": "",
                    businessTypeText: "",
                },
                // 表单验证
                noteformrules: {
                    notificationName: [{
                        required: true,
                        message: '请输入模板名称',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请输入提醒内容',
                        trigger: 'blur'
                    }],
                },
                notedialog: false,
                //健康指标开始------------------------------------------------------------------------------------------------
                healthtypelist: [],
                healthtypeformdata: {
                    "status": "",
                    "typeCode": "",
                    "typeId": "",
                    "typeName": "",
                    "hpiUnit": ""


                },
                curhealthtypeformdata: {
                    "status": "",
                    "typeCode": "",
                    "typeId": "",
                    "typeName": "",
                    "hpiUnit": ""
                },

            }
        },
        computed: {

        },
        methods: {
            //tab切换
            tabHandleClick(tab, event) {
                    this.activeName = tab.name;
                    if (tab.name == "notificationtpl") {
                        this.getNotelist()
                    } else if (tab.name == "healthtypendicators") {
                        this.gethealthtypelist();
                    } else {

                    }
                },
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                },

                //字典请求
                // dictionaryRequest() {
                //     let arr = ["cfs.dic.base_departmentType"];
                //     commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then((res) => {
                //         if (res.code == 200) {
                //             var that = this;
                //             $.each(res.body, function(index, el) {
                //                 if (el.dicId == arr[0]) {
                //                     that.dictionary.departmentType = el.items;
                //                 }
                //             });
                //         } else {
                //             this.$message({
                //                 type: 'error',
                //                 message: res.msg
                //             });
                //         }
                //     });
                // },
                //通知模板开始----------------------------------------------------------------
                //选中列表中的一条数据
                selectnote(item) {
                    this.noteformdata = item;
                    this.curnoteformdata = item;
                    $.each(this.notelist, function(index, el) {
                        el.selected = false
                        if (item.notificationDefineId == el.notificationDefineId) {
                            el.selected = true
                        }

                    }.bind(this));
                },
                // 新增通知模板
                addNote() {
                    alert(1111);
                    this.notedialog = true;
                    this.dialogtitle = "新增通知模板";
                    this.noteformdata = {
                        "businessType": "",
                        "content": "",
                        "notificationName": "",
                        "status": "",
                        businessTypeText: "",
                    }
                },
                // 编辑通知模板
                editNote() {
                    this.notedialog = true;
                    this.dialogtitle = "编辑通知模板";

                },
                // 删除通知模板
                deleNote(item) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, item.notificationName)
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
                            let params = `[${item.notificationDefineId}]`;
                            commonAjax("cas.baseNotificationDefService", "baseNotificationDefListDeleted", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.getNotelist();
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
                noteclosemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.notedialog = false;
                },
                //获取通知模板列表
                getNotelist() {
                    commonAjax("cas.baseNotificationDefService", "baseNotificationDefList", '[]').then((res) => {
                        if (res.code == 200) {
                            
                            $.each(res.body, function(index, el) {
                                el.selected = false
                                if (index == 0) {
                                    el.selected = true
                                }

                            }.bind(this));
                            this.notelist = res.body;
                            this.noteformdata = res.body[0];
                            this.curnoteformdata = res.body[0];
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取通知类别
                getNotetypelist() {
                    commonAjax("cas.baseNotificationDefService", "baseNotificationTypeList", '[]').then((res) => {
                        if (res.code == 200) {
                            this.notetypelist = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //保存按钮提交数据
                notesubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.baseNotificationDefService", "saveBaseNotificationDef", '[' + JSON.stringify(this.noteformdata) + ']').then(res => {

                                if (res.code == 200) {
                                    this.notedialog = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.getNotelist();
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
                // 编辑器内容变化触发
                onEditorChange({
                    editor, html, text
                }) {
                    // this.content = html;
                    // console.log(this.content);
                },
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


                },
                // 健康指标开始---------------------------------------------------------------------------------------
                //获取健康类型列表
                gethealthtypelist() {
                    commonAjax("cas.hpiManageService", "hpiTypeAll", '[]').then((res) => {
                        if (res.code == 200) {
                            if (res.body.length > 0) {
                                $.each(res.body, function(index, el) {
                                    el.selected = false
                                    if (index == 0) {
                                        el.selected = true
                                    }

                                }.bind(this));
                                this.healthtypelist = res.body;
                                this.healthtypeformdata = res.body[0];
                                this.curhealthtypeformdata = res.body[0];
                            }

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //选中列表中的一条数据
                selecthealthtype(item) {
                    this.healthtypeformdata = item;
                    this.curhealthtypeformdata = item;
                    $.each(this.healthtypelist, function(index, el) {
                        el.selected = false
                        if (item.typeId == el.typeId) {
                            el.selected = true
                        }

                    }.bind(this));
                },

                delehealthtype(item) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, item.typeName)
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
                            let params = `[${item.typeId}]`;
                            commonAjax("cas.hpiManageService", "deleteHpiType", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.gethealthtypelist();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg
                                    });
                                }
                            });
                        }

                    })
                }

        },
        components: {
            quillEditor
        },
        mounted() {

            this.getNotetypelist() //获取通知类型
                //字典请求
                // this.dictionaryRequest();
        },


}
</script>
<style type="text/css" scoped>
.left-con,
.right-con {
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 10px;
    font-size: 14px
}

.left-con .commonrow:hover {
    cursor: pointer;
}

.fr {
    float: right;
}

.tr {
    text-align: right;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.commonrow {
    line-height: 30px;
    padding: 10px;
}

.selectrow {
    background: rgb(228, 240, 241);
    color: #FF763C;
}

.orange {
    color: #FF763C;
}
</style>
