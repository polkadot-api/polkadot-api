"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./provider.cjs.production.min.js")
} else {
  module.exports = require("./provider.cjs.development.js")
}
