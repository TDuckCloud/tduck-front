<template>
    <div>
        <el-input
            v-model="inputValue"
            maxlength="11"
            readonly
            placeholder="点击验证手机号" class="input-with-select" @click="open=true"
        >
            <i slot="prefix" class="el-input__icon el-icon-mobile" />
            <el-button slot="append" icon="el-icon-message" @click="open=true" />
        </el-input>
        <el-dialog title="手机号验证" :visible.sync="open">
            <el-form ref="form" :model="phoneValidateForm" label-width="80px" :rules="rules">
                <el-form-item label="手机号" prop="phoneNumber">
                    <el-input v-model="phoneValidateForm.phoneNumber" maxlength="11" show-word-limit
                              prefix-icon=" el-icon-mobile "
                    />
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="validateCode" prefix-icon="el-icon-message" class="width80" />
                    <el-button type="primary"
                               :disabled="phoneValidateCodeBtn"
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
            validateCode: '',
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
        validateCodeHandle() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    // 调接口 验证成功
                } else {
                    return false
                }
            })
        },
        sendValidateMsgHandle() {
            this.$refs['form'].validateField('phoneNumber', err => {
                if (!err) {
                    this.phoneValidateCodeBtn = true
                    this.$api.get(`/register/phone/code?phoneNumber=${this.inputPhoneNumber}`).then(() => {
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

