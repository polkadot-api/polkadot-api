"use strict"

if (process.env.NODE_ENV === "production") {
  module.exports = require("./substrate-client.cjs.production.min.js")
} else {
  module.exports = require("./substrate-client.cjs.development.js")
}
