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
                            <el-input v-model="basicData.tenantId" :disabled="tenantOption.isdisabled"></el-input>
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
                        <el-table-column prop="parentOrg" label="上级机构">
                            <template scope="scope">
                                <el-button size="small" type="success" @click="addParentOrg(scope.$index, scope.row)">添加</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" type="danger" @click="deleteOrg(scope.$index, scope.row)">删除</el-button>
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
                        <el-table-column prop="tenantId" label="租户产品标识"></el-table-column>
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
                                <el-button size="small" type="warning" @click="getServListExtendFld(scope.$index, scope.row)">扩展属性</el-button>
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

        <!-- 服务扩展属性列表  -->
        <el-row v-if="isShowServExtend">
            <el-table :data="exServiceTableData" border style="width: 100%">
                <el-table-column prop="exPropertyType" label="属性" width="100"></el-table-column>
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
                        <el-button size="small" @click="serhandleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="serhandleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="ServiceTableDataNum" :page-sizes="[10,20,50]" @size-change="serhandleSizeChange" @current-change="serhandleCurrentChange" :page-size="serparams.pageSize">
                </el-pagination>
            </div>
        </el-row>

        <!-- 模态框  -->
        <!-- 添加医院模态框 -->
        <el-dialog :title="dialogTitle" v-model="navdialogFormVisible" @close="resetForm('navinfoForm')">
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
                <el-pagination layout='total, sizes, prev, pager, next, jumper' :total='addedOrgTableDataNum'  :page-sizes='[10,20,50]' @size-change="addOrgSizeChange" @current-change="addOrgCurrentChange" :page-size="serparams.pageSize">
                </el-pagination>
            </div>
        </el-dialog>

        <!-- 添加产品模态框 -->
        <el-dialog :title="dialogTitle" v-model="prodDialogFormVisible" @close="resetForm('prodAddDialogForm')">
            <el-form :model="serformdata" :rules="serformdata.serinforules" ref="prodAddDialogForm" auto-complete="off">
                <el-form-item label="租户产品标识" :label-width="formLabelWidth" prop="serviceCode">
                    <el-input v-model="serformdata.serviceCode"></el-input>
                </el-form-item>
                <el-form-item label="租户产品名称" :label-width="formLabelWidth" prop="serviceDesc">
                    <el-input v-model="serformdata.serviceDesc"></el-input>
                </el-form-item>
                <el-form-item label="租户名称" :label-width="formLabelWidth" prop="serviceDesc">
                    <el-input v-model="basicData.tenantName"></el-input>
                </el-form-item>

                <el-form-item label="一级产品" :label-width="formLabelWidth" prop="productFirstLevelData">
                    <el-select v-model="prodFirstLevelOption" placeholder="请选择">
                        <el-option v-for="item in productFirstLevelData" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="产品类型" :label-width="formLabelWidth" prop="productTypes">
                    <el-select v-model="test" placeholder="请选择">
                        <el-option v-for="item in dictionary.productTypes" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="说明" :label-width="formLabelWidth" prop="serviceCode">
                    <el-input v-model="serformdata.serviceCode"></el-input>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closesermodal('prodAddDialogForm')">返 回</el-button>
                    <el-button type="primary" @click="sersubmitForm('prodAddDialogForm')">保 存</el-button>
                </div>
            </el-form>
        </el-dialog>
            
        <!-- 查看产品模态框 -->
        <el-dialog :title="dialogTitle" v-model="prodCheckDialogForm" @close="resetForm('serinfoForm')">
            <el-form :model="serformdata" :rules="serformdata.serinforules" ref="prodInfoForm" auto-complete="off">
                <el-form-item label="租户产品标识" :label-width="formLabelWidth" prop="serviceCode">
                    <el-input v-model="serformdata.serviceCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="租户产品名称" :label-width="formLabelWidth" prop="serviceDesc">
                    <el-input v-model="serformdata.serviceDesc" disabled></el-input>
                </el-form-item>
                <el-form-item label="租户名称" :label-width="formLabelWidth" prop="serviceDesc">
                    <el-input v-model="serformdata.serviceDesc" disabled></el-input>
                </el-form-item>
                <el-form-item label="一级产品" :label-width="formLabelWidth" prop="objectType">
                    <el-select v-model="serformdata.objectType" placeholder="请选择">
                        <el-option v-for="item in dictionary.objectType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="产品类别" :label-width="formLabelWidth" prop="objectType">
                    <el-select v-model="serformdata.objectType" placeholder="请选择">
                        <el-option v-for="item in dictionary.objectType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" :label-width="formLabelWidth" prop="serviceCode">
                    <el-input v-model="serformdata.serviceCode" disabled></el-input>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closesermodal('prodInfoForm')">返回</el-button>
                    <el-button type="primary" @click="sersubmitForm('serinfoForm')">我要编辑</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 添加服务模态框 -->
        <el-dialog :title="dialogTitle" v-model="servAddDialogFormVisible" @close="resetForm('servAddDialogForm')">
            <el-form :model="servAddedDialogData" :rules="serformdata.serinforules" ref="servAddDialogForm" auto-complete="off">
                <el-row>
                    <el-col>
                        <div id="zhuguanyis">
                            <el-form-item label="服务项目" :label-width="formLabelWidth" prop="serviceId" @click.native="showlist">
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
                    <el-button @click="closesermodal('servAddDialogForm')">返回</el-button>
                    <el-button type="primary" @click="sersubmitForm('servAddDialogForm')">保存</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 查看服务模态框 -->
        <el-dialog :title="dialogTitle" v-model="servCheckDialogForm" @close="resetForm('serinfoForm')">
            <el-form :model="ServiceDetailTableData" :rules="serformdata.serinforules" ref="serinfoForm" auto-complete="off">
                <el-row>
                    <el-col>
                        <div id="zhuguanyis">
                            <el-form-item label="服务项目" :label-width="formLabelWidth" prop="serviceId" @click.native="showlist">
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
                    <el-button @click="closesermodal('serinfoForm')">返回</el-button>
                    <el-button type="primary" @click="sersubmitForm('serinfoForm')">我要编辑</el-button>
                </div>
            </el-form>
        </el-dialog>
    
        <!-- 报告说明模态框 -->
        <el-dialog :title="dialogTitle" v-model="repdialogFormVisible" @close="resetForm('repinfoForm')">
            <el-form :model="repformdata" :rules="repformdata.repinforules" ref="repinfoForm" auto-complete="off">
                <el-form-item label="报告大类型" :label-width="formLabelWidth" prop="reportCatalog">
                    <el-select v-model="repformdata.reportCatalog" placeholder="请选择">
                        <el-option v-for="item in dictionary.reportType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报告类型" :label-width="formLabelWidth" prop="reportType">
                    <el-select v-model="repformdata.reportType" placeholder="请选择">
                        <el-option v-for="item in dictionary.medicalCombType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明标题" :label-width="formLabelWidth" prop="instructionTitle">
                    <el-input v-model="repformdata.instructionTitle"></el-input>
                </el-form-item>
                </el-form-item>
                <el-form-item label="备注说明" :label-width="formLabelWidth" prop="remark">
                    <el-input v-model="repformdata.remark"></el-input>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closerepmodal('repinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="repsubmitForm('repinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>

        <!-- 服务新增修改模态框 -->
        <el-dialog :title="dialogTitle" v-model="serdialogFormVisible" @close="resetForm('serinfoForm')">
            <el-form :model="serformdata" :rules="serformdata.serinforules" ref="serinfoForm" auto-complete="off">
                <!-- <el-form-item label="服务项目" prop="serviceId" :label-width="formLabelWidth">
                                <el-select v-model="serformdata.serviceId" placeholder="请选择">
                                    <el-option v-for="item in servicePacklist" :key="item.serviceId" :label="item.serviceName" :value="item.serviceId">
                                    </el-option>
                                </el-select>
                            </el-form-item> -->
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
                    <el-button @click="closesermodal('serinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="sersubmitForm('serinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
    
        <!-- 服务扩展属性 - 新增或编辑模态框 -->
        <el-dialog :title="dialogTitle" v-model="addSerExtDialogFormVisible" @close="resetForm('addExtFldForm')">
            <el-form :model="serextformdata" ref="addExtFldForm" auto-complete="off">
    
                <el-form-item label="属性代码" :label-width="formLabelWidth" prop="svrOpenProperty">
                    <el-select v-model="serextformdata.exPropertyCode" placeholder="请选择">
                        <el-option v-for="item in dictionary.svrOpenProperty" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
    
                <el-form-item label="属性类型" :label-width="formLabelWidth" prop="baseDataType">
                    <el-select v-model="serextformdata.exPropertyType" placeholder="请选择">
                        <el-option v-for="item in dictionary.baseDataType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
    
                <el-form-item label="属性值" :label-width="formLabelWidth" prop="exPropertyData">
                    <el-input v-model="serextformdata.exPropertyData"></el-input>
                </el-form-item>
                <el-form-item label="有效标志" :label-width="formLabelWidth" prop="effectiveFlag">
                    <el-radio-group v-model="serextformdata.effectiveFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="dialog-footer center-foot">
                    <el-button @click="closesermodal('addExtFldForm')">返 回</el-button>
                    <el-button type="primary" @click="serextsubmitForm('addExtFldForm')">保 存</el-button>
                </div>
            </el-form>
        </el-dialog>
    
    </div>
</template>
<script>
import { commonAjax } from '../../api/api';
export default {
    data() {
        return {
            // 通用
            headers: {
                "X-Access-Token": sessionStorage.getItem("accessToken")
            },
            tenantOption: {             
                activeName: 'baseInfo', //基础信息标签页
                isdisabled: true,       //true表示显示信息；false表示添加信息
                isShowTab: true         //是否显示tab标签页
            },
            formLabelWidth: '150px',
            dialogTitle: "",
            isShowTabList: true,        //是否显示标签页
            // 字典查询数据
            dictionary: {
                medicalCombType: [{     // 租户维护-基本信息-类型
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }],
                svrOpenProperty: [{    // 属性代码
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }],
                baseDataType: [{       // 属性类型
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }],
                productTypes: [{       // 产品类型
                    key: "",
                    text: "",
                    leaf: "",
                    index: "",
                    mcode: ""
                }]
            },

            // Tab基本信息标签页
            // 租户基本信息表单属性
            basicData: {
                status: 1,
                tenantDesc: '',
                tenantId: '',
                tenantName: '',
                tenantPhone: '',
                tenantType: ''
            },
            hasBeenEdited: false,       // 表单是否被编辑过

            // Tab机构列表标签页
            orgKeyword: '',             // 机构列表搜索关键字
            addedOrgKeyword: '',        // 添加机构搜索关键字
            OrgTableData: [],           // 机构列表返回数据
            OrgTableDataNum: '',        // 条数
            orgListPagination: {        // 机构列表分页
                pageNo: 1,
                pageSize: 10,
            },
            addedOrgTableData: [],      // 添加机构列表
            addedOrgTableDataNum: '',   // 条数
            addedOrgListPagination: {   // 添加医院列表分页
                pageNo: 1,
                pageSize: 10,
            },
            navdialogFormVisible: false,//机构列表-添加机构模态框

            // Tab产品列表标签页
            ProductTableData: [],         // 产品列表返回数据
            ProductTableDataNum: '',      // 条数
            prodListPagination: {         // 分页
                pageNo: 1,
                pageSize: 10,
            },
            addProdTenantName: '',        // 添加租户产品模态框-租户名称
            productCheckData: '',         // 查看产品返回数据
            isProdEnable: false,          // 产品列表启用和禁用状态
            prodDialogFormVisible: false, //产品列表-添加产品模态框
            prodCheckDialogForm: false,   //产品列表-查看产品模态框
            productFirstLevelData: [{     // 一级产品返回数据
                code: "",
                tenantId: "",
                name: "",
                pCode: "",
                status: "",
                createDt: "",
                creater: ""
            }],
            
            // Tab服务列表标签页
            ServiceTableData: [],       // 服务列表返回数据
            ServiceTableDataNum: '',    // 条数
            servListPagination: {       // 分页
                pageNo: 1,
                pageSize: 10,
            },
            exServiceTableData: [],     // 服务列表-扩展属性返回数据
            exServiceTableDataNum: '',  // 条数
            ServiceDetailTableData: [], // 服务列表查看返回数据
            servCheckDialogForm: false, // 服务列表查看模态框
            servAddDialogFormVisible: false,   // 服务列表添加模态框
            isShowServExtend: false,    // 是否显示服务扩展列表页
            switchTxt: "禁用",          // 禁用和启用按钮
            sertotal: '',
            serparams: {                // 服务列表分页
                pageNo: 1,
                pageSize: 10
            },
            serextformdata: {           // 扩展服务属性
                "id": 0,                // id为0时表示新增，id有值时表示更新
                "openserviceId": "",
                "exPropertyCode": "",   // 扩展属性代码
                "exPropertyType": "",   // 属性类型
                "exPropertyData": "",
                "lastModifyDt": "",
                "lastModifyUser": "",
                "effectiveFlag": "",
                "startDt": "",
                "startUser": "",
                "svrOpenProperty": "",
                "baseDataType": ""
            },
            dialogTitle2: "",           //服务属性扩展的标题
            curopenserviceId: 0,
            curOpenServiceId: '',

            test: '',
            // TODO - 删除掉
            orgOption: {
                activeName: 'baseInfo', //基础信息标签页
                isdisabled: true,       //true表示显示信息；false表示添加信息
                isShowTab: false         //是否显示tab标签页, true显示，false不显示
            },
            
            //通用
            navparams: {
                pageNo: 1,
                pageSize: 10,
            },
            repparams: {
                content: "",
                pageNo: 1,
                pageSize: 10,
            },
            repformdata: {
                "id": 0,
                "orgId": "",
                "reportCatalog": "",
                "reportType": "",
                "instructionTitle": "",
                "instructionPicture": 0,
                "remark": "",
                "status": ""
            },
            serparams: {
                content: "",
                pageNo: 1,
                pageSize: 10,
            },
            serformdata: {
                "serviceCode": "",
                "tenantId": "",
                "serviceName": "",
                "serviceId": "",
                "orgId": "",
                "effectiveFlag": "",
                "serviceCode": "",
                "objectType": "",
                "id": 0,
            },

            //服务属性扩展开始
            serextparams: {
                content: "",
                pageNo: 1,
                pageSize: 10,
            },
        }
    },
    activated() {
        this.init()  //页面初始化
    },
    methods: {
        // 通用
        // 获取字典
        dictionaryRequest() {
            // 参数
            var that = this;
            let arr = [
                "cfs.dic.base_medicalCombType",  //租户维护-基本信息-类型
                "cfs.dic.base_svrOpenProperty",  // 属性代码字典
                "cfs.dic.base_baseDataType",     // 属性类型字典
                "cfs.dic.base_productType"       // 一级产品类型
            ]; 
            // 调用服务
            commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                if (res.code == 200) {
                    res.body.forEach(function (ele, index) {
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
                            that.dictionary.productTypes = ele.items;
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

        // 添加扩展属性
        addExtendField() {
            this.dialogTitle = '添加租户服务扩展属性';
            this.addSerExtDialogFormVisible = true; // 显示添加扩展属性模态框

            var that = this;
            let arr = [
                "cfs.dic.base_svrOpenProperty", // 属性代码字典
                "cfs.dic.base_baseDataType",    // 属性类型字典
                "cfs.dic.base_productType"      // 一级产品类型
            ];
            commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                if (res.code == 200) {
                    res.body.forEach(function (ele, index) {
                        if (ele.dicId == arr[0]) {
                            that.dictionary.svrOpenProperty = ele.items;
                        }
                        if (ele.dicId == arr[1]) {
                            that.dictionary.baseDataType = ele.items;
                        }
                        if (ele.dicId == arr[2]) {
                            that.dictionary.productTypes = ele.items;
                        }
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },

        // 获取机构列表
        getOrgList() {
            // 参数
            let params = [{
                tenantId: this.basicData.tenantId,
                pageNo: this.orgListPagination.pageNo,
                pageSize: this.orgListPagination.pageSize
            }]
            // 服务
            commonAjax("cas.tenantManageService", "searchTenantOrg", params).then(res => {
                if (res.code == 200) {
                    $.each(res.body.data, function(index, el) {
                        el.number = (index+1) + (params[0].pageNo-1)*(params[0].pageSize);
                    });
                    // debugger
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
            debugger
            this.addedOrgListPagination.pageSize = pageSize;
            this.getHospitalList();
        },

        // 机构列表 - 添加机构 - 当前页码
        addOrgCurrentChange(curPage) {
            this.addedOrgListPagination.pageNo = curPage;
            this.getHospitalList();
        },

        // 获取产品列表
        getProdList() {
            // 参数
            let params = [{
                tenantId: this.basicData.tenantId,
                pageNo: this.prodListPagination.pageNo,
                pageSize: this.prodListPagination.pageSize
            }];
            // 服务
            commonAjax("cas.tenantManageService", "productList", params).then(res => {
                if (res.code == 200) {
                    $.each(res.body.data, function(index, el) {
                        el.number = (index+1) + (params[0].pageNo-1)*(params[0].pageSize);
                    });
                    this.ProductTableData = res.body.data;
                    // debugger
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

        // 获取服务列表
        getServList() {
            // 参数
            let params = [{
                tenantId: this.basicData.tenantId,
                pageNo: this.servListPagination.pageNo,
                pageSize: this.servListPagination.pageSize
            }]
            // 服务
            commonAjax("cas.tenantManageService", "tenantServiceList", params).then(res => {
                if (res.code == 200) {
                    this.ServiceTableData = res.body.data;
                    this.ServiceTableDataNum = res.body.total;
                    // debugger
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

        // 注册事件
        //点击选项卡
        tabHandleClick(tab, event) {
            // debugger
            let activeTab = event.target.innerHTML
            this.tenantOption.activeName = tab.name
            this.tenantOption.isShowTab = true
            if (activeTab == "机构列表") {
                this.getOrgList()
            } else if (activeTab == "产品列表") {
                this.getProdList()
            } else if (activeTab == "服务列表") {
                this.getServList()
            }
        },

        // 如果是查询，获取租户基本查询信息
        getTenantData() {
            // 获取租户ID
            if (this.$route.params.id) {
                var tenantId = this.$route.params.id;
            }
            let params = [tenantId]
            // 参数
            let serviceId = 'cas.tenantManageService'
            let serviceMethod = 'tenantDetail'
            // 调用服务
            commonAjax(serviceId, serviceMethod, params).then(res => {
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

        // 判断是新增还是查看
        checkPrevBtn() {
            if (this.$route.params.type) {
                // debugger
                if (this.$route.params.type == 1) { // 新增租户传1
                    this.tenantOption.activeName = 'baseInfo'
                    this.basicData = {              // 重置
                        tenantId: '',
                        tenantType: '',
                        tenantName: '',
                        tenantPhone: '',
                        tenantDesc: ''
                    }
                    this.tenantOption.isShowTab = false   //不显示其他标签页
                    this.tenantOption.isdisabled = false //表单可以修改
                } else { // 查看租户传2
                    this.tenantOption.isShowTab = true    //显示标签页
                    this.tenantOption.isdisabled = true  //表单不可以修改
                    this.getTenantData()
                }
            }
        },

        // 初始化
        init() {
            this.isShowTabList = true;
            this.isShowServExtend = false;
            this.dictionaryRequest(); //获取字典 新增和编辑用
            this.checkPrevBtn();
        },

        // 通用
        //重置标单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 通用结束-----------------------------------------------------------

        // 租户基本信息开始
        // 基本信息 - 保存按钮
        saveBasicInfo() {
            // 参数
            let params = [this.basicData];
            // 服务
            commonAjax('cas.tenantManageService', 'tenantAdded', params).then(res => {
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
        
        // 基本信息 - 编辑后再保存
        saveEditedBasicInfo() {
            // 参数
            let params = [this.basicData];
            // 服务
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

        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) { //数据合法
                // debugger
                    if (!this.hasBeenEdited) {
                        this.saveBasicInfo();
                    } else {
                        this.saveEditedBasicInfo();
                    }
                } else {    //数据不合法
                    return false;
                }
            });
        },
        //租户基本信息结束

        // 租户基本信息 - 编辑按钮
        editBasicInfo() {
            this.hasBeenEdited = true;  // 保留痕迹
            this.tenantOption.isdisabled = false;
        },

        // 租户基本信息 - 返回按钮
        leaveBasicInfo(formName) {
            this.$refs[formName].resetFields();
            this.$router.push('tenantManage');
        },

        // 机构列表标签页 - 搜索机构
        searchOrgList() {
            let params = [{
                tenantId: this.basicData.tenantId,
                orgName: this.orgKeyword,
                pageNo: 1,
                pageSize: 20
            }]

            commonAjax("cas.tenantManageService", "searchTenantOrg", params).then(res => {
                if (res.code == 200) {
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

        // 租户管理 - 机构列表 - 上级机构 - 添加按钮
        addParentOrg(index, row) {
            var params = {};
            commonAjax('', '', params).then(res => {
                if (res.code == 200) {
                    console.log('done');
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },

        // 租户管理 - 机构列表 - 删除按钮
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

        // 机构列表模块
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
                    'pageSize':  this.addedOrgListPagination.pageSize
                }]
            }

            // 调用服务
            commonAjax('cas.tenantManageService', 'searchOrg', params).then(res => {
                if (res.code == 200) {
                    $.each(res.body.items, function(index, el) {
                        el.number = (index+1) + (params[0].pageNo-1)*(params[0].pageSize);
                    });
                    this.addedOrgTableData = res.body.items;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            });
        },

        // 租户管理 - 机构列表 - 添加医院
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
                    $.each(res.body.items, function(index, el) {
                        el.number = (index+1) + (params[0].pageNo-1)*(params[0].pageSize);
                    });
                    this.addedOrgTableData = res.body.items;
                    this.addedOrgTableDataNum = res.body.total;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },

        // 添加医院到机构列表
        addHspt2OrgList(index, row) {
            // 参数
            let params = [{
                orderId: index,
                orgId: row.orgId,
                tenantId: this.basicData.tenantId
            }];
            // 服务
            commonAjax('cas.tenantManageService', 'tenantOrgAdded', params).then(res => {
                if (res.code == 200) {
                    this.navdialogFormVisible = false;// 关闭模态框
                    this.$message({
                        type: 'success',
                        message: '添加成功！'
                    });
                    this.getOrgList();               // 刷新机构列表
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },

        // 租户管理 - 产品列表 - 添加产品
        addProduct() {
            this.dialogTitle = "添加租户产品";
            this.prodDialogFormVisible = true;

            let params = [this.basicData.tenantId]; //租户编码

            // 获取一级产品列表
            commonAjax('cas.tenantManageService', 'productFirstLevel', params).then(res => {
                if (res.code == 200) {
                    this.productFirstLevelData = res.body;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },

        // 租户管理-产品列表-查看产品
        checkProduct() {
            this.dialogTitle = "查看租户产品",
            this.prodCheckDialogForm = true;
            // 参数
            let params = [this.basicData.tenantId];
            // 服务
            commonAjax('cas.tenantManageService', 'productDetail', params).then(res => {
                if (res.code == 200) {
                    this.productCheckData = res.body;
                    console.log( JSON.stringify(res) )
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
             debugger
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
                        commonAjax('cas.tenantManageService', 'productStatusUpdated', [{code:row.code, status:0}]).then(res => {
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
                        commonAjax('cas.tenantManageService', 'productStatusUpdated', [{code:row.code, status:1}]).then(res => {
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

        // 服务列表 - 添加服务
        addService() {
            this.dialogTitle = '新增租户服务';
            this.servAddDialogFormVisible = true;

            let params = [{
                "tenantId": this.basicData.tenantId,
                "objectType": "开通服务对象类别",
                "objectId": "开通服务对象类别对应的id",
                "serviceId": "服务项目id",
                "mainFlag": "服务主体标志 0.否 1.是",
                "effectiveFlag": 1
            }];

            commonAjax('cas.tenantManageService', 'tenantServicAdded', params).then(res => {
                if (res.code == 200) {
                    this.servAddedDialogData = res.body;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },

        // 服务列表 - 查看服务
        checkService(index, row) {
            this.servCheckDialogForm = true;
            if (row) {
                this.dialogTitle = "编辑服务"
                this.serformdata = {
                    "serviceCode": row.serviceCode ? row.serviceCode : "",
                    serviceDesc: row.serviceDesc ? row.serviceDesc : "",
                    "mainFlag": row.mainFlag,
                    "tenantId": row.tenantId ? row.tenantId : "",
                    "serviceName": row.serviceName ? row.serviceName : "",
                    "serviceId": row.serviceId ? row.serviceId : "",
                    // "orgId": row.orgId,
                    "effectiveFlag": row.effectiveFlag,
                    "objectType": row.objectType ? row.objectType : "",
                    "id": row.id,
                };
            } else {
                this.dialogTitle = "添加服务";
                this.serformdata = {
                    "serviceCode": "",
                    serviceDesc: "",
                    "mainFlag": "",
                    "tenantId": sessionStorage.getItem('tenantId'),
                    "serviceName": "",
                    "serviceId": "",
                    // "orgId": this.orgOption.orgId,
                    "effectiveFlag": "",
                    "id": 0,
                    "objectType": "",
                };
            }
        },

        //服务列表开始
        sergetTableData() {
            if (this.orgOption.orgId) {
                var tenantId = sessionStorage.getItem('tenantId');
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

        // 服务列表-关闭和启用
        servListSwitch(index, row) {
            // debugger
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

        // 启用禁用标记
        serhandleDelete(index, row) {
            const h = this.$createElement;
            this.$msgbox({
                title: '确认删除',
                message: h('p', null, [
                    h('span', null, '是否删除 '),
                    h('i', {
                        style: 'color: teal'
                    }, row.serviceName)
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

                    let params = `[${row.id},'${row.effectiveFlag == 0 ? 1 : 0}']`;
                    commonAjax("cas.serviceOpenService", "enableOrDisableServiceOpen", params).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "删除成功"
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
        },

        serhandleEdit(index, row) {
            this.serdialogFormVisible = true;
            if (row) {
                this.dialogTitle = "编辑服务"
                this.serformdata = {
                    "serviceCode": row.serviceCode ? row.serviceCode : "",
                    serviceDesc: row.serviceDesc ? row.serviceDesc : "",
                    "mainFlag": row.mainFlag,
                    "tenantId": row.tenantId ? row.tenantId : "",
                    "serviceName": row.serviceName ? row.serviceName : "",
                    "serviceId": row.serviceId ? row.serviceId : "",
                    // "orgId": row.orgId,
                    "effectiveFlag": row.effectiveFlag,
                    "objectType": row.objectType ? row.objectType : "",
                    "id": row.id,
                };

            } else {
                this.dialogTitle = "添加服务";
                this.serformdata = {
                    "serviceCode": "",
                    serviceDesc: "",
                    "mainFlag": "",
                    "tenantId": sessionStorage.getItem('tenantId'),
                    "serviceName": "",
                    "serviceId": "",
                    // "orgId": this.orgOption.orgId,
                    "effectiveFlag": "",
                    "id": 0,
                    "objectType": "",
                };
            }

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

        // 模态框 - 返回按钮
        closesermodal(formName) {
            //   debugger
            this.$refs[formName].resetFields();
            if (formName == 'prodAddDialogForm') {         // 添加产品模态框
                this.prodDialogFormVisible = false;
            } else if (formName == 'servAddDialogForm') {  // 添加服务模态框
                this.servAddDialogFormVisible = false;
            } else if (formName == 'addExtFldForm') {
                this.addSerExtDialogFormVisible = false;   // 添加扩展属性模态框
            }
            // this.serdialogFormVisible = false;
        },

        showlist() {
            $(".yishenglist").show();
        },

        //服务新增和编辑时候选择服务项目时候的联动
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

        // 请求服务包
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

        // 服务列表 - 查看
        servListCheck(index, row) {
            this.dialogTitle = '查看租户服务';
            this.servCheckDialogForm = true;
            // 参数
            let param = [row.id];
            // 服务
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
        getServListExtendFld(index, row) {
            debugger
            // 由弹框改为页面 1 隐藏原来页面 2 显示现在页面 3 在页面加按钮和事件和跳转
            this.isShowTabList = false;
            this.isShowServExtend = true;

            if (row.id) {
                var params = [row.id]; // openserviceId
                this.serextformdata.openserviceId = row.id;
                this.curOpenServiceId = row.id; // 赋值给当前openServiceId
            } else {
                var params = [row]; //直接把row当作openserviceid
            }

            commonAjax('cas.tenantManageService', 'servicePropertyList', params).then(res => {
                if (res.code == 200) {
                    this.exServiceTableData = res.body;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
        },

        // 删除服务扩展属性方法
        serexthandleDelete(index, row) {
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
                    let params = `[${row.id}]`;
                    commonAjax("cas.servicePropertyService", "deleteServiceProperty", params).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                type: 'success',
                                message: "删除成功"
                            });
                            this.serextgetTableData(this.curopenserviceId);
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

        // 原来的查询扩展属性列表的方法
        serextgetTableData() {
            let params = `[${this.curopenserviceId}]`;
            commonAjax("cas.servicePropertyService", "queryServiceProperty", params).then(res => {
                if (res.code == 200) {
                    this.serexttableData = res.body.items;
                    this.serexttotal = res.body.total;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });

        },

        // 新增扩展属性 - 保存
        serextsubmitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var self = this;
                    commonAjax("cas.tenantManageService", "servicePropertyAdded", '[' + JSON.stringify(self.serextformdata) + ']').then(res => {
                        if (res.code == 200) {
                            self.$message({
                                type: 'success',
                                message: "保存成功"
                            });
                            self.addserextdialogFormVisible = false;          //关闭模态框
                            self.getServListExtendFld(this.curopenserviceId); //继续查询扩展属性
                        } else {
                            self.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
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
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.postdefaultarea();
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
</style>
