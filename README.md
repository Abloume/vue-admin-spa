# manage-system-vue2.0 #
基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案)

该方案作为一套多功能的后台框架模板，适用于绝大部分的后台管理系统（Web Management System）开发。基于vue.js,使用vue-cli脚手架快速生成项目目录，引用Element UI组件库，方便开发快速简洁好看的组件。分离颜色样式，支持手动切换主题色，而且很方便使用自定义主题色。

## 功能 ##
- [x] Element UI
- [x] 登录/注销
- [x] 表格
- [x] 表单
- [x] 图表 :bar_chart:
- [x] 富文本编辑器(修改了图片的上传，引入外部图片的url代替base64的图片)
- [x] 图片拖拽/裁剪上传
- [x] 支持切换主题色 :sparkles:


## 目录结构介绍 ##

	|-- build                            // webpack配置文件
	|-- config                           // 项目打包路径
	|-- src                              // 源码目录
	|   |-- components                   // 组件
	|       |-- common                   // 公共组件
	|           |-- Header.vue           // 公共头部
	|           |-- Home.vue           	 // 公共路由入口
	|           |-- Sidebar.vue          // 公共左边栏
	|		|-- page                   	 // 主要路由页面
	|           |-- BaseCharts.vue       // 基础图表
	|           |-- BaseForm.vue         // 基础表单
	|           |-- BaseTable.vue        // 基础表格
	|           |-- Login.vue          	 // 登录
	|           |-- MixCharts.vue        // 混合图表
	|           |-- Readme.vue           // 自述组件
	|           |-- Upload.vue           // 图片上传
	|           |-- VueEditor.vue        // 富文本编辑器
	|   |-- App.vue                      // 页面入口文件
	|   |-- main.js                      // 程序入口文件，加载各种公共组件
	|-- .babelrc                         // ES6语法编译配置
	|-- .editorconfig                    // 代码编写规格
	|-- .gitignore                       // 忽略的文件
	|-- index.html                       // 入口html文件
	|-- package.json                     // 项目及工具的依赖配置文件
	|-- README.md                        // 说明


## 安装步骤 ##

	git clone https://github.com/xiaomaoaaa/vue-admin-spa.git		// 把模板下载到本地
	cd manage-system											// 进入模板目录
	npm install													// 安装项目依赖，等待安装完成之后

## 本地开发 ##

	// 开启服务器，浏览器访问 http://localhost:8080
	npm run dev

## 构建生产 ##

	// 执行构建命令，生成的dist文件夹放在服务器下即可访问
	npm run build

## 组件使用说明与演示 ##

### element-ui ###
一套基于vue.js2.0的桌面组件库。访问地址：[element](http://element.eleme.io/#/zh-CN/component/layout)




```JavaScript
<template>
	<div>
		<datasource language="en" :table-data="information.data"
	        :columns="columns"
	        :pagination="information.pagination"
	        :actions="actions"
	        v-on:change="changePage"
	        v-on:searching="onSearch"></datasource>
	</div>
</template>

<script>
	import Datasource from 'vue-datasource';					// 导入quillEditor组件
    export default {
        data: function(){
            return {
                information: {
	                pagination: {...},						// 页码配置
	                data: [...]
	            },
	            columns: [...],								// 列名配置
	            actions: [...]								// 功能配置
            }
        },
        components: {
            Datasource										// 声明组件Datasource
        },
	    methods: {
	        changePage(values) {...},
	        onSearch(searchQuery) {...}
	    }
	}
</script>
```


### Vue-Quill-Editor ###
基于Quill、适用于Vue2的富文本编辑器。访问地址：[vue-quill-editor](https://github.com/surmon-china/vue-quill-editor)


```JavaScript
<template>
	<div>
		<quill-editor ref="myTextEditor" v-model="content" :config="editorOption"></quill-editor>
	</div>
</template>

<script>
	import { quillEditor } from 'vue-quill-editor';			// 导入quillEditor组件
    export default {
        data: function(){
            return {
                content: '',								// 编辑器的内容
                editorOption: {								// 编辑器的配置
                    // something config
                }
            }
        },
        components: {
            quillEditor										// 声明组件quillEditor
        }
	}
</script>
### Vue-Core-Image-Upload ###
一款轻量级的vue上传插件，支持裁剪。访问地址：[Vue-Core-Image-Upload](https://github.com/Vanthink-UED/vue-core-image-upload)

```JavaScript

<template>
    <div>
		<img :src="src">									// 用于显示上传的图片
        <vue-core-image-upload :class="['pure-button','pure-button-primary','js-btn-crop']"
           :crop="true"										// 是否裁剪
           text="上传图片"
           url=""											// 上传路径
           extensions="png,gif,jpeg,jpg"					// 限制文件类型
           @:imageuploaded="imageuploaded">					// 监听图片上传完成事件
		</vue-core-image-upload>
    </div>
</template>

<script>
    import VueCoreImageUpload  from 'vue-core-image-upload';	// 导入VueCoreImageUpload组件
    export default {
        data: function(){
            return {
                src:'../img/1.jpg'							// 默认显示图片地址
            }
        },
        components: {
            VueCoreImageUpload								// 声明组件VueCoreImageUpload
        },
        methods:{
            imageuploaded(res) {							// 定义上传完成执行的方法
                console.log(res)
            }
        }
    }
</script>

```

### vue-echarts-v3 ###
基于vue2和eCharts.js3的图表组件。访问地址：[vue-echarts-v3](https://github.com/xlsdg/vue-echarts-v3)

```JavaScript
<template>
    <div>
        <IEcharts :option="bar"></IEcharts>
    </div>
</template>
	
<script>
    import IEcharts from 'vue-echarts-v3';					// 导入IEcharts组件
    export default {
        data: function(){
            return {
                bar: {
			        title: {
			          text: '柱状图'							// 图标标题文本
			        },
			        tooltip: {},	
			        xAxis: {								// 横坐标
			          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
			        },
			        yAxis: {},								// 纵坐标
			        series: [{
			          name: '销量',
			          type: 'bar',							// 图标类型
			          data: [5, 20, 36, 10, 10, 20]
			        }]
			   	}
            }
        },
        components: {
            IEcharts								// 声明组件VueCoreImageUpload
        }
    }
</script>
```

## 其他注意事项 ##
### 一、如果我不想用到上面的某些组件呢，那我怎么在模板中删除掉不影响到其他功能呢？ ###

举个栗子，我不想用 vue-datasource 这个组件，那我需要分四步走。

第一步：删除该组件的路由，在目录 src/router/index.js 中，找到引入改组件的路由，删除下面这段代码。

```JavaScript
{
    path: '/vuetable',
    component: resolve => require(['../components/page/VueTable.vue'], resolve)     // vue-datasource组件
},
```

第二步：删除引入该组件的文件。在目录 src/components/page/ 删除 VueTable.vue 文件。

第三步：删除该页面的入口。在目录 src/components/common/Sidebar.vue 中，找到该入口，删除下面这段代码。
	
```HTML
<el-menu-item index="vuetable">Vue表格组件</el-menu-item>
```

第四步：卸载该组件。执行以下命令：
	
	npm un vue-datasource -S

完成。

### 二、如何切换主题色呢？ ###

第一步：打开 src/main.js 文件，找到引入 element 样式的地方，换成浅绿色主题。

```javascript
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
```

第二步：打开 src/App.vue 文件，找到 style 标签引入样式的地方，切换成浅绿色主题。

```javascript
@import "../static/css/main.css";
@import "../static/css/color-dark.css";     /*深色主题*/
/*@import "../static/css/theme-green/color-green.css";   !*浅绿色主题*!*/
```

第三步：打开 src/components/common/Sidebar.vue 文件，找到 el-menu 标签，把 theme="dark" 去掉即可。

### 三、vue-quill-editor富文本编辑器上传图片修改 ###

```javascript
找到文件夹'备份页面里面'的editor.vue文件替换\node_modules\vue-quill-editor里面的editor.vue
```


