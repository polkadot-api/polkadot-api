"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./solidity-bindings.cjs.production.min.js")
} else {
  module.exports = require("./solidity-bindings.cjs.development.js")
}
