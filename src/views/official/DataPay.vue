<template>
    <div class="data-pay">
        <el-row :span="24">
            <el-col v-for="(item,index) in data"
                    :key="index"
                    :md="span"
                    :offset="index==0?4:0"
                    :sm="12"
                    :xs="24"
            >
                <div class="item">
                    <div :style="{backgroundColor:item.color}"
                         class="top"
                    />
                    <div class="header">
                        <p class="title">{{ item.title }}</p>
                        <img :src="item.src"
                             alt=""
                             class="img"
                        >
                        <template v-if="item.subtitle">
                            <p :style="{color:item.color}"
                               class="subtitle"
                            >
                                {{ item.subtitle }}
                            </p>
                        </template>
                        <template v-if="item.money || item.dismoney">
                            <p :style="{color:item.color}"
                               class="money"
                            >
                                <span>¥</span>
                                <count-to :end-val="item.money" />
                                <s>{{ item.dismoney }}</s>
                                <em>{{ item.tip }}</em>
                            </p>
                        </template>
                        <div class="line" />
                        <a :href="item.href?item.href:'javascript:void(0);'"
                           :style="{backgroundColor:item.color}"
                           class="btn"
                           @click="item.click?item.click(item):''"
                        >{{ item.subtext }}</a>
                    </div>
                    <div class="list">
                        <div v-for="(citem,cindex) in item.list"
                             :key="cindex"
                             class="list-item"
                        >
                            <i v-if="citem.check"
                               :style="{color:item.color}"
                               class="list-item-icon list-item--check"
                            >√</i>
                            <i v-else
                               class="list-item-icon list-item--no"
                            >x</i>
                            <a :href="citem.href?citem.href:'javascript:void(0);'">
                                <el-tooltip :disabled="!citem.tip"
                                            effect="dark"
                                            placement="top"
                                >
                                    <div slot="content"
                                         v-html="citem.tip"
                                    />
                                    <span :class="{'list-item--link':citem.href}">{{ citem.title }}</span>
                                </el-tooltip>

                            </a>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import CountTo from '@/components/CountTo'

export default {
    name: 'DataPay',
    components: {CountTo},
    props: {
        option: {
            type: Object,
            default: () => {
            }
        }
    },
    computed: {
        animation() {
            return this.option.animation
        },
        decimals() {
            return this.option.decimals || 0
        },
        span() {
            return this.option.span || 6
        },
        data() {
            return this.option.data || []
        }
    }
}
</script>

<style lang="scss" scoped>
.data-pay .item {
  margin: 0 auto;
  padding-bottom: 16px;
  width: 80%;
  position: relative;
  border-radius: 4px;
  background-color: #fff;
  min-height: 670px;
  -webkit-box-shadow: 1px 2px 10px #eee;
  box-shadow: 1px 2px 10px #eee;
}

.data-pay .top {
  width: 100%;
  height: 6px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px 4px 0 0;
}

.data-pay .header {
  margin-bottom: 40px;
  text-align: center;
}

.data-pay .title {
  text-align: center;
  padding: 20px 0 10px;
  font-size: 20px;
  font-weight: 200;
}

.data-pay .money span {
  margin-right: 5px;
  font-size: 14px;
}

.data-pay .money .b {
  margin-right: 2px;
  font-size: 20px;
  font-weight: 700;
}

.data-pay .money s {
  margin-right: 3px;
  font-size: 12px;
}

.data-pay .money em {
  font-size: 14px;
  font-style: normal;
}

.data-pay .img {
  width: 50px;
}

.data-pay .line {
  width: 60%;
  height: 1px;
  background: rgba(150, 150, 150, 0.1);
  margin: 20px auto;
}

.data-pay .btn {
  display: block;
  width: 120px;
  height: 32px;
  line-height: 32px;
  margin: 0 auto;
  text-align: center;
  border-radius: 32px;
  color: #fff;
  cursor: pointer;
  -webkit-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
}

.data-pay .list-item {
  list-style: none;
  padding-left: 20px;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.data-pay .list-item a {
  color: #666;
}

.data-pay .list-item-icon {
  color: #515a6e;
  margin-right: 8px;
}

.data-pay .list-item--link {
  font-size: 12px;
  color: #2d8cf0;
}

.data-pay .list-item--no,
.data-pay .list-item--no + span {
  color: #c5c8ce;
}
</style>
