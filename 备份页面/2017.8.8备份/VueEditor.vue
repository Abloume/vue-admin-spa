<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="plugins-tips">
            Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。 修改了上传图片经过服务器返回url，不是直接转化成base64
             <input type="file" name="file" id="fileinput2" >
        </div>
        <quill-editor ref="myTextEditor" v-model="content" :config="editorOption" @showImageUI="imageHandler" @change="onEditorChange" >
        </quill-editor>
        <!-- 必须带上这个input 上传图片用-->
        <input type="file" name="file" id="fileinput" @change="customimgupload($event)" style="display:none">
        <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
        <el-button class="editor-btn" type="primary" @click="changeedit">可以编辑</el-button>
    </div>
</template>
<script>
import {
    imgview, imguploadAjax
}
from '../../api/api';
import quillEditor from '../common/editor.vue';
export default {
    data: function() {
        return {
            content: '22222222222222222222222',
            editorOption: {
                // debug: 'info',
                placeholder: 'Compose an epic...',
                theme: 'snow',
            }
        }
    },
    components: {
        quillEditor
    },
    methods: {
           onEditorChange({
                editor, html, text
            }) {
                this.content = html;
                console.log(this.content);
            },
            submit() {
                console.log(this.content);
                this.$message.success('提交成功！');
            },
            changeedit() {
                this.editor.enable(true);

            },
            imageHandler() {
                // let fileinput = document.getElementById('fileinput');
                fileinput.click();
            },
            customimgupload(){
                // var that=this;
                  var formData = new FormData();
                  formData.append('file', fileinput.files[0]);
                  if(fileinput.files[0]){
                    imguploadAjax(formData).then(res => {
                        console.log(res.body);
                        var imageUrl = `${imgview+res.body}`
                        var range = this.$refs.myTextEditor.quillEditor.getSelection();
                        var length = range.index;
                        this.$refs.myTextEditor.quillEditor.insertEmbed(length, 'image', imageUrl);
                    }).catch(err => {
                        console.log(err)
                    })
                  }
                  

            }
    },
    computed: {
        editor() {
            return this.$refs.myTextEditor.quillEditor;
        }
    },
    mounted() {
        this.editor.enable(false);
         console.log(fileinput2)
    }
}
</script>
<style scoped>
.editor-btn {
    margin-top: 20px;
}
</style>
