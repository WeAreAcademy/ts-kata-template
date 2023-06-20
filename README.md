# TypeScript Kata Template

## To install dependencies

```
yarn
```

## To run all tests

```
yarn test
```

## To run all tests each time you save a change

```
yarn test --watchAll
```

## To compile for codewars

_Some_ codewars katas support typescript. Others only support JS submissions.

Here's how to compile one stand-alone .ts file into .js for the latter type of kata.

You will first need to alter `make-js-for-one` in package.json to refer to the file you want compiled.

then:

```
yarn make-js-for-one
```

your output .js will be generated into a new folder `generatedJS`.

⚠️ Delete this folder when you're done to avoid confusion!

### alternatively, use `tsc` directly

You don't need to use the make-js-for-one convenience command. Instead:

```
yarn tsc src/myGreatFile.ts --outDir generatedJS
```

but you might get tired of typing that!

## license

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a>

> This is part of Academy's technical curriculum for **The Mark**. All parts of that curriculum, including this project, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>
