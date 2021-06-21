<template>
    <div>
        <Header />
        <data-pay :option="option" />
    </div>
</template>

<script>
import DataPay from '@/views/official/DataPay'
import Header from '@/views/official/header'
import {MessageBox} from 'element-ui'

export default {
    name: 'PayService',
    components: {Header, DataPay},
    data() {
        return {
            option: {
                span: 8,
                data: [
                    {
                        title: '私有部署',
                        src: 'https://qiniu.smileyi.top/vip1.png',
                        money: 599,
                        dismoney: 999,
                        tip: '/次',
                        color: '#2054F0FF',
                        subtext: '购买',
                        click: function() {
                            MessageBox.alert('<img src="https://qiniu.smileyi.top/pay_qrcode1.jpg"/>', '添加客服微信', {
                                dangerouslyUseHTMLString: true
                            })
                        },
                        list: [
                            {
                                title: '官方部署，快速使用',
                                check: true
                            },
                            {
                                title: '一次部署，开心使用',
                                check: true
                            },
                            {
                                title: '愉快解决，不再头疼',
                                check: true
                            },
                            {
                                title: '服务稳定，持久耐用',
                                check: true
                            }
                        ]
                    }, {
                        title: '私有定制',
                        src: 'https://qiniu.smileyi.top/vip2.png',
                        color: '#33C9FDFF',
                        money: 888,
                        dismoney: 1000,
                        tip: '/起',
                        subtext: '购买',
                        click: function() {
                            MessageBox.alert('<img src="https://qiniu.smileyi.top/pay_qrcode2.jpg"/>', '添加客服微信', {
                                dangerouslyUseHTMLString: true
                            })
                        },
                        list: [
                            {
                                title: '私有定制，随心所欲',
                                check: true
                            },
                            {
                                title: '强大团队，快速赋能你的业务',
                                check: true
                            },
                            {
                                title: '效果满意，价格美丽',
                                check: true
                            }
                        ]
                    }]
            }
        }
    }
}
</script>

