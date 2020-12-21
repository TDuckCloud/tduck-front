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
                                    <el-link type="primary">绑定</el-link>
                                </td>
                            </tr>
                            <tr>
                                <td width="80" style="text-align: right;">密码：</td>
                                <td>
                                    ******
                                    <el-link type="primary">修改</el-link>
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
            title="提示"
            :visible.sync="editDialogVisible"
            width="30%"
            center
        >
            <el-form ref="form" :model="userInfo" label-width="80px">
                <el-form-item label="新用户名">
                    <el-input v-model="userInfo.name" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="()=>{this.editDialogVisible = false;this.updateUserHandle()}"
                >确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="提示"
            :visible.sync="pwdDialogVisible"
            width="30%"
            center
        >
            <el-form ref="form" :model="userInfo" label-width="80px">
                <el-form-item label="新用户名">
                    <el-input v-model="userInfo.name" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pwdDialogVisible = false">取 消</el-button>
                <el-button type="primary"
                           @click="()=>{this.pwdDialogVisible = false;this.updateUserHandle()}"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'

export default {
    name: 'Member',
    components: {
        myUpload
    },
    data() {
        return {
            editDialogVisible: false,
            userInfo: {},
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
