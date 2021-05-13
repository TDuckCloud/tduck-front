<template>
    <div class="home-container">
        <div>
            <div class="banner-container">
                <el-carousel height="60px">
                    <el-carousel-item v-for="item in 4" :key="item">
                        <img style="height: 60px;" src="https://static.wenjuan.pub/1620698916041_333.jpg">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
        <div class="flex-row">
            <div class="left-container">
                <div class="userinfo-view">
                    <span class="hi-tips">HI.</span>
                    <span class="name text-overflow">15080929435</span>
                    <el-avatar class="avatar" size="small"
                               src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/avatar.jpg"
                    />
                </div>
                <div class="menu-view">
                    <div class="menu-item">
                        <font-icon class="fas fa-laptop" />
                        <span>工作台</span>
                    </div>
                    <div class="menu-item">
                        <font-icon class="fas fa-clipboard" />
                        <span>模板中心</span>
                    </div>
                    <div class="menu-item">
                        <font-icon class="fas fa-user" />
                        <span>个人中心</span>
                    </div>
                    <div class="menu-item">
                        <font-icon class="fas fa-cog" />
                        <span>系统设置</span>
                    </div>
                </div>
            </div>
            <div class="right-container">
                <el-button type="primary" @click="createBlankTemplate">新建项目</el-button>
                <el-button>新建项目</el-button>
                <my-project />
            </div>
        </div>
        <div class="about-container">
            <font-icon class="fas fa-user" />
            <span class="desc-text">关于填鸭</span>
        </div>
    </div>
</template>

<script>
import MyProject from '@/views/project/MyProject'
import {formConf} from '@/components/generator/config'

export default {
    name: 'NewIndex',
    components: {
        MyProject
    }, methods: {
        createBlankTemplate() {
            this.$api.post('/user/project/create', {
                'describe': formConf.description,
                'name': formConf.title
            }).then(res => {
                console.log(res)
                this.$router.push({path: '/project/form', query: {key: res.data}})
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.home-container {
    background-color: rgba(247, 247, 247, 90);
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: column;
}
.banner-container {
    height: 98px;
}
.left-container {
    min-width: 280px;
    height: 501px;
    line-height: 20px;
    border-radius: 2px;
    margin: 0 89px;
    text-align: center;
    //border: 1px solid rgba(255, 255, 255, 100);
    //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding-left: 20px;
}
.userinfo-view {
    display: flex;
    align-items: center;
    height: 42px;
    line-height: 42px;
    background-color: rgba(255, 255, 255, 100);
    .hi-tips {
        font-size: 21px;
        margin-left: 30px;
    }
    .name {
        width: 100px;
    }
    .avatar {
        margin-left: 10px;
    }
}
.menu-view {
    margin-top: 20px;
    height: 501px;
    background-color: rgba(255, 255, 255, 100);
    padding: 20px;
    .menu-item {
        color: rgba(16, 16, 16, 100);
        font-size: 20px;
        text-align: left;
        line-height: 40px;
        .fas {
            color: #1c7bf9;
            margin: 5px;
        }
        span {
            margin-left: 10px;
        }
    }
}
.project-container {
    display: flex;
    flex-direction: row;
    .project-item {
        display: flex;
    }
}
.about-container {
    position: fixed;
    width: 100%;
    bottom: 20px;
    display: flex;
    justify-content: center;
    margin-top: 40px;
    .fa-user {
        font-size: 19px;
        color: rgba(172, 172, 172, 100);
        margin: 1px;
    }
}
</style>
