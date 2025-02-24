module.exports = {
  collectCoverage: true,
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      diagnostics: false
    },
  },
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/project/.polywrap"
  ],
  transformIgnorePatterns: [
    "<rootDir>/src/__tests__/project/.polywrap"
  ],
  setupFilesAfterEnv: ["./jest.setup.js"],
  testMatch: ["**/build-rs.spec.ts"],
  modulePathIgnorePatterns: [],
};
