module.exports = {
    env: {
        node: true,
        es6: true,
        jest: true
    },
    extends: "eslint:recommended",
    rules: {
        "no-var": "error",
        "prefer-const": "error",
        "no-multiple-empty-lines": "error"
    }
}