"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./substrate-codegen.cjs.production.min.js")
} else {
  module.exports = require("./substrate-codegen.cjs.development.js")
}
