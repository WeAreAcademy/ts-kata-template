/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    //With this ts-jest default preset,
    //TypeScript files (.ts, .tsx) will be transformed by ts-jest to CommonJS syntax,
    //leaving JavaScript files (.js, jsx) as-is
    //More about ts-jest presets:
    //https://kulshekhar.github.io/ts-jest/docs/getting-started/presets
    preset: "ts-jest",

    //The test environment that will be used for testing.
    //The default environment in Jest is a Node.js environment.
    //If you are building a web app, you can use a browser-like environment through jsdom instead.
    //https://jestjs.io/docs/configuration#testenvironment-string
    testEnvironment: "node",
};
