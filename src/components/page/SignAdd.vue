<template>
    <div class="table">
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>签约服务</el-breadcrumb-item>
                        <el-breadcrumb-item>签约管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <el-col :span="6" class="fr">
                    <el-button type="info" icon="plus" @click="addapply">新增</el-button>
                </el-col>
                <el-col :span="6" class="addorg fr">
                    <el-select v-model="params.tenantId" placeholder="请选择租户">
                        <el-option v-for="item in tenantIdtableData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="6">
                    <el-input v-model="params.personName" placeholder="居民姓名"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="params.orgName" placeholder="签约机构名称"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="params.teamName" placeholder="签约团队"></el-input>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="6">
                    <el-date-picker v-model="params.start" type="date" placeholder="申请开始时间" @change="dateformat2" format="yyyy-MM-dd">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-date-picker v-model="params.end" type="date" placeholder="申请结束时间" @change="dateformat3" format="yyyy-MM-dd">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-select v-model="params.initiator" placeholder="发起人">
                        <el-option label="患者" value="patient"></el-option>
                        <el-option label="团队成员" value="member"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="personName" label="居民姓名">
            </el-table-column>
            <el-table-column prop="tel" label="联系电话">
            </el-table-column>
            <el-table-column prop="orgName" label="签约机构名称">
            </el-table-column>
            <el-table-column prop="teamName" label="签约团队">
            </el-table-column>
            <el-table-column prop="createAt" label="申请时间">
            </el-table-column>
            <el-table-column prop="initiator" label="发起人">
                <template scope="scope">
                    <p v-show="scope.row.initiator=='member'">团队成员</p>
                    <p v-show="scope.row.initiator=='patient'">患者</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" @click="lookapply(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" @click.native="print(scope.$index, scope.row)">打印</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <!-- 查看签约 -->
        <el-dialog title="查看签约" v-model="lookdialogFormVisible">
            <el-form :model="lookformdata" :rules="lookformrules" ref="lookadinfoForm" auto-complete="off" id="lookadinfoForm">
                <h2 class="account-title">
                    <span>居民信息</span>
                </h2>
                <el-form-item label="头像" :label-width="formLabelWidth">
                    <img :src="imgview+formdata.personHeader" width="100" height="150">
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="personName">
                    <el-input v-model="lookformdata.personName" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                    <el-select v-model="lookformdata.sex" placeholder="请选择性别" disabled>
                        <el-option v-for="item in dictionary.gender" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国籍" :label-width="formLabelWidth" prop="nationality">
                    <el-select v-model="lookformdata.nationality" placeholder="请选择国籍" disabled>
                        <el-option v-for="item in dictionary.nationality" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期" :label-width="formLabelWidth" prop="dob">
                    <el-input v-model="lookformdata.dob" disabled></el-input>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="idCardType">
                    <el-select v-model="lookformdata.idCardType" placeholder="请选择证件类型" disabled>
                        <el-option v-for="item in dictionary.certificateType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth" prop="idCard">
                    <el-input v-model="lookformdata.idCard" disabled></el-input>
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="tel">
                    <el-input v-model="lookformdata.tel" disabled></el-input>
                </el-form-item>
                <el-form-item label="居住地址" :label-width="formLabelWidth" prop="tel">
                    <el-input v-model="lookformdata.address" disabled></el-input>
                </el-form-item>
                <h2 class="account-title">
                    <span>签约信息</span>
                </h2>
                <el-form-item label="签约机构" :label-width="formLabelWidth" prop="orgName">
                    <el-input v-model="lookformdata.orgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="签约团队" :label-width="formLabelWidth" prop="teamName">
                    <el-input v-model="lookformdata.teamName" disabled></el-input>
                </el-form-item>
                <el-form-item label="团队长" :label-width="formLabelWidth" prop="teamLeaderName">
                    <el-input v-model="lookformdata.teamLeaderName" disabled></el-input>
                </el-form-item>
                <el-form-item label="签约周期" :label-width="formLabelWidth" prop="signCycle">
                    <el-input v-model="lookformdata.signCycle" disabled></el-input>
                </el-form-item>
                <el-form-item label="服务包" :label-width="formLabelWidth" prop="packages">
                    <el-select v-model="lookformdata.packages" multiple filterable allow-create placeholder="请选择标签" disabled>
                        <el-option v-for="item in packageslist" :key="item.spPackId" :label="item.spPackName" :value="item.spPackId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <h2 class="account-title">
                    <span>签约确认</span>
                </h2>
                <el-form-item label="确认方式" :label-width="formLabelWidth" prop="checkWay">
                    <el-select v-model="lookformdata.checkWay" placeholder="请选择确认方式" disabled>
                        <el-option v-for="item in dictionary.channelType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约生效日期" :label-width="formLabelWidth" prop="signValidDate">
                    <el-date-picker type="date" placeholder="选择日期" v-model="lookformdata.signValidDate" style="width: 100%;" format="yyyy-MM-dd" disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="管理类型" :label-width="formLabelWidth" prop="personGroup">
                    <el-select v-model="lookformdata.personGroup" placeholder="请选择管理类型" disabled>
                        <el-option v-for="item in dictionary.group" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区级医院" :label-width="formLabelWidth" prop="districtOrgName" v-show="lookformdata.openOneFlag==1">
                    <el-input v-model="lookformdata.districtOrgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="市级医院" :label-width="formLabelWidth" prop="cityOrgName" v-show="lookformdata.openOneFlag==1">
                    <el-input v-model="lookformdata.cityOrgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="operInfo">
                    <el-input v-model="lookformdata.operInfo" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" disabled></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closelookmodal('lookadinfoForm')">取 消</el-button>
                <el-button type="info" @click="lookprotoco">查看协议</el-button>
            </div>
        </el-dialog>
        <!-- 新增签约 -->
        <el-dialog title="新增签约" v-model="dialogFormVisible" @close="resetForm('adinfoForm')">
            <el-form :model="formdata" :rules="formrules" ref="adinfoForm" auto-complete="off" id="adinfoForm">
                <h2 class="account-title">
                    <span>居民信息</span>
                </h2>
              
                <el-form-item label="国籍" :label-width="formLabelWidth" prop="nationality">
                    <el-select v-model="formdata.nationality" placeholder="请选择国籍">
                        <el-option v-for="item in dictionary.nationality" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="idCardType" v-if="formdata.nationality=='01'">
                    <!--    <el-select v-model="formdata.idCardType" placeholder="请选择证件类型">
                        <el-option v-for="item in dictionary.certificateType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select> -->
                    <el-select v-model="formdata.idCardType" placeholder="请选择证件类型">
                        <el-option label="居民身份证" value="01"></el-option>
                        <!--  <el-option  label="居民户口簿" value="02"></el-option>
                        <el-option  label="护照" value="03"></el-option> -->
                        <el-option label="军官证" value="04"></el-option>
                        <!--  <el-option  label="驾驶证" value="05"></el-option>
                        <el-option  label="港澳居民来往内地通行证" value="06"></el-option>
                        <el-option  label="台湾居民来往内地通行证" value="07"></el-option> -->
                        <el-option label="出生证明" value="11"></el-option>
                        <!-- <el-option  label="其他法定有效证件" value="99"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="idCardType" v-if="formdata.nationality=='02'">
                    <el-select v-model="formdata.idCardType" placeholder="请选择证件类型">
                        <el-option label="港澳居民来往内地通行证" value="06"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="idCardType" v-if="formdata.nationality=='03'">
                    <el-select v-model="formdata.idCardType" placeholder="请选择证件类型">
                        <el-option label="台湾居民来往内地通行证" value="07"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件类型" :label-width="formLabelWidth" prop="idCardType" v-if="formdata.nationality=='04'">
                    <el-select v-model="formdata.idCardType" placeholder="请选择证件类型">
                        <el-option label="护照" value="03"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码" :label-width="formLabelWidth" prop="idCard">
                    <el-input v-model="formdata.idCard"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" :label-width="formLabelWidth" prop="dob">
                    <el-date-picker v-model="formdata.dob" type="date" placeholder="出生日期" @change="dateformat4" format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                    <el-select v-model="formdata.sex" placeholder="请选择性别">
                        <el-option v-for="item in dictionary.gender" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                  <el-form-item label="姓名" :label-width="formLabelWidth" prop="personName">
                    <el-input v-model="formdata.personName"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" :label-width="formLabelWidth" prop="tel">
                    <el-input v-model="formdata.tel"></el-input>
                </el-form-item>
                <div id="areatext">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="省级" :label-width="formLabelWidth" prop="province">
                                <el-select v-model="formdata.province" placeholder="请选择省">
                                    <el-option v-for="item in provincelist" :label="item.text" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="市级" :label-width="formLabelWidth" prop="city">
                                <el-select v-model="formdata.city" placeholder="请选择市">
                                    <el-option v-for="item in citylist" :label="item.text" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="地区" :label-width="formLabelWidth" prop="district">
                                <el-select v-model="formdata.district" placeholder="请选择地区">
                                    <el-option v-for="item in districtlist" :label="item.text" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="街道" :label-width="formLabelWidth" prop="city">
                                <el-select v-model="formdata.street" placeholder="请选择街道">
                                    <el-option v-for="item in streetlist" :label="item.text" :value="item.key" :key="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-form-item label="详细地址" :label-width="formLabelWidth" prop="address">
                    <el-input v-model="formdata.address"></el-input>
                </el-form-item>
                <h2 class="account-title">
                    <span>签约信息</span>
                </h2>
                <el-form-item label="签约团队" :label-width="formLabelWidth" prop="teamName">
                    <!--  <el-input v-model="formdata.teamName" ></el-input> -->
                    <el-select v-model="teamobj" filterable placeholder="请选择签约团队">
                        <el-option v-for="item in teamlist" :key="item.teamId" :label="item.teamName" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约机构" :label-width="formLabelWidth" prop="orgName">
                    <el-input v-model="formdata.orgName" disabled></el-input>
                </el-form-item>
                <el-form-item label="团队长" :label-width="formLabelWidth" prop="teamLeaderName">
                    <el-input v-model="formdata.teamLeaderName" disabled></el-input>
                </el-form-item>
                <el-form-item label="签约周期" :label-width="formLabelWidth" prop="signCycle">
                    <el-input v-model="formdata.signCycle" disabled></el-input>
                </el-form-item>
                <el-form-item label="服务包" :label-width="formLabelWidth" prop="packages">
                    <el-select v-model="formdata.packages" multiple filterable allow-create placeholder="请选择服务包">
                        <el-option v-for="item in packageslist" :key="item.spPackId" :label="item.spPackName" :value="item.spPackId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <h2 class="account-title">
                    <span>签约确认</span>
                </h2>
                <el-form-item label="确认方式" :label-width="formLabelWidth" prop="checkWay">
                    <el-select v-model="formdata.checkWay" placeholder="请选择确认方式">
                        <el-option v-for="item in dictionary.channelType" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签约生效日期" :label-width="formLabelWidth" prop="signValidDate">
                    <el-date-picker type="date" placeholder="选择日期" v-model="formdata.signValidDate" style="width: 100%;" @change="dateformat" format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="管理类型" :label-width="formLabelWidth" prop="personGroup">
                    <el-select v-model="formdata.personGroup" placeholder="请选择管理类型">
                        <el-option v-for="item in dictionary.group" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="区级医院" :label-width="formLabelWidth" prop="districtOrgName" v-if="formdata.openOneFlag==1">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-input v-model="formdata.districtOrgName"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="primary" @click="districtshow">请选择</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="市级医院" :label-width="formLabelWidth" prop="cityOrgName" v-if="formdata.openOneFlag==1">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <el-input v-model="formdata.cityOrgName"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-button type="primary" @click="cityshow">请选择</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="operInfo">
                    <el-input v-model="formdata.operInfo" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="closemodal('adinfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('adinfoForm')">确 定</el-button>
                <el-button type="info" @click="lookaddprotoco">查看协议</el-button>
            </div>
        </el-dialog>
        <el-dialog title="查看协议" v-model="curprotocoldialog">
            <div v-html="curprotocolcontent"></div>
        </el-dialog>
        <!-- cityOrglist -->
        <el-dialog title="" v-model="cityOrglistdialog">
            <el-table :data="cityOrglist" border style="width: 100%">
                <el-table-column prop="orgId" label="机构ID">
                </el-table-column>
                <el-table-column prop="orgFullName" label="机构名称">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button size="small" @click="selectcityOrg(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- districtOrglist -->
        <el-dialog title="" v-model="districtOrglistdialog">
            <el-table :data="districtOrglist" border style="width: 100%">
                <el-table-column prop="orgId" label="机构ID">
                </el-table-column>
                <el-table-column prop="orgFullName" label="机构名称">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button size="small" @click="selectdistrictOrg(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax, imgview,areaAjax
}
from '../../api/api';
import 'assets/lib/print/jquery.jqprint-0.3.js';
import 'assets/lib/print/jquery-migrate-1.2.1.min.js';

export default {
    data() {
            var checkidCard = (rule, value, callback) => {
                if (this.formdata.idCardType == "01") {
                    var iSum = 0,
                        info = "",
                        sId = value,
                        sBirthday;
                    if (!/^\d{17}(\d|x)$/i.test(sId)) {
                        callback(new Error('你输入的身份证长度或格式错误'))
                    }
                    sId = sId.replace(/x$/i, "a");
                    if (this.aCity[parseInt(sId.substr(0, 2))] == null) {
                        callback(new Error('你的身份证地区非法'))
                    }
                    sBirthday = sId.substr(6, 4) + "-" + sId.substr(10, 2) + "-" + sId.substr(12, 2);

                    var d = new Date(sBirthday.replace(/-/g, "/"));
                    var year = d.getFullYear(),
                        month = d.getMonth() + 1,
                        date = d.getDate();
                    if (sBirthday != (year + "-" + (month < 10 ? '0' + month : month) + "-" + (date < 10 ? '0' + date : date))) {
                        callback(new Error('身份证上的出生日期非法'))
                    }
                    for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
                    if (iSum % 11 != 1) {
                        callback(new Error('你输入的身份证号非法'))
                    }
                    var str = sId.substr(16, 1) % 2 ? "1" : "2"; //此次还可以判断出输入的身份证号的人性别 男1女2
                    callback();
                } else {
                    callback();

                }

                commonAjax("cas.signService", "hasCert", `['${this.formdata.idCard}','${this.formdata.idCardType}','${this.formdata.nationality}']`).then(res => {
                        if (res.code == 200) {
                            if(res.body){
                                this.formdata.sex=res.body.sex;
                                this.formdata.dob=res.body.dob.substring(0,10);
                                this.formdata.personName=res.body.personName;
                                this.formdata.tel=res.body.phoneNo;
                                this.formdata.province=res.body.province;
                                this.formdata.city=res.body.city;
                                this.formdata.district=res.body.district;
                                this.formdata.street=res.body.street;
                                this.formdata.address=res.body.address;
                                this.formdata.mpiId=res.body.mpiId;
                            }else{
                                if(this.formdata.idCardType=="01"){
                                     this.formdata.dob=sBirthday
                                     this.formdata.sex=str;
                                }
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });


            };
            return {
                // 通用
                formLabelWidth: '120px',
                imgview: imgview,
                // 列表常用的数据开始
                tableData: [],
                params: {
                    "orgName": "",
                    "pageNo": 1,
                    "pageSize": 10,
                    "personName": "",
                    "teamName": "",
                    "start": "", //开始时间
                    "end": "", //结束时间
                    "tenantId": "",
                    "initiator": "" //发起人 患者 patient 团队成员 member
                },
                total: 1,
                // 表单数据开始
                lookformdata: { //表单绑定数据用
                    "packages": [],
                    "teamLeaderName": "",
                    "address": "",
                    "teamId": 0,
                    "teamName": "",
                    "orgId": "",
                    "orgName": "",
                    "signCycle": 1,
                    "contactName": "",
                    "contactPhone": "",
                    "protocolId": 0,
                    "signId": 0,
                    "mpiId": "",
                    "idCardType": "",
                    "idCard": "",
                    "personHeader": 0,
                    "personName": "",
                    "sex": "",
                    "dob": "",
                    "tel": "",
                    "operPersonType": "",
                    "operPersonName": "",
                    "operTime": "",
                    "operInfo": "",
                    "createAt": "",
                    "checkWay": "",
                    "cityOrgId": "",
                    "cityOrgName": "",
                    "districtOrgId": "",
                    "districtOrgName": "",
                    "openOneFlag": "",
                    "personGroup": "",
                    "signState": "",
                    "signValidDate": "",
                    "nationality": ""
                },
                lookdialogFormVisible: false, //模态框显示隐藏用
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
                    "packages": [],
                    "teamLeaderName": "",
                    "teamLeaderId": "",
                    "address": "",
                    "teamId": "",
                    "teamName": "",
                    "orgId": "",
                    "orgName": "",
                    "signCycle": 1,
                    "contactName": "",
                    "contactPhone": "",
                    "protocolId": 0,
                    "idCardType": "",
                    "idCard": "",
                    "personHeader": 0,
                    "personName": "",
                    "sex": "",
                    "dob": "",
                    "tel": "",
                    "operPersonType": "",
                    "operPersonName": "",
                    "operTime": "",
                    "operInfo": "",
                    "createAt": "",
                    "checkWay": "",
                    "cityOrgId": "",
                    "cityOrgName": "",
                    "districtOrgId": "",
                    "districtOrgName": "",
                    "openOneFlag": "",
                    "personGroup": "",
                    "signValidDate": "",
                    "nationality": "",
                    province: "",
                    city: "",
                    district: "",
                    street: "",
                    mpiId:""

                },
                dialogtitle: "", //模态框动态标题
                formrules: { //表单验证规则
                    packages: [{
                        required: true,
                        message: '请选择服务包',

                    }],
                    checkWay: [{
                        required: true,
                        message: '请选择确认方式',
                        trigger: 'blur'
                    }],
                    cityOrgName: [{
                        required: true,
                        message: '请选择市医院',

                    }],
                    districtOrgName: [{
                        required: true,
                        message: '请选择区医院',
                    }],
                    signValidDate: [{
                        required: true,
                        message: '请选择签约生效日期',

                    }],
                    personGroup: [{
                        required: true,
                        message: '请选择管理类型',

                    }],
                    teamName: [{
                        required: true,
                        message: '请选择团队',

                    }],
                    personName: [{
                        required: true,
                        message: '请输入姓名',

                    }],
                    nationality: [{
                        required: true,
                        message: '请选择国籍',

                    }],
                    idCardType: [{
                        required: true,
                        message: '请选择证件类型',

                    }],
                    idCard: [{
                        required: true,
                        message: '请输入证件号码',

                    }, {
                        validator: checkidCard,
                        trigger: 'blur'
                    }],
                    sex: [{
                        required: true,
                        message: '请选择性别',

                    }],
                    tel: [{
                        required: true,
                        message: '请输入电话号码',

                    }],

                },
                imageUrl: "", //文件或者图片上传预览图片的src地址
                //字典查询数据
                dictionary: {
                    channelType: [],
                    nationality: [],
                    certificateType: [],
                    gender: [],
                    group: [],
                },
                tenantIdtableData: [],
                islook: false,
                packageslist: [],
                cursignId: "",
                curprotocolcontent: "",
                curprotocoldialog: false,
                "cityOrglist": [],
                "districtOrglist": [],
                cityOrglistdialog: false,
                districtOrglistdialog: false,
                teamlist: [],
                teamobj: null,
                aCity: {
                    11: "北京",
                    12: "天津",
                    13: "河北",
                    14: "山西",
                    15: "内蒙古",
                    21: "辽宁",
                    22: "吉林",
                    23: "黑龙江",
                    31: "上海",
                    32: "江苏",
                    33: "浙江",
                    34: "安徽",
                    35: "福建",
                    36: "江西",
                    37: "山东",
                    41: "河南",
                    42: "湖北",
                    43: "湖南",
                    44: "广东",
                    45: "广西",
                    46: "海南",
                    50: "重庆",
                    51: "四川",
                    52: "贵州",
                    53: "云南",
                    54: "西藏",
                    61: "陕西",
                    62: "甘肃",
                    63: "青海",
                    64: "宁夏",
                    65: "新疆",
                    71: "台湾",
                    81: "香港",
                    82: "澳门",
                    91: "国外"
                },
                provincelist: [],
                citylist: [],
                districtlist: [],
                streetlist: [],

            }
        },
        computed: {

        },
        methods: {
            dateformat2(val) {
                    this.params.start = val
                },
                dateformat3(val) {
                    this.params.end = val
                },
                //出生日期
                dateformat4(val) {
                    this.formdata.dob = val
                },
                dateformat(val) {
                    this.formdata.signValidDate = val
                },
                print(index, row) {
                    var params = `[${row.signId}]`
                    commonAjax("cas.signService", "signedProtocolContent", params).then(res => {
                        if (res.code == 200) {
                            var temcont = `'<div>${res.body}</div>'`;
                            $(temcont).jqprint();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });

                },
                addapply() {
                    this.dialogFormVisible = true;
                    this.formdata = { //表单绑定数据用
                        "packages": [],
                        "teamLeaderName": this.formdata.teamLeaderName,
                        "teamLeaderId": this.formdata.teamLeaderId,
                        "address": "",
                        "teamId": this.formdata.teamId,
                        "teamName": this.formdata.teamName,
                        "orgId": this.formdata.orgId,
                        "orgName": this.formdata.orgName,
                        "signCycle": 1,
                        "contactName": "",
                        "contactPhone": "",
                        "protocolId": 0,
                        "idCardType": "",
                        "idCard": "",
                        "personHeader": 0,
                        "personName": "",
                        "sex": "",
                        "dob": "",
                        "tel": "",
                        "operPersonType": "",
                        "operPersonName": "",
                        "operTime": "",
                        "operInfo": "",
                        "createAt": "",
                        "checkWay": "2",
                        "cityOrgId": "",
                        "cityOrgName": "",
                        "districtOrgId": "",
                        "districtOrgName": "",
                        "openOneFlag": this.formdata.openOneFlag,
                        "personGroup": "",
                        "signValidDate": "",
                        "nationality": "01",
                        province: "",
                        city: "",
                        district: "",
                        street: "",
                        mpiId:"",
                    }
                    var d = new Date();
                    var year = d.getFullYear();
                    var month = d.getMonth() + 1;
                    var date = d.getDate();
                    this.formdata.signValidDate = year + "-" + (month < 10 ? '0' + month : month) + "-" + (date < 10 ? '0' + date : date);

                },
                lookapply(index, row) {
                    this.cursignId = row.signId;
                    this.getpackageslist(row.teamId)
                    let param = `[${row.signId}]`;
                    commonAjax("cas.signService", "signDetail", param).then(res => {
                        if (res.code == 200) {
                            this.lookdialogFormVisible = true;
                            let temarr = [];
                            $.each(res.body.packages, function(index, el) {
                                temarr.push(el.spPackId);
                            });
                            this.lookformdata = { //表单绑定数据用
                                "packages": temarr,
                                "address": res.body.address,
                                "teamId": res.body.teamId,
                                "teamName": res.body.teamName,
                                "teamLeaderName": res.body.teamLeaderName,
                                "orgId": res.body.orgId,
                                "orgName": res.body.orgName,
                                "signCycle": res.body.signCycle,
                                "contactName": res.body.contactName,
                                "contactPhone": res.body.contactPhone,
                                "protocolId": res.body.protocolId,
                                "signId": res.body.signId,
                                "mpiId": res.body.mpiId,
                                "idCardType": res.body.idCardType,
                                "idCard": res.body.idCard,
                                "personHeader": res.body.personHeader,
                                "personName": res.body.personName,
                                "sex": res.body.sex,
                                "dob": res.body.dob,
                                "tel": res.body.tel,
                                "operPersonType": res.body.operPersonType,
                                "operPersonName": res.body.operPersonName,
                                "operTime": res.body.operTime,
                                "operInfo": res.body.operInfo,
                                "createAt": res.body.createAt,
                                "signState": res.body.signState,
                                "checkWay": res.body.checkWay,
                                "cityOrgId": res.body.cityOrgId,
                                "cityOrgName": res.body.cityOrgName,
                                "districtOrgId": res.body.districtOrgId,
                                "districtOrgName": res.body.districtOrgName,
                                "openOneFlag": res.body.openOneFlag,
                                "personGroup": res.body.personGroup,
                                "signValidDate": res.body.signValidDate,
                                "nationality": res.body.nationality
                            }

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });

                },

                //获取搜索下拉框的租户列表
                gettenantIdlist() {
                    let params = {
                        "pageNo": 1,
                        "pageSize": 300,
                    }
                    commonAjax("cas.tenantManageService", "tenantList", '[' + JSON.stringify(params) + ']', ).then(res => {
                        if (res.code == 200) {
                            this.tenantIdtableData = res.body.data;
                            this.params.tenantId = res.body.data[0].tenantId
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取服务包下拉框
                getpackageslist(teamId) {
                    commonAjax("cas.signService", "querySpPack", `[${teamId}]`).then(res => {
                        if (res.code == 200) {
                            this.packageslist = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //新增签约的时候用获取是否有1+1+1签约
                getsign111() {
                    commonAjax("cas.signService", "hasService", `['${this.formdata.orgId}']`).then(res => {
                        if (res.code == 200) {
                            this.formdata.openOneFlag = res.body ? "1" : 0
                            if (this.formdata.openOneFlag == 1) {
                                this.getorgbelong(2);
                                this.getorgbelong(3);
                            }

                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                // 新增签约的时候用查询市级医院或者区级医院
                getorgbelong(nubmerstr) {
                    commonAjax("cas.signService", "queryOrgInfoByAreaLevel", `['','${this.formdata.orgId}','${nubmerstr}']`).then(res => {
                        if (res.code == 200) {
                            if (nubmerstr == 2) {
                                this.districtOrglist = res.body
                            } else {
                                this.cityOrglist = res.body
                            }

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
                    commonAjax("cas.signService", "signApplyList", '[' + JSON.stringify(this.params) + ']').then(res => {
                        if (res.code == 200) {
                            // $.each(res.body.list, function(index, el) {
                            //     el.valid_startDate = el.valid_startDate.substring(0, 10)
                            //     el.valid_endDate = el.valid_endDate.substring(0, 10)
                            // }.bind(this));
                            this.tableData = res.body.data;
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
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            let temarr = [];
                            let that = this;
                            $.each(this.packageslist, function(index, el) {
                                $.each(that.formdata.packages, function(index2, el2) {
                                    if (el.spPackId == el2) {
                                        temarr.push(el)
                                    }
                                });
                            });

                            this.formdata.packages=temarr;
                            this.formdata.residents=[{
                                    "idCard": this.formdata.idCard,
                                    "idCardType": this.formdata.idCardType,
                                    "nation": this.formdata.nation,
                                    "nationality": this.formdata.nationality,
                                    "personName":this.formdata.personName,
                                    "dob":this.formdata.dob,
                                    "sex": this.formdata.sex,
                                    "tel": this.formdata.tel,
                                    mpiId:this.formdata.mpiId,

                                }]
                            // let temsubmitdata = {
                            //     "checkWay": this.formdata.checkWay,
                            //     "cityOrgId": this.formdata.cityOrgId,
                            //     "cityOrgName": this.formdata.cityOrgName,
                            //     "districtOrgId": this.formdata.districtOrgId,
                            //     "districtOrgName": this.formdata.districtOrgName,
                            //     "openOneFlag": this.formdata.openOneFlag,
                            //     "operInfo": this.formdata.operInfo,
                            //     "packages": temarr,
                            //     "personGroup": this.formdata.personGroup,
                            //     "signId": this.formdata.signId,

                            //     "signValidDate": this.formdata.signValidDate,
                            // }
                            commonAjax("cas.signService", "signApplySaved", '[' + JSON.stringify(this.formdata) + ']', ).then(res => {
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
                closelookmodal(formName) {
                    this.$refs[formName].resetFields();
                    this.lookdialogFormVisible = false;
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

                //获取字典
                dictionaryRequest() {
                    let arr = ["cfs.dic.base_channelType", "cfs.dic.base_nationality", "cfs.dic.base_certificateType", "cfs.dic.base_gender", "cfs.dic.base_group"];
                    commonAjax("cas.multipleDictionaryService", "findDic", '[' + JSON.stringify(arr) + ']').then(res => {
                        if (res.code == 200) {
                            var that = this;
                            res.body.forEach(function(ele, index) {
                                if (ele.dicId == arr[0]) {
                                    that.dictionary.channelType = ele.items;
                                }
                                if (ele.dicId == arr[1]) {
                                    that.dictionary.nationality = ele.items;
                                }
                                if (ele.dicId == arr[2]) {
                                    that.dictionary.certificateType = ele.items;
                                }
                                if (ele.dicId == arr[3]) {
                                    that.dictionary.gender = ele.items;
                                }
                                if (ele.dicId == arr[4]) {
                                    that.dictionary.group = ele.items;
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
                lookprotoco() {
                    this.curprotocoldialog = true;
                    this.getprotococont();
                },
                getprotococont() {
                    this.curprotocolcontent = "";
                    var params = `[${this.cursignId}]`
                    commonAjax("cas.signService", "signedProtocolContent", params).then(res => {
                        if (res.code == 200) {
                            this.curprotocolcontent = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                lookaddprotoco() {
                    this.curprotocoldialog = true;
                    this.getaddprotococont();
                },
                getaddprotococont() {
                    this.curprotocolcontent = "";
                    let temaddprodata = {
                        "orgId": this.formdata.orgId,
                        "peopleAddress": this.formdata.peopleAddress,
                        "peopleCardNum": this.formdata.idCard,
                        "peopleCardType": this.formdata.idCardType,
                        "peoplePhone": this.formdata.tel,
                        "signHospitalName": this.formdata.orgName,
                    };
                    commonAjax("cas.signProtocolService", "getSignContentText", '[' + JSON.stringify(temaddprodata) + ']').then(res => {
                        if (res.code == 200) {
                            this.curprotocolcontent = res.body;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                selectdistrictOrg(index, row) {
                    this.formdata.districtOrgId = row.orgId;
                    this.formdata.districtOrgName = row.orgFullName;
                    this.districtOrglistdialog = false;
                },
                selectcityOrg(index, row) {
                    this.formdata.cityOrgId = row.orgId;
                    this.formdata.cityOrgName = row.orgFullName;
                    this.cityOrglistdialog = false
                },
                //地区医院选择列表弹框
                districtshow() {
                    this.districtOrglistdialog = true;
                },
                //市级医院选择列表弹框
                cityshow() {
                    this.cityOrglistdialog = true;
                },
                //根据doctorId获取团队列表
                getteamlistbydoctorId() {
                    // commonAjax("cas.signService", "queryTeamInfoByDoctorId", "['01a950a3-b681-4197-afa0-672844643a1d']").then(res => {
                    //     if (res.code == 200) {
                    //         this.teamlist = res.body;
                    //         this.teamobj = res.body[0];
                    //     } else {
                    //         this.$message({
                    //             type: 'error',
                    //             message: res.msg
                    //         });
                    //     }
                    // });
                    this.getcurdocId().then(doctorId => {
                       commonAjax("cas.signService", "queryTeamInfoByDoctorId", `['${doctorId}']`).then(res => {
                            if (res.code == 200) {
                                this.teamlist = res.body;
                                this.teamobj = res.body[0];
                                // this.formdata.teamId = res.body[0].teamId;
                                // this.formdata.teamName = res.body[0].teamName;
                                // this.formdata.orgName = res.body[0].orgFullName;
                                // this.formdata.orgId = res.body[0].orgId;
                                // this.formdata.teamLeaderId = res.body[0].teamLeaderId;
                                // this.formdata.teamLeaderName = res.body[0].teamLeaderName;

                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    });
                },
                //先请求 获取当前登录人的医生id
                getcurdocId() {
                    var p = new Promise((resolve, reject) => {
                        commonAjax("cas.doctorService", "getCurrentDoctorId", '[]').then(res => {
                            if (res.code == 200) {
                                resolve(res.body);
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    })
                    return p;
                },
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

                // 表单常用的方法结束--------------------------------------------------------------------------

        },
        components: {

        },
        mounted() {
            this.getteamlistbydoctorId()
            this.gettenantIdlist();
            this.dictionaryRequest();
            this.getchilddata(null, 'province');
        },
        watch: {
            'params.tenantId' (val, oldval) {
                this.getTableData();
            },
            // 'formdata.orgId' (val, oldval) {
            //     if (val != '') {
            //         alert(111)
            //         this.getsign111();
            //     }
            // },
            'teamobj' (val, oldval) {
                if (val != null) {
                    this.formdata.packages=[];
                    this.formdata.teamId = val.teamId;
                    this.formdata.teamName = val.teamName;
                    this.formdata.orgName = val.orgFullName;
                    this.formdata.orgId = val.orgId;
                    this.formdata.teamLeaderId = val.teamLeaderId;
                    this.formdata.teamLeaderName = val.teamLeaderName;
                    this.getpackageslist(val.teamId)
                    this.getsign111();
                }

            },
            'formdata.nationality' (val, oldval) {
                if (val == '01') {
                    this.formdata.idCardType = "01"
                } else {
                    this.formdata.idCardType = ""
                }

            },
            'formdata.province' (val, oldval) {
                if (val != "") {
                    console.log(val);
                     console.log(oldval);
                    this.getchilddata(val, "city");
                }

            },
            'formdata.city' (val, oldval) {
                // //通过市区县
                if (val != "") {
                    this.getchilddata(val, "district");
                }

            },
            'formdata.district' (val, oldval) {

                if (val != "") {
                    this.getchilddata(val, "street");
                }

            },
            'formdata.street' (val, oldval) {
                if (val != "") {

                }

            },
        }

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

.el-table td,
.el-table th {
    padding: 5px;
}

.fr {
    float: right
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
