import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const LOCAL = 'http://localhost:8081/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias:{
        '@': '/src/',
        '@components': '/src/components/',
        '@assets': '/src/assets/'
    }
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
