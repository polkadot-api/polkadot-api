"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./ws-provider.cjs.production.min.js")
} else {
  module.exports = require("./ws-provider.cjs.development.js")
}
