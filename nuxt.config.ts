// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt"],
  pages: true,
  app: {
    head: {
      htmlAttrs: { class: "dark" },
    },
  },
  css: [
    "~/assets/css/main.styl",
    "~/assets/css/app.css",
    "element-plus/theme-chalk/index.css",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/element/index.scss" as element;`,
        },
      },
    },
  },
  elementPlus: {
    icon: "ElIcon",
    importStyle: "scss",
    themes: ["dark"],
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "https://blog.api.bloniea.com/v1",
        // target: "http://localhost:3001/v1/",
        changeOrigin: true,
      },
    },
  },
})
