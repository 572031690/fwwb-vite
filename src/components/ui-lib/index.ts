import CountTo from './count-to/CountTo.vue'
import vNone from './v-noneData/v-noneData.vue'
import vDialog from './v-dialog/v-dialog.vue'
import vSearchNav from './v-searchNac/v-searchNac.vue'
import vDrawer from './v-drawer/v-drawer.vue'

const UILib  = {
  install (Vue:any) {
    Vue.component('CountTo', CountTo)
    Vue.component('vNone', vNone)
    // Vue.component('vDialog', vDialog)
    Vue.component('vSearchNav', vSearchNav)
    Vue.component('vDrawer', vDrawer)
  }
}

export default UILib