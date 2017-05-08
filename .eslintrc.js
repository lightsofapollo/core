/* @flow */
module.exports = {
  "parser": "babel-eslint",
  "rules": {
    "strict": 0,
    "comma-dangle": ["error", "always",],
    "react/require-render-return": 1,
    "react/prefer-stateless-function": [2, {
      "ignorePureComponents": true,
    },],
    "react/jsx-indent-props": [2, 2,],
    "react/jsx-max-props-per-line": [1, {
      "when": "multiline",
    },],
    "flowtype/require-valid-file-annotation": [
      2,
      "always",
    ],
  },
 "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:flowtype/recommended",
  ],
  "plugins": [
    "react",
    "flowtype",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
  },
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true,
  },
};
