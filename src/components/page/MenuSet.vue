<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>APP管理</el-breadcrumb-item>
                        <el-breadcrumb-item>产品菜单管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
            </el-row>
            <el-row class="search_con" :gutter="20">
                <el-col :span="18">
                    <el-select v-model="curprocode" placeholder="请选择产品">
                        <el-option v-for="item in prolist" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="6" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit">添加广告</el-button>
                </el-col>
            </el-row>
        </div>
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 标题 -->
                <div class="commontit">
                    <h2>菜单列表</h2>
                </div>
                <div class="left-con">
                    <ul id="hospitalLists" class="ztree" style="width:240px"></ul>
                </div>
            </el-col>
            <el-col :span="16">
                <div class="commontit">
                    <h2>字段</h2>
                </div>
                <div class="right-con">
                    <el-form :model="formdata" :rules="formrules" ref="departForm" auto-complete="">
                        <el-form-item label="产品编码" :label-width="formLabelWidth" prop="productCode">
                            <el-input v-model="formdata.productCode" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
                            <el-input v-model="formdata.menuName" :disabled="eventOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="对应模块" :label-width="formLabelWidth" prop="moduleName">
                            <el-row class="search_con" :gutter="20">
                                <el-col :span="17">
                                    <el-input v-model="formdata.moduleName" disabled></el-input>
                                </el-col>
                                <el-col :span="6">
                                    <el-button type="primary" icon="search" @click="selectmodule" :disabled="eventOrg">选择</el-button>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="上级菜单" :label-width="formLabelWidth" prop="menuPname">
                            <el-input v-model="formdata.menuPname" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="菜单排序" :label-width="formLabelWidth" prop="menuOrder">
                            <el-input v-model="formdata.menuOrder" :disabled="eventOrg"></el-input>
                        </el-form-item>
                        <el-form-item label="图标文件" :label-width="formLabelWidth" prop="">
                            <el-upload class="avatar-uploader" :action="imguploadurl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers" :data="imguploaddata">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="备注说明" :label-width="formLabelWidth" prop="menuDesc">
                            <el-input v-model="formdata.menuDesc" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" :disabled="eventOrg" placeholder="最长100字符"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="center-foot" v-if="!eventOrg">
                        <el-button @click="closeorgmodal('departForm')">取 消</el-button>
                        <el-button type="primary" @click="submitForm('departForm')">保 存</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 选择模块模态框 -->
        <el-dialog title="选择对应模块" v-model="dialogFormVisible">
            <el-row class="search_con" :gutter="20">
                <el-col :span="8">
                    <el-input v-model="params.moduleName" placeholder="请输入模块名称" @blur="getserchval"></el-input>
                </el-col>
               <!--  <el-col :span="8">
                    <el-input v-model="params.moduleCode" placeholder="请输入模块编码"></el-input>
                </el-col> -->
                <el-col :span="6">
                    <el-button type="primary" icon="search" @click="searchClick">搜索</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="moduleCode" label="模块编码">
                </el-table-column>
                <el-table-column prop="moduleName" label="模块名称">
                </el-table-column>
                <el-table-column prop="moduleDesc" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button size="small" @click="addmodule(scope.$index, scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
                </el-pagination>
            </div>
        </el-dialog>
        <div id="rMenu">
            <ul>
                <li id="m_add" @click="addTreeNode">新增下级</li>
                <li id="m_del" @click="removeTreeNode">删除</li>
            </ul>
        </div>
    </div>
</template>
<script>
import {
    commonAjax, imguploadurl, imgview
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
                formLabelWidth: '120px',
                curprocode: "", //当前选中产品的code
                prolist: [], //产品列表
                dialogFormVisible: false,
                total: "",
                params: {
                    "moduleCode": "",
                    "moduleName": "",
                    "pageNo": 1,
                    "pageSize": 10,
                },
                //form数据
                formdata: {
                    "menuId": undefined,
                    "productCode": "",
                    "menuName": "",
                    "menuPid": undefined,
                    "menuOrder": undefined,
                    "menuIconId": undefined,
                    "moduleId": undefined,
                   
                    "menuDesc": "",
                    "menuPname": "",
                    "moduleName": "",
                },
                imguploadurl: imguploadurl, //文件或者图片上传的url
                headers: { //文件或者图片上传的headers
                    "X-Access-Token": sessionStorage.getItem("accessToken")
                },
                imageUrl: "", //文件或者图片上传预览图片的src地址
                // 表单验证
                formrules: {
                    menuDesc: [{
                        max: 100,
                        message: '最长100字符',
                        trigger: 'blur'
                    }],
                },
                curmenuId: '',
                curmenuName: "",
                //是否触发机构点击
                eventOrg: true,
                setting: {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "menuId",
                            pIdKey: "menuPid",
                            rootPId: 0
                        }
                    },
                    callback: {
                        onRightClick: this.OnRightClick,
                        onClick: this.zTreeOnClick
                    }
                },
                zTree: {},
                zNodes: [],
                tableData: [],
            }
        },
        computed: {

        },
        methods: {
        	//搜索框赋值
        	getserchval(){
        		this.params.moduleCode=this.params.moduleName
        	},
            getprolist() {
                    commonAjax('cas.productRelatedService', 'productSecondLevelList', '[]').then(res => {
                        if (res.code == 200) {
                            this.prolist = res.body;
                            this.curprocode = this.prolist[0].code;
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.msg
                            });
                        };
                    })
                },

                //树状节点左击
                zTreeOnClick(event, treeId, treeNode) {
                    if (treeNode.menuId == -1) {
                        this.eventOrg = true;
                        this.clearBindDataEvent();
                        this.$message({
                            type: 'error',
                            message: "请选择菜单进行维护"
                        });
                    } else {
                        this.eventOrg = false;
                        this.formdata.orgId = treeNode.orgId;
                        let slectedNodes = this.zTree.getSelectedNodes();
                        let parentNode = slectedNodes[0].getParentNode();
                        commonAjax('cas.productRelatedService', 'productMemuDetail', `['${treeNode.menuId}']`).then((res) => {
                            if (res.code == 200) {
                                this.formdata = {
                                    "menuId": res.body.menuId,
                                    "productCode": res.body.productCode,
                                    "menuName": res.body.menuName,
                                    "menuPid": res.body.menuPid,
                                    "menuOrder": res.body.menuOrder,
                                    "menuIconId": res.body.menuIconId,
                                    "moduleId": res.body.moduleId,
                                    
                                    "menuDesc": res.body.menuDesc,
                                    "menuPname": treeNode.menuPid == -1 ? "" : parentNode.menuName,
                                    "moduleName": res.body.moduleName,
                                };
                                this.imageUrl = res.body.menuIconId? imgview + res.body.menuIconId : ""
                                ;
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                });
                            }

                        });
                    }
                },
                //树状节点右击
                OnRightClick(event, treeId, treeNode) {
                    this.clearBindDataEvent();
                    if (treeNode.menuId == -1) {
                        this.showRMenu("root", event.clientX, event.clientY);
                        this.formdata.menuPname = ""; //当点击产品（树状根的时候）上级菜单名称为空
                    } else {
                        this.formdata.menuPname = treeNode.menuName;
                        this.showRMenu("node", event.clientX, event.clientY);
                        this.curmenuName = treeNode.menuName;
                        this.curmenuId = treeNode.menuId;
                    }

                    this.formdata.menuPid = treeNode.menuId;
                    this.zTree.selectNode(treeNode);
                },
                //右键菜单部分
                showRMenu(type, x, y) {
                    $("#rMenu ul").show();
                    if (type == "root") {
                        $("#m_del").hide();
                        $("#m_add").show();
                    } else {
                        $("#m_del").show();
                        $("#m_add").show();

                    }
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
                //清空绑定数据
                clearBindDataEvent() {
                    this.formdata = {
                        "menuId": undefined,
                        "productCode": "",
                        "menuName": "",
                        "menuPid": undefined,
                        "menuOrder": undefined,
                        "menuIconId": undefined,
                        "moduleId": undefined,
                    
                        "menuDesc": "",
                        "menuPname": "",
                    }
                    this.imageUrl = "";
                },
                //添加菜单
                addTreeNode() {
                    this.hideRMenu();
                    this.eventOrg = false;
                    this.formdata.productCode = this.curprocode;

                },
                closeorgmodal(formName) {
                    this.$refs[formName].resetFields();
                },
                //确认--新增/修改
                submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            commonAjax('cas.productRelatedService', 'productMemuSaved', '[' + JSON.stringify(this.formdata) + ']').then(res => {
                                if (res.code == 200) {
                                    if (this.formdata.menuId != null) {
                                        this.zTree.getSelectedNodes()[0].menuName = this.formdata.menuName;
                                        this.zTree.updateNode(this.zTree.getSelectedNodes()[0]);
                                    } else {
                                    	let newNode = this.formdata;
                                    	newNode.menuId=res.body;
                                    	newNode.name=this.formdata.menuName;
                                        this.zTree.addNodes(this.zTree.getSelectedNodes()[0], newNode); 
                                    }
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
                //选择模块
                selectmodule() {
                    this.dialogFormVisible = true
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
                getTableData() {
                 
                    commonAjax("cas.productRelatedService", "moduleList", '[' + JSON.stringify(this.params) + ']').then(res => {
                        if (res.code == 200) {
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
                addmodule(index, row) {
                    this.formdata.moduleId = row.moduleId;
                    this.formdata.moduleName = row.moduleName;
                    this.dialogFormVisible = false;
                    this.params.moduleCode= "";
                    this.params.moduleName= "";
                },
                //删除菜单
                removeTreeNode() {
                    const h = this.$createElement;
                    this.$msgbox({
                        title: '确认删除',
                        message: h('p', null, [
                            h('span', null, '是否删除 '),
                            h('i', {
                                style: 'color: teal'
                            }, this.curmenuName)
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
                            commonAjax("cas.productRelatedService", "productMemuDeleted", `[${this.curmenuId}]`).then(res => {
                                if (res.code == 200) {
                                    this.zTree.removeNode(this.zTree.getSelectedNodes()[0]);
                                    this.clearBindDataEvent();
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
                //上传文件或者图片成功后
                handleAvatarSuccess(res, file) {
                    this.imageUrl = imgview + res.body;
                    this.formdata.menuIconId = res.body;
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

        },
        components: {

        },
        mounted() {
            this.getprolist();
            this.getTableData();
        },
        watch: {
            'curprocode' (val, oldval) {
                this.eventOrg = true;
                commonAjax('cas.productRelatedService', 'productMemuList', `['${val}']`).then(res => {
                    if (res.code == 200) {
                        $.each(res.body, function(index, el) {
                            el.name = el.menuName;
                        });
                        var curproname = "";
                        $.each(this.prolist, function(index, el) {
                            if (el.code == val) {
                                curproname = el.name;

                            }
                        });
                        let temobj = {
                            menuId: -1,
                            menuPid: 0,
                            name: curproname,
                            open: true,
                            isParent: true,
                        };
                        res.body.unshift(temobj);
                        this.zNodes = res.body;
                        $.fn.zTree.init($("#hospitalLists"), this.setting, this.zNodes);
                        this.zTree = $.fn.zTree.getZTreeObj("hospitalLists");
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    };
                })
            }

        },

}
</script>
<style type="text/css" scoped>
.search_con {
    margin-top:0px;
    margin-bottom: 20px

}

.left-con,
.right-con {
    border: 1px solid #e6e6e6;
    border-top: none;
    padding: 10px;
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
</style>
