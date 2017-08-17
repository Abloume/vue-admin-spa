<template>
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
</template>
<script>
import {
    areaAjax
}
from '../../api/api';
export default {
    data() {
            return {
                formLabelWidth: "120px",
                provincelist: [],
                citylist: [],
                districtlist: [],
                streetlist: [],
            }
        },
        computed: {
            editarea: function() {
                return this.defaultarea
            }
        },
        props: {
            defaultarea: {
                type: Object,
                default: function() {
                    return {
                        province: "",
                        city: "",
                        district: "",
                        street: "",
                    }
                }
            },
        },
        mounted() {
            this.getchilddata(null, 'province');

        },
        methods: {
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
                    this.$emit('getareadata', this.editarea)

                });

            },
        },
        watch: {
            'editarea.province' (val, oldval) {
                //通过省获取市
                this.getchilddata(val, "city");
                // if (oldval != "") {
                //     this.editarea.city = "";
                //     this.editarea.district = "";
                //     this.editarea.street = ""
                // }
            },
            'editarea.city' (val, oldval) {
                // //通过市区县

                this.getchilddata(val, "district");
                // if (oldval != "") {
                //     this.editarea.district = "";
                //     this.editarea.street = ""
                // }
            },
            'editarea.district' (val, oldval) {
                // //通过区县获取街道
                this.getchilddata(val, "street");
                // if (oldval != "") {
                //     this.editarea.street = ""
                // }
            },
            'editarea.street' (val, oldval) {
                this.$emit('getareadata', this.editarea)
            },

        },
}
</script>
