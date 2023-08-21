import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//element plus on need
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// import Icons from 'unplugin-icons/vite'
// import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    //element plus on need
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        // IconsResolver({
        //   prefix: 'Icon',
        // }),
      ],
    }),
    Components({
      resolvers: [
        // IconsResolver({
        //   enabledCollections: ['ep'],
        // }),
        ElementPlusResolver({ importStyle: "sass" })],
    }),

    // Icons({
    //   autoInstall: true,
    // })
  ],
  //element custom theme scss file process
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
        // additionalData: `@use "@/styles/var.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: "http://10.10.205.58:8081/",
        secure: false,
        changeOrigin: true, //this one is declare for cross
        rewrite: (path) => { return path.replace(/^\/api/, '') }
      }
    }
  }
})
