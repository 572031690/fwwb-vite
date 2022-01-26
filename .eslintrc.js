module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es2021: true,
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        "ecmaVersion": 13,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    plugins: [
        "vue",
        "@typescript-eslint"
    ],
    extends: [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended"
    ],
    rules: {
        'no-var': 'error',
        "@typescript-eslint/no-var-requires": 0,
        "no-useless-constructor": "off",
        'no-extra-semi': 'error',
        "@typescript-eslint/indent": ["error", 4, { "VariableDeclarator": 4, "SwitchCase": 1 }],
        "@typescript-eslint/no-unused-vars": ["error", {
            "vars": "all",
            "args": "none",
            "ignoreRestSiblings": true
        }],
        "@typescript-eslint/explicit-member-accessibility": ["error", {"accessibility": "no-public"}],
        "@typescript-eslint/explicit-function-return-type": ["off", {
            "allowExpressions": true,
            "allowTypedFunctionExpressions": true
        }],
        "@typescript-eslint/interface-name-prefix": 0,
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-parameter-properties": 0,
        "@typescript-eslint/camelcase": ["off", {"properties": "always"}],
        "no-console": "off",
        "eqeqeq": ["warn", "always"]
    }
    
}
  