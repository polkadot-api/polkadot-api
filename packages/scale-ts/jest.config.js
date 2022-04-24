module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["node_modules", ".deno"],
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
}
