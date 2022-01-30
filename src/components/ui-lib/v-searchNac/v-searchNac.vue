<template>
  <div class="vSearchBoxs" :style="'width:' + width + ';'">
    <div
      class="inputLabel"
      :style="'width:' + (label ? labelwidth : '30px') + ';'"
    >
      {{ label ? label + "：" : "" }}
    </div>
    <div style="width: 100px">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'vSearchNav',
  props: {
    /**
     * @desc 搜索框文字前缀的宽度
     */
    labelwidth: {
      type: [String, Number],
      default: () => {
        return '80px'
      }
    },
    /**
     * @desc 整个搜索框的宽度
     */
    width: {
      type: [String, Number],
      default: () => {
        return '240px'
      }
    },
    /**
     * @desc 文本内容
     */
    label: {
      type: [String, Number],
      default: () => {
        return ''
      }
    }
  }
}
</script>

<style lang="less">
.vSearchBoxs {
  padding: 5px 0;
  display: flex;
  align-items: center;
  .inputLabel {
    text-align: end;
  }
  .el-input__inner {
    height: 30px;
    // width: 180px;
  }
  input {
    height: 30px;
  }
  .el-input__icon {
    line-height: 30px;
  }
}
</style>
