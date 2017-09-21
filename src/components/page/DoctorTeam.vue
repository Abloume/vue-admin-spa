<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>机构管理</el-breadcrumb-item>
                        <el-breadcrumb-item>家医团队</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 标题 -->
                <div class="commontit">
                    <h2>医院列表</h2>
                </div>
                <div class="left-con">
                    <ul id="hospitalLists3" class="ztree" style="width:240px"></ul>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="commontit commontit2">
                    <h2>家医团队列表</h2>
                </div>
                <div class="right-con">
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column prop="teamName" label="团队名称">
                        </el-table-column>
                        <el-table-column prop="teamLeaderName" label="团队长">
                        </el-table-column>
                        <el-table-column prop="telNo" label="联系电话">
                        </el-table-column>
                        <el-table-column prop="info" label="简介">
                        </el-table-column>
                        <el-table-column label="操作" width="130">
                            <template scope="scope">
                                <el-button size="small" @click="addTreeNode(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="teamclisttotal" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="param.pageSize">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div id="rMenu">
            <ul>
                <li id="m_add" @click="addTreeNode">添加团队</li>
            </ul>
        </div>
        <!-- 编辑或者新增团队 -->
        <el-dialog :title="dialogtitle" v-model="editTeamdialogFormVisible" @close="resetForm('editTeaminfoForm')">
            <el-tabs type="card" :active-name="activeName" @tab-click="tabHandleClick">
                <el-tab-pane label="基本信息" name="baseInfo" class="eltabpane">
                    <el-form :model="editTeamformdata" :rules="editTeamrules" ref="editTeaminfoForm" auto-complete="off">
                        <el-form-item label="团队名称" :label-width="formLabelWidth" prop="teamName">
                            <el-input v-model="editTeamformdata.teamName"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="telNo">
                            <el-input v-model="editTeamformdata.telNo"></el-input>
                        </el-form-item>
                        <el-form-item label="所属机构" :label-width="formLabelWidth" prop="curbeloneorg">
                            <el-input v-model="curbeloneorg" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="简介" :label-width="formLabelWidth" prop="info">
                            <el-input v-model="editTeamformdata.info" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                        </el-form-item>
                        <div class="center-foot">
                            <el-button @click="closeeditTeaminfo('editTeaminfoForm')">取 消</el-button>
                            <el-button type="primary" @click="editTeamsubmitForm('editTeaminfoForm')">确 定</el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="团队成员管理" name="teamMember" class="eltabpane" v-if="ishowtab">
                    <el-row class="addbtn">
                        <el-col :span="24" class="addorg">
                            <el-button type="primary" icon="plus" @click="teamMemberEdit">新建成员</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="teamDoclist" border style="width: 100%">
                        <el-table-column prop="memberName" label="姓名">
                        </el-table-column>
                        <el-table-column prop="memberRoleText" label="角色">
                        </el-table-column>
                        <el-table-column prop="memberTypeText" label="家医类型">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-button size="small" @click="setLeader(scope.$index, scope.row)" v-show="scope.row.memberRole==1">设为团队长</el-button>
                                <el-button size="small" type="danger" @click="teamMemberDelete(scope.$index, scope.row)" v-show="scope.row.memberRole==1">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="服务包" name="servicePkg" class="eltabpane" v-if="ishowtab">
                    <!-- <el-row class="addbtn">
                        <el-col :span="24" class="addorg">
                            <el-button type="primary" icon="plus" @click="serhandleEdit">新建服务包</el-button>
                        </el-col>
                    </el-row> -->
                    <el-row class="addbtn" :gutter="20">
                        <el-col :span="4">
                            <el-input v-model="spPackParam.spName" placeholder="请输入服务名称"></el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-input v-model="spPackParam.packCode" placeholder="请输入编号" v-show="!this.editTeamformdata.teamId"></el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-select v-model="spPackParam.status" placeholder="启用情况">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="启用" value="1"></el-option>
                                <el-option label="禁用" value="0"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" icon="search" @click="sersearchClick">搜索</el-button>
                        </el-col>
                        <el-col :span="6" class="addorg">
                            <el-button type="primary" icon="plus" @click="spPackEdit">新建服务包</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="spPacklist" border style="width: 100%">
                        <el-table-column prop="spPackName" label="名称">
                        </el-table-column>
                        <el-table-column prop="price" label="价格" >
                        </el-table-column>
                        <el-table-column prop="validPeriod" label="有效期" >
                        </el-table-column>
                        <el-table-column prop="status" label="启用状态" >
                            <template scope="scope">
                                <p v-show="scope.row.status==1">是</p>
                                <p v-show="scope.row.status==0">否</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="130">
                            <template scope="scope">
                                <el-button size="small" @click="spPackEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="small" type="danger" @click="spPackhandleDelete(scope.$index, scope.row)" v-show="scope.row.status==1">禁用</el-button>
                                <el-button size="small" type="primary" @click="spPackhandleDelete(scope.$index, scope.row)" v-show="scope.row.status==0">启用</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="spPacktotal" :page-sizes="[10,20,50]" @size-change="spPackhandleSizeChange" @current-change="spPackhandleCurrentChange" :page-size="spPackParam.pageSize">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!-- 选择医生 -->
        <el-dialog title="选择医生" v-model="selectdialogFormVisible">
            <el-row class="search_con" :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入医生姓名" v-model="selectparam.doctorName">
                    </el-input>
                </el-col>
                <el-col :span="4" class="addbtn">
                    <el-button type="primary" icon="search" @click="selectsearchClick">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="selectdoctableData" border style="width: 100%">
                <el-table-column prop="doctorName" label="医生姓名">
                </el-table-column>
                <el-table-column prop="deptName" label="科室名称">
                </el-table-column>
                <el-table-column prop="doctorLevelText" label="职称">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="selecteddoctor(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="selectteamclisttotal" :page-sizes="[10,20,50]" @size-change="selectSizeChange" @current-change="selectCurrentChange" :page-size="selectparam.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 设置团队长 -->
        <el-dialog title="变更原因" v-model="setleaderdialogFormVisible" @close="resetForm('setleaderinfoForm')">
            <el-form :model="setleaderformdata" :rules="setleaderrules" ref="setleaderinfoForm" auto-complete="off">
                <el-input v-model="setleaderformdata.reason" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入变更原因" class="mb20"></el-input>
                <div class="center-foot">
                    <el-button @click="closesetleader('setleaderinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="setleadersubmitForm('setleaderinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 新增或者编辑服务包 -->
        <el-dialog :title="dialogtitle2" v-model="editserpackldialogFormVisible" @close="resetForm('editserpackinfoForm')">
            <el-form :model="editserpackformdata" :rules="editserpackrules" ref="editserpackinfoForm" auto-complete="off">
                <el-form-item label="基础服务包" :label-width="formLabelWidth" prop="spPack.packId" v-show="dialogtitle2=='新增服务包'">
                    <el-select v-model="editserpackformdata.spPack.packId" placeholder="请选择基础服务包" filterable @change="baseserchange">
                        <el-option v-for="item in baseserlist" :key="item.packId" :label="item.packName" :value="item.packId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="基础服务包" :label-width="formLabelWidth" prop="spPack.packId" v-show="dialogtitle2=='编辑服务包'">
                    <el-input v-model="editserpackformdata.spPack.packName" disabled></el-input>
                </el-form-item>
                <el-form-item label="团队服务包" :label-width="formLabelWidth" prop="spPack.spPackName">
                    <el-input v-model="editserpackformdata.spPack.spPackName"></el-input>
                </el-form-item>
              <!--   <el-form-item label="编号" :label-width="formLabelWidth" prop="spPack.packCode">
                    <el-input v-model="editserpackformdata.spPack.packCode" disabled></el-input>
                </el-form-item> -->
                <el-form-item label="实际价格(元)" :label-width="formLabelWidth" prop="spPack.price">
                    <el-input v-model="editserpackformdata.spPack.price"></el-input>
                </el-form-item>
                <el-form-item label="有效期(天)" :label-width="formLabelWidth" prop="spPack.validPeriod">
                    <el-input v-model="editserpackformdata.spPack.validPeriod" disabled></el-input>
                </el-form-item>
                <el-form-item label="适合人群" :label-width="formLabelWidth" prop="spPack.suitableObjectText">
                    <el-input v-model="editserpackformdata.spPack.suitableObjectText" disabled></el-input>
                </el-form-item>
                <el-form-item label="启用时间" :label-width="formLabelWidth" prop="spPack.startDt">
                    <el-input v-model="editserpackformdata.spPack.startDt" disabled></el-input>
                </el-form-item>
                <h2 class="account-title" v-show="dialogtitle2=='编辑服务包'">
                    <span>服务项</span>
                      <el-button size="small" type="primary" @click="assciationhandleEdit" icon="plus">添加服务项</el-button>
                </h2>
                <el-table :data="editserpackformdata.assciationVos" border style="width: 100%" v-show="dialogtitle2=='编辑服务包'" class="mb20">
                    <el-table-column prop="serviceName" label="名称">
                    </el-table-column>
                    <el-table-column prop="validPeriod" label="有效期(天)">
                    </el-table-column>
                    <el-table-column prop="times" label="年服务次数">
                    </el-table-column>
                    <el-table-column prop="appointmentFlag" label="是否可预约">
                        <template scope="scope">
                             <el-select v-model="scope.row.appointmentFlag" placeholder="">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                          <!--   <p v-if="scope.row.appointmentFlag==='1'">是</p>
                            <p v-if="scope.row.appointmentFlag==='0'">否</p> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-button size="small" type="danger" @click="assciationVoshandleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="center-foot">
                    <el-button @click="closeeditserpack('editserpackinfoForm')">取 消</el-button>
                    <el-button type="primary" @click="editserpacksubmitForm('editserpackinfoForm')">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 可选择的服务项列表 -->
        <el-dialog title="选择服务项" v-model="assciationdialog">
            <el-checkbox :label="item.checked" :name="index" v-for="(item,index) in assciationlist" v-model="item.checked">{{item.serviceName}}</el-checkbox>
             <div class="center-foot mt20">
                    <el-button @click="closeedassciationdialog">取 消</el-button>
                    <el-button type="primary" @click="selectassciation">确 定</el-button>
                </div>
        </el-dialog>
        <!-- 选择基础服务包 -->
        <!--   <el-dialog title="选择医生" v-model="baseserdialogFormVisible">
            <el-row class="search_con" :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入医生姓名" v-model="baseserparam.packName">
                    </el-input>
                </el-col>
                <el-col :span="4" class="addbtn">
                    <el-button type="primary" icon="search" @click="selectsearchClick">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="baseserdata" border style="width: 100%">
                <el-table-column prop="packId" label="编号">
                </el-table-column>
                <el-table-column prop="packName" label="名称">
                </el-table-column>
                <el-table-column prop="price" label="价格">
                </el-table-column>
                <el-table-column prop="validPeriod" label="有效期">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="selectbaseser(scope.$index, scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="baseserlisttotal" :page-sizes="[10,20,50]" @size-change="baseserSizeChange" @current-change="baseserCurrentChange" :page-size="baseserparam.pageSize">
                </el-pagination>
            </div>
        </el-dialog> -->
    </div>
</template>
<script>
import {
    commonAjax, commonurl
}
from '../../api/api';
import 'assets/lib/zTree/img/metro.gif';
import 'assets/lib/zTree/img/metro.png';
import 'assets/lib/zTree/img/line_conn.png';

import 'assets/lib/zTree/metroStyle.css';
import 'assets/lib/zTree/js/jquery.ztree.core.js';
import 'assets/lib/zTree/js/jquery.ztree.exedit.min.js';

export default {
    data() {
            return {
                //通用
                formLabelWidth: '160px',
                dialogtitle: "",
                //团队列表开始
                param: {
                    pageNo: 1,
                    pageSize: 10,
                    orgId: "",
                },
                teamclisttotal: 1,
                tableData: [],
                // 团队列表结束--------------------------------------------------
                //医生添加编辑与机构关系开始----------------------------
                editTeamdialogFormVisible: false,
                editTeamformdata: {
                    "teamId": undefined, //团队Id 新增时候为0
                    "teamName": "",
                    "telNo": "", //联系电话
                    "info": "", //简介
                    "orgId": "" //机构Id
                },
                curbeloneorg: "",
                curorgId: "",
                editTeamrules: {
                    teamName: [{
                        required: true,
                        message: '请输入团队名称',
                        trigger: 'blur'
                    }],
                    telNo: [{
                        required: true,
                        message: '请输入联系电话',
                        trigger: 'blur'
                    }],
                    info: [{
                        required: true,
                        message: '请输入团队简介',
                        trigger: 'blur'
                    }],

                },
                activeName: "",
                ishowtab: false,
                curteamId: "",
                // 团队成员管理开始--------------
                //选择医生列表开始--------------------------------
                selectdoctableData: [],
                selectdialogFormVisible: false,
                selectteamclisttotal: 1,
                selectparam: {
                    deptId: "",
                    doctorName: "",
                    localDoctorId: "",
                    orgId: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                teamDoclist: [],
                setleaderdialogFormVisible: false,
                setleaderformdata: {
                    teamId: "",
                    doctorId: "",
                    reason: "",
                },
                //团队服务包开始--------------------------------------------------------
                spPacklist: [],
                spPacktotal: 1,
                spPackParam: {
                    spName: "",
                    packCode: "",
                    status: "",
                    "pageNo": 1,
                    "pageSize": 10,
                    spId: "", //团队id
                },
                editserpackformdata: {
                    "assciationVos": [],
                    "spPack": {
                        "packId": "",
                        "spPackName": "",
                        "packCode": "",
                        "price": "",
                        "suitableObject": "",
                        "suitableObjectText":"",
                        "startDt": "",
                        "spPackId": "",
                        "spId": "",
                        "validPeriod": "",
                        "packDesc": "",
                        "packName":""
                    }
                },
                dialogtitle2: "",
                editserpackrules: {
                    "spPack.packId": [{
                        required: true,
                        message: '请选择基础服务包',

                    }],
                    "spPack.spPackName": [{
                        required: true,
                        message: '请输入服务包名称',
                        // trigger: 'blur'
                    }],
                    "spPack.price": [{
                        required: true,
                        message: '请输入价格',
                        // trigger: 'blur'
                    }],

                },
                // 基础服务包列表
                baseserlist: [], //下拉框中用到
                editserpackldialogFormVisible: false,
                //添加服务项的弹框
                assciationdialog: false,
                assciationlist: [],
                allassciationlist:[],//当前基础服务包下面所有的服务项
                //团队服务包结束--------------------------------------------------------
                setting: {
                    async: {
                        enable: true,
                        type: "post",
                        url: commonurl,
                        dataType: "JSON",
                        headers: {
                            "X-Access-Token": sessionStorage.getItem('accessToken'),
                            "X-Service-Id": "cas.orgService",
                            "X-Service-Method": 'queryCommunityOrg',
                            "Content-Type": "application/json",
                            "roleIds": sessionStorage.getItem("roleIds"),
                        },
                        dataFilter: this.ajaxDataFilter,
                        // otherParam: {"id":"","nodeType":""},
                        autoParam: ["id", "nodeType=nodeType"],
                    },
                    callback: {
                        onRightClick: this.OnRightClick,
                        onClick: this.zTreeOnClick
                    }
                },
                zTree: {},
                zNodes: [],
            }
        },
        computed: {

        },
        methods: {
            // 选择医生弹框获取这个机构下所有医生列表
            getalldoc() {
                    this.selectparam.orgId = this.editTeamformdata.orgId
                    commonAjax("cas.doctorService", "queryDoctorByOrgIdAndDeptId", "[" + JSON.stringify(this.selectparam) + "]").then(res => {
                        if (res.code == 200) {
                            this.selectdoctableData = res.body.items;
                            this.selectteamclisttotal = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //根据机构id获取团队列表数据
                getTableData() {
                    let {
                        orgId, pageNo, pageSize
                    } = this.param;
                    let param = `['${orgId}',${pageNo},${pageSize}]`;
                    commonAjax("cas.teamManageService", "queryByOrgId", param).then(res => {
                        if (res.code == 200) {
                            this.tableData = res.body.items;
                            this.teamclisttotal = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //添加编辑团队
                addTreeNode(index, row) {
                    this.teamDoclist = []; //清空列表
                    this.spPacklist = [];
                    this.spPacktotal = 1;
                    this.hideRMenu();
                    this.editTeamdialogFormVisible = true;
                    this.activeName = 'baseInfo';
                    if (row) {
                        this.dialogtitle = "编辑团队";
                        this.ishowtab = true;
                        this.editTeamformdata = {
                            "teamId": row.teamId, //团队Id 新增时候为0
                            "teamName": row.teamName,
                            "telNo": row.telNo, //联系电话
                            "info": row.info, //简介
                            "orgId": row.orgId, //机构Id
                        }
                        this.curbeloneorg = row.orgFullName
                        this.curteamId = row.teamId


                    } else {
                        this.dialogtitle = "新增团队";
                        this.ishowtab = false;
                        this.editTeamformdata = {
                            "teamId": undefined, //团队Id 新增时候为0
                            "teamName": "",
                            "telNo": "", //联系电话
                            "info": "", //简介
                            "orgId": this.curorgId //机构Id
                        }
                    }
                    this.getalldoc(); //获取这个机构下面的所有医生
                },
                //tab切换
                tabHandleClick(tab, event) {
                    this.activeName = tab.name;
                    if (tab.name == "teamMember") {
                        if (this.teamDoclist.length == 0) {
                            this.getTeamDoc();
                        }

                    } else if (tab.name == "servicePkg") {
                        if (this.spPacklist.length == 0) {
                            this.getSpPack();
                        }
                    } else {

                    }

                },


                //团队列表页面显示的条数变化
                handleSizeChange(val) {
                    this.param.pageSize = val;
                    this.getTableData()
                },
                // 团队列表输入框翻页效果
                handleCurrentChange(val) {
                    this.param.pageNo = val;
                    this.getTableData()
                },
                //新增和编辑团队保存
                editTeamsubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax('cas.teamManageService', 'saveTeamInfo', '[' + JSON.stringify(this.editTeamformdata) + ']').then(res => {
                                if (res.code == 200) {
                                    this.editTeamdialogFormVisible = false;
                                    this.ishowtab = true;
                                    this.param.orgId = this.editTeamformdata.orgId;
                                    this.curteamId = res.body;
                                    this.editTeamformdata.teamId=res.body;
                                    // this.activeName = 'baseInfo';
                                    this.getTableData();
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg
                                    });
                                };
                            })
                        } else {
                            return false;
                        }
                    });
                },
                closeeditTeaminfo(formName) {
                    this.$refs[formName].resetFields();
                    this.editTeamdialogFormVisible = false;
                    // this.activeName = 'baseInfo';
                },
                // 删除团队列表中的一条数据
                handleDelete(index, row) {
                    // this.$message.error('删除第' + (index + 1) + '行');
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.teamName)
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
                            commonAjax("cas.teamManageService", "deleteTeamInfo", `['${row.teamId}']`).then(res => {
                                if (res.code == 200) {
                                    this.getTableData();
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
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
                },
                // 团队成员包开始-----------------------------------------------------
                //获取团队成员列表
                getTeamDoc() {
                    let params = `['${this.curteamId}',1,100]`
                    commonAjax("cas.teamManageService", "queryTeamDoctByTeamId", params).then(res => {
                        if (res.code == 200) {
                            this.teamDoclist = res.body.items;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                teamMemberEdit() {
                    this.selectdialogFormVisible = true
                },

                //设置团队长弹框
                setLeader(index, row) {
                    this.setleaderdialogFormVisible = true;
                    this.setleaderformdata = {
                        teamId: row.teamId,
                        doctorId: row.memberObjId,
                        reason: "",
                    }
                },
                //设置团队长
                setleadersubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            let {
                                teamId, doctorId, reason
                            } = this.setleaderformdata;
                            commonAjax('cas.teamManageService', 'setTeamLeader', `['${teamId}','${doctorId}','${reason}']`).then(res => {
                                if (res.code == 200) {
                                    this.setleaderdialogFormVisible = false;
                                    this.getTeamDoc();
                                    this.$message({
                                        type: 'success',
                                        message: "保存成功"
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.msg
                                    });
                                };
                            })
                        } else {
                            return false;
                        }
                    });
                },
                // 删除团队成员中的一条数据
                teamMemberDelete(index, row) {
                    // this.$message.error('删除第' + (index + 1) + '行');
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.memberName)
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
                            commonAjax("cas.teamManageService", "deleteTeamDoct", `['${row.teamId}','${row.memberObjId}']`).then(res => {
                                if (res.code == 200) {
                                    this.getTeamDoc();
                                    this.$message({
                                        type: 'success',
                                        message: "删除成功"
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
                },
                // 点击医生列表选择医生
                selecteddoctor(index, row) {
                    this.selectdialogFormVisible = false;
                    let param = {
                        "teamId": this.curteamId, //团队Id
                        "memberObjId": row.doctorId, //doctorId
                        "memberName": row.doctorName, //doctorName
                        "memberType": row.docType //成员对象类型：HCN_docType
                    }
                    commonAjax("cas.teamManageService", "addTeamDoct", "[" + JSON.stringify(param) + "]").then(res => {
                        if (res.code == 200) {

                            this.getTeamDoc();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //选择医生
                selectSizeChange(val) {
                    this.selectparam.pageSize = val;
                    this.getalldoc()
                },
                selectCurrentChange(val) {
                    this.selectparam.pageNo = val;
                    this.getalldoc()
                },
                selectsearchClick() {
                    this.getalldoc();
                },
                closesetleader(formName) {
                    this.$refs[formName].resetFields();
                    this.setleaderdialogFormVisible = false;
                },


                // 团队服务包开始-----------------------------------------------------
                closeedassciationdialog(formName) {
                    this.$refs[formName].resetFields();
                    this.editserpackldialogFormVisible = false;
                },
                 closeeditserpack(formName) {
                    this.$refs[formName].resetFields();
                    this.editserpackldialogFormVisible = false;
                },
                // 获取基础服务包列表
                getbaseserlist() {
                    let param = {
                        "pageNo": 1,
                        "pageSize": 500,
                        "tenantId": sessionStorage.getItem('tenantId'),
                        "packName": "",
                        "status": "1",
                    }
                    commonAjax("cas.baseServiceService", "getBasePackList", "[" + JSON.stringify(param) + "]").then(res => {
                        if (res.code == 200) {
                            $.each(res.body.items, function(index, el) {
                                el.spPackName = "";
                                el.price = "";
                                el.spId = this.curteamId;

                            });
                            this.baseserlist = res.body.items;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //获取指定家医团队服务包列表
                getSpPack() {
                    this.spPackParam.spId = this.curteamId;
                    commonAjax("cas.teamManageService", "findSpPack", "[" + JSON.stringify(this.spPackParam) + "]").then(res => {
                        if (res.code == 200) {
                            this.spPacklist = res.body.items;
                            this.spPacktotal = res.body.total;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                },
                //搜索服务包列表
                sersearchClick() {
                    this.getSpPack()
                },
                spPackEdit(index, row) {
                    this.editserpackldialogFormVisible = true;
                    if (row) {
                        this.dialogtitle2 = "编辑服务包";
                        commonAjax("cas.teamManageService", "getSpPackServiceBySpPackId", `[${row.spPackId}]`).then(res => {
                            if (res.code == 200) {
                                $.each(res.body.assciationVos,function(index, el) {
                                            el.checked=true;
                                        });
                                this.editserpackformdata = {
                                    "assciationVos": res.body.assciationVos,
                                    "spPack": {
                                        "packId": res.body.spPack.packId,
                                        "spPackName": res.body.spPack.spPackName,
                                        "packCode": res.body.spPack.packCode,
                                        "price": res.body.spPack.price,
                                        "suitableObject": res.body.spPack.suitableObject,
                                        "suitableObjectText":res.body.spPack.suitableObjectText,
                                        "startDt": res.body.spPack.startDt,
                                        "spPackId": res.body.spPack.spPackId,
                                        "spId": res.body.spPack.spId,
                                        "validPeriod": res.body.spPack.validPeriod,
                                        "packDesc": res.body.spPack.packDesc,
                                        "packName":res.body.spPack.packName,
                                    }
                                }
                                commonAjax("cas.teamManageService", "querySpServiceBySpPackId", `[${res.body.spPack.packId},${res.body.spPack.spPackId}]`).then(res2 => {
                                    if (res2.code == 200) {
                                        $.each(res2.body,function(index, el) {
                                            el.checked=false;
                                        });
                                        this.assciationlist = res2.body
                                       this.allassciationlist=this.editserpackformdata.assciationVos.concat(this.assciationlist);
                                    } else {
                                        this.$message({
                                            type: 'error',
                                            message: res2.msg
                                        });
                                    }
                                });

                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }
                        });
                    } else {
                        this.dialogtitle2 = "新增服务包";
                        this.editserpackformdata = {
                            "assciationVos": [],
                            "spPack": {
                                "packId": "",
                                "spPackName": "",
                                "packCode": "",
                                "price": "",
                                "suitableObject": "",
                                suitableObjectText:"",
                                "startDt": "",
                                "spPackId": undefined,
                                "spId": this.curteamId,
                                "validPeriod": "",
                                "packDesc": "",
                                "packName":"",
                            }
                        }

                    }
                },
                editserpacksubmitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if (this.editserpackformdata.spPack.packId) {
                                console.log(this.editserpackformdata);
                                commonAjax('cas.teamManageService', 'saveSpPack', '[' + JSON.stringify(this.editserpackformdata) + ']').then(res => {
                                    if (res.code == 200) {
                                        this.editserpackldialogFormVisible = false;
                                        this.getSpPack();
                                        this.$message({
                                            type: 'success',
                                            message: "保存成功"
                                        });
                                    } else {
                                        this.$message({
                                            type: 'error',
                                            message: res.msg
                                        });
                                    };
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: "请选择基础服务包"
                                });
                            }

                        } else {
                            return false;
                        }
                    });
                },
                spPackhandleDelete(index, row) {
                    const h = this.$createElement;
                    let status = row.status == "1" ? "0" : "1";
                    let param = `[${row.spPackId},'${status}']`
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否禁用 '),
                            h('i', {
                                style: 'color: teal'
                            }, row.spPackName)
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
                            commonAjax("cas.teamManageService", "updateSpSpckStatus", param).then(res => {
                                if (res.code == 200) {
                                    this.getSpPack()
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
                spPackhandleSizeChange(val) {
                    this.spPackParam.pageSize = val;
                    this.getSpPack()
                },

                // 团队列表输入框翻页效果
                spPackhandleCurrentChange(val) {
                    this.spPackParam.pageNo = val;
                    this.getSpPack()
                },
                //选择基础服务包的select改变
                baseserchange(val) {
                    if (!this.editserpackformdata.spPack.spPackId) {
                        $.each(this.baseserlist, function(index, el) {
                            if (el.packId == val) {
                                this.editserpackformdata.spPack.packCode = el.packCode;
                                this.editserpackformdata.spPack.spId = this.curteamId;
                                this.editserpackformdata.spPack.suitableObject = el.suitableObject;
                                 this.editserpackformdata.spPack.suitableObjectText = el.suitableObjectText;
                                this.editserpackformdata.spPack.startDt = el.startDt;
                                this.editserpackformdata.spPack.spPackId = 0;
                                this.editserpackformdata.spPack.validPeriod = el.validPeriod
                                this.editserpackformdata.spPack.packDesc = el.packDesc
                            }
                        }.bind(this));
                    }

                },
                //添加服务项
                assciationhandleEdit() {
                    this.assciationdialog=true
                },
                //删除服务项
                assciationVoshandleDelete(index, row) {
                    // this.allassciationlist
                    row.checked=false;
                    this.assciationlist.push(row);
                    this.editserpackformdata.assciationVos.splice(index, 1)
                },
                //点击取消关闭模态框
                closeedassciationdialog() {
                    this.assciationdialog = false;
                },
                // 选中服务项目后点添加
                selectassciation(){
                    let temarr=this.assciationlist.filter(function(el) {
                        return el.checked==true
                    });
                    let temarr2=this.assciationlist.filter(function(el) {
                        return el.checked==false
                    });
                    this.assciationlist=temarr2;//选中的下次就不能选了
                     this.editserpackformdata.assciationVos=this.editserpackformdata.assciationVos.concat(temarr);
                      this.assciationdialog = false;
                      console.log(this.editserpackformdata.assciationVos);
                },
                //通用的
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                },

                //数据请求并且赋值
                ajaxDataFilter(treeId, parentNode, responseData) {
                    responseData = responseData.body.info;
                    // if (parentNode) {
                    //     $.each(responseData, function(index, el) {
                    //         el.name = el.orgFullName;
                    //         el.isParent = true;
                    //         el.nodeType = "2"
                    //     })
                    // } else {
                    //     $.each(responseData, function(index, el) {
                    //         el.name = el.orgFullName;
                    //         el.isParent = true;
                    //         el.nodeType = "1"
                    //     })
                    // }
                    $.each(responseData, function(index, el) {
                        el.name = el.orgFullName;
                        el.isParent = true;
                        el.nodeType = "1"
                    })
                    return responseData;
                },
                //树状节点左击
                zTreeOnClick(event, treeId, treeNode, msg) {
                    this.param.orgId = treeNode.id;
                    this.getTableData();
                },
                //树状节点右击
                OnRightClick(event, treeId, treeNode) {
                    this.curorgId = treeNode.id;
                    this.curbeloneorg = treeNode.name;
                    this.showRMenu(event.clientX, event.clientY);
                    this.zTree.selectNode(treeNode);
                },

                //右键菜单部分
                showRMenu(x, y) {
                    $("#rMenu ul").show();
                    $("#rMenu").css({
                        "top": y + "px",
                        "left": x + "px",
                        "visibility": "visible"
                    });

                    $("body").bind("mousedown", this.onBodyMouseDown);
                },

                hideRMenu() {
                    $("#rMenu").css({
                        "visibility": "hidden"
                    })
                    $("body").unbind("mousedown", this.onBodyMouseDown);
                },

                onBodyMouseDown(event) {
                    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
                        $("#rMenu").css({
                            "visibility": "hidden"
                        });
                    }
                },



        },
        components: {

        },
        mounted() {
            //初始化社区机构列表
            $.fn.zTree.init($("#hospitalLists3"), this.setting);
            this.zTree = $.fn.zTree.getZTreeObj("hospitalLists3");
            this.getbaseserlist();

        },
        beforeMount() {


        },

}
</script>
<style type="text/css">
.left-con,
.right-con {
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 10px
}


/*右键*/

div#rMenu {
    position: fixed;
    visibility: hidden;
    top: 0;
    background-color: #fafafa;
    text-align: left;
    padding: 2px;
    border: 1px solid #e6e6e6;
    padding: 5px
}

div#rMenu ul {
    margin-bottom: 0;
}

div#rMenu ul li {
    margin: 1px 0;
    padding: 5px 10px;
    cursor: pointer;
    list-style: none outside none;
}

div#rMenu ul li:nth-child(1) {
    background: url(../../assets/img/add2.png) no-repeat 10px center;
    padding-left: 35px;
    cursor: pointer;
    border-bottom: 1px solid #1DC499;
}

div#rMenu ul li:nth-child(2) {
    background: url(../../assets/img/dele3.png) no-repeat 10px center;
    padding-left: 35px;
    cursor: pointer;
}

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}

.addbtn {
    margin: 0 0 20px;
    text-align: left;
}

.el-upload--text {
    width: 140px;
    height: 160px;
    line-height: 180px
}

.el-picker-panel__icon-btn {
    margin-left: 20px
}

.addorg button {
    float: right;
}

.mb20 {
    margin-bottom: 20px;
}
.mt20{
      margin-top: 20px;
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
