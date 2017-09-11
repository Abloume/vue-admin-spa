<template>
    <div>
        <!-- 标题  -->
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <!-- <el-breadcrumb-item>{{orgOption.orgId?'编辑机构':'新增机构'}}</el-breadcrumb-item> -->
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12" class="return_prev">
                    <router-link to="/tenantManage">
                        <span class="return">
                            <img src="../../assets/img/return.png">
                        </span>返回上一级</router-link>
                </el-col>
            </el-row>
            <el-row class="search_con" v-if="isShowServExtend">
                <el-col :span="24" class="addorg">
                    <el-button type="primary" icon="plus" @click="addExtendField">添加扩展属性</el-button>
                </el-col>
            </el-row>
        </div>
        <!-- 租户维护列表 -->
        <el-row v-if="isShowTabList">
            <el-tabs type="card" :active-name="tenantOption.activeName" @tab-click="tabHandleClick">
                <!-- 基本信息 -->
                <el-tab-pane label="基本信息" name="baseInfo" class="eltabpane">
                    <el-form :model="basicData" :rules="orginformrules" ref="orginfoForm" auto-complete="off">
                        <el-form-item label="租户标识" :label-width="formLabelWidth" prop="tenantId">
                            <el-input v-model="basicData.tenantId" :disabled="tenantOption.isdisabled||tntMark"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" :label-width="formLabelWidth" prop="tenantType">
                            <el-select v-model="basicData.tenantType" placeholder="请选择租户类型" :disabled="tenantOption.isdisabled">
                                <el-option v-for="item in dictionary.medicalCombType" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="名称" :label-width="formLabelWidth" prop="tenantName">
                            <el-input v-model="basicData.tenantName" :disabled="tenantOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="服务热线" :label-width="formLabelWidth" prop="tenantPhone">
                            <el-input v-model="basicData.tenantPhone" :disabled="tenantOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="服务说明" :label-width="formLabelWidth" prop="tenantDesc">
                            <el-input v-model="basicData.tenantDesc" :disabled="tenantOption.isdisabled"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="center-foot">
                        <el-button type="primary" @click="submitForm('orginfoForm')" v-if="!tenantOption.isdisabled">保存</el-button>
                        <el-button @click="leaveBasicInfo('orginfoForm')">返回</el-button>
                        <el-button type="primary" @click="editBasicInfo()" v-if="tenantOption.isdisabled">我要编辑</el-button>
                    </div>
                </el-tab-pane>
                <!-- 机构列表 -->
                <el-tab-pane label="机构列表" name="orgList" class="eltabpane" v-if="tenantOption.isShowTab">
                    <!-- 搜索和添加 -->
                    <el-row class="addbtn">
                        <el-col :span="10">
                            <el-input placeholder="搜索当前列表医院" icon="search" v-model="orgKeyword" :on-icon-click="searchOrgList">
                            </el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click="searchOrgList">搜索</el-button>
                        </el-col>
                        <el-col :span="12">
                            <el-button type="primary" icon="plus" @click="getAddedOrgList">添加</el-button>
                        </el-col>
                    </el-row>
                    <!-- 机构列表 -->
                    <el-table :data="OrgTableData" border style="width: 100%">
                        <el-table-column prop="number" label="序号"></el-table-column>
                        <el-table-column prop="orgFullName" label="机构名称"></el-table-column>
                        <el-table-column prop="orgParentFullName" label="上级机构">
                            <template scope="scope">
                                <span v-show='scope.row.orgParentFullName'>{{scope.row.orgParentFullName}}</span>
                                <i v-show='scope.row.orgParentFullName' class="el-icon-close orglist-icon-close" @click="delParentOrg(scope.$index, scope.row)"></i>
                                <el-button size="small" v-show='!scope.row.orgParentFullName' type="success" @click="getAddedParentOrgList(scope.$index, scope.row)">添加</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" type="danger" @click="deleteOrg(scope.$index, scope.row)">删除</el-button>
                                <el-button size="small" @click="showqrcode(scope.$index, scope.row)">二维码</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页 -->
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="OrgTableDataNum" :page-sizes="[10,20,50]" @size-change="updateOrgListPageSize" @current-change="updateOrgListCurPage" :page-size="orgListPagination.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <!-- 产品列表 -->
                <el-tab-pane label="产品列表" name="prodList" class="eltabpane" v-if="tenantOption.isShowTab">
                    <el-row class="addbtn">
                        <el-col :span="24">
                            <el-button type="primary" icon="plus" @click="addProduct">添加产品</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="ProductTableData" border style="width: 100%">
                        <el-table-column prop="number" label="序号"></el-table-column>
                        <el-table-column prop="code" label="租户产品标识"></el-table-column>
                        <el-table-column prop="name" label="租户产品名称"></el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" type="success" @click="checkProduct(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" type="success" @click="handleForbidden(scope.$index, scope.row)" v-show="scope.row.status==0">启用</el-button>
                                <el-button size="small" type="danger" @click="handleForbidden(scope.$index, scope.row)" v-show="scope.row.status==1">禁用</el-button>
                                
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="ProductTableDataNum" :page-sizes="[10,20,50]" @size-change="updateProdListPageSize" @current-change="updateProdListCurPage" :page-size="prodListPagination.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <!-- 服务列表 -->
                <el-tab-pane label="服务列表" name="servList" class="eltabpane" v-if="tenantOption.isShowTab">
                    <el-row class="addbtn">
                        <el-col :span="24">
                            <el-button type="primary" icon="plus" @click="addService">添加服务</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="ServiceTableData" border style="width: 100%">
                        <el-table-column prop="serviceName" label="服务项目"></el-table-column>
                        <el-table-column prop="serviceCode" label="服务编码" width="200"></el-table-column>
                        <el-table-column prop="effectiveFlag" label="启用标记" width="200">
                            <template scope="scope">
                                <p v-show="scope.row.effectiveFlag==1">是</p>
                                <p v-show="scope.row.effectiveFlag==0">否</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="servListCheck(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" type="warning" @click="getServListExtendFld(scope.row)">扩展属性</el-button>
                                <el-button size="small" type="success" @click="servListSwitch(scope.$index, scope.row)" v-show="scope.row.effectiveFlag==0">启用</el-button>
                                <el-button size="small" type="danger" @click="servListSwitch(scope.$index, scope.row)" v-show="scope.row.effectiveFlag==1">关闭</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="ServiceTableDataNum" :page-sizes="[1,20,50]" @size-change="updateServListPageSize" @current-change="updateServListCurPage" :page-size="servListPagination.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-row>

        <!-- 服务列表扩展属性列表  -->
        <el-row v-if="isShowServExtend">
            <el-table :data="exServiceTableData" border style="width: 100%">
                <el-table-column prop="exPropertyCodeText" label="属性" width="100"></el-table-column>
                <el-table-column prop="exPropertyData" label="属性值" width="200"></el-table-column>
                <el-table-column prop="effectiveFlag" label="有效标识" width="100">
                    <template scope="scope">
                        <p v-show="scope.row.effectiveFlag==1">是</p>
                        <p v-show="scope.row.effectiveFlag==0">否</p>
                    </template>
                </el-table-column>
                <el-table-column prop="lastModifyUser" label="最后修改人" width="100"></el-table-column>
                <el-table-column prop="lastModifyDt" label="最后修改时间" width="200"></el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="editServExtFld(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="delServExtFld(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="exServiceTableDataNum" :page-sizes="[10,20,50]" @size-change="serhandleSizeChange" @current-change="serhandleCurrentChange" :page-size="serparams.pageSize">
                </el-pagination>
            </div>
        </el-row>
        <!-- 模态框 -->
        <!-- 添加医院模态框 -->
        <el-dialog :title="dialogTitle" v-model="navdialogFormVisible" @close="closeAddHsptDialog">
            <!-- 搜索框 -->
            <el-row :gutter="20" class="search_con">
                <el-col :span="18">
                    <el-input v-model='addedOrgKeyword'></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="search" @click="getAddedOrgList">搜索</el-button>
                </el-col>
            </el-row>
            <!-- 列表 -->
            <el-table :data='addedOrgTableData' border style="width:100%" class='hospitalList'>
                <el-table-column label='序号' prop='number'></el-table-column>
                <el-table-column label='医院名称' prop='orgFullName'></el-table-column>
                <el-table-column label='操作'>
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="addHspt2OrgList(scope.$index, scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class='pagination'>
                <el-pagination layout='total, sizes, prev, pager, next, jumper' :total='addedOrgTableDataNum' :page-sizes='[10,20,50]' @size-change="addOrgSizeChange" @current-change="addOrgCurrentChange" :page-size="serparams.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 机构列表 - 添加上级医院 -->
        <el-dialog :title="dialogTitle" v-model="navdialogParentFormVisible" @close="closeAddParentOrg">
            <!-- 搜索框 -->
            <el-row :gutter="20" class="search_con">
                <el-col :span="18">
                    <el-input v-model='addedParentOrgKeyword'></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="search" @click="getParentOrgList">搜索</el-button>
                </el-col>
            </el-row>
            <!-- 列表 -->
            <el-table :data='addedParentOrgTableData' border style="width:100%" class='hospitalList'>
                <el-table-column label='序号' prop='number'></el-table-column>
                <el-table-column label='医院名称' prop='orgFullName'></el-table-column>
                <el-table-column label='操作'>
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="addParentHspt2OrgList(scope.$index, scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class='pagination'>
                <el-pagination layout='total, sizes, prev, pager, next, jumper' :total='addedParentOrgTableDataNum' :page-sizes='[10,20,50]' @size-change="addParentOrgSizeChange" @current-change="addParentOrgCurrentChange" :page-size="serparams.pageSize">
                </el-pagination>
            </div>
        </el-dialog>

        <!-- 添加产品模态框 -->
        <el-dialog :title="dialogTitle" v-model="prodDialogFormVisible" @close="closeModal('prodAddDialogForm')">
            <el-form :model="addProdFormData" ref="prodAddDialogForm">
                <el-form-item label="租户产品标识" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="addProdFormData.code" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="租户产品名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="addProdFormData.name" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="租户名称" :label-width="formLabelWidth" prop="tenantName">
                    <el-input v-model="addProdFormData.tenantName"></el-input>
                </el-form-item>
                <el-form-item label="上级产品" :label-width="formLabelWidth" prop="pCode">
                    <el-select placeholder="请选择" v-model="addProdFormData.pCode" @change="choosePrtPrd">
                        <el-option v-for="item in productFirstLevelData" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品类型" :label-width="formLabelWidth" prop="productType">
                    <el-select placeholder="请选择" v-model="addProdFormData.productType" @change="setProductType">
                        <el-option v-for="item in dictionary.productType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="addProdFormData.description"></el-input>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closeModal('prodAddDialogForm')">返 回</el-button>
                    <el-button type="primary" @click="saveAddedProduct('prodAddDialogForm')">保 存</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 查看产品模态框 -->
        <el-dialog :title="dialogTitle" v-model="prodCheckDialogForm" @close="closeModal('serinfoForm')">
            <el-form :model="productCheckData" :rules="serformdata.serinforules" ref="prodInfoForm" auto-complete="off">
                <el-form-item label="租户产品标识" :label-width="formLabelWidth" prop="code">
                    <el-input v-model="productCheckData.code" disabled='true'></el-input>
                </el-form-item>
                <el-form-item label="租户产品名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="productCheckData.name" disabled='true'></el-input>
                </el-form-item>
                <el-form-item label="租户名称" :label-width="formLabelWidth" prop="tenantName">
                    <el-input v-model="basicData.tenantName" disabled='true'></el-input>
                </el-form-item>
                <el-form-item label="一级产品" :label-width="formLabelWidth" prop="pCode">
                    <el-select placeholder="请选择" v-model="productCheckData.pCode" disabled='true'>
                        <el-option v-for="item in productFirstLevelData" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品类别" :label-width="formLabelWidth" prop="productType">
                    <el-select v-model="productCheckData.productType" placeholder="请选择" disabled='true' @change="editProdType">
                        <el-option v-for="item in dictionary.productType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="productCheckData.description" :disabled='isProdReadOnly'></el-input>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closeModal('prodInfoForm')">返回</el-button>
                    <el-button v-show="isProdReadOnly" type="primary" @click="editProductInfo('serinfoForm')">我要编辑</el-button>
                    <el-button v-show="!isProdReadOnly" type="primary" @click="saveEditedProductInfo('serinfoForm')">保存</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 新增租户服务模态框 -->
        <el-dialog :title="dialogTitle" v-model="servAddDialogFormVisible" @close="closeModal('servAddDialogForm')">
            <el-form :model="servAddedDialogData" :rules="serformdata.serinforules" ref="servAddDialogForm" auto-complete="off">
                <el-form-item label="服务项目" :label-width="formLabelWidth" prop="serviceX">
                    <el-select v-model="servAddedDialogData.serviceX" placeholder="请选择" @change='chooseServItem'>
                        <el-option v-for="item in dictionary.svrItemCode" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务编码" :label-width="formLabelWidth" prop="serviceCode">
                    <el-input v-model="servAddedDialogData.serviceCode" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="服务说明" :label-width="formLabelWidth" prop="serviceDesc">
                    <el-input v-model="servAddedDialogData.serviceDesc" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="开通服务对象类别" :label-width="formLabelWidth" prop="objectId">
                    <el-select v-model="servAddedDialogData.objectId" placeholder="请选择">
                        <el-option v-for="item in dictionary.svrItemType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务主体标志" prop="mainFlag" :label-width="formLabelWidth">
                    <el-radio-group v-model="servAddedDialogData.mainFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效标志" prop="effectiveFlag" :label-width="formLabelWidth">
                    <el-radio-group v-model="servAddedDialogData.effectiveFlag" disabled="true">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closeModal('servAddDialogForm')">返回</el-button>
                    <el-button type="primary" @click="saveAddedService('servAddDialogForm')">保存</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 查看服务模态框 -->
        <el-dialog :title="dialogTitle" v-model="servCheckDialogForm" @close="closeModal('servCheck')">
            <el-form :model="ServiceDetailTableData" ref="servCheck">
                <el-form-item label="服务项目" :label-width="formLabelWidth" prop="serviceId">
                    <el-select class="serv_check" v-model="ServiceDetailTableData.serviceId" placeholder="请选择" :disabled="isServReadOnly">
                        <el-option v-for="item in dictionary.svrItemCode" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务编码" :label-width="formLabelWidth" prop="serviceNo">
                    <el-input class="serv_check" v-model="ServiceDetailTableData.serviceNo" :disabled="isServReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="服务说明" :label-width="formLabelWidth" prop="serviceDesc">
                    <el-input class="serv_check" v-model="ServiceDetailTableData.serviceDesc" :disabled="isServReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="开通服务对象类别" :label-width="formLabelWidth" prop="objectId">
                    <el-select placeholder="请选择" class="serv_check" v-model="ServiceDetailTableData.objectType" :disabled="isServReadOnly">
                        <el-option v-for="item in dictionary.svrItemType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务主体标志" :label-width="formLabelWidth" prop="mainFlag">
                    <el-radio-group v-model="ServiceDetailTableData.mainFlag" :disabled="isServReadOnly">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效标志" :label-width="formLabelWidth" prop="effectiveFlag">
                    <el-radio-group v-model="ServiceDetailTableData.effectiveFlag" :disabled="isServReadOnly">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closeModal('servCheck')">返回</el-button>
                    <el-button v-show="isServReadOnly" type="primary" @click="editService">我要编辑</el-button>
                    <el-button v-show="!isServReadOnly" type="primary" @click="saveEditedService">保存</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 服务新增修改模态框 -->
        <el-dialog :title="dialogTitle" v-model="serdialogFormVisible" @close="closeModal('serinfoForm')">
            <el-form :model="serformdata" :rules="serformdata.serinforules" ref="serinfoForm" auto-complete="off">
                <el-row>
                    <el-col>
                        <div id="zhuguanyis">
                            <el-form-item label="服务项目" :label-width="formLabelWidth" prop="serviceName" @click.native="showlist">
                                <el-input v-model="serformdata.serviceName" id="serviceName"></el-input>
                            </el-form-item>
                            <div class="yishenglist">
                                <p @click="mayclick()">清空搜索内容</p>
                                <p @click="mayclick(item,$event)" v-for="item in servicePacklist" :key="item.serviceId">{{item.serviceName}}</p>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-form-item label="模块编码" :label-width="formLabelWidth" prop="serviceCode">
                    <el-input v-model="serformdata.serviceCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="服务说明" :label-width="formLabelWidth" prop="serviceDesc">
                    <el-input v-model="serformdata.serviceDesc" disabled></el-input>
                </el-form-item>
                <el-form-item label="开通服务对象类别" :label-width="formLabelWidth" prop="objectType">
                    <el-select v-model="serformdata.objectType" placeholder="请选择">
                        <el-option v-for="item in dictionary.objectType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务主体标志" prop="mainFlag" :label-width="formLabelWidth">
                    <el-radio-group v-model="serformdata.mainFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效标志" prop="effectiveFlag" :label-width="formLabelWidth">
                    <el-radio-group v-model="serformdata.effectiveFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closeModal('serinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="sersubmitForm('serinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 服务扩展属性 - 新增模态框 -->
        <el-dialog :title="dialogTitle" v-model="addSerExtDialogFormVisible" @close="closeModal('addExtFldForm')">
            <el-form :model="serextformdata" ref="addExtFldForm" auto-complete="off">
                <el-form-item label="属性代码" :label-width="formLabelWidth" prop="exPropertyCode">
                    <el-select v-model="serextformdata.exPropertyCode" placeholder="请选择" :disabled='!isEditStatus'>
                        <el-option v-for="item in dictionary.svrOpenProperty" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性类型" :label-width="formLabelWidth" prop="exPropertyType">
                    <el-select v-model="serextformdata.exPropertyType" placeholder="请选择" :disabled='!isEditStatus'>
                        <el-option v-for="item in dictionary.baseDataType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性值" :label-width="formLabelWidth" prop="exPropertyData">
                    <el-input v-model="serextformdata.exPropertyData" :disabled='!isEditStatus'></el-input>
                </el-form-item>
                <el-form-item label="有效标志" :label-width="formLabelWidth" prop="effectiveFlag">
                    <el-radio-group v-model="serextformdata.effectiveFlag" :disabled='!isEditStatus'>
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="dialog-footer center-foot">
                    <el-button @click="closeModal('addExtFldForm')">返 回</el-button>
                    <el-button v-show='isEditStatus' type="primary" @click="saveServExtFld('addExtFldForm')">保 存</el-button>
                    <el-button v-show='!isEditStatus' type="primary" @click="goEditServExtFld('addExtFldForm')">我要编辑</el-button>
                </div>
            </el-form>
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
                /**
                 *  通用
                 */
                dialogTitle: "",
                formLabelWidth: '150px',
                isShowTabList: true, // 是否显示标签页
                headers: {
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                tenantOption: {
                    activeName: 'baseInfo', // 基础信息标签页
                    isdisabled: false, // true表示显示信息；false表示添加信息
                    isShowTab: true // 是否显示tab标签页
                },
                dictionary: { // 字典查询数据
                    medicalCombType: [{ // 租户维护-基本信息-类型
                        key: "",
                        text: "",
                        leaf: "",
                        index: "",
                        mcode: ""
                    }],
                    svrOpenProperty: [{ // 属性代码
                        key: "",
                        text: "",
                        leaf: "",
                        index: "",
                        mcode: ""
                    }],
                    baseDataType: [{ // 属性类型
                        key: "",
                        text: "",
                        leaf: "",
                        index: "",
                        mcode: ""
                    }],
                    productType: [{ // 产品类型
                        key: "",
                        text: "",
                        leaf: "",
                        index: "",
                        mcode: ""
                    }],
                    svrItemCode: [{ // 添加服务 - 服务项目
                        key: "",
                        text: "",
                        leaf: "",
                        index: "",
                        mcode: ""
                    }],
                    svrItemType: [{ // 开通服务对象类别
                        key: "",
                        text: "",
                        leaf: "",
                        index: "",
                        mcode: ""
                    }]
                },

                // Tab基本信息标签页
                hasBeenEdited: false, // 表单是否被编辑过
                tntMark: false,       // 租户标示兼容条件
                basicData: {          // 租户基本信息表单属性
                    status: 1,
                    tenantDesc: '',
                    tenantId: '',
                    tenantName: '',
                    tenantPhone: '',
                    tenantType: ''
                },

                // Tab机构列表标签页
                orgKeyword: '',                     // 机构列表搜索关键字
                addedOrgKeyword: '',                // 添加机构搜索关键字
                addedParentOrgKeyword: '',          // 添加上级机构搜索关键字
                OrgTableData: [],                   // 机构列表返回数据
                OrgTableDataNum: '',                // 条数
                addedOrgTableData: [],              // 添加机构列表
                addedOrgTableDataNum: '',           // 添加机构条数
                addedParentOrgTableData: [],        // 添加上级机构列表
                addedParentOrgTableDataNum: '',     // 添加上级机构条数
                isHasParentOrg: false,              // 是否有上级机构名称，无：添加；有：显示名称
                childOrgId: '',                     // 具有上级机构的机构ID
                parentOrgLabel: '',                 // 上级机构名称
                navdialogFormVisible: false,        // 添加机构模态框
                navdialogParentFormVisible: false,  // 添加上级机构模态框
                orgListPagination: {                // 机构列表分页
                    pageNo: 1,
                    pageSize: 10,
                },
                addedOrgListPagination: {           // 添加医院列表分页
                    pageNo: 1,
                    pageSize: 10,
                },
                addedParentOrgListPagination: {     // 添加上级医院列表分页
                    pageNo: 1,
                    pageSize: 10,
                },

                // Tab产品列表标签页
                test: '',
                ProductTableData: [], // 产品列表返回数据
                ProductTableDataNum: '', // 条数
                curProductCode: '', // 当前产品编码
                productCheckData: { // 查看产品返回数据
                    productType: ''
                },
                addProdTenantName: '', // 添加租户产品模态框-租户名称
                curProductTypeObj: '', // 当前已选产品类型
                isFstPrdEmpty: false,  // 一级产品是否为空
                addProdFormData: {     // 添加产品表单数据
                    code: '',
                    description: '',
                    name: '',
                    pCode: '',         // 一级产品
                    productType: '',   // 产品类型
                    status: 1,
                    tenantName: ''     // 租户名称
                },
                isProdEnable: false, // 产品列表启用和禁用状态
                prodDialogFormVisible: false, // 产品列表-添加产品模态框
                prodCheckDialogForm: false, // 产品列表-查看产品模态框
                isProdReadOnly: true, // 查看或编辑
                prodListPagination: { // 分页
                    pageNo: 1,
                    pageSize: 10,
                },
                productFirstLevelData: [{ // 一级产品返回数据
                    code: "",
                    tenantId: "",
                    name: "",
                    pCode: "",
                    status: "",
                    createDt: "",
                    creater: ""
                }],

                // Tab服务列表标签页
                dialogTitle2: "", //服务属性扩展的标题
                curopenserviceId: 0,
                curOpenServiceId: '',
                ServiceTableData: [], // 服务列表返回数据
                ServiceTableDataNum: '', // 条数
                servListPagination: { // 分页
                    pageNo: 1,
                    pageSize: 10,
                },
                exServiceTableData: [], // 服务列表-扩展属性返回数据
                exServiceTableDataNum: '', // 条数
                ServiceDetailTableData: { // 服务列表查看返回数据
                    serviceName: '',
                    serviceId: '',
                    serviceNo: '',
                    serviceDesc: '',
                    objectType: '',
                    mainFlag: '',
                    effectiveFlag: ''
                },
                servAddedDialogData: { // 服务列表-添加服务数据源
                    serviceId: '',
                    serviceCode: '',
                    serviceDesc: '',
                    objectId: '',
                    mainFlag: '1',
                    effectiveFlag: '1',
                    serviceX: ''
                },
                servCheckDialogForm: false,         // 服务列表查看模态框
                tenantServicUpdatedForm: {},        // 服务列表编辑保存的数据
                isServReadOnly: true,               // 查看服务是否只读
                servAddDialogFormVisible: false,    // 服务列表添加模态框
                addSerExtDialogFormVisible: false,  // 扩展属性添加模态框model
                isShowServExtend: false,            // 是否显示服务扩展列表页
                isEditStatus: false,                // 是否显示编辑按钮
                switchTxt: "禁用",                   // 禁用和启用按钮
                orgOption: {
                    activeName: 'baseInfo', //基础信息标签页
                    isdisabled: true,       //true表示显示信息；false表示添加信息
                    isShowTab: false        //是否显示tab标签页, true显示，false不显示
                },
                sertotal: '',
                serparams: { // 服务列表分页
                    pageNo: 1,
                    pageSize: 10
                },
                serextformdata: {       // 扩展服务属性添加
                    id: 0,              // id为0时表示新增，id有值时表示更新
                    openserviceId: "",
                    exPropertyCode: "", // 扩展属性代码
                    exPropertyType: "", // 属性类型
                    exPropertyData: "",
                    effectiveFlag: ""
                },
                serparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                serformdata: {
                    id: 0,
                    orgId: "",
                    tenantId: "",
                    serviceId: "",
                    serviceCode: "",
                    serviceName: "",
                    mainFlag: "",
                    effectiveFlag: "",
                    objectType: ""
                },
                qrcodeVisible: false,
                qrcodevalue: "",
                qrcodetit: "",
            }
        },
        activated() {
            this.tenantOption.activeName = 'baseInfo';
            this.init() //页面初始化
        },
        methods: {
            /**
             *  通用 
             */
            // 获取字典
            dictionaryRequest() {
                    var that = this;
                    let arr = [
                        "cfs.dic.base_medicalCombType", // 租户维护-基本信息-类型
                        "cfs.dic.base_svrOpenProperty", // 属性代码字典
                        "cfs.dic.base_baseDataType", // 属性类型字典
                        "cfs.dic.base_productType", // 一级产品类型
                        "cfs.dic.base_svrItemCode", // 服务项目
                        "cfs.dic.base_svrItemType" // 开通服务对象类别
                    ];

                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.medicalCombType = ele.items;
                                }
                                if (ele.dicId == arr[1]) {
                                    that.dictionary.svrOpenProperty = ele.items;
                                }
                                if (ele.dicId == arr[2]) {
                                    that.dictionary.baseDataType = ele.items;
                                }
                                if (ele.dicId == arr[3]) {
                                    that.dictionary.productType = ele.items;
                                }
                                if (ele.dicId == arr[4]) {
                                    that.dictionary.svrItemCode = ele.items;
                                }
                                if (ele.dicId == arr[5]) {
                                    that.dictionary.svrItemType = ele.items;
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
                // 关闭添加医院模态框
                closeAddHsptDialog() {
                    this.navdialogFormVisible = false;
                },
                // 关闭添加上级机构模态框 
                closeAddParentOrg() {
                    this.navdialogParentFormVisible = false;
                },
                // 模态框 - 关闭和取消按钮
                closeModal(formName) {
                    this.$refs[formName].resetFields();
                    if (formName == 'prodInfoForm') {             // 查看产品模态框
                        this.prodCheckDialogForm = false;
                    } else if (formName == 'prodAddDialogForm') { // 添加产品模态框
                        this.prodDialogFormVisible = false;
                    } else if (formName == 'servAddDialogForm') { // 添加服务模态框
                        this.servAddDialogFormVisible = false;
                    } else if (formName == 'addExtFldForm') {
                        this.addSerExtDialogFormVisible = false;  // 添加扩展属性模态框
                    } else if (formName == 'servCheck') {
                        this.servCheckDialogForm = false;
                    }
                },
                showlist() {
                    $(".yishenglist").show();
                },
                // 点击选项卡
                tabHandleClick(tab, event) {
                    if (tab.name == 'baseInfo') {
                        return;
                    }
                    let activeTab = event.target.innerHTML;
                    this.tenantOption.activeName = tab.name;
                    this.tenantOption.isShowTab = true;
                    if (activeTab == "机构列表") {
                        if (this.OrgTableData.length == 0) {
                            this.getOrgList();
                        }
                    } else if (activeTab == "产品列表") {
                        if (this.ProductTableData.length == 0) {
                            this.getProdList();
                        }
                    } else if (activeTab == "服务列表") {
                        if (this.ServiceTableData.length == 0) {
                            this.getServList();
                        }
                    }
                },
                // 判断是新增还是查看
                checkPrevBtn() {
                    if (this.$route.params.type) {
                        if (this.$route.params.type == 1) { // 新增租户传1
                            this.basicData = { // 重置
                                tenantId: '',
                                tenantType: '',
                                tenantName: '',
                                tenantPhone: '',
                                tenantDesc: ''
                            }
                            this.tenantOption.isShowTab = false; // 不显示其他标签页
                            this.tenantOption.isdisabled = false; // 表单可以修改
                        } else { // 查看租户传2
                            this.tenantOption.isShowTab = true; //显示标签页
                            this.tenantOption.isdisabled = true; //表单不可以修改
                            this.getTenantData()
                        }
                    }
                },


                /**
                 *  基本信息 
                 */
                // 基本信息 - 租户添加保存按钮
                saveBasicInfo() {
                    let params = [this.basicData];

                    commonAjax('cas.tenantManageService', 'tenantAdded', params).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "保存成功"
                            });
                            this.tenantOption.isShowTab = true; //显示其他标签页
                            this.tenantOption.isdisabled = true;
                            this.tntMark = true;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 基本信息 - 编辑后再保存
                saveEditedBasicInfo() {
                    let params = [this.basicData];

                    commonAjax('cas.tenantManageService', 'tenantUpdated', params).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "保存成功"
                            });
                            this.tenantOption.isShowTab = true; //显示其他标签页
                            this.tenantOption.isdisabled = true;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 基本信息 - 保存新增或者保存修改后的内容
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if (!this.hasBeenEdited) {
                                this.saveBasicInfo();
                            } else {
                                this.saveEditedBasicInfo();
                            }
                        } else { //数据不合法
                            return false;
                        }
                    });
                },
                // 基本信息 - 编辑按钮
                editBasicInfo() {
                    this.hasBeenEdited = true; // 保留痕迹
                    this.tenantOption.isdisabled = false;
                    this.tntMark = true;
                },
                // 基本信息 - 返回按钮
                leaveBasicInfo(formName) {
                    this.$refs[formName].resetFields();
                    this.$router.push('tenantManage');
                },
                // 如果是查询，获取租户基本查询信息
                getTenantData() {
                    if (this.$route.params.id) { // 获取租户ID
                        var tenantId = this.$route.params.id;
                    }

                    let params = [tenantId]

                    commonAjax('cas.tenantManageService', 'tenantDetail', params).then(res => {
                        if (res.code == 200) {
                            this.basicData.tenantId = res.body.tenantId
                            this.basicData.tenantType = res.body.tenantType
                            this.basicData.tenantName = res.body.tenantName
                            this.basicData.tenantPhone = res.body.tenantPhone
                            this.basicData.tenantDesc = res.body.tenantDesc
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                },


                /**
                 *  机构信息 
                 */
                // 获取机构列表
                getOrgList() {
                    let params = [{
                        tenantId: this.basicData.tenantId,
                        pageNo: this.orgListPagination.pageNo,
                        pageSize: this.orgListPagination.pageSize
                    }]

                    commonAjax("cas.tenantManageService", "searchTenantOrg", params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.data, function(index, el) {
                                el.number = (index + 1) + (params[0].pageNo - 1) * (params[0].pageSize);
                            });
                            this.OrgTableData = res.body.data;
                            this.OrgTableDataNum = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                },
                // 机构列表 - 单页条数
                updateOrgListPageSize(pageSize) {
                    this.orgListPagination.pageSize = pageSize;
                    this.getOrgList();
                },
                // 机构列表 - 当前页码
                updateOrgListCurPage(curPage) {
                    this.orgListPagination.pageNo = curPage;
                    this.getOrgList();
                },
                // 机构列表 - 添加机构 - 单页条数
                addOrgSizeChange(pageSize) {
                    this.addedOrgListPagination.pageSize = pageSize;
                    this.getHospitalList();
                },
                // 机构列表 - 添加机构 - 当前页码
                addOrgCurrentChange(curPage) {
                    this.addedOrgListPagination.pageNo = curPage;
                    this.getHospitalList();
                },
                // 机构列表 - 添加上级机构 - 单页条数
                addParentOrgSizeChange(pageSize) {
                    this.addedParentOrgListPagination.pageSize = pageSize;
                    this.getParentOrgList();
                },
                // 机构列表 - 添加上级机构 - 当前页码
                addParentOrgCurrentChange(curPage) {
                    this.addedParentOrgListPagination.pageNo = curPage;
                    this.getParentOrgList();
                },
                // 机构列表 - 搜索机构
                searchOrgList() {
                    let params = [{
                        tenantId: this.basicData.tenantId,
                        orgName: this.orgKeyword,
                        pageNo: this.orgListPagination.pageNo,
                        pageSize: this.orgListPagination.pageSize
                    }]

                    commonAjax("cas.tenantManageService", "searchTenantOrg", params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.data, function(index, el) {
                                el.number = (index + 1) + (params[0].pageNo - 1) * (params[0].pageSize);
                            });
                            this.OrgTableData = res.body.data;
                            this.OrgTableDataNum = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                },
                // 机构列表 - 删除按钮
                deleteOrg(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
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
                                message: "取消删除"
                            });
                        } else {
                            let params = [row.id];
                            commonAjax("cas.tenantManageService", "tenantOrgDeleted", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.getOrgList();
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
                // 机构添加 - 机构搜索（初始化列表视作搜索为空）
                getHospitalList() {
                    if (this.orgKeyword) {
                        var params = [{
                            'pageNo': this.addedOrgListPagination.pageNo,
                            'pageSize': this.addedOrgListPagination.pageSize,
                            'orgFullName': paramO.content
                        }]
                    } else {
                        var params = [{
                            'pageNo': this.addedOrgListPagination.pageNo,
                            'pageSize': this.addedOrgListPagination.pageSize
                        }]
                    }

                    commonAjax('cas.tenantManageService', 'searchOrg', params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.data, function(index, el) {
                                el.number = (index + 1) + (params[0].pageNo - 1) * (params[0].pageSize);
                            });
                            this.addedOrgTableData = res.body.data;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    });
                },
                // 机构列表 - 添加医院
                getAddedOrgList() {
                    this.dialogTitle = "添加医院";
                    this.navdialogFormVisible = true;

                    if (this.addedOrgKeyword) {
                        var params = [{
                            orgFullName: this.addedOrgKeyword,
                            pageNo: this.addedOrgListPagination.pageNo,
                            pageSize: this.addedOrgListPagination.pageSize
                        }];
                    } else {
                        var params = [{
                            pageNo: this.addedOrgListPagination.pageNo,
                            pageSize: this.addedOrgListPagination.pageSize
                        }];
                    }

                    commonAjax('cas.tenantManageService', 'searchOrg', params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.data, function(index, el) {
                                el.number = (index + 1) + (params[0].pageNo - 1) * (params[0].pageSize);
                            });
                            this.addedOrgTableData = res.body.data;
                            this.addedOrgTableDataNum = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 机构列表 - 获取上级医院列表
                getParentOrgList() {
                    if (this.addedParentOrgKeyword) {
                        var params = [{
                            orgName: this.addedParentOrgKeyword,
                            tenantId: this.basicData.tenantId,
                            pageNo: this.addedParentOrgListPagination.pageNo,
                            pageSize: this.addedParentOrgListPagination.pageSize
                        }];
                    } else {
                        var params = [{
                            tenantId: this.basicData.tenantId,
                            pageNo: this.addedParentOrgListPagination.pageNo,
                            pageSize: this.addedParentOrgListPagination.pageSize
                        }];
                    }

                    commonAjax('cas.tenantManageService', 'searchTenantOrg', params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.data, function(index, el) {
                                el.number = (index + 1) + (params[0].pageNo - 1) * (params[0].pageSize);
                            });
                            this.addedParentOrgTableData = res.body.data;
                            this.addedParentOrgTableDataNum = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 机构列表 - 添加上级医院
                getAddedParentOrgList(index, row) {
                    this.dialogTitle = '添加上级机构';
                    this.navdialogParentFormVisible = true;
                    this.childOrgId = row.id;
                    this.getParentOrgList();    
                },
                // 机构列表 - 删除上级医院
                delParentOrg(index, row) {
                    var params = [row.id];

                    commonAjax('cas.tenantManageService', 'tenantOrgParentDeleted', params).then(res => {
                        if (res.code == 200) {
                            this.getOrgList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 机构列表 - 添加医院到机构列表
                addHspt2OrgList(index, row) {
                    let params = [{
                        orderId: index,
                        orgId: row.orgId,
                        tenantId: this.basicData.tenantId
                    }];

                    commonAjax('cas.tenantManageService', 'tenantOrgAdded', params).then(res => {
                        if (res.code == 200) {
                            this.navdialogFormVisible = false; // 关闭模态框
                            this.$message({
                                type: 'success',
                                message: '添加成功！'
                            });
                            this.getOrgList(); // 刷新机构列表
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 机构列表 - 添加'上级医院'到机构列表
                addParentHspt2OrgList(index, row) {
                    let params = [{
                        id: this.childOrgId,
                        orgPid: row.orgId
                    }];

                    commonAjax('cas.tenantManageService', 'tenantOrgParentUpdated', params).then(res => {
                        if (res.code == 200) {
                            this.navdialogParentFormVisible = false;
                            this.$message({
                                type: 'success',
                                message: '添加成功！'
                            });
                            this.getOrgList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },


                /**
                 *  产品信息 
                 */
                // 产品列表 - 获取产品列表
                getProdList() {
                    let params = [{
                        tenantId: this.basicData.tenantId,
                        pageNo: this.prodListPagination.pageNo,
                        pageSize: this.prodListPagination.pageSize
                    }];

                    commonAjax("cas.tenantManageService", "productList", params).then(res => {
                        if (res.code == 200) {
                            $.each(res.body.data, function(index, el) {
                                el.number = (index + 1) + (params[0].pageNo - 1) * (params[0].pageSize);
                            });
                            this.ProductTableData = res.body.data;
                            this.ProductTableDataNum = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    });
                },
                // 产品列表 - 单页条数
                updateProdListPageSize(pageSize) {
                    this.prodListPagination.pageSize = pageSize;
                    this.getProdList();
                },
                // 产品列表 - 当前页码
                updateProdListCurPage(curPage) {
                    this.prodListPagination.pageNo = curPage;
                    this.getProdList();
                },
                // 产品列表 - 查看产品
                checkProduct(index, row) {
                    this.dialogTitle = "查看租户产品",
                    this.isProdReadOnly = true;
                    this.prodCheckDialogForm = true;
                    this.curProductCode = row.code;

                    let params = [row.code];

                    commonAjax('cas.tenantManageService', 'productDetail', params).then(res => {
                        if (res.code == 200) {
                            this.productCheckData = res.body;
                            switch (res.body.code) {
                                case 'hcn.patient':
                                    this.productCheckData.productType = '患者版';
                                    break;
                                case 'hcn.patient_ios':
                                    this.productCheckData.productType = '患者版_ios';
                                    break;
                                case 'hcn.patient_android':
                                    this.productCheckData.productType = '患者版_android';
                                    break;
                                case 'hcn.doctor':
                                    this.productCheckData.productType = '医生版';
                                    break;
                                case 'hcn.doctor_ios':
                                    this.productCheckData.productType = '医生版_ios';
                                    break;
                                case 'hcn.doctor_android':
                                    this.productCheckData.productType = '医生版_android';
                                    break;
                                case 'hcn.admin':
                                    this.productCheckData.productType = '管理版';
                                    break;
                                case 'hcn.admin_pc':
                                    this.productCheckData.productType = '管理版_pc';
                                    break;
                                default:
                                    this.productCheckData.productType = '';
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 产品列表 - 编辑产品类别
                editProdType(val) {
                    console.log(val)
                },
                // 产品列表 - 编辑产品信息
                editProductInfo() {
                    this.isProdReadOnly = false;
                    this.getFirstLevelProduct();
                    // this.productCheckData.productType = this.dictionary.productType;
                },
                // 产品列表 - 获取一级产品信息
                getFirstLevelProduct() {
                    let params = [this.basicData.tenantId]; //租户编码

                    commonAjax('cas.tenantManageService', 'productFirstLevel', params).then(res => {
                        if (res.code == 200) {
                            if (res.body.length != 0) { // 返回一级产品
                                this.productFirstLevelData = res.body;     
                            } else {  // 没有返回
                                this.isFstPrdEmpty = true;
                                this.dictionary.productType = [
                                    {
                                      "key": "patient",
                                      "text": "患者版",
                                      "leaf": true,
                                      "index": 0,
                                      "mcode": "hzb"
                                    },
                                    {
                                      "key": "doctor",
                                      "text": "医生版",
                                      "leaf": true,
                                      "index": 0,
                                      "mcode": "ysb"
                                    },
                                    {
                                      "key": "admin",
                                      "text": "管理版",
                                      "leaf": true,
                                      "index": 0,
                                      "mcode": "glb"
                                    }
                                ];
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 产品列表 - 选择一级产品
                choosePrtPrd() {
                    let myPcode = this.addProdFormData.pCode;
                    if ( myPcode.indexOf('admin') != -1 ) {        // 管理
                        this.dictionary.productType = [{
                            "key": "admin_pc",
                            "text": "管理版_pc",
                            "leaf": true,
                            "index": 0,
                            "mcode": "glb_pc"
                        }];
                    } else if ( myPcode.indexOf('doctor') != -1 ) { // 医生
                        this.dictionary.productType = [{
                            "key": "doctor_ios",
                            "text": "医生版_ios",
                            "leaf": true,
                            "index": 0,
                            "mcode": "ysb_ios"
                        }, {
                              "key": "doctor_android",
                              "text": "医生版_android",
                              "leaf": true,
                              "index": 0,
                              "mcode": "ysb_android"
                        }];
                    } else {                                        // 患者
                        this.dictionary.productType = [{
                            "key": "patient_ios",
                            "text": "患者版_ios",
                            "leaf": true,
                            "index": 0,
                            "mcode": "hzb_ios"
                        }, {
                              "key": "patient_android",
                              "text": "患者版_android",
                              "leaf": true,
                              "index": 0,
                              "mcode": "hzb_android"
                        }];
                    }
                },
                // 产品列表 - 添加产品
                addProduct() {
                    this.addProdFormData.productType = '';
                    this.addProdFormData.code = '';
                    this.addProdFormData.name = '';
                    this.addProdFormData.description = '';

                    this.dialogTitle = "添加租户产品";
                    this.addProdFormData.tenantName = this.basicData.tenantName;
                    this.prodDialogFormVisible = true;
                    this.getFirstLevelProduct();
                },
                // 产品列表 - 选择产品类型
                setProductType(val) {
                    var self = this;
                    $.each(self.dictionary.productType, function(index, ele) {
                        if (ele.key == val) {
                            self.curProductType = ele.text;
                        }
                    });

                    this.addProdFormData.productType = this.curProductType;
                    this.addProdFormData.code = this.basicData.tenantId + '.' + val;
                    this.addProdFormData.name = this.basicData.tenantName + '.' + this.curProductType;

                    if (this.prodDialogFormVisible == false) {
                        this.addProdFormData.productType = '';
                        this.addProdFormData.code = '';
                        this.addProdFormData.name = '';
                    }
                },
                // 产品列表 - 保存添加的产品
                saveAddedProduct() {
                    delete this.addProdFormData.productType;
                    delete this.addProdFormData.tenantName;
                    this.addProdFormData.tenantId = this.basicData.tenantId;
                    let params = [this.addProdFormData];

                    commonAjax('cas.tenantManageService', 'productAdded', params).then(res => {
                        if (res.code == 200) {
                            this.prodDialogFormVisible = false;
                            this.getProdList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 产品列表 - 保存编辑后的产品信息
                saveEditedProductInfo(index, row) {
                    delete this.productCheckData.productType;
                    delete this.productCheckData.createDt;
                    delete this.productCheckData.creater;
                    delete this.productCheckData.lastModify;
                    delete this.productCheckData.modifier;
                    // let params = [this.curProductCode, this.productCheckData];
                    let params = [this.productCheckData];

                    commonAjax('cas.tenantManageService', 'productUpdated', params).then(res => {
                        if (res.code == 200) {
                            this.prodCheckDialogForm = false;
                            this.getProdList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 产品列表 - 禁用启用
                handleForbidden(index, row) {
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
                                commonAjax('cas.tenantManageService', 'productStatusUpdated', [{
                                    code: row.code,
                                    status: 0
                                }]).then(res => {
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
                    } else {
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
                                commonAjax('cas.tenantManageService', 'productStatusUpdated', [{
                                    code: row.code,
                                    status: 1
                                }]).then(res => {
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
                // 点击生成二维码
                showqrcode(index, row) {
                    this.qrcodeVisible = true;
                    this.qrcodetit = row.orgFullName;
                    let temobj = {
                        type: "1", //二维码类型，必传
                        tenantId: this.$route.params.id, //租户ID，必传
                        orgId:row.orgId, //机构ID，必传
                        t: new Date().getTime() //时间戳，必传
                    };
                    temobj = JSON.stringify(temobj);
                    let b = new Base64();
                    this.qrcodevalue = "https://app.bshcn.com.cn/download/apk/appdowmload.html?data=" + b.encode(temobj);
                    let str = b.decode(b.encode(temobj));//解码
                    // alert(str);
                },


                /**
                 *  服务信息 
                 */
                // 服务列表 - 获取服务列表
                getServList() {
                    let params = [{
                        tenantId: this.basicData.tenantId,
                        pageNo: this.servListPagination.pageNo,
                        pageSize: this.servListPagination.pageSize
                    }]

                    commonAjax("cas.tenantManageService", "tenantServiceList", params).then(res => {
                        if (res.code == 200) {
                            this.ServiceTableData = res.body.data;
                            this.ServiceTableDataNum = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                },
                // 服务列表 - 单页条数
                updateServListPageSize(pageSize) {
                    this.servListPagination.pageSize = pageSize;
                    this.getServList();
                },
                // 服务列表 - 当前页码
                updateServListCurPage(curPage) {
                    this.servListPagination.pageNo = curPage;
                    this.getServList();
                },
                // 服务列表 - 编辑查看的服务信息
                editService() {
                    this.isServReadOnly = false;
                },
                // 服务列表 - 保存编辑过的服务信息
                saveEditedService() {
                    let params = [this.ServiceDetailTableData];

                    commonAjax('cas.tenantManageService', 'tenantServicUpdated', params).then(res => {
                        if (res.code == 200) {
                            this.servCheckDialogForm = false;
                            this.getServList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 服务列表 - 添加扩展属性
                addExtendField() {
                    this.dialogTitle = '添加租户服务扩展属性';
                    this.serextformdata.exPropertyCode = '';
                    this.serextformdata.exPropertyType = '';
                    this.serextformdata.exPropertyData = '';
                    this.serextformdata.effectiveFlag = '';
                    this.isEditStatus = true;
                    this.addSerExtDialogFormVisible = true; // 显示添加扩展属性模态框
                },
                // 服务列表 - 编辑扩展属性
                editServExtFld(index, row) {
                    this.dialogTitle = '添加租户服务扩展属性';
                    this.addSerExtDialogFormVisible = true;
                    this.isEditStatus = false;

                    // this.serextformdata = this.exServiceTableData[index];
                    this.serextformdata.id = this.exServiceTableData[index].id;
                    this.serextformdata.exPropertyCode = this.exServiceTableData[index].exPropertyCode;
                    this.serextformdata.exPropertyType = this.exServiceTableData[index].exPropertyType;
                    this.serextformdata.exPropertyData = this.exServiceTableData[index].exPropertyData;
                    this.serextformdata.effectiveFlag = this.exServiceTableData[index].effectiveFlag;
                },
                // 服务列表 - 扩展属性 - 我要编辑 
                goEditServExtFld() {
                    this.isEditStatus = true;
                },
                // 服务列表 - 服务新增和编辑时候选择服务项目时候的联动
                mayclick(item, event) {
                    if (item == undefined && event == undefined) {
                        this.serformdata.serviceDesc = "";
                        this.serformdata.serviceCode = "";
                        this.serformdata.serviceId = "";
                        this.serformdata.serviceName = "";
                    } else {
                        this.serformdata.serviceDesc = item.serviceDesc;
                        this.serformdata.serviceCode = item.serviceCode;
                        this.serformdata.serviceId = item.serviceId;
                        this.serformdata.serviceName = item.serviceName;

                    }
                    $(".yishenglist").hide();
                },
                // 服务列表 - 点击添加服务
                addService() {
                    this.dialogTitle = '新增租户服务';
                    this.servAddDialogFormVisible = true;
                },
                // 服务列表 - 添加服务 - 服务项目选择
                chooseServItem(val) {
                    if (this.servAddDialogFormVisible == false) {
                        return;
                    }

                    let params = [val];

                    commonAjax('cas.tenantManageService', 'getAvailableServiceByCode', params).then(res => {
                        if (res.code == 200) {
                            this.servAddedDialogData.serviceId = res.body.serviceId;
                            this.servAddedDialogData.serviceCode = res.body.serviceCode;
                            this.servAddedDialogData.serviceDesc = res.body.serviceDesc;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 服务列表 - 保存新增租户服务
                saveAddedService(formName) {
                    var self = this;
                    $.each(self.dictionary.svrItemType, function(index, ele) {
                        if (ele.key == self.servAddedDialogData.objectId) {
                            self.servAddedDialogData.objectType = ele.text;
                        }
                    });

                    delete this.servAddedDialogData.serviceX;
                    delete this.servAddedDialogData.serviceCode;
                    delete this.servAddedDialogData.serviceDesc;
                    this.servAddedDialogData.tenantId = this.basicData.tenantId;
                    let params = [this.servAddedDialogData];

                    commonAjax('cas.tenantManageService', 'tenantServicAdded', params).then(res => {
                        if (res.code == 200) {
                            this.servAddDialogFormVisible = false;
                            this.getServList();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 服务列表开始
                sergetTableData() {
                    if (this.orgOption.orgId) {
                        // var tenantId = sessionStorage.getItem('tenantId');
                        var tenantId = this.basicData.tenantId;
                        let params = `["${tenantId}","${this.orgOption.orgId}"]`;
                        commonAjax("cas.serviceOpenService", "queryOrgService", params).then(res => {
                            if (res.code == 200) {
                                this.sertableData = res.body;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    }
                },
                // 服务列表 - 关闭和启用
                servListSwitch(index, row) {
                    if (row.effectiveFlag == 1) { // 关闭
                        const h = this.$createElement;
                        this.$msgbox({
                            title: '确认关闭？',
                            message: h('p', null, [
                                h('span', null, ''),
                                h('i', {
                                    style: 'color: teal'
                                }, '')
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
                                    message: "取消关闭"
                                });
                            } else {
                                // let params = `[${row.id},'${row.effectiveFlag == 0 ? 1 : 0}']`
                                let params = [{
                                    effectiveFlag: 0,
                                    id: row.id,
                                    tenantId: this.basicData.tenantId
                                }];
                                row.effectiveFlag = 0
                                commonAjax("cas.tenantManageService", "tenantServicStatusUpdated", params).then(res => {
                                    if (res.code == 200) {
                                        this.$message({
                                            type: 'success',
                                            message: "关闭成功"
                                        });
                                        this.sergetTableData();
                                    } else {
                                        this.$message({
                                            type: 'error',
                                            message: res.msg
                                        });
                                    }
                                });
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
                                }, '')
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
                                    message: "取消启用"
                                });
                            } else {
                                // let params = `[${row.id},'${row.effectiveFlag == 0 ? 1 : 0}']`
                                let params = [{
                                    effectiveFlag: 1,
                                    id: row.id,
                                    tenantId: this.basicData.tenantId
                                }];
                                row.effectiveFlag = 1
                                commonAjax("cas.tenantManageService", "tenantServicStatusUpdated", params).then(res => {
                                    if (res.code == 200) {
                                        this.$message({
                                            type: 'success',
                                            message: "启用成功"
                                        });
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
                // 服务列表 - 新增扩展属性 - 保存
                saveServExtFld(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            var self = this;
                            if (!this.isEditStatus) {
                                commonAjax("cas.tenantManageService", "servicePropertyAdded", '[' + JSON.stringify(self.serextformdata) + ']').then(res => {
                                    if (res.code == 200) {
                                        self.$message({
                                            type: 'success',
                                            message: "保存成功"
                                        });
                                        self.addSerExtDialogFormVisible = false; //关闭模态框
                                        self.getServListExtendFld(this.curOpenServiceId); //继续查询扩展属性
                                    } else {
                                        self.$message({
                                            type: 'error',
                                            message: res.msg
                                        });
                                    }
                                });
                            } else {
                                commonAjax("cas.tenantManageService", "servicePropertyUpdated", '[' + JSON.stringify(self.serextformdata) + ']').then(res => {
                                    if (res.code == 200) {
                                        self.$message({
                                            type: 'success',
                                            message: "保存成功"
                                        });
                                        self.addSerExtDialogFormVisible = false;          //关闭模态框
                                        self.getServListExtendFld(this.curOpenServiceId); //继续查询扩展属性
                                    } else {
                                        self.$message({
                                            type: 'error',
                                            message: res.msg
                                        });
                                    }
                                });
                            }
                        } else {
                            return false;
                        }
                    });
                },
                sersubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.serviceOpenService", "addOrUpdateServiceOpen", '[' + JSON.stringify(this.serformdata) + ']', ).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.sergetTableData();
                                    this.serdialogFormVisible = false;
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg
                                    });
                                }
                            });
                            // alert('submit!');
                        } else {
                            return false;
                        }
                    });
                },
                // 服务列表 - 请求服务包列表
                getServicePacklist() {
                    commonAjax("cas.serviceService", "queryServices", '[]', ).then(res => {
                        if (res.code == 200) {
                            this.servicePacklist = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 服务列表 - 查看服務詳情
                servListCheck(index, row) {
                    this.dialogTitle = '查看租户服务';
                    this.isServReadOnly = true;
                    this.servCheckDialogForm = true;

                    let params = [row.id];

                    commonAjax('cas.tenantManageService', 'tenantServiceDetail', params).then(res => {
                        if (res.code == 200) {
                            this.ServiceDetailTableData = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 点击服务列表的扩展属性
                getServListExtendFld(row) {
                    this.isShowTabList = false;
                    this.isShowServExtend = true;

                    if (row.id || row) { // 从服务列表过来
                        if (row.id) {
                            var params = [row.id]; // openserviceId
                            this.serextformdata.openserviceId = row.id;
                            this.curOpenServiceId = row.id; // 赋值给当前openServiceId
                        } else {
                            var params = [row]; //直接把row当作openserviceid
                            this.curOpenServiceId = row;
                        }
                    } else { // 保存了新的扩展属性
                        params = [this.curOpenServiceId];
                    }

                    commonAjax('cas.tenantManageService', 'servicePropertyList', params).then(res => {
                        if (res.code == 200) {
                            this.exServiceTableData = res.body;
                            this.exServiceTableDataNum = res.body.length;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 删除服务扩展属性方法
                delServExtFld(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.exPropertyData)
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
                            let params = [row.id];
                            commonAjax("cas.tenantManageService", "servicePropertyDeleted", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.getServListExtendFld(this.curopenserviceId);
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

                // 初始化
                init() {
                    this.isShowTabList = true;
                    this.isShowServExtend = false;
                    this.dictionaryRequest();
                    this.checkPrevBtn();
                },

                //传递数据都地区组件
                postdefaultarea() {
                    // this.defaultarea = {
                    //     province: this.orgOption.province,
                    //     city: this.orgOption.city,
                    //     district: this.orgOption.district,
                    //     street: this.orgOption.street,
                    // };
                },
        },
         components: {
            vueQrcodeComponent
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.postdefaultarea();
                vm.OrgTableData = [];
                vm.ProductTableData = [];
                vm.ServiceTableData = [];
            })
        }
}
</script>
<style type="text/css" scoped=''>
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
    width: 800px;
    overflow: hidden;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.eltabpane {
    margin: 0 auto;
}

h2.account-title {
    font-size: 16px;
    background: #EEE;
    padding: 5px 5%;
    margin-bottom: 20px
}

.el-upload-list__item.is-success:hover .el-icon-close {
    position: absolute;
    top: 5px;
    right: 10px;
}

.explains {
    font-size: 12px;
    color: rgb(131, 164, 165);
    line-height: 36px;
}

.addbtn {
    margin: 0 0 20px;
    text-align: right;
}

.qrimg {
    display: block;
    margin: 20px auto;
    width: 200px;
    height: 200px
}

#zhuguanyis {
    position: relative;
    display: inline-block;
}

#zhuguanyis .yishenglist {
    position: absolute;
    display: none;
    left: 150px;
    top: 32px;
    z-index: 9;
    width: 172px;
    height: 200px;
    overflow: auto;
    -webkit-box-shadow: 0 0 10px rgba(230, 230, 230, .9);
    -moz-box-shadow: 0 0 10px rgba(230, 230, 230, .9);
    box-shadow: 0 0 10px rgba(230, 230, 230, .9);
    background: #fff;
    border-radius: 0 0 10px 10px;
    padding: 10px
}

#zhuguanyis .yishenglist p {
    line-height: 26px;
    height: 26px;
    margin-top: 5px;
    background: #f1f1f1;
    padding-left: 10px
}

#zhuguanyis .yishenglist p:nth-child(1) {
    background: #1dc499;
    color: #fff
}


/*添加医院模态框样式*/

.hospitalList {
    margin-top: 10px;
}

.orglist-icon-close {
    color: orange
}

.serv_check {
    width: 175px;
}
#qrcode {
    width: 300px;
    height: 300px;
    margin: 30px auto;
}
</style>
