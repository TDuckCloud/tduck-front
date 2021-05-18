<template>
    <div class="page-container">
        <div>
            <el-button v-if="prev" size="mini" type="primary" icon="el-icon-arrow-left">上一页</el-button>
            <el-button size="mini" type="primary">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
        </div>
        <div style="text-align: center;">
            <span v-if="currPage" class="desc-text">第2页，</span>
            <span v-if="totalPage" class="desc-text">共5页</span>
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
        currPage: {
            type: Boolean,
            default: true
        },
        totalPage: {
            type: Boolean,
            default: true
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
