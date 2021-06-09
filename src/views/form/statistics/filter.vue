<template>
    <el-dialog :visible.sync="dialogVisible" center title="筛选">
        <p>点击添加筛选项：</p>
        <el-row>
            <el-col :span="6" class="filter-left">
                <p v-for="(field,index) in fields" :key="field.id"
                   :class="{'selected':field.selected}"
                   class="filter-item-label"
                   @click="selectedFieldHandle(index,field)"
                >
                    {{
                        field.label
                    }}
                </p>
            </el-col>
            <el-col :span="18" class="filter-right">
                <data-empty v-if="!selectedFields||selectedFields.length==0" :desc="'请在左侧选择筛选项'" />
                <div v-for="field in selectedFields" :key="field.id">
                    <div class="filter-item">
                        <label>{{ field.label }}</label>
                        <div v-if="['SELECT','RADIO','CHECKBOX','IMAGE_SELECT'].includes(field.type)">
                            <p class="compare">
                                选择
                            </p>
                            <el-select v-model="filterParams[`filed${field.formItemId}`]">
                                <el-option
                                    v-for="item in field.expand.options"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.id"
                                />
                            </el-select>
                        </div>
                        <div v-else>
                            <p class="compare">
                                包含
                            </p>
                            <el-input v-model="filterParams[`filed${field.formItemId}`]" />
                        </div>
                        <i class="el-icon-delete" @click="removeSelectedFieldHandle" />
                    </div>
                    <el-divider />
                </div>
            </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button :disabled="selectedFields.length==0&&filterParams!={}" type="primary"
                       @click="submitFilterHandle"
            >确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import DataEmpty from '@/components/DataEmpty'

export default {
    name: 'StatisticsFilter',
    components: {DataEmpty},
    props: {
        fields: null
    },
    data() {
        return {
            dialogVisible: true,
            selectedFields: [],
            // 参数比较类型
            filterParamsComparison: {},
            filterParams: {}
        }
    },
    methods: {
        showDialogHandle() {
            this.dialogVisible = true
        },
        removeSelectedFieldHandle(index, item) {
            this.selectedFields.splice(index, 1)
            item.selected = false
            this.$set(this.fields, item.leftIndex, item)
        },
        submitFilterHandle() {
            this.$emit('filter', this.filterParams, this.filterParamsComparison)
            this.dialogVisible = false
        },
        selectedFieldHandle(index, item) {
            if (item.selected) {
                return
            }
            item.selected = true
            this.$set(this.fields, index, item)
            item.leftIndex = index
            if (['SELECT', 'RADIO', 'CHECKBOX', 'IMAGE_SELECT'].includes(item.type)) {
                this.filterParamsComparison[`filed${item.formItemId}`] = 'EQ'
            } else {
                this.filterParamsComparison[`filed${item.formItemId}`] = 'LIKE'
            }
            this.selectedFields.push(item)
        }
    }
}
</script>

<style lang="scss" scoped>
.filter-left {
  border-right: 1px solid #dcdfe6;

  .selected {
    color: $--color-primary !important;

    &:hover {
      cursor: none !important;
    }
  }

  .filter-item-label {
    color: #606266;
    line-height: 25px;

    &:hover {
      color: $--color-primary;
      cursor: pointer;
    }
  }

}

.filter-right {
  padding: 20px;

  .filter-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;

    & :first-child p {
      width: 100px;
    }

    .compare {
      width: 100px;
      margin: 0px;
    }

    & .el-icon-delete:hover {
      color: $--color-danger;
    }

    & > div {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}
</style>

