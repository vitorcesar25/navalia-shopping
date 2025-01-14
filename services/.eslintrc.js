module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {allowTemplateLiterals: true}],
    "max-len": ["error", {code: 180}],
    "new-cap": ["error", {"capIsNewExceptions": ["Router"]}],
  },
  overrides: [
    {
      files: ["**/*.spec.*", "**/*.test.*"], // Jest test file patterns
      env: {
        jest: true, // Add Jest environment
      },
      rules: {},
    },
  ],
  globals: {},
};
