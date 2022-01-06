<template>
    <div class="project-setting-view ">
        <p class="project-setting-title">
            回收设置
        </p>
        <el-form ref="writeSettingForm" :model="writeSettingForm" :rules="settingRules">
            <div class="setting-item">
                <p class="label">
                    只在微信中填写
                </p>
                <el-switch v-model="writeSettingForm.wxWrite" />
            </div>
            <div class="setting-item">
                <p class="label">
                    定时收集表单
                </p>
                <el-switch
                    v-model="writeSettingForm.timedCollection"
                />
            </div>
            <div v-if="writeSettingForm.timedCollection">
                <el-form-item>
                    <el-row align="middle" type="flex">
                        <el-col :span="12">
                            <el-date-picker
                                v-model="writeSettingForm.timedCollectionBeginTime"
                                align="center"
                                style="width: 100%"
                                placeholder="收集开始时间"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            />
                        </el-col>
                        <el-col :span="12">
                            <el-date-picker
                                v-model="writeSettingForm.timedCollectionEndTime"
                                style="width: 100%"
                                align="center"
                                placeholder="收集结束时间"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item prop="timedNotEnabledPromptText"
                              :rules="[{ required: true, message: '请输入未启用提示语', trigger: 'blur' }]"
                >
                    <el-input v-model="writeSettingForm.timedNotEnabledPromptText" placeholder="请输入未启用提示语" />
                </el-form-item>
                <el-form-item prop="timedDeactivatePromptText"
                              :rules="[{ required: true, message: '请输入停用后提示语', trigger: 'blur' }]"
                >
                    <el-input v-model="writeSettingForm.timedDeactivatePromptText" placeholder="请输入停用后提示语" />
                </el-form-item>
            </div>
            <div class="setting-item">
                <p class="label">
                    定时定量表单
                </p>
                <el-switch v-model="writeSettingForm.timedQuantitativeCollection" />
            </div>
            <div v-if="writeSettingForm.timedQuantitativeCollection">
                <el-form-item>
                    <el-row align="middle" type="flex">
                        <el-col :span="16">
                            <el-date-picker
                                v-model="writeSettingForm.timedCollectionBeginTime"
                                align="center"
                                placeholder="收集开始时间"
                                type="datetime"
                                style="width: 100%"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            />
                        </el-col>
                        <el-col :span="16">
                            <el-date-picker
                                v-model="writeSettingForm.timedCollectionEndTime"
                                align="center"
                                placeholder="收集结束时间"
                                type="datetime"
                                style="width: 100%"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            />
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item prop="timedNotEnabledPromptText"
                              :rules="[{ required: true, message: '请输入未启用提示语', trigger: 'blur' }]"
                >
                    <el-input v-model="writeSettingForm.timedNotEnabledPromptText" placeholder="请输入未启用提示语" />
                </el-form-item>
                <el-form-item prop="timedDeactivatePromptText"
                              :rules="[{ required: true, message: '请输入停用后提示语', trigger: 'blur' }]"
                >
                    <el-input v-model="writeSettingForm.timedDeactivatePromptText" placeholder="请输入停用后提示语" />
                </el-form-item>
                <el-form-item prop="timedQuantitativeQuantity"
                              :rules="[{ required: true, message: '请输入定量表单填写数量', trigger: 'blur' }]"
                >
                    <el-input v-model.number="writeSettingForm.timedQuantitativeQuantity" placeholder="请输入定量表单填写数量" />
                </el-form-item>
                <el-form-item prop="timedEndPromptText" :rules="[{ required: true, message: '请输入收集完成提示语', trigger: 'blur' }]">
                    <el-input v-model.number="writeSettingForm.timedEndPromptText" placeholder="请输入收集完成提示语" />
                </el-form-item>
            </div>

            <div class="setting-item">
                <p class="label">
                    每个微信仅填写一次
                </p>
                <el-switch
                    v-model="writeSettingForm.wxWriteOnce"
                    @change="()=>{
                        writeSettingForm.recordWxUser=true
                        writeSettingForm.wxWrite=true
                    }"
                />
            </div>
            <div class="setting-item">
                <p class="label">
                    每人限制填写1次
                    <el-tooltip class="item" content="根据IP地址限制填写" effect="dark" placement="top-start">
                        <i class="el-icon-warning" />
                    </el-tooltip>
                </p>
                <el-switch
                    v-model="writeSettingForm.everyoneWriteOnce"
                />
            </div>
            <div class="setting-item">
                <p class="label">
                    每人每天限制填写1次
                </p>
                <el-switch
                    v-model="writeSettingForm.everyoneDayWriteOnce"
                />
            </div>
            <el-form-item v-if="writeSettingForm.everyoneDayWriteOnce||writeSettingForm.everyoneWriteOnce"
                          prop="writeOncePromptText" :rules="[{ required: true, message: '请输入重复填写后提示语', trigger: 'blur' }]"
            >
                <el-input v-model.number="writeSettingForm.writeOncePromptText" placeholder="请输入重复填写后提示语" />
            </el-form-item>
            <div class="setting-item">
                <p class="label">
                    记录微信用户个人信息
                </p>
                <el-switch
                    v-model="writeSettingForm.recordWxUser"
                    @change="(val)=>{
                        if(!writeSettingForm.wxWrite&&val){
                            writeSettingForm.wxWrite=true
                        }
                    }"
                />
            </div>
            <el-row>
                <p class="project-setting-sub-label">
                    * 开启后将会授权登录，提供微信昵称、性别、城市信息
                </p>
            </el-row>
            <div class="submit-btn">
                <el-button type="primary" @click="saveSettingHandle">
                    保存设置
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
import mixin from './mixin'
import {getWriteSettingRequest, saveWriteSettingRequest} from '@/api/project/setting'

export default {
    name: 'WriteSetting',
    mixins: [mixin],
    data() {
        return {
            settingRules: {},
            writeSettingForm: {
                wxWrite: false,
                wxWriteOnce: false,
                everyoneWriteOnce: false,
                everyoneDayWriteOnce: false,
                writeOncePromptText: null,
                recordWxUser: false,
                timedCollection: false,
                timedQuantitativeCollection: false,
                timedCollectionBeginTime: null,
                timedCollectionEndTime: null,
                timedNotEnabledPromptText: null,
                timedDeactivatePromptText: null,
                timedQuantitativeQuantity: null,
                timedEndPromptText: null
            }
        }
    },
    mounted() {
        this.queryUserProjectSetting()
    },
    methods: {
        queryUserProjectSetting() {
            getWriteSettingRequest(this.formKey).then(res => {
                if (res.data) {
                    this.writeSettingForm = res.data
                }
            })
        },
        saveSettingHandle() {
            this.$refs['writeSettingForm'].validate(valid => {
                if (valid) {
                    this.writeSettingForm.formKey = this.formKey
                    saveWriteSettingRequest(this.writeSettingForm).then(() => {
                        this.msgSuccess('保存成功')
                        this.queryUserProjectSetting()
                    })
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "settting";

</style>
