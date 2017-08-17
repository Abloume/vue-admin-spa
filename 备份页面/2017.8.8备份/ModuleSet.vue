<template>
    <div>
        <div class="crumbs">
            <el-row class="navbreadcrumb cbafter">
                <el-col :span="12" class="zuhu">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                        <el-breadcrumb-item>模块管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-col>
                <!--  <el-col :span="12" class="return_prev">
                    <router-link to="/"> <span class="return"><img src="../../assets/img/return.png"></span>返回上一级</router-link>
                </el-col> -->
            </el-row>
            <el-row class="search_con">
                <el-col :span="12">
                    <el-input placeholder="请输入医院名称" icon="search" v-model="params.content" :on-icon-click="searchClick">
                    </el-input>
                </el-col>
                <el-col :span="12" class="addorg">
                    <el-button type="primary" icon="plus" @click="handleEdit('','','baseInfo')">新建机构</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="number" label="模块编码" width="100">
            </el-table-column>
            <el-table-column prop="orgFullName" label="模块名称" width="300">
            </el-table-column>
            <el-table-column prop="orgShortName" label="模块URL" width="200">
            </el-table-column>
            <el-table-column prop="orgShortName" label="链接类型" width="200">
            </el-table-column>
            <el-table-column prop="orgShortName" label="排序" width="200">
            </el-table-column>
            <el-table-column prop="orgShortName" label="排序" width="200">
            </el-table-column>
            <el-table-column label="备注">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row,'baseInfo')">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-sizes="[10,20,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="params.pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogtitle" v-model="dialogFormVisible" @close="resetForm('orginfoForm')" before-close="beforeclose">
            <el-form :model="formdata" :rules="formrules" ref="orginfoForm" auto-complete="off">
                <el-form-item label="模块编码" :label-width="formLabelWidth" prop="orgFullName">
                    <el-input v-model="formdata.orgFullName"></el-input>
                </el-form-item>
                <el-form-item label="模块名称" :label-width="formLabelWidth" prop="orgFullName">
                    <el-input v-model="formdata.orgFullName"></el-input>
                </el-form-item>
               <!--  <el-form-item label="链接类型" :label-width="formLabelWidth" prop="orgClassify">
                    <el-select v-model="formdata.orgClassify" placeholder="请选择医院分类">
                        <el-option v-for="item in dictionary.orgClassify" :key="item.key" :label="item.text" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="链接URL" :label-width="formLabelWidth" prop="orgFullName">
                    <el-input v-model="formdata.orgFullName"></el-input>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth" prop="orgFullName">
                    <el-input v-model="formdata.orgFullName"></el-input>
                </el-form-item>
                <el-form-item label="备注" :label-width="formLabelWidth" prop="description">
                    <el-input v-model="formdata.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer center-foot">
                <el-button @click="resetForm('orginfoForm')">取 消</el-button>
                <el-button type="primary" @click="submitForm('orginfoForm')">确 定</el-button>
            </div>
            <quill-editor ref="myTextEditor" v-model="content" :config="editorOption" @showImageUI="imageHandler">
            </quill-editor>
            <!-- 必须带上这个input 上传图片用-->
            <input type="file" name="file" id="fileinput" @change="customimgupload($event)" style="display:none">
        </el-dialog>
    </div>
</template>
<script>
import {
    commonAjax
}
from '../../api/api';
import {
    mapActions
}
from 'vuex';
export default {
    data() {
            return {
                formLabelWidth: '120px',
                tableData: [{
                    number: 1,
                    orgFullName: "浙江省第一人民医院",
                    orgShortName: "浙一"
                }],
                params: {
                    content: "",
                    pageNo: 1,
                    pageSize: 10,
                },
                total: "",
                dialogFormVisible: false, //模态框显示隐藏用
                formdata: { //表单绑定数据用
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
            }
        },
        computed: {

        },
        methods: {
            handleEdit(index, row) { //第三个参数是为了到orgInfo组件的tab传参
                     this.dialogFormVisible = true;
                    this.dialogtitle = "编辑模块"; 
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
                                }, row.orgFullName)
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
                                this.$message({
                                    type: 'success',
                                    message: "删除成功"
                                });
                            }
                        });
                },
                //获取机构列表数据
                getTableData() {
                   
                },
                //页面显示的条数变化
                handleSizeChange(val) {
                    this.params.pageSize = val;
                    this.getTableData()
                },
                // 输入框翻页效果
                handleCurrentChange(val) {
                    this.params.pageNo = val;
                    this.getTableData()
                },
                //搜索按钮点击
                searchClick() {
                    this.getTableData();
                },
                resetForm(formName) {
                    this.dialogFormVisible = false;
                    this.$refs[formName].resetFields();

                },

        },
        components: {},
        mounted() {

        },
        beforeMount() {
            this.getTableData();
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

.zuhu {
    background: url(../../assets/img/zuhu.png) no-repeat left center;
    padding-left: 30px
}
</style>
