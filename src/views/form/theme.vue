<template xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
    <div class="theme-container">
        <el-row>
            <el-col :span="8" :offset="1">
                <div class="left-container">
                    <p class="theme-title">外观主题</p>
                    <el-row>
                        <el-col :span="3">
                            <span class="theme-prompt-text">风格</span>
                        </el-col>
                        <el-col :span="3" v-for="item in styleList">
                            <span class="style-btn">{{item.label}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="3">
                            <span class="theme-prompt-text">颜色</span>
                        </el-col>
                        <el-col v-bind:style="{backgroundColor: c}" class="color-btn" :span="3" v-for="c in colorList">
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="8">

            </el-col>
            <el-col :span="8">
                外观设置
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'theme',
    data() {
        return {
            styleList: [
                {'label': '节日', 'key': 'festival'},
                {'label': '亲子', 'key': 'parent_child'},
                {'label': '风景', 'key': 'scenery'},
                {'label': '职业', 'key': 'occupation'},
                {'label': '校园', 'key': 'school'},
                {'label': '商务', 'key': 'commerce'},
                {'label': '其他', 'key': 'others'},
                {'label': '餐饮', 'key': 'catering'},
                {'label': '防疫', 'key': 'fangyi'}
            ],
            colorList: [
                '#FF6D56',
                '#F8E71C',
                '#00BF6F',
                '#2672FF ',
                '#7464FF',
                '#484848',
                '#EAEAEA',
                '#804000'
            ]
        }
    }, methods: {
        tet() {
        }
    }
}
</script>

<style scoped>
.theme-container {
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    background-color: #f7f7f7;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.left-container {
    width: 341px;
    height: 845px;
    line-height: 20px;
    border-radius: 7px;
    text-align: center;
    padding: 30px;
    border: 1px solid rgba(255, 255, 255, 100);
    background-color: white;
}

.style-btn {
    line-height: 25px;
    border-radius: 4px;
    padding: 2px;
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    margin: 3px;
    text-align: center;
    font-family: Arial;
    border: 1px solid rgba(187, 187, 187, 100);
}

.theme-title {
    color: rgba(16, 16, 16, 100);
    font-size: 24px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
}

.theme-prompt-text {
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    font-family: SourceHanSansSC-regular;
}

.color-btn {
    width: 40px;
    height: 22px;
    line-height: 20px;
    border-radius: 4px;
    background-color: rgba(11, 141, 213, 100);
    color: rgba(16, 16, 16, 100);
    font-size: 14px;
    text-align: center;
    font-family: Arial;
    margin: 3px;
    border: 1px solid rgba(255, 255, 255, 100);
}

.color-btn:hover,
.style-btn:hover {
    cursor: pointer;
}
</style>
