import { defineConfig } from 'vite'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {}
      }
    }
  },
  // 设置包引入的别名
  resolve: {
    alias: [{
      find: /^~/,
      replacement: path.resolve(__dirname, "src")
    }]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com/',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    },
    hmr: true
  }
})
