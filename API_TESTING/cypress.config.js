const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "webpack",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      
    },
  },
});
