"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./sc-provider.cjs.production.min.js")
} else {
  module.exports = require("./sc-provider.cjs.development.js")
}
