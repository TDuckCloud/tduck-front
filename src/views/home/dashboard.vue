<template>
    <el-row>
        <el-row type="flex" align="top" justify="space-around">
            <el-col :offset="1" :span="11">
                <el-row type="flex" align="middle" justify="center">
                    <el-col :span="3">
                        <p class="tagTitle">回收概览</p>
                    </el-col>
                    <el-col :offset="1" :span="21">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                                v-for="item in ['表单1']"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row
                    style="width: 719px; height: 416px; border-radius: 10px; border: 1px solid rgba(187, 187, 187, 100);"
                >
                    <el-row style="height: 50px;" />
                    <el-row>
                        <el-row type="flex" justify="space-around">
                            <el-col :offset="2" :span="5">
                                <span>有效回收量</span>
                            </el-col>
                            <el-col :span="5">
                                <span>总浏览量</span>
                            </el-col>
                            <el-col :span="5">
                                <span>回收率</span>
                            </el-col>
                            <el-col :span="5">
                                <span>平局完成时间</span>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-around">
                            <el-col :offset="2" :span="5">
                                <h4>
                                    1231
                                </h4>
                            </el-col>
                            <el-col :span="5">
                                <h4>
                                    3921
                                </h4>
                            </el-col>
                            <el-col :span="5">
                                <h4>28%</h4>
                            </el-col>
                            <el-col :span="5">
                                <h4>12分16秒</h4>
                            </el-col>
                        </el-row>
                    </el-row>
                    <el-row>
                        <img style="width: 719px; height: 252px;"
                             src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2cdrp.png"
                        >
                    </el-row>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row type="flex" align="middle" justify="start">
                    <el-col :span="5">
                        <p class="tagTitle">表单提交地域分布图</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <img style="height: 215px;"
                             src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2cdw0.png"
                        >
                    </el-col>
                </el-row>
                <el-row type="flex" justify="space-around">
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="5">
                                <p class="tagTitle">常用设备</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <img style="height: 160px;"
                                 src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2cdta.png"
                            >
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="5">
                                <p class="tagTitle">来源渠道</p>
                            </el-col>
                        </el-row>
                        <el-row>
                            <img style="height: 160px;"
                                 src="https://freebrio.oss-cn-shanghai.aliyuncs.com/t/v2_q2cdo2.png"
                            >
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row style="height: 30px;" />
    </el-row>
</template>
<script>
export default {
    name: 'HomeDashboard'
}
</script>

<style scoped>
.tagTitle {
    font-size: 20px;
    border-bottom: 3px solid rgba(68, 68, 68, 100);
    line-height: 25px;
}
</style>
