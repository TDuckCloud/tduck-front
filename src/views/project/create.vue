<template>
    <div class="create-wrapper">
        <el-backtop target=".create-wrapper" :visibility-height="100" :bottom="60" />
        <el-row>
            <el-row style="height: 20px;" />
            <el-row>
                <el-col :offset="1" :span="2">
                    <el-button size="mini" round @click="$router.back(-1)">
                        <i class="el-icon-arrow-left" />
                        返回
                    </el-button>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col :offset="4" :span="8">
                    <el-form ref="form">
                        <el-form-item label="">
                            <el-input class="search-template-input" />
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :offset="1" :span="4">
                    <el-button type="primary" class="search-template-btn">查询</el-button>
                </el-col>
                <el-col :span="6" />
            </el-row>
            <el-row>
                <el-col :offset="6" :span="10">
                    <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
                        <el-menu-item index="1">全部</el-menu-item>
                        <el-menu-item index="2">问卷调查</el-menu-item>
                        <el-menu-item index="3">满意度调查</el-menu-item>
                        <el-menu-item index="4">投票评选</el-menu-item>
                        <el-menu-item index="5">报名登记表</el-menu-item>
                        <el-menu-item index="6">考试测评</el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="3" :span="3">
                    <span class="tagTitle">推荐模板</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :offset="3" :span="3" @click.native="createBlankTemplate">
                    <div class="project-template-view" style="display: flex; align-items: center;">
                        <div style="flex: 1;">
                            <i style="font-size: 40px; align-items: center;" class="el-icon-plus" />
                            <p style="font-size: 14px;">创建一个空白模板</p>
                        </div>
                    </div>
                </el-col>
                <el-col v-for="(template,index) in templateList" :key="template.title"
                        :offset="getTemplateOffset(index)"
                        :span="3"
                >
                    <div class="project-template-view">
                        <img style="width: 144px; height: 133px;" :src="template.image">
                        <p style="color: rgba(16, 16, 16, 100); font-size: 14px; margin: 0; line-height: 30px;">
                            {{ template.title }}
                        </p>
                        <p style="color: rgba(189, 188, 188, 100); font-size: 12px; margin: 0;">
                            {{ template.likeCount }}人喜欢
                            <svg-icon name="like" style="width: 12px; height: 12px;" />
                        </p>
                    </div>
                </el-col>
            </el-row>
            <el-row style="height: 20px;" />
            <el-row type="flex" justify="center">
                <el-col :span="5">
                    <el-pagination
                        :hide-on-single-page="true"
                        :total="50"
                        layout="prev, pager, next"
                    />
                </el-col>
            </el-row>
            <el-row />
        </el-row>
    </div>
</template>

<script>
import {formConf} from '@/components/generator/config'

export default {
    name: 'CreateProject',
    data() {
        return {
            templateList: [
                {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                },
                {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                },
                {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }, {
                    image: 'https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2c3ec.png',
                    title: '垃圾分类问卷调查',
                    likeCount: 10000
                }
            ]
        }
    },
    computed: {},
    methods: {
        getTemplateOffset(index) {
            console.log(index)
            // if (index == 5 || (index != 6 && index != 0 && index % 6 === 0)) {
            //     return 3
            // }
            if ((index + 1) % 6 == 0) {
                return 3
            }
            return 0
        },
        createBlankTemplate() {
            this.$api.post('/user/project/create', {'describe': formConf.description, 'name': formConf.title}).then(res => {
                console.log(res)
                this.$router.push({path: '/project/form', query: {key: res.data}})
            })
        }
    }
}
</script>

<style scoped>
.create-wrapper {
    height: 100%;
    overflow-x: hidden;
}
.tagTitle {
    font-size: 20px;
    border-bottom: 3px solid rgba(68, 68, 68, 100);
    line-height: 25px;
}
.project-template-view {
    width: 151px;
    height: 196px;
    line-height: 20px;
    border-radius: 3px;
    text-align: center;
    margin-top: 20px;
    border: 1px solid rgba(187, 187, 187, 100);
}
.el-menu.el-menu--horizontal {
    border-bottom: none;
}
/deep/ .search-template-input input {
    width: 651px;
    height: 50px;
    line-height: 20px;
    border-radius: 10px;
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 100);
}
/deep/ .search-template-btn {
    width: 132px;
    height: 50px;
    border-radius: 10px;
    background-color: rgba(25, 73, 157, 100);
    color: rgba(255, 255, 255, 100);
    font-size: 18px;
    text-align: center;
    border: 1px solid rgba(187, 187, 187, 100);
}
</style>
