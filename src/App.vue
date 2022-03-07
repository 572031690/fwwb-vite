<template lang="pug">
el-config-provider(:locale="locale") 
    #app
        transition(:name="animateName")
            router-view.view
</template>

<script lang="ts">
import { ElConfigProvider } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { pathList } from '@/router/getRouter'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
export default {
    name: 'app',
    components: {
      ElConfigProvider,// 汉化element-plus
    },
    setup() {
        const router = useRouter()
        pathList.unshift('/')
        const animateName = ref('slide-left')
        //监听路由的路径，可以通过不同的路径选择不同的切换效果
        router.beforeEach((to,from,next) => {
            const prevPath = from.path;
            const nextPath = to.path;
            const prevIndex = pathList.findIndex(val=>prevPath === val);//前一个路由的索引
            const nextIndex = pathList.findIndex(val=>nextPath === val);//当前点击路由的索引
            if(prevIndex < nextIndex){
                animateName.value = 'slide-left'
            }
            else{
                animateName.value = 'slide-right'
            }
            next();
        })
        return {
            animateName,
            locale: zhCn // 汉化
        }
    },
    
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
.view {
    transition: all 1s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter-from{
    opacity: 0;
    transform: translate(-50%)
}
.slide-left-leave-to{
    opacity: 0;
    transform: translate(-50%)
}
.slide-left-enter-to {
    opacity: 1;
    transform: translate(0)
}
.slide-left-leave-from {
    opacity: 1;
    transform: translate(0)
}

.slide-right-enter-from{
    opacity: 0;
    transform: translate(50%)
}
.slide-right-leave-to{
    opacity: 0;
    transform: translate(50%)
}
.slide-right-enter-to {
    opacity: 1;
    transform: translate(0)
}
.slide-right-leave-from {
    opacity: 1;
    transform: translate(0)
}

</style>