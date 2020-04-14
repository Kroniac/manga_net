module.exports = {
    "extends": "airbnb",
    "parser": 'babel-eslint',
    rules: {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "import/prefer-default-export": "off",
        "react/prefer-stateless-function": "off",
        "no-underscore-dangle": "off",
        "react/jsx-equals-spacing": [1, "always"],
        "react/no-multi-comp": "off",
        "max-len": ["error", { "code": 110 }],
        "camelcase": ["warn"],
        "react/destructuring-assignment": ["warn"],
        "object-curly-newline": ["warn"],
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "prefer-destructuring": ["warn"],
        "react/jsx-one-expression-per-line": [0],
    },
    "env": {
        "browser": true,
        "node": true
    } 
};