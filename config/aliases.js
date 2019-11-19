const path = require("path");

module.exports = {
  "@src": path.resolve("src/"),
  "@commonViews": path.resolve("src/views/common"),
  "@axios": path.resolve("src/config/axios"),
  "@UI": path.resolve("src/views/UI"),
  "@views": path.resolve("src/views/"),
  "@DUI": path.resolve("src/views/Dashboard"),
  "@act": path.resolve("src/common/store/action"),
  "@store": path.resolve("src/common/store/index"),
  "@utils": path.resolve("src/common/utils"),
  "@msg": path.resolve("src/common/messages")
};
