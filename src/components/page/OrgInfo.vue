<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>租户管理</el-breadcrumb-item>
                        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
                        <el-breadcrumb-item>{{orgOption.orgId?'编辑机构':'新增机构'}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="12" class="return_prev">
                    <router-link to="/organizationList"> <span class="return"><img src="../../assets/img/return.png"></span>返回上一级</router-link>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <el-tabs type="card" :active-name="orgOption.activeName" @tab-click="tabHandleClick">
                <el-tab-pane label="基本信息" name="baseInfo" class="eltabpane">
                    <el-form :model="orgOption" :rules="orginformrules" ref="orginfoForm" auto-complete="off">
                        <el-form-item label="机构全称" :label-width="formLabelWidth" prop="orgFullName">
                            <el-input v-model="orgOption.orgFullName" :disabled="orgOption.isdisabled" @blur="mapposition"></el-input>
                        </el-form-item>
                        <el-form-item label="机构简称" :label-width="formLabelWidth" prop="orgShortName">
                            <el-input v-model="orgOption.orgShortName" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="机构医保局ID" :label-width="formLabelWidth" prop="medicalOrgId">
                            <el-input v-model="orgOption.medicalOrgId" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="机构本地代码" :label-width="formLabelWidth" prop="localOrgId">
                            <el-input v-model="orgOption.localOrgId" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="上传图片" :label-width="formLabelWidth" prop="">
                            <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :disabled="orgOption.isdisabled" :data="orgimguploaddata">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="医院分类" :label-width="formLabelWidth" prop="orgClassify">
                            <el-select v-model="orgOption.orgClassify" placeholder="请选择医院分类" :disabled="orgOption.isdisabled">
                                <el-option v-for="item in dictionary.orgClassify" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="医院性质" :label-width="formLabelWidth" prop="orgNature">
                            <el-select v-model="orgOption.orgNature" placeholder="请选择医院性质" :disabled="orgOption.isdisabled">
                                <el-option v-for="item in dictionary.orgNature" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上级机构" :label-width="formLabelWidth" prop="parentId">
                            <el-select v-model="orgOption.parentId" filterable placeholder="请选择上级机构名称" :disabled="orgOption.isdisabled">
                                <el-option v-for="item in tableData" :key="item.id" :label="item.orgFullName" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="医院等级" :label-width="formLabelWidth" prop="orgLevel">
                            <el-select v-model="orgOption.orgLevel" placeholder="请选择医院等级" :disabled="orgOption.isdisabled">
                                <el-option v-for="item in dictionary.orgLevel" :key="item.key" :label="item.text" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--  <Area-Text v-on:getareadata="getareadata" :defaultarea="defaultarea"></Area-Text> -->
                        <div id="areatext">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="省级" :label-width="formLabelWidth" prop="province">
                                        <el-select v-model="editarea.province" placeholder="请选择省">
                                            <el-option v-for="item in provincelist" :label="item.text" :value="item.key" :key="item.key">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="市级" :label-width="formLabelWidth" prop="city">
                                        <el-select v-model="editarea.city" placeholder="请选择市">
                                            <el-option v-for="item in citylist" :label="item.text" :value="item.key" :key="item.key">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="地区" :label-width="formLabelWidth" prop="district">
                                        <el-select v-model="editarea.district" placeholder="请选择地区">
                                            <el-option v-for="item in districtlist" :label="item.text" :value="item.key" :key="item.key">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="街道" :label-width="formLabelWidth" prop="city">
                                        <el-select v-model="editarea.street" placeholder="请选择街道">
                                            <el-option v-for="item in streetlist" :label="item.text" :value="item.key" :key="item.key">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                        <el-form-item label="机构地址" :label-width="formLabelWidth" prop="orgAddress">
                            <el-input v-model="orgOption.orgAddress" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="医院地图" :label-width="formLabelWidth" prop="">
                            <div id="allmap"></div>
                        </el-form-item>
                        <el-form-item label="经度" :label-width="formLabelWidth" prop="longitude">
                            <el-input v-model="orgOption.longitude" @blur="baiduMap(orgOption.longitude,orgOption.latitude)" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="纬度" :label-width="formLabelWidth" prop="latitude">
                            <el-input v-model="orgOption.latitude" @blur="baiduMap(orgOption.longitude,orgOption.latitude)" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="咨询电话" :label-width="formLabelWidth" prop="consultNo">
                            <el-input v-model="orgOption.consultNo" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="紧急电话" :label-width="formLabelWidth" prop="emergencyNo">
                            <el-input v-model="orgOption.emergencyNo" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="contactNo">
                            <el-input v-model="orgOption.contactNo" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="医院网址" :label-width="formLabelWidth" prop="homepage">
                            <el-input v-model="orgOption.homepage" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="机构介绍" :label-width="formLabelWidth" prop="description">
                            <el-input v-model="orgOption.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="交通说明" :label-width="formLabelWidth" prop="trafficDesc">
                            <el-input v-model="orgOption.trafficDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="邮编" :label-width="formLabelWidth" prop="postcode">
                            <el-input v-model="orgOption.postcode" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="传真" :label-width="formLabelWidth" prop="fax">
                            <el-input v-model="orgOption.fax" :disabled="orgOption.isdisabled"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="center-foot">
                        <el-button @click="closeorgmodal('orginfoForm')">取 消</el-button>
                        <el-button type="primary" @click="submitForm('orginfoForm')" v-if="!orgOption.isdisabled">保 存</el-button>
                        <el-button type="primary" @click="editForm()" v-if="orgOption.isdisabled">我要编辑</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="机构导航" name="orgnavigation" class="eltabpane" v-if="orgOption.ishowtab">
                    <el-row class="addbtn">
                        <el-col :span="24">
                            <el-button type="primary" icon="plus" @click="navhandleEdit">新建机构导航</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="navtableData" border style="width: 100%">
                        <el-table-column prop="id" label="导航ID">
                        </el-table-column>
                        <el-table-column prop="shortName" label="简称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="navhandleEdit(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" type="danger" @click="navhandleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="navtotal" :page-sizes="[10,20,50]" @size-change="navhandleSizeChange" @current-change="navhandleCurrentChange" :page-size="navparams.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <!--<el-tab-pane label="账号信息" name="countInfo" class="eltabpane" v-if="orgOption.ishowtab">
                    <h2 class="account-title">支付宝</h2>
                    <el-form :model="countformdata" :rules="conutinformrules" ref="countForm" auto-complete="off">
                        <el-form-item label="支付宝账号" :label-width="formLabelWidth" prop="AliPay.account">
                            <el-input v-model="countformdata.AliPay.account" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="合作者身份(PID)" :label-width="formLabelWidth" prop="AliPay.partnerId">
                            <el-input v-model="countformdata.AliPay.partnerId" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="商户私钥" :label-width="formLabelWidth" prop="AliPay.privateKey">
                            <el-input v-model="countformdata.AliPay.privateKey" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="Appid" :label-width="formLabelWidth" prop="AliPay.appId">
                            <el-input v-model="countformdata.AliPay.appId" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-row :gutter="20">
                            <el-col :span="18">
                                <el-form-item label="AliPublicKey" :label-width="formLabelWidth" prop="AliPay.aliPublicKey">
                                    <el-input v-model="countformdata.AliPay.aliPublicKey" :disabled="orgOption.orgId!=''"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"> <span class="explains">开放平台秘钥管理，查看支付宝公钥</span></el-col>
                        </el-row>
                        <h2 class="account-title">微信</h2>
                        <el-form-item label="微信账号" :label-width="formLabelWidth" prop="wechatPay.account">
                            <el-input v-model="countformdata.wechatPay.account" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="合作商户ID" :label-width="formLabelWidth" prop="wechatPay.partnerId">
                            <el-input v-model="countformdata.wechatPay.partnerId" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="商户私钥" :label-width="formLabelWidth" prop="wechatPay.privateKey">
                            <el-input v-model="countformdata.wechatPay.privateKey" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="Appid" :label-width="formLabelWidth" prop="wechatPay.appId">
                            <el-input v-model="countformdata.wechatPay.appId" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <h2 class="account-title">银联</h2>
                        <el-form-item label="银行卡号" :label-width="formLabelWidth" prop="bankPay.account">
                            <el-input v-model="countformdata.bankPay.account" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="商户ID" :label-width="formLabelWidth" prop="bankPay.partnerId">
                            <el-input v-model="countformdata.bankPay.partnerId" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="商户私钥" :label-width="formLabelWidth" prop="bankPay.privateKey">
                            <el-input v-model="countformdata.bankPay.privateKey" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <el-form-item label="私钥密码" :label-width="formLabelWidth" prop="bankPay.privateKey">
                            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-change="bankPayhandleChange" :file-list="fileList3">
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                                <div slot="tip" class="el-upload__tip">只能上传银行私密文件</div>
                            </el-upload>
                        </el-form-item>
                        <h2 class="account-title">中福统一支付平台账号配置</h2>
                        <el-row :gutter="20">
                            <el-col :span="18">
                                <el-form-item label="收款商户名" :label-width="formLabelWidth" prop="account">
                                    <el-input v-model="countformdata.ZhongFu.account" :disabled="orgOption.orgId!=''"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6"> <span class="explains">收款商户名、商户号由中福支付统一提供</span></el-col>
                        </el-row>
                        <el-form-item label="收款商户号" :label-width="formLabelWidth" prop="partnerId">
                            <el-input v-model="countformdata.ZhongFu.partnerId" :disabled="orgOption.orgId!=''"></el-input>
                        </el-form-item>
                        <div class="center-foot">
                            <el-button @click="closeorgmodal('orginfoForm')">取 消</el-button>
                            <el-button type="primary" @click="countsubmitForm('orginfoForm')" v-if="!orgOption.isdisabled">保 存</el-button>
                            <el-button type="primary" @click="editForm()" v-if="orgOption.isdisabled">我要编辑</el-button>
                        </div>
                    </el-form> 
                </el-tab-pane>-->
                <el-tab-pane label="报告说明" name="reportDes" class="eltabpane" v-if="orgOption.ishowtab">
                    <el-row class="addbtn">
                        <el-col :span="24">
                            <el-button type="primary" icon="plus" @click="rephandleEdit">新建报告说明</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="reptableData" border style="width: 100%">
                        <el-table-column prop="reportCatalogText" label="报告大类型">
                        </el-table-column>
                        <el-table-column prop="reportTypeText" label="报告类型">
                        </el-table-column>
                        <el-table-column prop="instructionTitle" label="说明标题">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="rephandleEdit(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" type="danger" @click="rephandleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="reptotal" :page-sizes="[10,20,50]" @size-change="rephandleSizeChange" @current-change="rephandleCurrentChange" :page-size="repparams.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="服务列表" name="serviceList" class="eltabpane" v-if="orgOption.ishowtab">
                    <el-row class="addbtn">
                        <el-col :span="24">
                            <el-button type="primary" icon="plus" @click="serhandleEdit">新建服务</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="sertableData" border style="width: 100%">
                        <el-table-column prop="serviceName" label="服务项目">
                        </el-table-column>
                        <el-table-column prop="serviceCode" label="服务编码" width="200">
                        </el-table-column>
                        <el-table-column prop="effectiveFlag" label="启用标记" width="200">
                            <template scope="scope">
                                <p v-show="scope.row.effectiveFlag==1">是</p>
                                <p v-show="scope.row.effectiveFlag==0">否</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="serhandleEdit(scope.$index, scope.row)">查看</el-button>
                                <el-button size="small" type="warning" @click="serhandleExtend(scope.$index, scope.row)">扩展属性</el-button>
                                <el-button size="small" type="success" @click="serhandleDelete(scope.$index, scope.row)" v-show="scope.row.effectiveFlag==0">启用</el-button>
                                <el-button size="small" type="danger" @click="serhandleDelete(scope.$index, scope.row)" v-show="scope.row.effectiveFlag==1">禁用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--  <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="sertotal" :page-sizes="[10,20,50]" @size-change="serhandleSizeChange" @current-change="serhandleCurrentChange" :page-size="serparams.pageSize">
                        </el-pagination>
                    </div> -->
                </el-tab-pane>
                <!--  <el-tab-pane label="机构二维码" name="qrCode" class="eltabpane" v-if="orgOption.ishowtab">
                    <img :src="imgview+orgOption.qrAvatarFileId" class="qrimg">
                </el-tab-pane> -->
            </el-tabs>
        </el-row>
        <!-- 导航模态框 -->
        <el-dialog :title="dialogtitle" v-model="navdialogFormVisible" @close="resetForm('navinfoForm')">
            <el-form :model="navformdata" :rules="navinformrules" ref="navinfoForm" auto-complete="off">
                <el-form-item label="导航图名称" :label-width="formLabelWidth" prop="shortName">
                    <el-input v-model="navformdata.shortName" required></el-input>
                </el-form-item>
                <el-form-item label="导航图描述" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="navformdata.description" required></el-input>
                </el-form-item>
                <el-form-item label="图片地址" :label-width="formLabelWidth" prop="">
                    <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="navhandleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="navimguploaddata">
                        <img v-if="navimageUrl" :src="navimageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closenavmodal('navinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="navsubmitForm('navinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 报告说明模态框 -->
        <el-dialog :title="dialogtitle" v-model="repdialogFormVisible" @close="resetForm('repinfoForm')">
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
                <el-form-item label="图片地址" :label-width="formLabelWidth" prop="">
                    <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="rephandleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="repimguploaddata">
                        <img v-if="repimageUrl" :src="repimageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
        <el-dialog :title="dialogtitle" v-model="serdialogFormVisible" @close="resetForm('serinfoForm')">
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
                    <el-select v-model="serformdata.objectType" placeholder="请选择" disabled>
                         <el-option label="机构" value="021">
                        </el-option>
                       <!--  <el-option v-for="item in dictionary.objectType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option> -->
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
                        <el-radio label="1" disabled>是</el-radio>
                        <el-radio label="0" disabled>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="center-foot">
                    <el-button @click="closesermodal('serinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="sersubmitForm('serinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 服务扩展属性列表模态框 -->
        <el-dialog :title="dialogtitle" v-model="serextdialogFormVisible">
            <el-row class="addbtn">
                <el-col :span="24">
                    <el-button type="primary" icon="plus" @click="serexthandleEdit">新建服务扩展属性</el-button>
                </el-col>
            </el-row>
            <el-table :data="serexttableData" border style="width: 100%">
                <el-table-column prop="exPropertyType" label="属性类型">
                </el-table-column>
                <el-table-column prop="exPropertyData" label="属性值">
                </el-table-column>
                <el-table-column prop="effectiveFlag" label="有效标识">
                    <template scope="scope">
                        <p v-show="scope.row.effectiveFlag==1">是</p>
                        <p v-show="scope.row.effectiveFlag==0">否</p>
                    </template>
                </el-table-column>
                <el-table-column prop="lastModifyUserName" label="最后修改人">
                </el-table-column>
                <el-table-column prop="lastModifyDt" label="最后修改时间">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button size="small" @click="serexthandleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="serexthandleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="serexttotal" :page-sizes="[10,20,50]" @size-change="serexthandleSizeChange" @current-change="serexthandleCurrentChange" :page-size="serextparams.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 服务扩展属性新增编辑模态框 -->
        <el-dialog :title="dialogtitle2" v-model="addserextdialogFormVisible" @close="resetForm('serextinfoForm')">
            <el-form :model="serextformdata" :rules="serextformdata.serextinforules" ref="serextinfoForm" auto-complete="off">
                <el-form-item label="属性代码" prop="exPropertyCode" :label-width="formLabelWidth">
                    <el-select v-model="serextformdata.exPropertyCode" placeholder="请选择">
                        <el-option v-for="item in dictionary.svrOpenProperty" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性类型" :label-width="formLabelWidth" prop="exPropertyType">
                    <el-select v-model="serextformdata.exPropertyType" placeholder="请选择">
                        <el-option v-for="item in dictionary.baseDataType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性值" :label-width="formLabelWidth" prop="exPropertyData">
                    <el-input v-model="serextformdata.exPropertyData"></el-input>
                </el-form-item>
                <!--  <el-form-item label="属性值" :label-width="formLabelWidth" prop="exPropertyData" v-if="serextformdata.exPropertyType==12">
                    <el-input v-model="serextformdata.exPropertyData"></el-input>
                </el-form-item> -->
                <!--   <el-form-item label="属性值" :label-width="formLabelWidth" prop="exPropertyData" v-if="serextformdata.exPropertyType==13">
                    <el-date-picker v-model="serextformdata.exPropertyData" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="属性值" prop="exPropertyData" :rules="[{ required: true, message: '值不能为空'},{ type: 'number', message: '必须为数字值'}]" :label-width="formLabelWidth" v-if="serextformdata.exPropertyType==11">
                    <el-input v-model.number="serextformdata.exPropertyData" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="有效标志" prop="effectiveFlag" :label-width="formLabelWidth">
                    <el-radio-group v-model="serextformdata.effectiveFlag">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="dialog-footer center-foot">
                    <el-button @click="closeserextmodal('serextinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="serextsubmitForm('serextinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import BMap from 'BMap'
import {
    commonAjax, imguploadurl, imgview, areaAjax
}
from '../../api/api';
import {
    mapState
}
from 'vuex';
import AreaText from '../common/Area.vue';
export default {
    data() {
            return {
                //通用
                imgview: imgview,
                imguploadurl: imguploadurl,
                formLabelWidth: '150px',
                dialogtitle: "",
                headers: {
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                //字典查询数据
                dictionary: {
                    orgClassify: [], //机构分类base_organizationType
                    orgNature: [], //机构性质base_mechanismProperties
                    orgLevel: [], //机构等级base_organizationGrade
                    reportType: [],
                    medicalCombType: [],
                    // objectType: [],
                    svrOpenProperty: [],
                    baseDataType: [],
                },
                //机构基本信息开始
                orgimguploaddata: {
                    catalog: "org"
                },
                navimguploaddata: {
                    catalog: "orglayout"
                },
                repimguploaddata: {
                    catalog: "orgReportGuide"
                },
                imageUrl: "",
                tableData: [], //上级机构搜索
                orginformrules: {
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
                    city: [{
                        required: true,
                        message: '请选择市',
                        trigger: 'blur'
                    }],
                    district: [{
                        required: true,
                        message: '请选择地区',
                        trigger: 'blur'
                    }],
                    localOrgId: [{
                        required: true,
                        message: '请输入机构本地代码',
                        trigger: 'blur'
                    }],
                    // street: [{
                    //     required: true,
                    //     message: '请选择街道',
                    //     trigger: 'blur'
                    // }],
                    orgAddress: [{
                        required: true,
                        message: '请填写地址',
                        trigger: 'blur'
                    }],
                    trafficDesc: [{
                        required: true,
                        message: '请填写交通说明',
                        trigger: 'blur'
                    }],
                    longitude: [{
                        required: true,
                        message: '请填写经度',

                    }],
                    latitude: [{
                        required: true,
                        message: '请填写维度',

                    }],
                },
                mapsearchtext: "", //百度地图搜索关键字


                // defaultarea: { //地区组件父组件传值
                //     province: "",
                //     city: "",
                //     district: "",
                //     street: "",
                // },

                //机构基本信息结束--------------------------------------------------

                //机构导航开始
                navimageUrl: "",
                navtableData: [],
                navparams: {
                    pageNo: 1,
                    pageSize: 10,
                },
                navtotal: 2,
                navdialogFormVisible: false,
                navformdata: {
                    "orgId": "",
                    "id": "",
                    "shortName": "",
                    "description": "",
                    "navigatorField": 0
                },
                navinformrules: {
                    shortName: [{
                        required: true,
                        message: '请输入导航图名称',
                        trigger: 'blur'
                    }],
                    description: [{
                        required: true,
                        message: '请输入描述',
                        trigger: 'blur'
                    }]
                },

                //机构导航结束--------------------------------------------------
                //报告查询开始--------------------------------------------------
                repimageUrl: "",
                reptableData: [],
                repparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                reptotal: "",
                repdialogFormVisible: false,
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
                repinformrules: {
                    // orgFullName: [{
                    //     required: true,
                    //     message: '请输入机构全称',
                    //     trigger: 'blur'
                    // }]
                },
                //报告查询结束-------------------------------------------------
                //服务列表开始
                servicePacklist: [],
                sertableData: [],
                // serparams: {
                //     content: "",
                //     pageNo: 1,
                //     pageSize: 10,
                // },
                serformdata: {
                    "serviceCode": "",
                    "tenantId": "",
                    "serviceName": "",
                    "serviceId": "",
                    "orgId": "",
                    "effectiveFlag": "",
                    "serviceCode": "",
                    "objectType": "021",
                    "id": 0,
                },
                serdialogFormVisible: false,
                serinformrules: {
                    // orgFullName: [{
                    //     required: true,
                    //     message: '请输入机构全称',
                    //     trigger: 'blur'
                    // }]
                },
                // sertotal: "",
                //服务属性扩展开始
                serextparams: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                serexttableData: [],
                serexttotal: "",
                serextdialogFormVisible: false,
                addserextdialogFormVisible: false,
                serextformdata: {
                    "id": 0, //id为0时表示新增，id有值时表示更新
                    "openserviceId": 0,
                    "exPropertyCode": "",
                    "exPropertyType": "",
                    "exPropertyData": "",
                    "lastModifyDt": "",
                    "lastModifyUser": "",
                    "effectiveFlag": "",
                    "startDt": "",
                    "startUser": ""
                },
                dialogtitle2: "", //服务属性扩展的标题
                curopenserviceId: 0,
                //服务属性扩展结束
                //服务列表结束--------------------------------------------------
                // 账号信息开始
                countinformrules: {
                    orgFullName: [{
                        required: true,
                        message: '请输入机构全称',
                        trigger: 'blur'
                    }]
                },
                countformdata: {
                    AliPay: {
                        'aliPublicKey': "",
                        'orgId': "",
                        'appId': "",
                        'privateKey': "",
                        'partnerId': "",
                        'accountType': "02",
                        'account': "",
                        'recordId': ""
                    },
                    wechatPay: {
                        'aliPublicKey': "",
                        'orgId': "",
                        'appId': "",
                        'privateKey': "",
                        'partnerId': "",
                        'accountType': "03",
                        'account': "",
                        'recordId': ""
                    },
                    bankPay: {
                        'aliPublicKey': "",
                        'orgId': "",
                        'appId': "",
                        'privateKey': "",
                        'partnerId': "",
                        'accountType': "04",
                        'account': "",
                        'recordId': "",
                    },
                    ZhongFu: {
                        'orgId': "",
                        'account': '',
                        'partnerId': '',
                        'accountType': '06'
                    },
                },
                fileList3: [],
                // 账号信息结束--------------------------------------------------
                // 机构二维码开始

                // 账号信息结束--------------------------------------------------
                provincelist: [],
                citylist: [],
                districtlist: [],
                streetlist: [],
                editarea: {
                    province: "",
                    city: "",
                    district: "",
                    street: "",
                }
            }
        },
        computed: {
            ...mapState(['orgOption']),
        },
        methods: {

            // 通用
            tabHandleClick(tab, event) {
                    let ishowtab = event.target.innerHTML;
                    this.orgOption.activeName = tab.name;
                    this.orgOption.ishowtab = ishowtab == "基本信息" && !this.orgOption.orgId ? false : true;
                    this.$store.dispatch('orgOption', this.orgOption)
                        // if (ishowtab == "机构导航") {
                        //     this.navgetTableData();
                        // } else if (ishowtab == "报告说明") {
                        //     this.repgetTableData();
                        // } else if (ishowtab == "服务列表") {
                        //     this.sergetTableData();
                        // } else {

                    // }
                },
                beforeAvatarUpload(file) { //上传图片之前通用
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
                //重置标单
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                },
                //获取字典
                dictionaryRequest() {
                    var that = this;
                    // let arr = ["cfs.dic.base_organizationType", "cfs.dic.base_mechanismProperties", "cfs.dic.base_organizationGrade", "cfs.dic.base_reportType", "cfs.dic.base_inspectionReportType", "cfs.dic.base_objectType", "cfs.dic.base_svrOpenProperty", "cfs.dic.base_baseDataType"];
                     let arr = ["cfs.dic.base_organizationType", "cfs.dic.base_mechanismProperties", "cfs.dic.base_organizationGrade", "cfs.dic.base_reportType", "cfs.dic.base_inspectionReportType", "cfs.dic.base_svrOpenProperty", "cfs.dic.base_baseDataType"];
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
                                // if (ele.dicId == arr[5]) {
                                //     that.dictionary.objectType = ele.items;
                                // }
                                if (ele.dicId == arr[5]) {
                                    that.dictionary.svrOpenProperty = ele.items;
                                }
                                if (ele.dicId == arr[6]) {
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
                // 通用结束-----------------------------------------------------------
                //机构基本信息开始
                submitForm(formName) {
                    this.orgOption.province = this.editarea.province;
                    this.orgOption.city = this.editarea.city;
                    this.orgOption.district = this.editarea.district;
                    this.orgOption.street = this.editarea.street;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            var reqmtd = this.orgOption.orgId ? "updateOrgInfo" : "addOrgInfo";
                            commonAjax("cas.orgService", reqmtd, '[' + JSON.stringify(this.orgOption) + ']', ).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });

                                    this.orgOption.orgId = res.body.orgId ? res.body.orgId : res.body;
                                    this.orgOption.ishowtab = true;

                                    // this.$router.push('organizationList');
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
                handleAvatarSuccess(res, file) { //上传图片成功后
                    this.imageUrl = imgview + res.body;
                    this.orgOption.avatarField = res.body;
                    this.$message.success('上传成功');
                },

                //百度地图(经纬度)
                baiduMap(longs, latati) {
                    longs = longs == '' ? 116.404 : longs;
                    latati = latati == '' ? 39.915 : latati;
                    //console.log(longs+':'+latati);
                    var that = this;
                    setTimeout(function() {
                        // 创建Map实例,设置地图允许的最小/大级别
                        var map = new BMap.Map("allmap");
                        map.centerAndZoom(new BMap.Point(longs, latati), 12);
                        map.enableScrollWheelZoom(true);
                        map.addControl(new BMap.MapTypeControl()); //添加地图类型控件  
                        let new_point = new BMap.Point(longs, latati);
                        let marker = new BMap.Marker(new_point); // 创建标注
                        map.addOverlay(marker); // 将标注添加到地图中
                        // map.panTo(new_point);       
                        //单击获取点击的经纬度
                        map.addEventListener("click", function(e) {
                            that.orgOption.longitude = e.point.lng + "";
                            that.orgOption.latitude = e.point.lat + "";
                            map.clearOverlays();
                            let new_point = new BMap.Point(e.point.lng, e.point.lat);
                            let marker = new BMap.Marker(new_point); // 创建标注
                            map.addOverlay(marker);
                        });
                    }, 200);
                },
                //百度地图检索(关键字)
                baiduMapIndex(indexAdd) {
                    var that = this;
                    //检索
                    var map = new BMap.Map("allmap");
                    //map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
                    var local = new BMap.LocalSearch(map, {
                        renderOptions: {
                            map: map
                        }
                    });
                    map.enableScrollWheelZoom(true);
                    //获取经纬度
                    map.clearOverlays(); //清空原来的标注
                    local.setSearchCompleteCallback(function(searchResult) {
                        var poi = searchResult.getPoi(0);
                        that.orgOption.longitude = poi.point.lng + "";
                        that.orgOption.latitude = poi.point.lat + "";
                        map.centerAndZoom(poi.point, 13);
                        var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat)); // 创建标注，为要查询的地址对应的经纬度
                        map.addOverlay(marker);
                        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    });
                    local.search(indexAdd);
                    //map.click
                    map.addEventListener("click", function(e) {
                        that.orgOption.longitude = e.point.lng + "";
                        that.orgOption.latitude = e.point.lat + "";
                        map.clearOverlays();
                        let new_point = new BMap.Point(e.point.lng, e.point.lat);
                        let marker = new BMap.Marker(new_point); // 创建标注
                        map.addOverlay(marker);
                    });
                },
                //机构地址失去焦点的时候
                mapposition() {
                    // var serachtext = $(".el-select-dropdown").find(".selected.el-select-dropdown__item").text() + this.orgOption.orgAddress;
                    var serachtext = this.orgOption.orgFullName;
                    this.baiduMapIndex(serachtext)
                },
                //点击可以编辑
                editForm() {
                    this.orgOption.isdisabled = false;
                },
                closeorgmodal(formName) {
                    this.$refs[formName].resetFields();
                    this.$router.push('organizationList')
                },
                // 获取地区信息代码
                // getareadata(editarea) {
                //     this.orgOption.province = editarea.province;
                //     this.orgOption.city = editarea.city;
                //     this.orgOption.district = editarea.district;
                //     this.orgOption.street = editarea.street;
                // },
                //传递数据都地区组件
                postdefaultarea() {
                    this.editarea = {
                        province: this.orgOption.province,
                        city: this.orgOption.city,
                        district: this.orgOption.district,
                        street: this.orgOption.street,
                    };
                    this.baiduMap(this.orgOption.longitude, this.orgOption.latitude);
                },
                //机构基本信息结束---------------------------------------------------------
                //机构导航开始
                navhandleDelete(index, row) {
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
                navhandleEdit(index, row) {
                    this.navdialogFormVisible = true;

                    if (row) {
                        this.dialogtitle = "编辑导航"
                        this.navformdata = {
                            "id": row.id,
                            "orgId": row.orgId,
                            "shortName": row.shortName ? row.shortName : "",
                            "description": row.description ? row.description : "",
                            "navigatorField": row.navigatorField ? row.navigatorField : 0
                        };
                        this.navimageUrl = imgview + this.navformdata.navigatorField;
                    } else {
                        this.dialogtitle = "添加导航";
                        this.navformdata = {
                            "id": 0,
                            "orgId": this.orgOption.orgId,
                            "shortName": "",
                            "description": "",
                            "navigatorField": 0
                        }
                        this.navimageUrl = "";
                    }

                },
                //提交机构导航
                navsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.orgService", "addOrUpdateOrgLayout", '[' + JSON.stringify(this.navformdata) + ']', ).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.navgetTableData();
                                    this.navdialogFormVisible = false;
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
                //获取医院导航列表数据
                navgetTableData() {
                    if (this.orgOption.orgId) {
                        let {
                            pageSize, pageNo
                        } = this.navparams;
                        let params = `['${this.orgOption.orgId}',${pageNo},${pageSize}]`;
                        commonAjax("cas.orgService", "listOrgLayout", params).then(res => {
                            if (res.code == 200) {
                                $.each(res.body.items, function(index, el) {
                                    el.number = (index + 1) + (pageNo - 1) * pageSize;
                                });
                                this.navtableData = res.body.items;
                                this.navtotal = res.body.total;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    }

                },
                navhandleSizeChange(val) {
                    this.navparams.pageSize = val;
                    this.navgetTableData()
                },
                navhandleCurrentChange(val) {
                    this.navparams.pageNo = val;
                    this.navgetTableData()
                },

                navhandleAvatarSuccess(res, file) { //上传图片成功后
                    this.navimageUrl = imgview + res.body;
                    this.navformdata.navigatorField = res.body;
                    this.$message.success('上传成功');
                },
                closenavmodal(formName) {
                    this.$refs[formName].resetFields();
                    this.navdialogFormVisible = false;
                },
                //机构导航结束---------------------------------------------------------

                //报告查询开始
                rephandleDelete(index, row) {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.instructionTitle)
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
                            commonAjax("cas.orgReportGuideService", "deleteOrgReportGuide", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
                                    });
                                    this.repgetTableData();
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
                rephandleEdit(index, row) {
                    this.repdialogFormVisible = true;
                    if (row) {
                        this.dialogtitle = "编辑报告"
                        this.repformdata = {
                            "id": row.id,
                            "orgId": row.orgId,
                            "reportCatalog": row.reportCatalog ? row.reportCatalog : "",
                            "reportType": row.reportType ? row.reportType : "",
                            "instructionTitle": row.instructionTitle ? row.instructionTitle : "",
                            "instructionPicture": row.instructionPicture ? row.instructionPicture : 0,
                            "remark": row.remark ? row.remark : "",
                            "status": row.status ? row.status : "",
                        };
                        this.repimageUrl = imgview + this.repformdata.instructionPicture;
                    } else {
                        this.dialogtitle = "添加报告";
                        this.repformdata = {
                            "id": 0,
                            "orgId": this.orgOption.orgId,
                            "reportCatalog": "",
                            "reportType": "",
                            "instructionTitle": "",
                            "instructionPicture": 0,
                            "remark": "",
                            "status": "",
                        };
                        this.repimageUrl = "";
                    }


                },
                //提交报告
                repsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.orgReportGuideService", "addOrUpdateOrgReportGuide", '[' + JSON.stringify(this.repformdata) + ']', ).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.repgetTableData();
                                    this.repdialogFormVisible = false;
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
                //获取报告列表数据--------------------
                repgetTableData() {
                    if (this.orgOption.orgId) {
                        let {
                            pageSize, pageNo
                        } = this.repparams;
                        let params = `['${this.orgOption.orgId}',${pageNo},${pageSize}]`;
                        commonAjax("cas.orgReportGuideService", "queryOrgReportGuide", params).then(res => {
                            if (res.code == 200) {
                                this.reptableData = res.body.items;
                                this.reptotal = res.body.total;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    }

                },
                rephandleSizeChange(val) {
                    this.repparams.pageSize = val;
                    this.repgetTableData()
                },
                rephandleCurrentChange(val) {
                    this.repparams.pageNo = val;
                    this.repgetTableData()
                },

                rephandleAvatarSuccess(res, file) { //上传图片成功后
                    this.repimageUrl = imgview + res.body;
                    this.repformdata.instructionPicture = res.body;
                    this.$message.success('上传成功');
                },
                closerepmodal(formName) {
                    this.$refs[formName].resetFields();
                    this.repdialogFormVisible = false;
                },
                //报告查询结束---------------------------------------------------------
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
                // 启用禁用标记
                serhandleDelete(index, row) {
                    const h = this.$createElement;
                     let text=row.effectiveFlag==1?"是否禁用":"是否启用"
                    this.$msgbox({
                        title: '确认操作',
                        message: h('p', null, [
                            h('span', null, text),
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
                                message: "取消操作"
                            });
                        } else {

                            let params = `[${row.id},'${row.effectiveFlag==0?1:0}']`;
                            commonAjax("cas.serviceOpenService", "enableOrDisableServiceOpen", params).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "操作成功"
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
                        this.dialogtitle = "编辑服务"
                        this.serformdata = {
                            "serviceCode": row.serviceCode ? row.serviceCode : "",
                            serviceDesc: row.serviceDesc ? row.serviceDesc : "",
                            "mainFlag": row.mainFlag,
                            "tenantId": row.tenantId ? row.tenantId : "",
                            "serviceName": row.serviceName ? row.serviceName : "",
                            "serviceId": row.serviceId ? row.serviceId : "",
                            "orgId": row.orgId,
                            "objectId": this.orgOption.orgId,
                            "effectiveFlag": row.effectiveFlag,
                            "objectType":"021",
                            "id": row.id,
                        };

                    } else {
                        this.dialogtitle = "添加服务";
                        this.serformdata = {
                            "serviceCode": "",
                            "serviceDesc": "",
                            "mainFlag": "1",
                            "tenantId": sessionStorage.getItem('tenantId'),
                            "serviceName": "",
                            "serviceId": "",
                            "orgId": this.orgOption.orgId,
                            "objectId": this.orgOption.orgId,
                            "effectiveFlag": "1",
                            "id": 0,
                            "objectType": "021",
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
                closesermodal(formName) {
                    this.$refs[formName].resetFields();
                    this.serdialogFormVisible = false;
                },
                showlist() {
                    $(".yishenglist").show();
                },
                // serhandleSizeChange(val) {
                //     // this.serparams.pageSize = val;
                //     // this.sergetTableData()
                // },
                // serhandleCurrentChange(val) {
                //     // this.serparams.pageNo = val;
                //     // this.sergetTableData()
                // },
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
                    // let temobj = {
                    //     "pageNo": 1,
                    //     "pageSize": 200,
                    //     "serviceName": "",
                    //     "status": "1",
                    //     "tenantId": sessionStorage.getItem('tenantId')
                    // };
                     let  tenantId= sessionStorage.getItem('tenantId')
                     let param=`['${tenantId}']`
                    commonAjax("cas.serviceOpenService", "queryOpenServiceByTenantId", param).then(res => {
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
                // 点击服务列表的扩展属性
                serhandleExtend(index, row) {
                    this.serextdialogFormVisible = true;
                    this.dialogtitle = "扩展属性列表"
                    this.curopenserviceId = row.id
                    this.serextgetTableData(this.curopenserviceId);

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
                serexthandleEdit(index, row) {
                    this.addserextdialogFormVisible = true;
                    if (row) {
                        this.dialogtitle2 = "编辑扩展属性"
                        this.serextformdata = {
                            "id": row.id, //id为0时表示新增，id有值时表示更新
                            "openserviceId": row.openserviceId ? row.openserviceId : 0,
                            "exPropertyCode": row.exPropertyCode ? row.exPropertyCode : "",
                            "exPropertyType": row.exPropertyType ? row.exPropertyType : "",
                            "exPropertyData": row.exPropertyData ? row.exPropertyData : "",
                            "lastModifyDt": row.lastModifyDt ? row.lastModifyDt : "",
                            "lastModifyUser": row.lastModifyUser ? row.lastModifyUser : "",
                            "effectiveFlag": row.effectiveFlag,
                            "startDt": row.startDt ? row.startDt : "",
                            "startUser": row.startUser ? row.startUser : "",
                        };

                    } else {
                        this.dialogtitle2 = "新增扩展属性"
                        this.serextformdata = {
                            "id": 0, //id为0时表示新增，id有值时表示更新
                            "openserviceId": this.curopenserviceId,
                            "exPropertyCode": "",
                            "exPropertyType": "",
                            "exPropertyData": "",
                            "lastModifyDt": "",
                            "lastModifyUser": "",
                            "effectiveFlag": "",
                            "startDt": "",
                            "startUser": ""
                        };
                    }

                },

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
                serexthandleSizeChange(val) {
                    this.serextparams.pageSize = val;
                    this.serextgetTableData(this.curopenserviceId);
                },
                serexthandleCurrentChange(val) {
                    this.serextparams.pageNo = val;
                    this.serextgetTableData(this.curopenserviceId);
                },
                serextsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax("cas.servicePropertyService", "addOrUpdateServiceProperty", '[' + JSON.stringify(this.serextformdata) + ']', ).then(res => {
                                if (res.code == 200) {
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                    this.serextgetTableData(this.curopenserviceId);
                                    this.addserextdialogFormVisible = false;
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
                closeserextmodal(formName) {
                    this.$refs[formName].resetFields();
                    this.addserextdialogFormVisible = false;
                },
                //服务列表结束---------------------------------------------------------


                //账号管理开始
                bankPayhandleChange(file, fileList) {
                    console.log(fileList);
                    this.fileList3 = fileList.slice(-3);
                },

                //账号管理结束---------------------------------------------------------
                getchilddata(val, sign) {
                    var params = {
                        limit: 50,
                        parentKey: val,
                    };
                    areaAjax(params).then(res => {
                        if (sign == "city") {
                            this.citylist = res.items;
                        } else if (sign == "district") {
                            this.districtlist = res.items;
                        } else if (sign == "street") {
                            this.streetlist = res.items;
                        } else {
                            this.provincelist = res.items;
                        }

                    });

                },
        },
        components: {
            AreaText
        },
        mounted() {
            let params = [{}];
            commonAjax("cas.departmentService", "deptTree", params).then(res => {
                if (res.code == 200) {
                    this.tableData = res.body.info;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            });
            this.dictionaryRequest();
            this.getServicePacklist();
            this.getchilddata(null, 'province');
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.citylist = [];
                vm.districtlist = [];
                vm.streetlist = [];
                vm.postdefaultarea();
                vm.imageUrl = vm.orgOption.avatarField ? imgview + vm.orgOption.avatarField : "";
                vm.navgetTableData()
                vm.repgetTableData()
                vm.sergetTableData()
            })
        },
        watch: {
            'editarea.province' (val, oldval) {
                if (val != "") {
                    this.getchilddata(val, "city");
                }
                //通过省获取市

                // if (oldval != "") {
                //     this.editarea.city = "";
                //     this.editarea.district = "";
                //     this.editarea.street = ""
                // }
            },
            'editarea.city' (val, oldval) {
                // //通过市区县
                if (val != "") {
                    this.getchilddata(val, "district");
                }

                // if (oldval != "") {
                //     this.editarea.district = "";
                //     this.editarea.street = ""
                // }
            },
            'editarea.district' (val, oldval) {
                // //通过区县获取街道

                if (val != "") {
                    this.getchilddata(val, "street");
                }
                // if (oldval != "") {
                //     this.editarea.street = ""
                // }
            },
            'editarea.street' (val, oldval) {
                if (val != "") {

                }

            },

        },
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
</style>
