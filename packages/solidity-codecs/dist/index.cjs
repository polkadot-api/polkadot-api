"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./solidity-codecs.cjs.production.min.js")
} else {
  module.exports = require("./solidity-codecs.cjs.development.js")
}
