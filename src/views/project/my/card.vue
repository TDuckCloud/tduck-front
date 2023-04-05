<template>
  <div class="project-card-container">
    <el-row v-if="projectList.length" :gutter="30">
      <el-col v-for="p in projectList" :key="p.id" :span="4.5">
        <el-card :key="p.id" :body-style="{ padding: '0px', position: 'static' }" class="move">
          <div class="body">
            <el-row align="middle" justify="center" type="flex">
              <el-col :span="20">
                <span class="title">
                  {{ p.textName }}
                </span>
              </el-col>

              <el-col :span="4">
                <span class="form-type" :style="{ backgroundColor: getType(p.type).color }">{{
                  getType(p.type).name
                }}</span>
              </el-col>
            </el-row>
            <div class="status">
              <span :style="getStatusColorStyle(p.status)" class="status-tag" />
              <span class="status-name" :style="{ color: getFormStatusName(p.status).color }">{{
                getFormStatusName(p.status).statusName
              }}</span>
            </div>
            <div class="card-time-div">
              <span class="card-time">创建时间：{{ p.createTime | formatDate }}</span>
            </div>
          </div>

          <div class="btns">
            <div class="split-line" />
            <el-button type="text" @click="toProjectHandle(p, 'editor')"> 编辑表单 </el-button>
            <el-button type="text" @click="toProjectHandle(p, 'data')"> 数据 </el-button>
            <el-button v-if="p.status == 2" type="text" @click.native="stopProject(p.formKey)"> 停止 </el-button>
            <el-button v-if="p.status != 2" type="text" class="delete-text" @click="deleteFrom(p.formKey)">
              删除
            </el-button>
            <el-button type="text" @click.native="toProjectHandle(p, 'statistics')"> 统计 </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div v-if="projectList.length == 0">
      <el-empty slot="empty" description="暂无数据" />
    </div>
  </div>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'FormCardList',
  components: {},
  mixins: [mixin],
  props: {
    projectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 我的表单页还是协作页区分 默认为表单页 协作页某些内容不显示
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    getStatusColorStyle() {
      return function (code) {
        let color = this.projectStatusList.find((item) => item.code == code).color
        return {
          backgroundColor: color,
          borderColor: color
        }
      }
    },
    getFormStatusName() {
      return function (code) {
        let name = this.projectStatusList.find((item) => item.code == code).name
        let statusColor = this.projectStatusList.find((item) => item.code == code).color
        return {
          statusName: name,
          color: statusColor
        }
      }
    }
  },
  methods: {
    deleteFrom(key) {
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.logicDeleteForm(key)
        })
        .catch(() => {})
    },
    endEvent(event) {
      console.log(event)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-card-container {
  //width: 950px;
  margin: 20px auto;

  .el-card {
    border-radius: 4px;
    position: relative;

    .body {
      padding: 10px;
      height: 150px;
      width: 280px;
      text-align: center;
    }
  }

  .el-col {
    margin-bottom: 10px;
    text-align: left;

    .form-type {
      color: white;
      font-size: 11px;
      padding: 3px 5px;
      border-radius: 5px;
    }

    .status {
      text-align: left;
    }

    .status-tag {
      display: inline-block;
      width: 7px;
      height: 7px;
      line-height: 20px;
      background-color: rgba(0, 110, 255, 100);
      text-align: center;
      border: 1px solid rgba(0, 110, 255, 100);
      border-radius: 20px;
      margin-bottom: 0px;
      margin-left: 10px;
    }

    .status-name {
      margin-left: 6px;
      font-size: 11px;
    }

    .title {
      color: rgb(68, 66, 66);
      font-size: 16px;
      text-align: left;
      font-weight: 500;
      margin-left: 10px;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
      max-width: 100%;
      line-height: 27px;
      vertical-align: bottom;
    }

    .card-time-div {
      text-align: left;
      margin-top: 5px;
    }

    .card-time {
      color: rgba(144, 147, 153, 100);
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      margin-left: 10px;
    }

    .time {
      color: rgba(144, 147, 153, 100);
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      margin: 0;
    }

    img {
      width: 143px;
      height: 121px;
    }

    .folder-img {
      width: 60px;
      height: 59px;
      margin: 0 auto;
      display: inline-block;
    }

    .folder-img + .time {
      margin-top: 20px;
    }

    .btns {
      color: rgba(144, 147, 153, 100);
      position: absolute;
      width: 100%;
      margin: 0;
      padding: 0;
      bottom: 0;
      display: block;
      border: none;
      text-align: center;
    }

    .el-button--text {
      font-weight: normal;
      color: #c0c4cc;
    }

    .el-button--text:hover {
      color: #409eff;
    }

    .split-line {
      text-align: center;
      margin-top: 100px;
      width: 100%;
      border-bottom: 1px solid #e7e7e7;
    }

    &:hover .btns {
      display: block;
    }
  }
}

::v-deep .el-card {
  border-radius: 10px !important;
}
</style>
