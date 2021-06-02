<template>
    <div class="phone-number-container">
        <el-input
            v-model="inputValue"
            class="input-with-select"
            maxlength="11"
            placeholder="点击验证手机号" readonly @click.native="openDialogHandle"
        >
            <i slot="prefix" class="el-input__icon el-icon-mobile" />
            <el-button slot="append" icon="el-icon-message" @click="openDialogHandle" />
        </el-input>
        <el-dialog :visible.sync="open" title="手机号验证">
            <el-form ref="form" :model="phoneValidateForm" :rules="rules" label-width="80px">
                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="phoneValidateForm.phoneNumber" style="width: 80%;" maxlength="11" prefix-icon=" el-icon-mobile "
                              show-word-limit
                    />
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="phoneValidateForm.code" style="width: 60%;" prefix-icon="el-icon-message" />
                    <el-button :disabled="phoneValidateCodeBtn"
                               style="width: 15%;"
                               type="primary"
                               @click="sendValidateMsgHandle"
                    >
                        {{ phoneValidateCodeBtnText }}
                    </el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="open = false">取 消</el-button>
                <el-button type="primary" @click="validateCodeHandle">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Index',
    props: {
        value: null
    },
    data() {
        return {
            phoneValidateCodeBtnText: '发送验证码',
            phoneValidateCodeBtn: false,
            open: false,
            inputValue: null,
            phoneValidateForm: {
                phoneNumber: '',
                code: ''
            },
            rules: {
                phoneNumber: [
                    {required: true, trigger: 'blur', message: '请输入手机号'},
                    {
                        pattern: /^(?:0|86|\+86)?1[3456789]\d{9}$/,
                        message: '请输入正确的手机号'
                    }
                ],
                code: {required: true, trigger: 'blur', message: '请输入验证码'}
            }
        }
    },
    methods: {
        openDialogHandle() {
            this.open = true
            this.phoneValidateForm = {
                phoneNumber: '',
                code: ''
            }
        },
        validateCodeHandle() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    // 调接口 验证成功
                    this.$api.post('/project/phone/code/check', this.phoneValidateForm).then(res => {
                        this.inputValue = res.data
                        this.open = false
                        this.$emit('input', res.data)
                    })
                } else {
                    return false
                }
            })
        },
        sendValidateMsgHandle() {
            this.$refs['form'].validateField('phoneNumber', err => {
                if (!err) {
                    this.phoneValidateCodeBtn = true
                    this.$api.get(`/project/phone/code?phoneNumber=${this.phoneValidateForm.phoneNumber}`).then(() => {
                        this.msgSuccess('验证码发送成功，5分钟内有效')
                        this.phoneValidateCodeBtn = true
                        let count = 60
                        let timer = setInterval(() => {
                            count--
                            this.phoneValidateCodeBtnText = count + 's后重新发送'
                            if (count == 0) {
                                this.phoneValidateCodeBtnText = '发送验证码'
                                this.phoneValidateCodeBtn = false
                                clearInterval(timer)
                            }
                        }, 1000)
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.phone-number-container {
    display: flex;
}
.phone-number-container ::v-deep.el-form-item__label {
    float: left;
}
</style>
