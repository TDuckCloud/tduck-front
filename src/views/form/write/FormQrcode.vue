<template>
  <div class="qrcode-box">
    <vue-qr v-if="codeUrl" :text="codeUrl" style="height: 100px; width: 100px" />
    <div class="qrcode-desc">手机扫码查看</div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'

export default {
  name: 'FormQrcode',
  components: {
    VueQr
  },
  data() {
    return {
      codeUrl: ''
    }
  },
  created() {
    this.codeUrl = location.href
  }
}
</script>

<style lang="scss" scoped>
.qrcode-box {
  position: fixed;
  left: 50%;
  top: 50px;
  margin-left: 450px;
  background: #fff;
  padding: 5px;
  z-index: 11;
  border-radius: 10px;
  -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);

  .qrcode-desc {
    text-align: center;
    font-size: 12px;
    color: #999;
  }
}

@media screen and (max-width: 1024px) {
  .qrcode-box {
    display: none;
  }
}
</style>
