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
                <el-table :data="basesetlist" border style="width: 100%">
                    <el-table-column prop="paramName" label="名称">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" @click="editbaseset(scope.$index, scope.row)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="评价模板" name="evaluationtpl" class="eltabpane">
                <el-row class="search_con" :gutter="20">
                    <el-col :span="4" class="addorg mb20" :offset="20">
                        <el-button type="primary" icon="plus" @click="editevaluationtpl">添加</el-button>
                    </el-col>
                </el-row>
                <el-table :data="evaluationtpllist" border style="width: 100%">
                    <el-table-column prop="defineTpName" label="评价模板名称">
                    </el-table-column>
                    <el-table-column prop="status" label="评价是否启用">
                        <template scope="scope">
                            <p v-show="scope.row.status==1">是</p>
                            <p v-show="scope.row.status==0">否</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="addEvaluationFlag" label="是否开启追评">
                        <template scope="scope">
                            <p v-show="scope.row.addEvaluationFlag==1">是</p>
                            <p v-show="scope.row.addEvaluationFlag==0">否</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inputFlag" label="首评是否启用输入框">
                        <template scope="scope">
                            <p v-show="scope.row.inputFlag==1">是</p>
                            <p v-show="scope.row.inputFlag==0">否</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="appendInputFlag" label="追评是否启用输入框">
                        <template scope="scope">
                            <p v-show="scope.row.appendInputFlag==1">是</p>
                            <p v-show="scope.row.appendInputFlag==0">否</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template scope="scope">
                            <el-button size="small" @click="editevaluationtpl(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="deleevaluationtpl(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="健康指标" name="healthtypendicators" class="eltabpane">
                <el-row class="search_con" :gutter="20">
                    <el-col :span="4" class="addorg mb20" :offset="20">
                        <el-button type="primary" icon="plus" @click="edithealthtype">添加</el-button>
                    </el-col>
                </el-row>
                <el-table :data="healthtypelist" border style="width: 100%">
                    <el-table-column prop="typeName" label="名称">
                    </el-table-column>
                    <el-table-column prop="typeCode" label="代码">
                    </el-table-column>
                    <el-table-column prop="hpiUnit" label="单位">
                    </el-table-column>
                    <el-table-column prop="status" label="启用状态">
                        <template scope="scope">
                            <p v-show="scope.row.status==1">是</p>
                            <p v-show="scope.row.status==0">否</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template scope="scope">
                            <el-button size="small" @click="edithealthtype(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="delehealthtype(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="续约提醒" name="renewalreminder" class="eltabpane">
                <el-row class="search_con" :gutter="20">
                    <el-col :span="4" class="addorg mb20" :offset="20">
                        <el-button type="primary" icon="plus" @click="editrenewal">添加</el-button>
                    </el-col>
                </el-row>
                <el-table :data="renewallist" border style="width: 100%">
                    <el-table-column prop="paramName" label="名称">
                    </el-table-column>
                    <el-table-column prop="status" label="启用状态">
                        <template scope="scope">
                            <p v-show="scope.row.status==1">是</p>
                            <p v-show="scope.row.status==0">否</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paramValue" label="提醒天数">
                    </el-table-column>
                    <el-table-column prop="mode" label="提醒方式">
                        <template scope="scope">
                            <p v-show="scope.row.mode==1">app消息</p>
                            <p v-show="scope.row.mode==2">手机短信</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="content" label="提醒内容">
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template scope="scope">
                            <el-button size="small" @click="editrenewal(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="delerenewal(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="通知模板" name="notificationtpl" class="eltabpane">
                <el-row class="search_con" :gutter="20">
                    <el-col :span="4" class="addorg mb20" :offset="20">
                        <el-button type="primary" icon="plus" @click="editNote">添加</el-button>
                    </el-col>
                </el-row>
                <el-table :data="notelist" border style="width: 100%">
                    <el-table-column prop="notificationName" label="名称">
                    </el-table-column>
                    <el-table-column prop="status" label="启用状态">
                        <template scope="scope">
                            <p v-show="scope.row.status==1">是</p>
                            <p v-show="scope.row.status==0">否</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="businessTypeText" label="模板类别">
                    </el-table-column>
                    <el-table-column prop="content" label="提醒内容">
                        <template scope="scope">
                            <p v-html="scope.row.content"></p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template scope="scope">
                            <el-button size="small" @click="editNote(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="deleNote(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
                    <!-- <quill-editor ref="myTextEditor" v-model="noteformdata.content" :config="editorOption" @showImageUI="imageHandler" @change="onEditorChange">
                    </quill-editor> -->
                    <el-input v-model="noteformdata.content" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                    <!-- 必须带上这个input 上传图片用-->
                    <!--  <input type="file" name="file" id="fileinput" @change="customimgupload($event)" style="display:none"> -->
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="noteclosemodal('noteForm')">取 消</el-button>
                <el-button type="primary" @click="notesubmitForm('noteForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 健康指标类型编辑和添加-->
        <el-dialog :title="dialogtitle" v-model="healthtypedialog" @close="resetForm('healthtypeForm')">
            <el-form :model="healthtypeformdata" :rules="healthtypeformrules" ref="healthtypeForm" auto-complete="off" id="healthtypeForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="typeName">
                    <el-input v-model="healthtypeformdata.typeName"></el-input>
                </el-form-item>
                <el-form-item label="代码" :label-width="formLabelWidth" prop="typeCode">
                    <el-input v-model="healthtypeformdata.typeCode" :disabled="healthtypeformdata.typeId"></el-input>
                </el-form-item>
                <el-form-item label="单位" :label-width="formLabelWidth" prop="hpiUnit">
                    <el-input v-model="healthtypeformdata.hpiUnit"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
                    <el-select v-model="healthtypeformdata.status">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <h2 class="account-title" v-show="healthtypeformdata.typeId">
                    <span>健康指标列表</span>
                      <el-button size="small" type="primary" @click="edithpi" icon="plus">添加健康指标</el-button>
                </h2>
                <el-table :data="hpilist" border style="width: 100%" v-show="healthtypeformdata.typeId" class="mb20">
                    <el-table-column prop="hpiName" label="名称">
                    </el-table-column>
                    <el-table-column prop="hpiCode" label="代码">
                    </el-table-column>
                    <el-table-column prop="upperLimit" label="上限">
                    </el-table-column>
                    <el-table-column prop="lowerLimit" label="下限">
                    </el-table-column>
                    <el-table-column prop="status" label="启用状态">
                        <template scope="scope">
                            <p v-show="scope.row.status==1">是</p>
                            <p v-show="scope.row.status==0">否</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" @click="edithpi(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="small" type="danger" @click="hpiDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="healthtypeclosemodal('healthtypeForm')">取 消</el-button>
                <el-button type="primary" @click="healthtypesubmitForm('healthtypeForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 健康指标编辑和添加-->
        <el-dialog :title="dialogtitle2" v-model="hpidialog" @close="resetForm('hpiForm')">
            <el-form :model="hpiformdata" :rules="hpiformrules" ref="hpiForm" auto-complete="off" id="hpiForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="hpiName">
                    <el-input v-model="hpiformdata.hpiName"></el-input>
                </el-form-item>
                <el-form-item label="代码" :label-width="formLabelWidth" prop="hpiCode">
                    <el-input v-model="hpiformdata.hpiCode" :disabled="hpiformdata.hpiId"></el-input>
                </el-form-item>
                <el-form-item label="上限" :label-width="formLabelWidth" prop="upperLimit">
                    <el-input v-model="hpiformdata.upperLimit"></el-input>
                </el-form-item>
                <el-form-item label="下限" :label-width="formLabelWidth" prop="lowerLimit">
                    <el-input v-model="hpiformdata.lowerLimit"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
                    <el-select v-model="hpiformdata.status">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="hpiclosemodal('hpiForm')">取 消</el-button>
                <el-button type="primary" @click="hpisubmitForm('hpiForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 评价模板编辑和添加-->
        <el-dialog :title="dialogtitle" v-model="evaluationtpldialog" @close="resetForm('evaluationtplForm')">
            <el-form :model="evaluationtplformdata" :rules="evaluationtplformrules" ref="evaluationtplForm" auto-complete="off" id="evaluationtplForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="defineTpName">
                    <el-input v-model="evaluationtplformdata.defineTpName"></el-input>
                </el-form-item>
                <el-form-item label="评价是否启用" :label-width="formLabelWidth" prop="status">
                    <el-select v-model="evaluationtplformdata.status">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否开启追评" :label-width="formLabelWidth" prop="addEvaluationFlag">
                    <el-select v-model="evaluationtplformdata.addEvaluationFlag">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="首评是否启用输入框" :label-width="formLabelWidth" prop="inputFlag">
                    <el-select v-model="evaluationtplformdata.inputFlag">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="追评是否启用输入框" :label-width="formLabelWidth" prop="appendInputFlag">
                    <el-select v-model="evaluationtplformdata.appendInputFlag">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <h2 class="account-title" v-show="evaluationtplformdata.id">
                    <span>评价项目列表</span>
                      <el-button size="small" type="primary" @click="editevaluation" icon="plus">添加评价项目</el-button>
                </h2>
                <el-tabs type="card" :active-name="activeName2" v-show="evaluationtplformdata.id" @tab-click="tabHandleClick2">
                    <el-tab-pane label="首评列表" name="fristevaluation" class="eltabpane">
                        <el-table :data="evaluationtlist" border style="width: 100%" class="mb20">
                            <el-table-column prop="content" label="评价内容">
                            </el-table-column>
                            <el-table-column prop="status" label="启用状态">
                                <template scope="scope">
                                    <p v-show="scope.row.status==1">是</p>
                                    <p v-show="scope.row.status==0">否</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" @click="editevaluation(scope.$index, scope.row)">编辑</el-button>
                                    <el-button size="small" type="danger" @click="evaluationDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="追评列表" name="secondevaluation" class="eltabpane">
                        <el-table :data="evaluationtlist2" border style="width: 100%" class="mb20">
                            <el-table-column prop="content" label="评价内容">
                            </el-table-column>
                            <el-table-column prop="status" label="启用状态">
                                <template scope="scope">
                                    <p v-show="scope.row.status==1">是</p>
                                    <p v-show="scope.row.status==0">否</p>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作">
                                <template scope="scope">
                                    <el-button size="small" @click="editevaluation(scope.$index, scope.row)">编辑</el-button>
                                    <el-button size="small" type="danger" @click="evaluationDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="evaluationtplclosemodal('evaluationtplForm')">取 消</el-button>
                <el-button type="primary" @click="evaluationtplsubmitForm('evaluationtplForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 评价项目编辑和添加-->
        <el-dialog :title="dialogtitle2" v-model="evaluationdialog" @close="resetForm('evaluationForm')">
            <el-form :model="evaluationformdata" :rules="evaluationformrules" ref="evaluationForm" auto-complete="off" id="evaluationForm">
                <el-form-item label="项目名称" :label-width="formLabelWidth" prop="content">
                    <el-input v-model="evaluationformdata.content"></el-input>
                </el-form-item>
                <el-form-item label="项目是否启用" :label-width="formLabelWidth" prop="status">
                    <el-select v-model="evaluationformdata.status">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="evaluationclosemodal('evaluationForm')">取 消</el-button>
                <el-button type="primary" @click="evaluationsubmitForm('evaluationForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 基础设置编辑和添加-->
        <el-dialog :title="dialogtitle" v-model="basesetdialog" @close="resetForm('basesetForm')">
            <el-form :model="basesetformdata" :rules="basesetformrules" ref="basesetForm" auto-complete="off" id="basesetForm">
                <el-form-item :label="baselabel" :label-width="formLabelWidth" prop="paramValue">
                    <el-input v-model="basesetformdata.paramValue"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="basesetclosemodal('basesetForm')">取 消</el-button>
                <el-button type="primary" @click="basesetsubmitForm('basesetForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 续约提醒的编辑和添加-->
        <el-dialog :title="dialogtitle" v-model="renewaldialog" @close="resetForm('renewalForm')">
            <el-form :model="renewalformdata" :rules="renewalformrules" ref="renewalForm" auto-complete="off" id="renewalForm">
                <el-form-item label="名称" :label-width="formLabelWidth" prop="paramName">
                    <el-input v-model="renewalformdata.paramName"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth" prop="status">
                    <el-select v-model="renewalformdata.status">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提前提醒天数" :label-width="formLabelWidth" prop="paramValue">
                    <el-input v-model="renewalformdata.paramValue"></el-input>
                </el-form-item>
                <el-form-item label="提醒方式" :label-width="formLabelWidth" prop="mode">
                    <el-select v-model="renewalformdata.mode">
                        <el-option label="app消息" value="1"></el-option>
                        <el-option label="手机短信" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提醒内容" :label-width="formLabelWidth" prop="content">
                    <el-input v-model="renewalformdata.content" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="renewalclosemodal('renewalForm')">取 消</el-button>
                <el-button type="primary" @click="renewalsubmitForm('renewalForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, imguploadAjax, imgview
}
from '../../api/api';
// import quillEditor from '../common/editor.vue';
export default {
    data() {
            // 提醒天数验证
            var reminderdays = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('提醒天数不能为空'));
                } else {
                    if (value.length > 6) {
                        return callback(new Error('最多只能6位'));
                    } else {
                        var g = /^[1-9]*[1-9][0-9]*$/;
                        if (g.test(value)) {
                            callback()
                        } else {
                            return callback(new Error('必须是正整数'));
                        }
                    }
                }
            };
            var checkbaseset = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入值'));
                } else {
                    if (this.basesetformdata.paramCode == "familyServiceAheadTimeLimit") {
                            var g =/^([1-9]\d{0,1}|100)$/;
                            if (g.test(value)) {
                                callback()
                            } else {
                                return callback(new Error('必须是1-100整数'));
                            }

                    } else {
                        if (value.length > 10) {
                            return callback(new Error('最多只能10位'));
                        } else {
                            var g = /^[1-9]*[1-9][0-9]*$/;
                            if (g.test(value)) {
                                callback()
                            } else {
                                return callback(new Error('必须是正整数'));
                            }
                        }
                    }


                }
            };

            return {
                //通用
                formLabelWidth: '160px',
                activeName: "baseset",
                //字典请求
                dictionary: {

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
                // 表单验证
                noteformrules: {
                    notificationName: [{
                        required: true,
                        message: '请输入模板名称',
                        trigger: 'blur'
                    }, {
                        max: 15,
                        message: '长度最大15个字符',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请输入提醒内容',
                        trigger: 'blur'
                    }, {
                        max: 150,
                        message: '长度最大150个字符',
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
                // 表单验证
                healthtypeformrules: {
                    typeCode: [{
                        required: true,
                        message: '请输入代码',
                        trigger: 'blur'
                    }],
                    typeName: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }],
                    hpiUnit: [{
                        required: true,
                        message: '请输入单位',
                        trigger: 'blur'
                    }],
                },
                healthtypedialog: false,
                dialogtitle2: "",
                hpidialog: false,
                hpiformdata: {
                    "hpiCode": "",
                    "hpiId": "",
                    "hpiName": "",
                    "status": "",
                    "typeId": "",
                    "upperLimit": "",
                    "lowerLimit": "",
                },
                // 表单验证
                hpiformrules: {
                    hpiCode: [{
                        required: true,
                        message: '请输入代码',
                        trigger: 'blur'
                    }],
                    hpiName: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }],
                    upperLimit: [{
                        required: true,
                        message: '请输入上限',
                        trigger: 'blur'
                    }],
                    lowerLimit: [{
                        required: true,
                        message: '请输入下限',
                        trigger: 'blur'
                    }],
                },
                hpilist: [],
                //评价模板开始------------------------------------------------------------------
                evaluationtpllist: [],
                evaluationtplformdata: {
                    "inputFlag": "", //首评是否启用输入框
                    "defineTpName": "", //评价模板名称
                    "tenantId": "", //租户
                    "addEvaluationFlag": "", //追评标志
                    "appendInputFlag": "", //追评是否启用输入框
                    "status": "", //是否启动
                    "id": "" //新增为0
                },
                // 表单验证
                evaluationtplformrules: {
                    defineTpName: [{
                        required: true,
                        message: '请输入评价模板名称',
                        trigger: 'blur'
                    }, {
                        max: 10,
                        message: '长度最大10个字符',
                        trigger: 'blur'
                    }],

                },
                evaluationtpldialog: false,
                curtenantId: sessionStorage.getItem("tenantId"),
                // 评价项目开始

                // 表单验证
                evaluationformrules: {
                    content: [{
                        required: true,
                        message: '请输入评价项目名称',
                        trigger: 'blur'
                    }, {
                        max: 10,
                        message: '长度最大10个字符',
                        trigger: 'blur'
                    }]
                },
                evaluationtlist: [], //新加的评价
                evaluationtlist2: [], //再次评价
                activeName2: "fristevaluation",
                evaluationformdata: {
                    "defineId": "", //满意度评价定义表id
                    "appendFlag": "", //追评标志：0首评 1追评
                    "content": "", //内容
                    "status": "", //状态 0.未启用 1.已启用
                    "itemId": 0 //新增为0
                },
                evaluationdialog: false,
                curitemindex: 0,
                //基础设置开始------------------------------------------------------------------------------------------
                basesetlist: [{
                    paramCode: "signAdditionalTimeLimit",
                    paramName: "签约补录时间",
                    "paramValue": "30"
                }, {
                    paramCode: "serviceRecordAdditionalTimeLimit",
                    paramName: "服务记录补录时间",
                    "paramValue": "30"
                }, {
                    paramCode: "canRemoveCount",
                    paramName: "可解约次数",
                    "paramValue": ""
                }, {
                    paramCode: "familyServiceAheadTimeLimit",
                    paramName: "家医服务提醒系数(%)",
                    "paramValue": ""
                }],
                basesetdialog: false,
                basesetformdata: {
                    "paramCode": "",
                    "paramValue": "",

                },
                basesetformrules: {
                    paramValue: [{
                        validator: checkbaseset,
                        trigger: 'blur'
                    }],
                },
                baselabel: "",
                //续约提醒---------------------------------------------------------------------------
                renewallist: [],
                renewalformdata: {
                    "content": "",
                    "mode": "",
                    "paramId": 0,
                    "paramName": "",
                    "paramValue": "",
                    "status": ""
                },
                // 表单验证
                renewalformrules: {
                    paramValue: [{
                        validator: reminderdays,
                        trigger: 'blur'
                    }],
                    paramName: [{
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    }, {
                        max: 15,
                        message: '长度最大15个字符',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请输入提醒内容',
                        trigger: 'blur'
                    }, {
                        max: 30,
                        message: '长度最大30个字符',
                        trigger: 'blur'
                    }],
                },
                renewaldialog: false,
            }
        },
        computed: {

        },
        methods: {
            //tab切换
            tabHandleClick(tab, event) {
                    this.activeName = tab.name;
                    if (tab.name == "notificationtpl" && this.notelist.length == 0) {
                        this.getNotelist();
                        this.getNotetypelist(); //获取通知类型
                    } else if (tab.name == "healthtypendicators" && this.healthtypelist.length == 0) {
                        this.gethealthtypelist();
                    } else if (tab.name == "evaluationtpl" && this.evaluationtpllist.length == 0) {
                        this.getevaluationtpllist();
                    } else if (tab.name == "renewalreminder" && this.renewallist.length == 0) {
                        this.getrenewallist();
                    }
                },
                tabHandleClick2(tab, event) {
                    this.activeName2 = tab.name;
                },
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                },


                //通知模板开始----------------------------------------------------------------
                // 编辑通知模板
                editNote(index, row) {
                    this.notedialog = true;
                    if (row) {
                        this.dialogtitle = "编辑通知模板";

                        this.noteformdata = {
                            "notificationDefineId": row.notificationDefineId,
                            "businessType": row.businessType,
                            "content": row.content,
                            "notificationName": row.notificationName,
                            "status": row.status,
                            businessTypeText: row.businessTypeText,
                        }

                    } else {
                        this.dialogtitle = "新增通知模板";
                        this.noteformdata = {
                            "notificationDefineId": undefined,
                            "businessType": "",
                            "content": "",
                            "notificationName": "",
                            "status": "1",
                            businessTypeText: ""
                        }
                    }

                },
                // 删除通知模板
                deleNote(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.notificationName)
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
                            let params = `[${row.notificationDefineId}]`;
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
                            this.notelist = res.body;
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
                // onEditorChange({
                //     editor, html, text
                // }) {
                //     // this.content = html;
                //     // console.log(this.content);
                // },
                // imageHandler() {
                //     fileinput.click();
                // },
                // customimgupload() {
                //     // var that=this;
                //     var formData = new FormData();
                //     formData.append('file', fileinput.files[0]);
                //     if (fileinput.files[0]) {
                //         imguploadAjax(formData).then(res => {
                //             var imageUrl = `${imgview+res.body}`
                //             var range = this.$refs.myTextEditor.quillEditor.getSelection();
                //             var length = range.index;
                //             this.$refs.myTextEditor.quillEditor.insertEmbed(length, 'image', imageUrl);
                //         }).catch(err => {
                //             console.log(err)
                //         })
                //     }
                // },
                // 健康指标开始---------------------------------------------------------------------------------------
                //获取健康类型列表
                gethealthtypelist() {
                    commonAjax("cas.hpiManageService", "hpiTypeAll", '[]').then((res) => {
                        if (res.code == 200) {

                            this.healthtypelist = res.body;


                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                edithealthtype(index, row) {
                    this.healthtypedialog = true;
                    if (row) {
                        this.dialogtitle = "编辑健康指标类型";
                        this.healthtypeformdata = {
                            "status": row.status,
                            "typeCode": row.typeCode,
                            "typeId": row.typeId,
                            "typeName": row.typeName,
                            "hpiUnit": row.hpiUnit
                        }
                        this.gethpilist();

                    } else {
                        this.dialogtitle = "新增健康指标类型";
                        this.healthtypeformdata = {
                            "status": "1",
                            "typeCode": "",
                            "typeId": undefined,
                            "typeName": "",
                            "hpiUnit": ""
                        }
                    }
                },
                //保存按钮提交数据
                healthtypesubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.hpiManageService", "saveHpiType", '[' + JSON.stringify(this.healthtypeformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.healthtypedialog = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.gethealthtypelist();
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
                delehealthtype(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.typeName)
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
                            let params = `[${row.typeId}]`;
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
                },
                healthtypeclosemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.healthtypedialog = false;
                },
                gethpilist() {
                    commonAjax("cas.hpiManageService", "hpiList", `[${this.healthtypeformdata.typeId}]`).then((res) => {
                        if (res.code == 200) {

                            this.hpilist = res.body;

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 健康指标开始---------------------------------------------------------------
                edithpi(index, row) {
                    this.hpidialog = true;
                    if (row) {
                        this.dialogtitle2 = "编辑健康指标";
                        this.hpiformdata = {
                            "hpiCode": row.hpiCode,
                            "hpiId": row.hpiId,
                            "hpiName": row.hpiName,
                            "status": row.status,
                            "typeId": row.typeId,
                            "upperLimit": row.upperLimit,
                            "lowerLimit": row.lowerLimit,
                        }

                    } else {
                        this.dialogtitle2 = "新增健康指标";
                        this.hpiformdata = {
                            "hpiCode": "",
                            "hpiId": undefined,
                            "hpiName": "",
                            "status": "1",
                            "typeId": this.healthtypeformdata.typeId,
                            "upperLimit": "",
                            "lowerLimit": "",
                        }
                    }
                },
                hpisubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.hpiManageService", "saveHpi", '[' + JSON.stringify(this.hpiformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.hpidialog = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.gethpilist();
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
                hpiDelete(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.hpiName)
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
                            let params = `[${row.hpiId}]`;
                            commonAjax("cas.hpiManageService", "deleteHpi", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.gethpilist();
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
                hpiclosemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.hpidialog = false;
                },
                //评价模板开始-----------------------------------------------------------------------------------------------
                getevaluationtpllist() {

                    commonAjax("cas.evaluationManageService", "queryDefineByTenantId", `['${this.curtenantId}']`).then((res) => {
                        if (res.code == 200) {
                            this.evaluationtpllist = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                editevaluationtpl(index, row) {
                    this.evaluationtpldialog = true;
                    if (row) {
                        this.dialogtitle = "编辑评价模板";
                        this.evaluationtplformdata = {
                            "inputFlag": row.inputFlag, //首评是否启用输入框
                            "defineTpName": row.defineTpName, //评价模板名称
                            "tenantId": row.tenantId, //租户
                            "addEvaluationFlag": row.addEvaluationFlag, //追评标志
                            "appendInputFlag": row.appendInputFlag, //追评是否启用输入框
                            "status": row.status, //是否启动
                            "id": row.id //新增为0

                        }
                        commonAjax("cas.evaluationManageService", "getByDefineId", `['${row.id}']`).then((res) => {
                            if (res.code == 200) {
                                this.evaluationtlist = res.body.evaluationItems;
                                this.evaluationtlist2 = res.body.addevaluationItems;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });


                    } else {
                        this.dialogtitle = "新增评价模板";
                        this.evaluationtplformdata = {
                            "inputFlag": "1", //首评是否启用输入框
                            "defineTpName": "", //评价模板名称
                            "tenantId": this.curtenantId, //租户
                            "addEvaluationFlag": "1", //追评标志
                            "appendInputFlag": "1", //追评是否启用输入框
                            "status": "1", //是否启动
                            "id": 0 //新增为0
                        }
                    }
                },
                evaluationtplsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.evaluationManageService", "saveEvalutionDefine", '[' + JSON.stringify(this.evaluationtplformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.evaluationtpldialog = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.getevaluationtpllist();
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
                deleevaluationtpl(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.defineTpName)
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
                            commonAjax("cas.evaluationManageService", "deleteDefind", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.getevaluationtpllist();
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
                evaluationtplclosemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.evaluationtpldialog = false;
                },
                //评价项目开始-----------------------------
                editevaluation(index, row) {
                    this.evaluationdialog = true;
                    if (row) {
                        this.dialogtitle2 = "编辑评价项目";
                        this.curitemindex = index;
                        this.evaluationformdata = {
                            "defineId": row.defineId, //满意度评价定义表id
                            "appendFlag": row.appendFlag, //追评标志：0首评 1追评
                            "content": row.content, //内容
                            "status": row.status, //状态 0.未启用 1.已启用
                            "itemId": row.itemId //新增为0
                        }
                    } else {
                        this.dialogtitle2 = "新增评价项目";
                        this.evaluationformdata = {
                            "defineId": this.evaluationtplformdata.id, //满意度评价定义表id
                            "appendFlag": "", //追评标志：0首评 1追评
                            "content": "", //内容
                            "status": "1", //状态 0.未启用 1.已启用
                            "itemId": 0 //新增为0
                        }
                        if (this.activeName2 == "fristevaluation") {
                            this.evaluationformdata.appendFlag = 0
                        } else {
                            this.evaluationformdata.appendFlag = 1
                        }

                    }
                },
                evaluationsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.evaluationManageService", "saveEvalutionItem", '[' + JSON.stringify(this.evaluationformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.evaluationdialog = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    if (this.evaluationformdata.itemId != 0) { //编辑
                                        if (this.evaluationformdata.appendFlag == 0) {
                                            this.evaluationtlist.splice(this.curitemindex, 1, res.body)
                                        } else {
                                            this.evaluationtlist2.splice(this.curitemindex, 1, res.body)
                                        }

                                    } else { //新增
                                        if (this.evaluationformdata.appendFlag == 0) {
                                            this.evaluationtlist.push(res.body)
                                        } else {
                                            this.evaluationtlist2.push(res.body)
                                        }
                                    }
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
                evaluationDelete(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.content)
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
                            let params = `[${row.itemId}]`;
                            commonAjax("cas.evaluationManageService", "deleteItem", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    if (row.appendFlag == 0) {
                                        this.evaluationtlist.splice(index, 1)
                                    } else {
                                        this.evaluationtlist2.splice(index, 1)
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
                evaluationclosemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.evaluationdialog = false;
                },
                //基础设置开始--------------------------------------------------------
                getbasesetlist() {
                    commonAjax("cas.signParamValueSercice", "getPanelValues", '[]').then((res) => {
                        if (res.code == 200) {
                            $.each(res.body, function(index, el) {
                                if (el.paramCode == "signAdditionalTimeLimit") {
                                    el.paramName = "签约补录天数"
                                } else if (el.paramCode == "serviceRecordAdditionalTimeLimit") {
                                    el.paramName = "服务记录补录天数"
                                } else if (el.paramCode == "canRemoveCount") {
                                    el.paramName = "可解约次数"
                                } else {
                                    el.paramName = "家医服务提醒系数(%)"
                                }
                            }.bind(this));
                            this.basesetlist = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //基础配置
                editbaseset(index, row) {
                    this.basesetdialog = true;
                    this.dialogtitle = "基础配置"
                    if (row) {

                    }
                    this.basesetformdata = {
                        "paramCode": row.paramCode,
                        "paramValue": row.paramValue,
                    }
                    this.baselabel = row.paramName;

                },
                basesetsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.signParamValueSercice", "addSignparamValue", '[' + JSON.stringify(this.basesetformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.basesetdialog = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.getbasesetlist()
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
                basesetclosemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.basesetdialog = false;
                },
                //续约提醒--------------------------------------------------------------------------------
                getrenewallist() {
                    commonAjax("cas.signRemindParamService", "getSignRemindParam", '[]').then((res) => {
                        if (res.code == 200) {
                            this.renewallist = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },

                editrenewal(index, row) {
                    this.renewaldialog = true;
                    if (row) {
                        this.dialogtitle = "编辑续约提醒";
                        this.renewalformdata = {
                            "content": row.content,
                            "mode": row.mode,
                            "paramId": row.paramId,
                            "paramName": row.paramName,
                            "paramValue": row.paramValue,
                            "status": row.status
                        }

                    } else {
                        this.dialogtitle = "新增续约提醒";
                        this.renewalformdata = {
                            "content": "",
                            "mode": "",
                            "paramId": undefined,
                            "paramName": "",
                            "paramValue": "",
                            "status": "1"
                        }
                    }
                },
                //保存按钮提交数据
                renewalsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            let param = this.renewalformdata.paramId ? "updateSignRemindParam" : "addSignRemindParam";
                            commonAjax("cas.signRemindParamService", param, '[' + JSON.stringify(this.renewalformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.renewaldialog = false;
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.getrenewallist();
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
                delerenewal(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.paramName)
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
                            let params = `[${row.paramId}]`;
                            commonAjax("cas.signRemindParamService", "deleteSignRemindParam", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.getrenewallist();
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
                renewalclosemodal(formName) {
                    this.$refs[formName].resetFields();
                    this.renewaldialog = false;
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

        },
        components: {
            // quillEditor
        },
        mounted() {
            this.getbasesetlist();
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

.mb20 {
    margin-bottom: 20px
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

h2.account-title {
    font-size: 16px;
    border-bottom: 2px #EEE solid;
    padding: 5px 5%;
    margin-bottom: 20px;
    height: 40px;
}

h2.account-title button {
    float: right;
}
</style>
