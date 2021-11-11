"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./scale-codec.cjs.production.min.js")
} else {
  module.exports = require("./scale-codec.cjs.development.js")
}
