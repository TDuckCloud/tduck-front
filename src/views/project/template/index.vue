<template>
  <div class="create-container">
    <!-- 头部 Hero 区域：大气开阔的视觉引入 -->
    <div class="hero-header-section">
      <div class="hero-content">
        <h1 class="hero-title">模板库</h1>
        <p class="hero-subtitle">选择一个专业设计的模板，立即开启您的高效表单收集与卓越数据统计旅程。</p>
      </div>

      <!-- 搜索胶囊组件 -->
      <div class="search-capsule-wrapper">
        <div class="search-capsule">
          <i class="el-icon-search search-icon"></i>
          <input
            v-model="queryParams.name"
            type="text"
            placeholder="查找模板名称..."
            class="search-input"
            @keyup.enter="queryTemplatePage"
          />
          <button class="search-action-btn" @click="queryTemplatePage">查询</button>
        </div>
      </div>
    </div>

    <!-- 苹果风格的 Segmented Controls（胶囊卡片筛选栏） -->
    <div class="category-tabs-container">
      <div class="segmented-control">
        <button class="control-item" :class="{ active: queryParams.type === null }" @click="selectType(null)">
          全部模板
        </button>
        <button
          v-for="item in templateTypeList"
          :key="item.id"
          class="control-item"
          :class="{ active: queryParams.type === item.id.toString() }"
          @click="selectType(item.id.toString())"
        >
          {{ item.name }}
        </button>
      </div>
    </div>

    <!-- 响应式 CSS Grid 模板网格 -->
    <div class="project-grid-container">
      <div v-if="templateList && templateList.length > 0" class="project-grid-view">
        <div v-for="template in templateList" :key="template.id" class="project-template-card">
          <!-- 媒体展示区（含悬浮磨砂操作层） -->
          <div class="card-media-wrapper">
            <img
              v-if="template.coverImg && !imageErrorList.includes(template.id)"
              :src="template.coverImg"
              class="preview-img"
              alt="cover"
              @error="handleImageError(template.id)"
            />
            <!-- 极简占位图 -->
            <div v-else class="placeholder-art">
              <i class="el-icon-document placeholder-icon"></i>
            </div>

            <!-- 高清磨砂玻璃悬浮层 -->
            <div class="card-glass-overlay">
              <div class="action-btn-group">
                <button class="action-btn preview" @click="toProjectTemplate(template.formKey)">
                  <i class="el-icon-view"></i>
                  预览模板
                </button>
                <button class="action-btn delete" @click="handleDelete(template)">
                  <i class="el-icon-delete"></i>
                  删除
                </button>
              </div>
            </div>
          </div>

          <!-- 卡片信息区 -->
          <div class="card-info-wrapper">
            <h3 class="project-template-title" :title="template.name">
              {{ template.name }}
            </h3>
            <div class="card-meta">
              <span class="meta-tag">
                {{ template.categoryName || getTypeName(template.categoryId || template.type) }}
              </span>
              <span class="meta-icon">
                <i class="el-icon-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 大气无模板空态 -->
      <div v-else class="empty-state-view">
        <svg class="empty-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="48" fill="#F4F7FF" />
          <path d="M60 38V82" stroke="#E1E7F6" stroke-width="3" stroke-linecap="round" />
          <path d="M38 60H82" stroke="#E1E7F6" stroke-width="3" stroke-linecap="round" />
          <rect
            x="42"
            y="42"
            width="36"
            height="36"
            rx="6"
            stroke="#3370ff"
            stroke-width="3"
            stroke-dasharray="6 4"
            fill="white"
            fill-opacity="0.8"
          />
          <circle cx="60" cy="60" r="6" fill="#3370ff" />
        </svg>
        <p class="empty-title">没有找到相关表单模板</p>
        <p class="empty-subtitle">换个搜索词，或者选择其他模板分类看看吧</p>
      </div>
    </div>

    <!-- 精致的磨砂背板分页器 -->
    <div class="pagination-wrapper">
      <el-pagination
        v-if="total > 10"
        :current-page.sync="queryParams.current"
        :page-size.sync="queryParams.size"
        :total="total"
        background
        layout="total, prev, pager, next"
        @current-change="queryTemplatePage"
      />
    </div>
  </div>
</template>

<script>
import {
  deleteFormTemplateRequest,
  getFormTemplatePageRequest,
  getFormTemplateTypeListRequest
} from '@/api/project/template'
import { createFormRequest } from '@/api/project/form'

export default {
  name: 'CreateProject',
  data() {
    return {
      queryParams: {
        current: 1,
        size: 12,
        name: '',
        type: null
      },
      total: 0,
      templateTypeList: [],
      templateList: [],
      imageErrorList: []
    }
  },
  computed: {},
  created() {
    this.queryTemplateType()
    this.queryTemplatePage()
  },
  methods: {
    // 获取分类列表
    queryTemplateType() {
      getFormTemplateTypeListRequest().then((res) => {
        this.templateTypeList = res.data
      })
    },
    // 胶囊 Tab 点击切换事件（附带重置当前页 Bug 修复）
    selectType(typeId) {
      this.queryParams.type = typeId
      this.queryParams.current = 1
      this.queryTemplatePage()
    },
    // 查看/预览模板详情
    toProjectTemplate(key) {
      this.$router.push({ path: '/project/template/preview', query: { key: key } })
    },
    // 优雅确认弹窗与删除
    handleDelete(item) {
      this.$confirm(`此操作将永久删除模板「${item.name}」, 是否继续?`, '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        confirmButtonClass: 'el-button--danger',
        type: 'warning',
        roundButton: true
      }).then(() => {
        deleteFormTemplateRequest({ formKey: item.formKey }).then((res) => {
          this.msgSuccess('删除成功')
          this.queryTemplatePage()
        })
      })
    },
    // 分页及过滤查询
    queryTemplatePage() {
      getFormTemplatePageRequest(this.queryParams).then((res) => {
        let { records, total, size } = res.data
        this.templateList = records
        this.total = total
        this.queryParams.size = size
        this.projectListLoading = false
      })
    },
    // 创建空白模板（保留原有备用方法）
    createBlankTemplate() {
      createFormRequest({ description: '表单模板', name: '表单模板' }).then((res) => {
        this.$router.push({ path: '/project/form', query: { key: res.data } })
      })
    },
    // 根据当前类型 ID 获取对应的分类名字
    getTypeName(typeId) {
      if (!typeId) return '默认分类'
      const found = this.templateTypeList.find((t) => t && t.id != null && String(t.id) === String(typeId))
      return found ? found.name : '默认分类'
    },

    // 图片加载失败退化方案
    handleImageError(id) {
      if (!this.imageErrorList.includes(id)) {
        this.imageErrorList.push(id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

// 全局容器布局：极简呼吸感
.create-container {
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 40px 80px 80px 80px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #1d1d1f;
  -webkit-font-smoothing: antialiased;

  @media (max-width: 1200px) {
    padding: 30px 40px 60px 40px;
  }

  @media (max-width: 768px) {
    padding: 24px 20px 60px 20px;
  }
}

// 头部 Hero 区域
.hero-header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 28px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;

  .hero-content {
    flex: 1;
    min-width: 250px;

    .hero-title {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #1d1d1f 0%, #3a3a3c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 8px 0;
    }

    .hero-subtitle {
      font-size: 15px;
      color: #86868b;
      margin: 0;
      line-height: 1.5;
    }
  }
}

// 胶囊搜索框设计：极致精细微阴影
.search-capsule-wrapper {
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }

  .search-capsule {
    display: flex;
    align-items: center;
    background: #f5f5f7;
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 30px;
    padding: 4px 6px 4px 16px;
    width: 350px;
    max-width: 100%;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    @media (max-width: 768px) {
      width: 100%;
    }

    &:focus-within {
      background: #ffffff;
      border-color: rgba($color-primary, 0.4);
      box-shadow: 0 0 0 3px rgba($color-primary, 0.12), 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .search-icon {
      color: #86868b;
      font-size: 16px;
      margin-right: 10px;
    }

    .search-input {
      border: none;
      background: transparent;
      outline: none;
      flex: 1;
      font-size: 14px;
      color: #1d1d1f;
      height: 28px;

      &::placeholder {
        color: #b6b6bb;
      }
    }

    .search-action-btn {
      background: $color-primary;
      color: #ffffff;
      border: none;
      outline: none;
      padding: 6px 18px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 6px rgba($color-primary, 0.2);

      &:hover {
        background: $color-primary-hover;
        transform: translateY(-0.5px);
        box-shadow: 0 4px 10px rgba($color-primary, 0.3);
      }

      &:active {
        background: $color-primary-active;
        transform: translateY(0.5px);
      }
    }
  }
}

// 胶囊卡片筛选栏：苹果扁平圆角交互
.category-tabs-container {
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-start;

  .segmented-control {
    display: inline-flex;
    background: #f5f5f7;
    padding: 4px;
    border-radius: 20px;
    overflow-x: auto;
    max-width: 100%;
    scrollbar-width: none; // Firefox

    &::-webkit-scrollbar {
      display: none; // Chrome/Safari
    }

    .control-item {
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      font-weight: 500;
      color: #86868b;
      padding: 8px 20px;
      border-radius: 16px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);

      &:hover:not(.active) {
        color: #1d1d1f;
        background: rgba(0, 0, 0, 0.03);
      }

      &.active {
        color: $color-primary;
        background: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.02);
      }
    }
  }
}

// 响应式自适应网格系统
.project-grid-container {
  min-height: 400px;

  .project-grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    width: 100%;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }
  }
}

// 精美 3D 浮雕模板卡片
.project-template-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 2px 6px rgba(0, 0, 0, 0.01);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  height: 310px;

  @media (max-width: 768px) {
    height: 250px;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 22px 40px rgba(51, 112, 255, 0.08), 0 8px 18px rgba(0, 0, 0, 0.03);
    border-color: rgba($color-primary, 0.12);

    // 图片缩放动画
    .card-media-wrapper .preview-img {
      transform: scale(1.05);
    }

    // 磨砂玻璃层淡入
    .card-media-wrapper .card-glass-overlay {
      opacity: 1;
      pointer-events: auto;
    }

    // 信息区箭头高亮
    .card-info-wrapper .card-meta .meta-icon {
      color: $color-primary;
      transform: translateX(3px);
    }
  }
}

// 媒体展示区（含默认插画）
.card-media-wrapper {
  height: 200px;
  overflow: hidden;
  position: relative;
  background: #f5f5f7;

  @media (max-width: 768px) {
    height: 155px;
  }
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);

  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  // 极简占位插画
  .placeholder-art {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
    color: #dcdfe6;

    .placeholder-icon {
      font-size: 48px;
    }
  }

  // 高清毛玻璃悬浮层：操作按钮居中浮现
  .card-glass-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(14px) saturate(120%);
    -webkit-backdrop-filter: blur(14px) saturate(120%);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 10;

    .action-btn-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 70%;
      align-items: center;
    }

    .action-btn {
      width: 100%;
      border: none;
      outline: none;
      padding: 10px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s ease;

      &.preview {
        background: $color-primary;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba($color-primary, 0.25);

        &:hover {
          background: $color-primary-hover;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba($color-primary, 0.35);
        }

        &:active {
          background: $color-primary-active;
          transform: translateY(1px);
        }
      }

      &.delete {
        background: rgba(255, 59, 48, 0.08);
        color: #ff3b30;
        border: 1px solid rgba(255, 59, 48, 0.15);

        &:hover {
          background: #ff3b30;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 59, 48, 0.25);
          border-color: transparent;
        }

        &:active {
          transform: translateY(1px);
        }
      }
    }
  }
}

// 卡片底侧信息区
.card-info-wrapper {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  background: #ffffff;

  .project-template-title {
    font-size: 15px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0 0 6px 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .meta-tag {
      font-size: 12px;
      color: #86868b;
      background: #f5f5f7;
      padding: 3px 8px;
      border-radius: 10px;
      font-weight: 500;
    }

    .meta-icon {
      font-size: 12px;
      color: #c7c7cc;
      transition: all 0.3s ease;
    }
  }
}

// 空态样式：极简大气
.empty-state-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;

  .empty-svg {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #1d1d1f;
    margin: 0 0 6px 0;
  }

  .empty-subtitle {
    font-size: 14px;
    color: #86868b;
    margin: 0;
  }
}

// 分页组件包围盒：磨砂低调底座
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 45px;
}
</style>
