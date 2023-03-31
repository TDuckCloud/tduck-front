<template>
  <div class="project-setting-view">
    <p class="project-setting-title">
      回收设置
      <span class="small-font-size ml20 text-secondary-color"> 自定义表单收集收集时间，次数，以及限制填写环境等 </span>
    </p>
    <el-divider />
    <el-form ref="writeSettingForm" :model="writeSettingForm" :rules="settingRules" label-position="left">
      <div class="setting-item">
        <p class="label">
          密码填写
          <el-tooltip class="item" content="开启后需要输入密码才能进入填写页面" effect="dark" placement="top-start">
            <i class="el-icon-question" />
          </el-tooltip>
        </p>
        <el-switch v-model="writeSettingForm.passwordWriteStatus" />
      </div>
      <div v-if="writeSettingForm.passwordWriteStatus">
        <el-form-item :rules="[{ required: true, message: '请输入填写密码', trigger: 'blur' }]" prop="writePassword">
          <el-input v-model="writeSettingForm.writePassword" placeholder="请输入填写密码" />
        </el-form-item>
      </div>
      <div class="setting-item">
        <p class="label">每个微信答题次数限制</p>
        <el-switch
          v-model="writeSettingForm.wxWriteCountLimitStatus"
          @change="
            () => {
              writeSettingForm.recordWxUser = true
              writeSettingForm.onlyWxWrite = true
            }
          "
        />
      </div>
      <div v-if="writeSettingForm.wxWriteCountLimitStatus">
        <el-row>
          <el-col :span="8">
            <el-select v-model="writeSettingForm.wxWriteCountLimitDateType">
              <el-option v-for="d in dateRangeList" :key="d.value" :label="d.label" :value="d.value">
                {{ d.label }}
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            答题
            <el-input-number v-model="writeSettingForm.wxWriteCountLimit" :min="1" />
            次
          </el-col>
        </el-row>
        <el-input
          v-model="writeSettingForm.wxWriteCountLimitText"
          class="mt10"
          placeholder="该微信已经提交过数据，不可重复提交，有问题请与表单发布者联系"
        />
      </div>
      <div class="setting-item">
        <p class="label">
          每个IP答题次数限制
          <el-tooltip
            placement="top-start"
            content=" 此属性用于指定每一个IP地址只能提交一次表单，可以防止用户在同一台计算机上进行多次提交。"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </p>
        <el-switch v-model="writeSettingForm.ipWriteCountLimitStatus" />
      </div>
      <div class="setting-item">
        <p class="label">
          每个账号答题次数限制
          <el-tooltip
            placement="top-start"
            content=" 此属性用于指定每一个账号只能提交指定次表单，防止用户重复提交过指定次数。"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </p>
        <el-switch v-model="writeSettingForm.accountWriteCountLimitStatus" />
      </div>
      <div v-if="writeSettingForm.accountWriteCountLimitStatus">
        <el-row>
          <el-col :span="8">
            <el-select v-model="writeSettingForm.accountWriteCountLimitDateType">
              <el-option v-for="d in dateRangeList" :key="d.value" :label="d.label" :value="d.value">
                {{ d.label }}
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            答题
            <el-input-number v-model="writeSettingForm.accountWriteCountLimit" :min="1" />
            次
          </el-col>
        </el-row>
        <el-input
          v-model="writeSettingForm.accountWriteCountLimitText"
          class="mt10"
          placeholder="该账号已经提交过数据，不可重复提交，有问题请与表单发布者联系"
        />
      </div>
      <div class="setting-item">
        <p class="label">
          每台设备次数限制
          <el-tooltip placement="top-start" content="此功能依赖浏览器的本地存储，不能保证100%有效。">
            <i class="el-icon-question" />
          </el-tooltip>
        </p>
        <el-switch v-model="writeSettingForm.deviceWriteCountLimitStatus" />
      </div>
      <div v-if="writeSettingForm.deviceWriteCountLimitStatus">
        <el-row>
          <el-col :span="12">
            答题
            <el-input-number v-model="writeSettingForm.deviceWriteCountLimit" :min="1" />
            次
          </el-col>
        </el-row>
        <el-input
          v-model="writeSettingForm.deviceWriteCountLimitText"
          class="mt10"
          placeholder="该设备已经提交过数据，不可重复提交，有问题请与表单发布者联系"
        />
      </div>
      <div class="setting-item">
        <p class="label">
          设定答题次数上限
          <el-tooltip placement="top-start" content="当答题次数达到上限后，表单将无法提交数据，进入将显示提示文案">
            <i class="el-icon-question" />
          </el-tooltip>
        </p>
        <el-switch v-model="writeSettingForm.totalWriteCountLimitStatus" />
      </div>
      <div v-if="writeSettingForm.totalWriteCountLimitStatus">
        <el-row>
          <el-col :span="8">
            <el-select v-model="writeSettingForm.totalWriteCountLimitDateType">
              <el-option v-for="d in dateRangeList" :key="d.value" :label="d.label" :value="d.value">
                {{ d.label }}
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            答题
            <el-input-number v-model="writeSettingForm.totalWriteCountLimit" :min="1" />
            次
          </el-col>
        </el-row>
        <el-input
          v-model="writeSettingForm.totalWriteCountLimitText"
          class="mt10"
          placeholder="该表单收集数据已经达到上限，有问题请与表单发布者联系"
        />
      </div>
      <div class="setting-item">
        <p class="label">
          允许填写时间
          <el-tooltip
            placement="top-start"
            content="当进入设置的时间范围内，用户能访问表单并提交数据，否则将会显示对应文案"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </p>
        <el-switch v-model="writeSettingForm.writeInterviewTimeStatus" />
      </div>
      <div v-if="writeSettingForm.writeInterviewTimeStatus">
        <el-row>
          <el-col :span="5">
            <el-checkbox v-model="writeSettingForm.writeInterviewDayTimeStatus"> 限制每天访问的时间范围 </el-checkbox>
          </el-col>
        </el-row>
        <div v-if="writeSettingForm.writeInterviewDayTimeStatus">
          <el-row class="mt10">
            <el-col :span="13">
              <el-date-picker
                v-model="writeSettingForm.writeInterviewDateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-col>
          </el-row>
          <el-row class="mt10">
            <el-col :span="13">
              <el-time-picker
                v-model="writeSettingForm.writeInterviewTimeRange"
                is-range
                range-separator="-"
                value-format="HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              />
            </el-col>
          </el-row>
        </div>

        <el-row v-else class="mt10">
          <el-col :span="12">
            <el-date-picker
              v-model="writeSettingForm.writeInterviewDateTimeRange"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-col>
        </el-row>
        <div class="checkbox-group mt10">
          <el-checkbox-group v-model="writeSettingForm.writeInterviewTimeWhichDays">
            <el-checkbox label="2"> 周一 </el-checkbox>
            <el-checkbox label="3"> 周二 </el-checkbox>
            <el-checkbox label="4"> 周三 </el-checkbox>
            <el-checkbox label="5"> 周四 </el-checkbox>
            <el-checkbox label="6"> 周五 </el-checkbox>
            <el-checkbox label="7"> 周六 </el-checkbox>
            <el-checkbox label="1"> 周日 </el-checkbox>
          </el-checkbox-group>
        </div>
        <el-input
          v-model="writeSettingForm.writeInterviewTimeText"
          class="mt10"
          placeholder="此表单设置了访问时间，当前时间无法访问，有问题请与表单发布者联系"
        />
      </div>
      <div class="setting-item">
        <p class="label">只能在微信中填写</p>
        <el-switch
          v-model="writeSettingForm.onlyWxWrite"
          @change="
            (val) => {
              if (!writeSettingForm.onlyWxWrite && !val) {
                writeSettingForm.recordWxUser = false
              }
            }
          "
        />
      </div>
      <div class="setting-item">
        <p class="label">记录微信用户个人信息</p>
        <el-switch
          v-model="writeSettingForm.recordWxUser"
          @change="
            (val) => {
              if (!writeSettingForm.onlyWxWrite && val) {
                writeSettingForm.onlyWxWrite = true
              }
            }
          "
        />
      </div>
      <el-row>
        <p class="project-setting-sub-label">* 开启后将会授权登录，提供微信昵称、性别、城市信息</p>
      </el-row>
      <div class="submit-btn">
        <el-button type="primary" @click="saveSettingHandle"> 保存设置 </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import mixin from './mixin'
import { getSettingRequest, saveSettingRequest } from '../../../api/project/setting'

export default {
  name: 'WriteSetting',
  mixins: [mixin],
  data() {
    return {
      dateRangeList: [
        { value: 1, label: '总共' },
        { value: 2, label: '每天' },
        { value: 3, label: '每周' },
        { value: 4, label: '每月' }
      ],
      settingRules: {},
      writeSettingForm: {
        // 仅在微信填写
        onlyWxWrite: false,
        // 记录微信用户信息
        recordWxUser: false,
        // 恢复提交数据
        saveSubmitStatus: false,
        // 保存未恢复数据
        saveNotSubmitStatus: false,
        // 密码填写状态
        passwordWriteStatus: false,
        // 填写密码
        writePassword: '',
        // 每个微信答题次数限制
        wxWriteCountLimitStatus: false,
        // 次数
        wxWriteCountLimit: 1,
        // 日期范围
        wxWriteCountLimitDateType: 1,
        // 文案
        wxWriteCountLimitText: '',
        // 每个IP答题次数限制
        ipWriteCountLimitStatus: false,
        // 次数
        ipWriteCountLimit: 1,
        // 日期范围
        ipWriteCountLimitDateType: 1,
        // 文案
        ipWriteCountLimitText: '',
        // 每个账号答题次数限制
        accountWriteCountLimitStatus: false,
        // 次数
        accountWriteCountLimit: 1,
        // 日期范围
        accountWriteCountLimitDateType: 1,
        // 文案
        accountWriteCountLimitText: '',
        // 每台设备答题次数限制
        deviceWriteCountLimitStatus: false,
        // 次数
        deviceWriteCountLimit: 1,
        // 文案
        deviceWriteCountLimitText: '',
        // 累计答题数量
        totalWriteCountLimitStatus: false,
        // 次数
        totalWriteCountLimit: 1,
        // 日期范围
        totalWriteCountLimitDateType: 1,
        // 文案
        totalWriteCountLimitText: '',
        // 访问时间
        writeInterviewTimeStatus: false,
        // 访问时间是否是一天内的某些小时
        writeInterviewDayTimeStatus: false,
        // 允许访问访问时间范围
        writeInterviewDateTimeRange: [],
        // 允许访问访问日期范围
        writeInterviewDateRange: [],
        // 允许访问访问时间范围
        writeInterviewTimeRange: [],
        // 每周允许周几访问
        writeInterviewTimeWhichDays: [],
        writeInterviewTimeText: ''
      }
    }
  },
  mounted() {
    this.queryUserProjectSetting()
  },
  methods: {
    queryUserProjectSetting() {
      getSettingRequest(this.formKey).then((res) => {
        if (res.data) {
          this.writeSettingForm = res.data
        }
      })
    },
    saveSettingHandle() {
      this.$refs['writeSettingForm'].validate((valid) => {
        if (valid) {
          this.writeSettingForm.formKey = this.formKey
          saveSettingRequest(this.writeSettingForm).then(() => {
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
@import 'settting';

.checkbox-group .el-checkbox {
  margin-right: 23px;
}
</style>
