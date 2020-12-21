<template>
    <div class="member-container">
        <el-card class="member-box-card">
            <div class="member-info-view">
                <p class="title pl-5">账号信息</p>
                <el-divider />
                <div v-if="userInfo" class="account-info-view">
                    <table>
                        <tbody>
                            <tr>
                                <td width="80" style="text-align: right;">用户名：</td>
                                <td>
                                    {{ userInfo.name }}
                                    <el-link type="primary" @click="editDialogVisible=true">修改</el-link>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" style="text-align: right;">账号邮箱：</td>
                                <td>
                                    {{ userInfo.email }}
                                    <el-link type="primary" @click="emailDialogVisible=true">绑定</el-link>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" style="text-align: right;">密码：</td>
                                <td>
                                    ******
                                    <el-link type="primary" @click="pwdDialogVisible=true">修改</el-link>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" style="text-align: right;">手机号：</td>
                                <td>
                                    {{ userInfo.phoneNumber }}
                                    <el-link type="primary">修改</el-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="account-avatar-view">
                        <my-upload v-model="showUploadAvatar"
                                   field="file"
                                   :width="300"
                                   :height="300"
                                   :url="getUploadUrl()"
                                   :headers="getUploadHeader()"
                                   img-format="png"
                                   @crop-upload-success="cropUploadSuccess"
                        />
                        <el-avatar
                            style="width: 100px; height: 100px;"
                            :src="userInfo.avatar"
                            @click.native="showUploadAvatar=true"
                        />
                        <div style="margin-left: 10px; margin-top: 5px;">
                            <el-button @click.native="showUploadAvatar=true">更换头像</el-button>
                        </div>
                    </div>
                </div>
                <p class="title pl-5">第三方账号</p>
                <el-divider />
                <div v-if="userInfo" class="account-info-view">
                    <table>
                        <tbody>
                            <tr>
                                <td width="80" style="text-align: right;">smile：</td>
                                <td>
                                    {{ userInfo.name }}
                                    <el-link type="primary" @click="editDialogVisible=true">修改</el-link>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" style="text-align: right;">smile：</td>
                                <td>
                                    {{ userInfo.name }}
                                    <el-link type="primary" @click="editDialogVisible=true">修改</el-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </el-card>
        <el-dialog
            title="修改用户名"
            :visible.sync="editNameDialogVisible"
            width="30%"
            center
        >
            <el-form ref="form" :model="userInfo" :rules="userInfoRules" label-width="80px">
                <el-form-item label="新用户名" prop="name">
                    <el-input v-model="userInfo.name" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"
                           @click="()=>{this.editNameDialogVisible = false;this.updateUserHandle()}"
                >保存</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改密码"
            :visible.sync="pwdDialogVisible"
            width="30%"
            center
        >
            <el-form ref="form"
                     style="width: 80%;"
                     :model="userPwdForm" :rules="userPwdRules" label-width="120px"
            >
                <el-form-item label="输入旧密码" prop="oldPassword">
                    <el-input v-model="userPwdForm.oldPassword" placeholder="请输入旧密码" show-password />
                </el-form-item>
                <el-form-item label="输入新密码" prop="password">
                    <el-input v-model="userPwdForm.password" placeholder="请输入新密码" show-password />
                </el-form-item>
                <el-form-item label="重复输入密码" prop="repeatPassword">
                    <el-input v-model="userPwdForm.repeatPassword" placeholder="请重复输入密码" show-password />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"
                           @click="()=>{this.pwdDialogVisible = false;this.updateUserPwdHandle()}"
                >完 成</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改邮箱"
            :visible.sync="emailDialogVisible"
            width="30%"
            center
        >
            <el-form ref="form"
                     style="width: 80%;"
                     :model="userInfo" :rules="userInfoRules" label-width="80px"
            >
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"
                           @click="()=>{this.pwdDialogVisible = false;this.sendUpdateEmail()}"
                >发送验证邮件</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import constants from '@/utils/constants'

export default {
    name: 'Member',
    components: {
        myUpload
    },
    data() {
        let validateRePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.resetPwdForm.rePassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            userInfoRules: {
                name: [
                    {required: true, trigger: 'blur', message: '请输入昵称'}
                ],
                email: [
                    {required: true, trigger: 'blur', message: '请输入邮箱'},
                    {
                        pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                        message: '请输入正确的邮箱'
                    }
                ]
            },
            userPwdRules: {
                oldPassword: [
                    {required: true, trigger: 'blur', message: '请输入旧密码'},
                    {
                        pattern: constants.passwordReg,
                        message: constants.passwordRegDesc
                    }
                ],
                password: [
                    {required: true, trigger: 'blur', message: '请输入新密码'},
                    {
                        pattern: constants.passwordReg,
                        message: constants.passwordRegDesc
                    }
                ],
                repeatPassword: [
                    {required: true, trigger: 'blur', validator: validateRePass}
                ]
            },
            editNameDialogVisible: false,
            pwdDialogVisible: false,
            emailDialogVisible: false,
            userInfo: {},
            userPwdForm: {
                oldPassword: '',
                password: '',
                repeatPassword: ''
            },
            showUploadAvatar: false
        }
    },
    created() {
        this.$api.get('/user/current/detail').then(res => {
            if (res.data) {
                this.userInfo = res.data
            }
        })
    },
    methods: {
        getUploadHeader() {
            return {
                'token': this.$store.getters['user/isLogin']
            }
        },
        getUploadUrl() {
            return `${process.env.VUE_APP_API_ROOT}/user/file/upload`
        },
        updateUserPwdHandle() {
            this.$api.post('/user/update/password', this.userPwdForm).then(res => {
                if (res.data) {
                    console.log(res.data)
                    this.msgSuccess('修改成功')
                }
            })
        },
        sendUpdateEmail() {
            this.$api.get('/update/email', {params: {email: this.userInfo.email}}).then(res => {
                if (res.data) {
                    this.msgSuccess('发送成功')
                }
            })
        },
        updateUserHandle() {
            this.$api.post('/user/update', this.userInfo).then(res => {
                if (res.data) {
                    console.log(res.data)
                    this.msgSuccess('保存成功')
                }
            })
        },
        cropUploadSuccess(res) {
            console.log(res)
            this.userInfo.avatar = res.data
            this.updateUserHandle()
        }
    }
}
</script>

<style lang="scss" scoped>
.member-container {
    display: flex;
    align-content: center;
    justify-content: center;
}
.title {
    font-size: 16px;
}
.member-box-card {
    margin-top: 20px;
    width: 900px;
    table {
        color: #666;
        font-size: 14px;
    }
    table tr {
        line-height: 30px;
    }
}
.account-info-view {
    padding: 10px;
    display: flex;
    justify-content: space-between;
}
.account-avatar-view {
    width: 180px;
}

</style>
