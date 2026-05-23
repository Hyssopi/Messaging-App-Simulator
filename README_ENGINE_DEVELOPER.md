# Messaging App Simulator for Engine Developers
Add custom functionalities to the game engine.  
Written in TypeScript/JavaScript, HTML, and CSS.

## Files
1. `src/model.ts`
    - Constants and types
1. `src/state.ts`
    - Shared state throughout the application
1. `src/utility.ts`
    - Miscellaneous functions unrelated to the UI
1. `src/ui.ts`
    - Functionality that controls the UI
1. `src/api.ts`
    - Wrapper around `ui.ts` that describes the fully supported API that authors can and (should only) use

## Prerequisites
`Node.js` required to build.

## Build
1. Run in command prompt:
```bash
npm install
npm run clean
npm run lint
npm run build
```
Building transpiles code from TypeScript to JavaScript, specifically outputting into the `build/dist` folder.

2. In each of the `build/dist/*.js` files, we must remove the keyword `export`, and delete the lines that have `import`.  
For example,

Before:
```js
import { MessageSpeed } from './model';
export const player = {
```
After:
```js
const player = {
```
The reason is because we code in ES6, build in ES6, but we don't want to use ES6 in the output. That is because running `index.html` locally using `module` will give CORS errors, for example:
```html
<script type="module" src="build/dist/model.js"></script>
```
We should not use `module`, which is ES6. We also want to remove `export` and `import`, which are also ES6. This way we can run `index.html` locally without having to create a server to host these files.

### Build using Node.js zip (without installing Node.js)
Running `npm run` may give an error:
```bash
'"node"' is not recognized as an internal or external command, operable program or batch file.
```
Resolve this issue using:
```bash
set PATH=%PATH%;C:\Users\t\Desktop\Main\node-v24.15.0-win-x64
```
Then:
```bash
cd C:\Users\t\Desktop\Messaging-App-Simulator
C:\Users\t\Desktop\Main\node-v24.15.0-win-x64\npm install
C:\Users\t\Desktop\Main\node-v24.15.0-win-x64\npm run clean
C:\Users\t\Desktop\Main\node-v24.15.0-win-x64\npm run lint
C:\Users\t\Desktop\Main\node-v24.15.0-win-x64\npm run build
```

## Run
Open `index.html` in a web browser (Firefox, Chrome, etc).

## Test
Enable `Unit Tests` in the settings, then go to `Jane Doe` contact to start the tests.  
Side by side demo:  
https://www.youtube.com/watch?v=4tdykQAxJmc
