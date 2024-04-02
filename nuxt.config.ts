// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "@pinia/nuxt"],
  pages: true,
  app: {
    head: {
      htmlAttrs: { class: "dark" },
    },
  },
  css: ["~/assets/css/main.styl", "~/assets/css/app.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
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
