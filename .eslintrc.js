const { rules } = require("eslint-config-prettier");
const { plugins } = require("eslint-plugin-prettier/recommended");

module.exports = {
    extends: ['expo','prettier'],
    plugins,
    rules
}