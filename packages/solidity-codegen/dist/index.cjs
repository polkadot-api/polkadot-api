"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./solidity-codegen.cjs.production.min.js")
} else {
  module.exports = require("./solidity-codegen.cjs.development.js")
}
