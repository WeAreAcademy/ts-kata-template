/* eslint-env node */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    plugins: ["@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    root: true,
    rules: {
        "@typescript-eslint/no-unused-vars": "off",
    },
};

//More detail about this eslint setup for TypeScript
//https://typescript-eslint.io/getting-started/
//https://typescript-eslint.io/linting/typed-linting
