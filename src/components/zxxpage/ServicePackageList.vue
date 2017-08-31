<template>
    <div class="SPList">
        <!--标题-->
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>服务管理</el-breadcrumb-item>
                        <el-breadcrumb-item>服务包</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con">
                <el-col :span="24" class="addServItem">
                    <el-button type="primary" icon="plus" @click="addServiceItem">添加服务包</el-button>
                </el-col>
            </el-row>
            <el-row class="search_line">
                <el-col :span="20">
                    <el-form :inline="true" :model="searchContent" class="demo-form-inline">
                        <el-form-item label="服务名称:">
                            <el-input class="serv_name" v-model="searchContent.name"></el-input>
                        </el-form-item>
                        <el-form-item label="编号:">
                            <el-input class="number" v-model="searchContent.no" autosize disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="启用状态">
                            <el-select class="status" v-model="searchContent.status" placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="启用" value="1"></el-option>
                                <el-option label="停用" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="4" class="oper_btn">
                    <el-button type="warning" @click="clear">清除</el-button>
                    <el-button type="success" @click="search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <!--列表-->
        <el-table :data="servPackData" border style="width: 100%">
            <el-table-column label="编号" prop="packId" width="100"></el-table-column>
            <el-table-column label="名称" prop="packName" width="120"></el-table-column>
            <el-table-column label="价格(元)" prop="price" width="100"></el-table-column>
            <el-table-column label="有效期" prop="validPeriod" width="100"></el-table-column>
            <el-table-column label="简介" prop="packDesc" width="120"></el-table-column>
            <el-table-column label="启用状态" prop="status" width="100">
                <template scope="scope">
                    <span v-if='scope.row.status==1'>已启用</span>
                    <span v-if='scope.row.status==0'>已禁用</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small" @click="checkServPack(scope.row)">查看</el-button>
                    <el-button size="small" @click="editServPack(scope.$index, scope.row)">编辑</el-button>
                    <el-button v-show="scope.row.status==0" size="small" type="success" @click="switchStatus(scope.$index, scope.row)">启用</el-button>
                    <el-button v-show="scope.row.status==1" size="small" type="danger" @click="switchStatus(scope.$index, scope.row)">禁用</el-button>
                    <el-button size="small" @click="copyServPack(scope.$index, scope.row)">复制</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10, 20, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="page.pageSize">
            </el-pagination>
        </div>

        <!-- 查看服务包对话框 -->
        <el-dialog :title="dialogPackTitle" v-model="checkPackFormVisible" @close="closeDialog('checkPack')">
            <el-form :model="checkPackFormData" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <i class="mark_input">*</i>
                <el-form-item label="服务包名称" class="as_inline" :label-width="formLabelWidth" prop="name">
                    <el-input class="serv_no" v-model="checkPackFormData.packName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="编号" class="as_inline" :label-width="formLabelWidth" prop="packName">
                    <el-input class="serv_no" v-model="checkPackFormData.packName" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="实际价格(元)" class="as_inline min_width" :label-width="formLabelWidth" prop="price">
                    <el-input placeholder="0" class="serv_no" v-model="checkPackFormData.price" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="有效期(天)" class="as_inline min_width" :label-width="formLabelWidth" prop="validPeriod">
                    <el-input placeholder="365" class="serv_no" v-model="checkPackFormData.validPeriod" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="适合人群" class="as_inline" :label-width="formLabelWidth" prop="name">
                    <el-select placeholder="无" class="serv_no" v-model="checkPackFormData.suitableObject" :disabled="true">
                        <el-option v-for="item in dictionary.base_suitableObject" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用时间" class="as_inline" :label-width="formLabelWidth" prop="startDt">
                    <el-date-picker placeholder="选择日期" class="serv_no" type="date" v-model="checkPackFormData.startDt" :picker-options="pickerOptions0" :disabled="true">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="简介" :label-width="formLabelWidth" prop="packDesc">
                    <el-input v-model="checkPackFormData.packDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    
        <!-- 新增服务包对话框 -->
        <el-dialog :title="dialogPackTitle" v-model="dialogFormVisible" @close="closeDialog('addPack')">
            <el-form :model="addPackFormData" :rules="addPackRules" ref="addPackInfoForm" auto-complete="off" id="addPackInfoForm">
                <!-- 基础信息 -->
                <i class="mark_input">*</i>
                <el-form-item label="服务包名称" class="as_inline" :label-width="formLabelWidth" prop="packName">
                    <el-input class="serv_no" v-model="addPackFormData.packName" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="编号" class="as_inline" :label-width="formLabelWidth" prop="">
                    <el-input class="serv_no" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="实际价格(元)" class="as_inline min_width" :label-width="formLabelWidth" prop="price">
                    <el-input placeholder="0" class="serv_no" v-model="addPackFormData.price" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="有效期(天)" class="as_inline min_width" :label-width="formLabelWidth" prop="validPeriod">
                    <el-input placeholder="365" class="serv_no" v-model="addPackFormData.validPeriod" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="适合人群" class="as_inline" :label-width="formLabelWidth" prop="suitableObject">
                    <el-select placeholder="无" class="serv_no" v-model="addPackFormData.suitableObject" :disabled="isReadOnly">
                        <el-option v-for="item in dictionary.base_suitableObject" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用时间" class="as_inline" :label-width="formLabelWidth" prop="startDt">
                    <el-date-picker placeholder="选择日期" class="serv_no" type="date" v-model="addPackFormData.startDt" @change="dateChange" :picker-options="pickerOptions0" :disabled="isReadOnly">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="简介" :label-width="formLabelWidth" prop="packDesc">
                    <el-input v-model="addPackFormData.packDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <hr/>
                <!-- 优惠信息 -->
                <div class="dialog_title">优惠信息(选填)</div>
                <el-form-item :label="dictionary.base_discountType[0].text" class="as_inline" :label-width="formLabelWidth" prop="aa">
                    <el-input placeholder="0" class="serv_no" v-model="addPackFormData.discount[0].discountAmount"></el-input>
                </el-form-item>
                <el-form-item :label="dictionary.base_discountType[1].text" class="as_inline" :label-width="formLabelWidth" prop="bb">
                    <el-input placeholder="0" class="serv_no" v-model="addPackFormData.discount[1].discountAmount"></el-input>
                </el-form-item>
                <el-form-item :label="dictionary.base_discountType[2].text" class="as_inline min_width" :label-width="formLabelWidth" prop="cc">
                    <el-input placeholder="0" class="serv_no" v-model="addPackFormData.discount[2].discountAmount"></el-input>
                </el-form-item>
                <hr/>
                <!-- 服务项列表 -->
                <el-row>
                    <el-col :span="20">
                        <div class="dialog_title">服务项(必填)</div>
                    </el-col>
                    <el-col :span="4">
                        <div v-show="!isReadOnly" class="dialog_title_mini" @click='addServItem'>+新增服务项</div>
                    </el-col>
                </el-row>
                <el-table :data="addPackFormData.packAssociation" border style="width: 100%" class="serv_item_table">
                    <el-table-column label="名称" prop="serviceName" width="100"></el-table-column>
                    <el-table-column label="编号" prop="serviceCode" width="120"></el-table-column>
                    <el-table-column label="上限价格(元)" prop="upperPrice" width="100"></el-table-column>
                    <el-table-column label="下限价格(元)" prop="lowerPrice" width="100"></el-table-column>
                    <el-table-column label="默认价格(元)" prop="price" width="100"></el-table-column>
                    <el-table-column label="有效期(天)" prop="validPeriod" width="120"></el-table-column>
                    <el-table-column label="服务次数" prop="times" width="120"></el-table-column>
                    <el-table-column label="服务频率" prop="frequency" width="120"></el-table-column>
                    <el-table-column label="每次服务时间" prop="duration" width="120"></el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" @click="delAddedServItem(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <!-- 按钮 -->
            <div class="dialog-footer center-foot bottom_btn">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="savePackFormData('addPackInfoForm')">保 存</el-button>
            </div>
        </el-dialog>
    
        <!-- 编辑服务包对话框 -->
        <el-dialog :title="dialogTitle" v-model="editPackFormVisible" @close="closeDialog">
            <el-tabs type="card" :active-name="tenantOption.activeName" @tab-click="tabHandleClick">
                <!-- 基础信息标签页 -->
                <el-tab-pane label="基础信息" name="baseInfo" class="eltabpane">
                    <el-form :model="basicInfoData" :rules="editPackFormRules" ref="editPackFormRef" auto-complete="off">
                        <i class="mark_input">*</i>
                        <el-form-item label="服务包名称" class="as_inline" :label-width="formLabelWidth" prop="packName">
                            <el-input class="serv_no" v-model="basicInfoData.packName"></el-input>
                        </el-form-item>
                        <el-form-item label="编号" class="as_inline" :label-width="formLabelWidth" prop="">
                            <el-input class="serv_no" disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="实际价格(元)" class="as_inline min_width" :label-width="formLabelWidth" prop="price">
                            <el-input placeholder="0" class="serv_no" v-model="basicInfoData.price"></el-input>
                        </el-form-item>
                        <el-form-item label="有效期(天)" class="as_inline min_width" :label-width="formLabelWidth" prop="validPeriod">
                            <el-input placeholder="365" class="serv_no" v-model="basicInfoData.validPeriod"></el-input>
                        </el-form-item>
                        <el-form-item label="适合人群" class="as_inline" :label-width="formLabelWidth" prop="suitableObject">
                            <el-select placeholder="无" class="serv_no" v-model="basicInfoData.suitableObject">
                                <el-option v-for="item in dictionary.base_suitableObject" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="启用时间" class="as_inline" :label-width="formLabelWidth" prop="startDt">
                            <el-date-picker placeholder="选择日期" class="serv_no" type="date" v-model="basicInfoData.startDt" :picker-options="pickerOptions0">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="简介" :label-width="formLabelWidth" prop="packDesc">
                            <el-input v-model="basicInfoData.packDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="center-foot">
                        <el-button @click="cancelEdit('editBasicInfo')">取消</el-button>
                        <el-button type="primary" @click="saveEditedData('editPackFormRef')">保存</el-button>
                    </div>
                </el-tab-pane>
    
                <!-- 服务项标签页 -->
                <el-tab-pane label="服务项" name="servItem" class="eltabpane" v-if="tenantOption.isShowTab">
                    <!-- 服务项列表 -->
                    <el-row>
                        <el-col :span="20">
                            <div class="dialog_title">服务项(必填)</div>
                        </el-col>
                        <el-col :span="4">
                            <div v-show="!isReadOnly" class="dialog_title_mini" @click='addServItem'>+新增服务项</div>
                        </el-col>
                    </el-row>
                    <el-table :data="addPackFormData.packAssociation" border style="width: 100%" class="serv_item_table">
                        <el-table-column label="名称" prop="serviceName" width="90"></el-table-column>
                        <el-table-column label="编号" prop="serviceCode" width="110"></el-table-column>
                        <el-table-column label="上限价格(元)" prop="upperPrice" width="90"></el-table-column>
                        <el-table-column label="下限价格(元)" prop="lowerPrice" width="90"></el-table-column>
                        <el-table-column label="默认价格(元)" prop="price" width="90"></el-table-column>
                        <el-table-column label="有效期(天)" prop="validPeriod" width="90"></el-table-column>
                        <el-table-column label="服务次数" prop="times" width="110"></el-table-column>
                        <el-table-column label="服务频率" prop="frequency" width="110"></el-table-column>
                        <el-table-column label="每次服务时间" prop="duration" width="110"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="delEditedServItem(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
    
                <!-- 优惠信息标签页 -->
                <el-tab-pane label="优惠信息" name="discountInfo" class="eltabpane" v-if="tenantOption.isShowTab">
                    <el-table :data="discountInfoFormData" border style="width: 100%">
                        <el-table-column label="名称" prop="discountTypeText"></el-table-column>
                        <el-table-column label="优惠金额(元)" prop="discountAmount"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" type="success" @click="editDiscInfo(scope.$index, scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <!-- 优惠信息编辑对话框 -->
        <el-dialog :title="dialogTitle" v-model="editDiscInfoFormVisible" @close="(closeDialog('editDiscInfo'))">
            <el-form :model="editDiscInfoForm" :rules="formrules" ref="editDiscInfoForm" auto-complete="off" id="editDiscInfoForm">
                <el-form-item :label="editDiscInfoForm.discountTypeText" class="as_inline" :label-width="formLabelWidth" prop="editDiscInfoForm.discountAmount">
                    <el-input class="serv_no" v-model="editDiscInfoForm.discountAmount"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot bottom_btn">
                <el-button @click="closeDialog('editDiscInfo')">取 消</el-button>
                <el-button type="primary" @click="saveEditDiscInfoForm">保 存</el-button>
            </div>
        </el-dialog>
    
        <!-- 添加服务项对话框 -->
        <el-dialog :title="dialogItemTitle" v-model="addServItemFormVisible" @close="(closeDialog('addItem'))">
            <el-form :model="addServItemForm" :rules="formrules" ref="addItemForm" auto-complete="off" id="addItemForm">
                <el-form-item label="服务项名称" class="as_inline" :label-width="formLabelWidth" prop="serviceName">
                    <el-select placeholder="无" class="serv_name serv_no" v-model="addServItemForm.serviceId" :disabled="isReadOnly" @change="getItsFields">
                        <el-option v-for="item in servItemSelect" :key="item.serviceId" :label="item.serviceName" :value="item.serviceId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="默认价格" class="as_inline" :label-width="formLabelWidth" prop="price">
                    <el-input class="serv_no" v-model="addServItemForm.price" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="价格上限(元)" class="as_inline min_width" :label-width="formLabelWidth" prop="upperPrice">
                    <el-input class="serv_no" v-model="addServItemForm.upperPrice" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="价格下限(元)" class="as_inline min_width" :label-width="formLabelWidth" prop="lowerPrice">
                    <el-input placeholder="" class="serv_no" v-model="addServItemForm.lowerPrice" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务次数" class="as_inline min_width" :label-width="formLabelWidth" prop="times">
                    <el-input placeholder="为空代表无限制次数" class="serv_no" v-model="addServItemForm.times" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="服务频率" class="as_inline min_width" :label-width="formLabelWidth" prop="evaluationTplId">
                    <el-input placeholder="" class="serv_freq_input" v-model="addServItemForm.frequency"></el-input>
                    <el-select placeholder="周" class="serv_freq" v-model="addServItemForm.frequencyType">
                        <el-option v-for="item in dictionary.base_frequencyType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                    <span>一次</span>
                </el-form-item>
                <el-form-item label="每次服务时间(分钟):" class="as_inline" :label-width="formLabelWidth" prop="duration">
                    <el-input placeholder="" class="serv_no" v-model="addServItemForm.duration" :disabled="isReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="服务项有效期" class="as_inline" :label-width="formLabelWidth" prop="validPeriod">
                    <el-input class="serv_no" v-model="addServItemForm.validPeriod" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot bottom_btn">
                <el-button v-if='!isReadOnly' @click="closeDialog('addItem')">取 消</el-button>
                <el-button v-if='!isReadOnly' type="primary" @click="saveServItemForm('addItemForm')">保 存</el-button>
            </div>
        </el-dialog>

        <!-- 复制服务包对话框 -->
        <el-dialog :title="dialogItemTitle" v-model="copyPackFormVisible" @close="(closeDialog('copyPack'))">
            <el-form :model="copyPackFormData" :rules="formrules" ref="copyItemForm" auto-complete="off" id="copyItemForm">
                <el-form-item label="复制的服务包" class="as_inline" :label-width="formLabelWidth" prop="prePackName">
                    <el-input class="serv_no" v-model="copyPackFormData.prePackName" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="新服务包名" class="as_inline min_width" :label-width="formLabelWidth" prop="packName">
                    <el-input class="serv_no" v-model="copyPackFormData.packName"></el-input>
                </el-form-item>
                <el-form-item label="启用时间" :label-width="formLabelWidth" prop="startDt" onClick="setFormat">
                    <el-date-picker placeholder="选择日期" class="serv_no" type="date" v-model="copyPackFormData.startDt" @change="dateChange" :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-checkbox label="优惠信息" v-model="checked" @change='copyDiscountInfo'></el-checkbox>
            </el-form>
            <div class="dialog-footer center-foot bottom_btn">
                <el-button @click="closeDialog('addItem')">取 消</el-button>
                <el-button type="primary" @click="saveCopyServPack">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { commonAjax } from '../../api/api';
export default {
    data() {
        return {
            // 通用
            curPackId: '',             // 当前包ID
            curPickDate: '',           // 当前选择日期
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            isAddedPackStatus: true,    // 当前是添加状态还是编辑状态
            isReadOnly: false,
            dialogTitle: '',
            dialogFormVisible: false,
            copyOtherFormVisible: false,
            editPackFormVisible: false,
            addTplFormVisible: false,
            isGenePlan: false,
            formLabelWidth: '100px',
            dictionary: {
                bannerPostion: [{    
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }],
                base_suitableObject: [{
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }],
                base_frequencyType: [{
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }],
                base_discountType: [{ // 优惠类型
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }]
            },
            page: {
                pageNo: 1,
                pageSize: 10
            },
            total: '',
            addPackRules: {
                packName: [{
                    required: true,
                    message: '包名不能为空'
                }],
                price: [{
                    required: true,
                    message: '价格不能为空'
                }],
                validPeriod: [{
                    required: true,
                    message: '有效期不能为空'
                }],
                name: [{
                    required: true,
                    message: '人群不能为空'
                }],
                startDt: [{
                    required: true,
                    message: '时间不能为空'
                }],
                packDesc: [{
                    required: true,
                    message: '简介不能为空'
                }]
            },
            editPackFormRules: {
                packName: [{
                    required: true,
                    message: '包名不能为空'
                }],
                price: [{
                    required: true,
                    message: '价格不能为空'
                }],
                validPeriod: [{
                    required: true,
                    message: '有效期不能为空'
                }],
                suitableObject: [{
                    required: true,
                    message: '人群不能为空'
                }],
                startDt: [{
                    required: true,
                    message: '时间不能为空'
                }],
                packDesc: [{
                    required: true,
                    message: '简介不能为空'
                }]
            },
            
            // 复制服务包
            checked: false,            // 复制包优惠信息标识
            copyPackFormData: {        // 复制服务包表单数据 
                prePackName: '',
                packName: '',
                startDt: '',
                tenantId: "hcn"        // 租户id
            },

            // 编辑服务包
            copyPackFormVisible: false, // 复制包对话框显示
            curEditPackId: '',           // 当前编辑包的ID
            tenantOption: {             // 编辑对话框    
                activeName: 'baseInfo', //基础信息标签页
                isdisabled: true,       //true表示显示信息；false表示添加信息
                isShowTab: true         //是否显示tab标签页
            },
            basicInfoData: {            // 编辑服务包-基本信息标签页数据源
                packName: '',
                price: '',
                validPeriod: '',
                suitableObject: '',
                startDt: '',
                packDesc: ''
            },

            // 添加服务包
            dialogPackTitle: '',        // 添加包对话框标题
            addServItemFormVisible: false, // 添加包显示
            addPackFormData: {   // 添加服务包表单绑定数据用
                packDesc: "",         // 简介
                packName: "",         // 服务包名称
                price: "",            // 价格
                startDt: "",          // 启用时间
                suitableObject: "",   // 签约适合对象
                tenantId: "hcn",      // 租户id
                validPeriod: "",      // 有效期（天）
                discount: [{          // 优惠信息
                    discountType: 1
                },{
                    discountType: 2
                },{
                    discountType: 3
                }],           
                packAssociation: [] 
            },
            
            // 查看服务包
            checkPackFormVisible: false,   // 查看包显示
            searchContent: {
                name: '',
                no: '',
                status: ''
            },
            servPackData: [],               // 本页列表数据源
            servPackData2: [{               // 本页列表模拟数据源
                serviceCode: "071",         // 服务项编码
                serviceName: "电子档案",     // 服务项目名称
                serviceDesc: "这里是简介",   // 简介
                upperPrice: 20,
                lowerPrice: 5,
                price: 15,
                status: "已启用",
                serviceId: 1,
                tenantId: "hcn"
            }],
            checkPackFormData: {    // 查看服务包表单数据
                packId: 0,
                tenantId: "",
                packName: "",
                upperPrice: 0,
                lowerPrice: 0,
                price: 0,
                packDesc: "",
                validPeriod: 0,
                startDt: "",
                suitableObject: "",
                createDt: "",
                suitableObjectText: ""
            },
            
            // 添加服务项
            servItemSelect: [],     // 服务项列表选项
            addServItemForm: {      // 添加服务项详情表单
                duration: '',       // 服务时长(分钟)
                frequency: '',      // 服务频率计数
                frequencyType: '',  // 服务频率类型
                lowerPrice: '',     // 价格下限
                price: '',          // 价格
                serviceName: '',    // 服务项目名称
                serviceId: '',      // 服务项目id
                servicePackId: '',  // 服务包id ?
                times: '',          // 年服务次数
                upperPrice: '',     // 价格上限
                validPeriod: ''     // 有效期
            },
            
            // 优惠信息
            editDiscInfoFormVisible: false,
            discountInfoFormData: [],    // 优惠信息数据源
            tmpDiscInfo: [],
            editDiscInfoForm: {
                discountAmount: '',
                discountType: '',
                packId: ''
            }
        }
    },
    activated() {
        this.init();
    },
    methods: {
        /**
         *  通用
         */ 
        // 设置日期格式
        dateChange(val) {
            this.curPickDate = val;
        },
        // 关闭对话框
        closeDialog(one) {
            if (one == 'addPack') {
                this.dialogFormVisible = false;
            } else if (one == 'addItem') {
                this.addServItemFormVisible = false;
            } else if (one == 'checkPack') {
                this.checkPackFormVisible = false;
            } else if (one == 'editDiscInfo') {
                this.editDiscInfoFormVisible = false;
            } else if (one == 'copyPack') {
                this.copyPackFormVisible = false;
            }
        },
        // 获取字典
        dictionaryRequest() {
            // 参数
            var that = this;
            let arr = [
                "cfs.dic.base_suitableObject",  // 适合人群
                "cfs.dic.base_frequencyType",   // 服务频率单位
                "cfs.dic.base_discountType"     // 优惠类型
            ];
            // 调用服务
            commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                if (res.code == 200) {
                    console.table( res.body )
                    res.body.forEach(function (ele, index) {
                        if (ele.dicId == arr[0]) {
                            that.dictionary.base_suitableObject = ele.items;
                        }
                        if (ele.dicId == arr[1]) {
                            that.dictionary.base_frequencyType = ele.items;
                        }
                        if (ele.dicId == arr[2]) {
                            that.dictionary.base_discountType = ele.items;
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
        // 条数变化
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.getServPackList();
        },
        // 当前页变化
        handleCurrentChange(val) {
            this.page.pageNo = val;
            this.getServPackList();
        },


        /**
         *  复制服务包 
         */ 
        // 复制包获取优惠信息
        getDiscInfo4CopyPack() {
            let params = [this.curPackId];

            commonAjax('cas.baseServiceService', 'getDiscountList', params).then(res => {
                if (res.code == 200) {
                    this.tmpDiscInfo = res.body;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 复制包选择优惠信息
        copyDiscountInfo() {
            if (this.checked) {
                console.log('选中')
            }
        },
        // 保存复制服务包
        saveCopyServPack() {
            delete this.copyPackFormData.packId;
            delete this.copyPackFormData.prePackName;
            this.copyPackFormData.startDt = this.curPickDate;

            this.copyPackFormData.packAssociation = [{
                "duration": "33",
                "frequency": "33",
                "frequencyType": "03",
                "serviceId": "7",
                "servicePackId": "7",
                "times": "8"
            }];
            this.copyPackFormData.discount = [{
                "discountAmount": "22",
                "discountType": "2",
                "packId": "7"
            }];

            if (!this.checked) { // 不包含优惠信息
                var params = [this.copyPackFormData];
            } else {  // 包含优惠信息
                this.getDiscInfo4CopyPack();
                this.copyPackFormData.discount = this.tmpDiscInfo;
                var params = [this.copyPackFormData];
            }

            commonAjax('cas.baseServiceService', 'saveBasePack', params).then(res => {
                if (res.code == 200) {
                    this.dialogFormVisible = false;
                    this.copyPackFormVisible = false;
                    this.getServPackList();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },


        /**
         *  服务包编辑 
         */ 
        // 删除服务包编辑的服务项
        delEditedServItem(index, row) {
            let params = [row.serviceId];

            commonAjax('cas.baseServiceService', 'deleteServiceitemTmpl', params).then(res => {
                if (res.code == 200) {
                    this.addPackFormData.packAssociation.splice(index, 1);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 删除服务包添加的服务项
        delAddedServItem(index, row) {
            this.addPackFormData.packAssociation.splice(index, 1);
        },
        // 优惠信息保存
        saveEditDiscInfoForm() {
            let params = [this.editDiscInfoForm.discountAmount, this.editDiscInfoForm.packId];

            commonAjax('cas.baseServiceService', 'updateDiscountById', params).then(res => {
                if (res.code == 200) {
                    this.editDiscInfoFormVisible = false;
                }
            });
        },
        // 优惠信息编辑
        editDiscInfo(index, row) {
            this.editDiscInfoForm = row;
            this.dialogTitle = '编辑优惠信息';
            this.editDiscInfoFormVisible = true;
        },
        // 标签页切换
        tabHandleClick(tag) {
            let tagName = tag.name;
            if (tagName == 'discountInfo') {
                let id = this.curEditPackId;
                let params = [id];

                commonAjax('cas.baseServiceService', 'getDiscountList', params).then(res => {
                    if (res.code == 200) {
                        this.discountInfoFormData = res.body;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                });
            }
        },
        // 基础信息对话框，取消按钮
        cancelEdit() {
            this.editPackFormVisible = false;
        },
        // 编辑基础信息对话框，保存按钮
        saveEditedData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params = [this.basicInfoData];

                    commonAjax('cas.baseServiceService', 'editBasePack', params).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: '信息保存成功！'
                            });
                            this.editPackFormVisible = false;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                } else {
                    alert('请完成所有必填项');
                }
            });
        },
        // 保存添加的服务项
        saveServItemForm() {
            if (this.isAddedPackStatus) { // 添加
                let tmpObj = {
                    duration: this.addServItemForm.duration,
                    frequency: this.addServItemForm.frequency,
                    frequencyType: this.addServItemForm.frequencyType,
                    lowerPrice: parseInt(this.addServItemForm.lowerPrice),
                    price: parseInt(this.addServItemForm.price),
                    serviceName: this.addServItemForm.serviceName,
                    serviceId: this.addServItemForm.serviceId,
                    times: this.addServItemForm.times,
                    upperPrice: parseInt(this.addServItemForm.upperPrice),
                    validPeriod: this.addServItemForm.validPeriod
                };

                this.addPackFormData.packAssociation.push(tmpObj);
                this.addServItemFormVisible = false;
            } else {  // 编辑
                let tmpObj = {
                    duration: this.addServItemForm.duration,
                    frequency: this.addServItemForm.frequency,
                    frequencyType: this.addServItemForm.frequencyType,
                    lowerPrice: parseInt(this.addServItemForm.lowerPrice),
                    price: parseInt(this.addServItemForm.price),
                    serviceName: this.addServItemForm.serviceName,
                    serviceId: this.addServItemForm.serviceId,
                    times: this.addServItemForm.times,
                    upperPrice: parseInt(this.addServItemForm.upperPrice),
                    validPeriod: this.addServItemForm.validPeriod
                };
                let params = [tmpObj];

                commonAjax('cas.baseServiceService', 'savePackAssociation', params).then(res => {
                    if (res.code == 200) {
                        this.addPackFormData.packAssociation.push(tmpObj);
                        this.addServItemFormVisible = false;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                });
            }
        },
        // 获取其他字段
        getItsFields(serviceId) {
            var self = this;
            var val = serviceId;
            $.each(self.servItemSelect, function (index, ele) {
                
                if (ele.serviceId == val) {
                    self.addServItemForm.price = ele.price;
                    self.addServItemForm.lowerPrice = ele.lowerPrice;
                    self.addServItemForm.upperPrice = ele.upperPrice;
                    self.addServItemForm.validPeriod = ele.validPeriod;

                    console.log( '1>>> ' + ele.price )
                    console.log( '2>>> ' + JSON.stringify(self.addServItemForm) )
                }

            });
        },
        // 获取服务项列表
        getServItemList() {
            var params = [{
                tenantId: 'hcn',
                pageNo: 1,
                pageSize: 1000
            }];

            commonAjax('cas.baseServiceService', 'getBaseServiceitemsList', params).then(res => {
                if (res.code == 200) {
                    this.servItemSelect = res.body.items;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 新增服务项
        addServItem() {
            this.dialogItemTitle = '添加服务项';
            this.addServItemFormVisible = true;
            this.getServItemList();
        },
        // 编辑
        editServPack(index, row) {
            // debugger
            this.basicInfoData = row;
            this.curEditPackId = row.packId;
            this.isAddedPackStatus = false; // 当前为编辑状态
            this.dialogTitle = '编辑服务包';
            this.editPackFormVisible = true;
        },
        // 复制
        copyServPack(index, row) {
            this.dialogItemTitle = '复制服务包';
            this.copyPackFormData = row;    // Clone
            this.copyPackFormData.prePackName = row.packName;
            this.copyPackFormData.packName = '';
            this.copyPackFormData.startDt = '';
            this.curPackId = row.packId;
            this.copyPackFormVisible = true;
        },
        // 复制其他模版
        copyOtherTpl() {
            this.dialogTitle = '复制其它模板项';
            this.copyOtherFormVisible = true;
        },
        // 单选按钮
        chooseItem(val) {
            if (val == 1) {
                this.isGenePlan = true;
            } else {
                this.isGenePlan = false;
            }
        },
        // 删除服务说明模块
        delExplModule() {
            alert('删除该执行模块！')
        },
        // 切换状态
        switchStatus(index, row) {
             if (row.status == 1) { // 禁用
                const h = this.$createElement;

                this.$msgbox({
                    title: '确认禁用？',
                    message: h('p', null, [
                        h('span', null, ''),
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
                            message: "取消禁用"
                        });
                    } else {
                        // 禁用服务
                        commonAjax('cas.baseServiceService', 'updatePackStatus', [row.packId, "0"]).then(res => {
                            if (res.code == 200) {
                                row.status = 0;
                                this.$message({
                                    type: 'success',
                                    message: '禁用成功！'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                })
                            }
                        })
                    }
                })
            } else { // 启用
                const h = this.$createElement;

                this.$msgbox({
                    title: '确认启用？',
                    message: h('p', null, [
                        h('span', null, ''),
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
                            instance.confirmButtonText = '执行中...',
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
                    if (action === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: "取消启用"
                        });
                    } else {
                        // 启用服务
                        commonAjax('cas.baseServiceService', 'updatePackStatus', [row.packId, "1"]).then(res => {
                            if (res.code == 200) {
                                row.status = 1;
                                this.$message({
                                    type: 'success',
                                    message: '启用成功！'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                })
                            }
                        })
                    }
                });
            }
        },


        /**
         *  服务包查看 
         */ 
        // 获取服务包列表
        getServPackList() {
            if (this.searchContent.name == "" && this.searchContent.status == "") {
                var params = [{
                    tenantId: 'hcn',
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize
                }];
            } else {
                var params = [{
                    tenantId: 'hcn',
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize,
                    packName: this.searchContent.name,
                    status: this.searchContent.status
                }];
            }

            commonAjax('cas.baseServiceService', 'getBasePackList', params).then(res => {
                if (res.code == 200) {
                    this.servPackData = res.body.items;
                    this.total = res.body.total
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },
        // 清除
        clear() {
            this.searchContent.name = '';
            this.searchContent.no = '';
            this.searchContent.status = '';
        },
        // 搜索
        search() {
            this.getServPackList();
        },
        // 查看
        checkServPack(row) {
            let params = [row.packId];

            commonAjax('cas.baseServiceService', 'getBasePackInfo', params).then(res => {
                if (res.code == 200) {
                    this.checkPackFormData = res.body;
                    this.dialogPackTitle = '查看服务包';
                    this.checkPackFormVisible = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },


        /**
         *  服务包添加 
         */ 
        // 添加服务包
        addServiceItem() {
            this.dialogPackTitle = '添加服务包';
            this.isGenePlan = false;
            this.dialogFormVisible = true;
        },
        // 添加服务说明模版
        addServExplModule() {
            this.dialogTitle = '添加服务说明模版';
            this.addTplFormVisible = true;
        },
        // 保存添加服务包表单数据
        savePackFormData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.addPackFormData.packAssociation.length == 0) {
                        this.$message({
                            type: 'error',
                            message: '服务项不能为空'
                        });
                        return;
                    }

                    this.addPackFormData.price = parseInt(this.addPackFormData.price);
                    this.addPackFormData.startDt = this.curPickDate;

                    let params = [this.addPackFormData];

                    commonAjax('cas.baseServiceService', 'saveBasePack', params).then(res => {
                        if (res.code == 200) {
                            this.dialogFormVisible = false;
                            this.getServPackList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                } else {
                    // alert('请检查所有必填项');
                }
            });
        },

        init() {
            var self = this;
            this.dictionaryRequest();
            this.getServPackList(); // 获取列表数据
        }
    }
}
</script>
<style type="text/css" scoped>
.addServItem button {
    float: right;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.search_line {
    margin-top: 10px;
}

.serv_name,
.number,
.status {
    width: 130px;
}

.oper_btn {
    text-align: right;
}

.serv_name,
.serv_no {
    width: 175px;
}

.SPList .el-dialog__wrapper:nth-child(1)>div {
    width: 65%;
}

.mark_input {
    margin-right: -15px;
    color: red;
}

.as_inline {
    display: inline-block;
    margin-top: 18px;
}

.min_width {
    width: 265px;
}

.bottom_btn {
    margin-top: 20px;
}

.dialog_title {
    margin-top: 18px;
    line-height: 1;
    font-size: 16px;
    font-weight: 700;
    color: rgb(31, 61, 60);
}

.dialog_title_mini {
    margin-top: 18px;
    line-height: 1;
    font-size: 12px;
    font-weight: 700;
    color: blue;
}

.serv_item_table {
    margin-top: 12px;
}

.serv_freq_input {
    width: 36%;
}

.serv_freq {
    width: 42%;
}

.addServItemBtn {
    text-align: right;
    margin-bottom: 10px;
}

#copyItemForm {
    margin-left: 100px;
}
</style>
