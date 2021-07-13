<template>
    <div>
        <el-input ref="main"
                  v-model="address"
                  :clearable="disabled"
                  :disabled="disabled"
                  placeholder="请选择地址"
                  @clear="handleClear"
                  @focus="handleShow"
        />

        <el-dialog
            :visible.sync="box"
            append-to-body
            title="选择位置"
            width="80%"
            @close="handleClose"
        >
            <div v-if="box">
                <el-input id="map__input"
                          v-model="formattedAddress"
                          class="input-map-content-input"
                          :readonly="disabled"
                          clearable
                          placeholder="输入关键字选取地点"
                          @clear="clear"
                />
                <div>
                    <div id="map__container"
                         class="input-map-content-container"
                         tabindex="0"
                    />
                    <div id="map__result"
                         class="input-map-content-result"
                    />
                </div>
            </div>
            <span slot="footer"
                  class="dialog-footer"
            >
                <el-button v-if="!(disabled )"
                           icon="el-icon-check"
                           type="primary"
                           @click="handleSubmit"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import MapLoader from '@/components/form/InputMap/amap.js'

export default {
    name: 'InputMap',
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formattedAddress: '',
            address: '',
            poi: {},
            text: '',
            marker: null,
            map: null,
            box: false
        }
    },
    watch: {
        poi(val) {
            this.formattedAddress = val.formattedAddress
        },
        value(val) {
            if (!val) {
                this.poi = {}
            }
        },
        text(val) {
            if (val) {
                this.poi = {
                    longitude: val[0],
                    latitude: val[1],
                    formattedAddress: val[2]
                }
                this.address = val[2]
            }
        },
        box: {
            handler() {
                if (this.box) {
                    this.$nextTick(() =>
                        this.init(() => {
                            if (this.longitude && this.latitude) {
                                this.addMarker(this.longitude, this.latitude)
                                this.getAddress(this.longitude, this.latitude)
                            }
                        })
                    )
                }
            },
            immediate: true
        }
    },
    methods: {
        clear() {
            this.poi = {}
            this.clearMarker()
        },
        handleSubmit() {
            this.setVal()
            this.$emit('input', this.text)
            this.box = false
        },
        handleClear() {
            this.text = []
            this.poi = {}
        },
        setVal() {
            this.text = [this.poi.longitude, this.poi.latitude, this.poi.formattedAddress]
        },
        handleShow() {
            this.$refs.main.blur()
            this.box = true
        },
        // 新增坐标
        addMarker(lng, lat) {
            this.clearMarker()
            this.marker = new window.AMap.Marker({
                position: [lng, lat]
            })
            this.map.add(this.marker)
        },
        // 清空坐标
        clearMarker() {
            if (this.marker) {
                this.map.remove(this.marker)
                this.marker = null
            }
        },
        // 获取坐标
        getAddress(lng, lat) {
            let that = this
            window.AMap.plugin('AMap.Geocoder', function() {
                // 回调函数
                let geocoder = new window.AMap.Geocoder({})
                geocoder.getAddress([lng, lat], (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        const regeocode = result.regeocode
                        that.poi = Object.assign(regeocode, {
                            longitude: lng,
                            latitude: lat
                        })
                        // 自定义点标记内容
                        that.clearMarker()
                        let content = `<div><img class="amap-marker-img" src="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png">
                            <span class="input-map-marker">${that.poi.formattedAddress}</span></div>`
                        that.marker = new window.AMap.Marker({
                            content: content,  // 自定义点标记覆盖物内容
                            position: [lng, lat],
                            title: that.poi.formattedAddress,
                            zoom: 13
                        })
                        that.map.add(that.marker)
                    }
                })
            })
        },
        // 获取当前位置
        getCurrentLocation() {
            let that = this
            window.AMap.plugin('AMap.Geolocation', function() {
                let geolocation = new window.AMap.Geolocation({
                    // 是否使用高精度定位，默认：true
                    enableHighAccuracy: true,
                    // 设置定位超时时间，默认：无穷大
                    timeout: 10000,
                    // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
                    buttonOffset: new window.AMap.Pixel(10, 20),
                    //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    zoomToAccuracy: true,
                    //  定位按钮的排放位置,  RB表示右下
                    buttonPosition: 'RB'
                })

                geolocation.getCurrentPosition(function(status, result) {
                    if (status == 'complete') {
                        onComplete(result)
                    } else {
                        onError(result)
                    }
                })

                function onComplete(data) {
                    // data是具体的定位信息
                    console.log(data)
                    let {lng, lat} = data.position
                    that.getAddress(lng, lat)
                }

                function onError(data) {
                    // 定位出错
                    console.log(data)
                }
            })
        },
        handleClose() {
            window.poiPicker.clearSearchResults()
            this.box = false
        },
        addClick() {
            this.map.on('click', e => {
                if (this.disabled) return
                console.log(e)
                const lnglat = e.lnglat
                // 经度
                const lng = lnglat.lng
                // 纬度
                const lat = lnglat.lat
                this.addMarker(lng, lat)
                this.getAddress(lng, lat)
            })
        },
        init() {
            MapLoader().then(AMap => {
                console.log('地图加载成功')
                this.map = new AMap.Map('map__container', Object.assign({
                    zoom: 13,
                    // 自动定位到所在城市并显示
                    resizeEnable: true,
                    center: (() => {
                        if (this.longitude && this.latitude) return [this.longitude, this.latitude]
                    })()
                }, this.params))
                this.getCurrentLocation()
                this.initPoip()
                this.addClick()
            }, e => {
                console.log('地图加载失败', e)
            })

        },
        initPoip() {
            // https://lbs.amap.com/api/amap-ui/reference-amap-ui/other/poipicker
            if (!window.AMapUI) {
                return
            }
            // 加载PoiPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            window.AMapUI.loadUI(['misc/PoiPicker'], PoiPicker => {
                var poiPicker = new PoiPicker({
                    input: 'map__input',
                    placeSearchOptions: {
                        map: this.map,
                        pageSize: 10
                    },
                    searchResultsContainer: 'map__result'
                })
                // 初始化poiPicker
                this.poiPickerReady(poiPicker)
            })
        },
        poiPickerReady(poiPicker) {
            window.poiPicker = poiPicker
            // 选取了某个POI
            poiPicker.on('poiPicked', poiResult => {
                this.clearMarker()
                let source = poiResult.source,
                    poi = poiResult.item
                console.log(poiResult)
                this.poi = Object.assign(poi, {
                    formattedAddress: poi.name,
                    longitude: poi.location.lng,
                    latitude: poi.location.lat
                })

                if (source !== 'search') {
                    poiPicker.searchByKeyword(poi.name)
                }
            })
        }
    }
}
</script>
<style scoped>

::v-deep .amap-marker-img {
    width: 25px !important;
    height: 34px !important;
}
::v-deep .input-map-marker {
    position: absolute !important;
    top: -20px !important;
    right: -118px !important;
    color: #fff !important;
    padding: 4px 10px !important;
    -webkit-box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
    box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
    white-space: nowrap;
    font-size: 12px;
    background-color: #25a5f7 !important;
    border-radius: 3px;
}
.input-map-content-container {
    width: 100%;
    height: 450px;
}
.input-map-content-result {
    display: block !important;
    position: absolute;
    top: 0;
    right: -8px;
    width: 250px;
    height: 450px;
    overflow-y: auto;
}
.input-map-content-input {
    margin-bottom: 10px;
}

::v-deep .el-dialog__headerbtn {
  z-index: 999;
}
</style>
