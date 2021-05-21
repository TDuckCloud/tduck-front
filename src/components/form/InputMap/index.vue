<template>
    <div class="p-map">
        <div id="mapContainer">
            <!--渲染地图的div-->
        </div>
    </div>
</template>

<script>
import MapLoader  from '@/components/form/InputMap/amap.js'
export default {
    name: 'Index',
    created() {
        this.loadMap()
    },
    methods: {
        loadMap() {
            const _this = this
            MapLoader().then(AMap => {
                console.log('地图加载成功')
                this.map = new AMap.Map('mapContainer', {
                    center: [117.000923, 36.675807],
                    zoom: 6
                })
                // map初始化插件
                AMap.plugin(['AMap.ToolBar'], function() {
                    _this.map.addControl(new AMap.ToolBar())
                })
            }, e => {
                console.log('地图加载失败', e)
            })
        }
    }
}
</script>
