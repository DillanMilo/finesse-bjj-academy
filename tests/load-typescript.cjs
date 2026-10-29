const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
module.exports = function createLoader(overrides = {}) {
  const cache = new Map();
  const context = vm.createContext({ console, URL, URLSearchParams, Request, Response, Headers, AbortSignal, setTimeout, clearTimeout, Date, process: { env: {} }, ...overrides });
  function load(relative) {
    const file = path.resolve(root, relative);
    if (cache.has(file)) return cache.get(file).exports;
    const loadedModule = { exports: {} };
    cache.set(file, loadedModule);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
    const localRequire = name => name.endsWith('.json') ? JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), name), 'utf8')) : name.startsWith('@/') ? load(`src/${name.slice(2)}.ts`) : require(name);
    vm.runInContext(`(function(exports,require,module){${code}\n})`, context, { filename: file })(loadedModule.exports, localRequire, loadedModule);
    return loadedModule.exports;
  }
  return { load, context };
};
