module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
}
