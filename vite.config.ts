import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const LOCAL = 'http://localhost:8081/'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'

// import styleImport from 'vite-plugin-style-import'
// import ViteComponents, { ElementPlusResolver } from 'vite-plugin-components'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ViteComponents from 'unplugin-vue-components/vite';
// 使用你所使用的UI组件库的 resolver
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        ViteComponents({
            resolvers: [ AntDesignVueResolver() ]
        }),
        // AutoImport({
        //     resolvers: [ElementPlusResolver()],
        // }),
        // Components({
        //     resolvers: [ElementPlusResolver()],
        // }),
    ],
    resolve: {
        alias: {
            '@': '/src/',
            '@components': '/src/components/',
            '@assets': '/src/assets/',
            '@static': '/public/static',
        },
    },
    build: {
        assetsDir: 'static/img/',
        rollupOptions: {
            output: {
                chunkFileNames: 'static/js/[name]-[hash].js',
                entryFileNames: 'static/js/[name]-[hash].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                // 解决打包时Some chunks are larger警告
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString()
                    }
                },
            },
        },
    },
    server: {
        port: 3077,
        open: true,
        proxy: {
            '/api': {
                target: LOCAL,
                rewrite: path => path.replace(/^\/api/, ''),
                changeOrigin: true,
            }
        }
    }
})
