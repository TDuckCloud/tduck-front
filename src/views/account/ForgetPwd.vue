<template>
    <div class="app-container">
        <div class="pwd-container">
            <label>找回密码</label>
            <el-tabs
                v-model="retrieveType" class="login-form" style="width: 300px;"
            >
                <el-tab-pane label="手机号找回" name="phone">
                    <el-form ref="form" :model="retrieveAccountForm" label-width="0px">
                        <el-form-item label="">
                            <el-input v-model="retrieveAccountForm.username" placeholder="请输入手机号" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="retrieveAccountForm.password" show-password placeholder="请输入密码"
                                      autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="retrieveAccountForm.code" style="width: 150px;" placeholder="请输入验证码"
                                      autocomplete="off"
                            />
                            <el-button style="margin-left: 20px;" type="primary">发送验证码</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width: 100%;">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="邮箱找回" name="email">
                    <el-form ref="emailRegForm" status-icon :rules="emailRetrieveRules" :model="retrieveAccountForm"
                             label-width="0px"
                    >
                        <el-form-item label="" prop="email">
                            <el-input v-model="retrieveAccountForm.email" placeholder="请输入邮箱" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="" prop="password">
                            <el-input v-model="retrieveAccountForm.password" show-password placeholder="请输入密码"
                                      autocomplete="off"
                            />
                        </el-form-item>
                        <el-form-item label="" prop="code">
                            <el-input v-model="retrieveAccountForm.code" oninput="value=value.replace(/[^\d]/g,'')"
                                      style="width: 150px;" maxlength="4" placeholder="请输入验证码"
                                      autocomplete="off"
                            />
                            <el-button style="margin-left: 20px;" :disabled="validateCodeBtn" type="primary"
                                       @click="sendEmailCodeHandle"
                            >
                                {{ validateCodeBtnText }}
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width: 100%;" @click="emailRegHandle">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RetrievePwd',
    data() {
        return {
            retrieveType: 'phone',
            retrieveAccountForm: {
                email: '',
                password: ''
            },
            emailRetrieveRules: {
                email: [
                    {required: true, trigger: 'blur', message: '请输入邮箱'},
                    {
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: '请输入正确的邮箱,多个使用;分隔'
                    }
                ],
                // password: [{required: true, trigger: 'blur', validator: validatePassword}],
                code: {required: true, trigger: 'blur', message: '请输入验证码'}
            }
        }
    }
}
</script>

<style scoped>
.app-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
}
.pwd-container {
    width: 20%;
    height: 50%;
    border: 1px red solid;
}
</style>
