<template lang="pug">
el-config-provider(:locale="locale")
    #app
        router-view
</template>

<script lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export default {
    name: 'app',
    components: {
      ElConfigProvider,// 汉化element-plus
    },
    setup() {
        return {
            locale: zhCn
        }
    }
}
</script>
<style lang="stylus">
@import './styles/base.styl'
*
    // box-sizing border-box
    margin 0
    padding 0
#app
    width 100%
    height 100%
</style>