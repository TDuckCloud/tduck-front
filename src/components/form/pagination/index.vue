<template>
    <div class="page-container">
        <div>
            <el-button v-if="prev&&currPageNum!==1" icon="el-icon-arrow-left" size="mini" type="primary"
                       @click="prevClick"
            >
                上一页
            </el-button>
            <el-button v-if="currPageNum!==totalPageNum" size="mini" type="primary" @click="nextClick">
                下一页<i class="el-icon-arrow-right el-icon--right" />
            </el-button>
        </div>
        <div style="text-align: center;">
            <span v-if="currPage" class="desc-text">第{{ currPageNum }}页，</span>
            <span v-if="totalPage" class="desc-text">共{{ totalPageNum }}页</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
        // 上一页按钮
        prev: {
            type: Boolean,
            default: true
        },
        // 显示当前页
        currPage: {
            type: Boolean,
            default: true
        },
        currPageNum: {
            type: Number,
            default: 1
        },
        // 显示总页数
        totalPage: {
            type: Boolean,
            default: true
        },
        totalPageNum: {
            type: Number,
            default: 1
        }
    },
    methods: {
        prevClick() {
            this.$emit('prev', this.currPageNum)
        },
        nextClick() {
            this.$emit('next', this.currPageNum)
        }
    }
}
</script>
<style scoped>
.page-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}
</style>
