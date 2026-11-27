import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { Script, createContext } from "node:vm";
import ts from "typescript";

const loadPackage = createRequire(import.meta.url);

export function loadModule(file, globals = {}, modules = {}) {
  const output = ts.transpileModule(readFileSync(resolve(file), "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const exports = {};
  const context = createContext({
    module: { exports },
    exports,
    require: (name) =>
      Object.hasOwn(modules, name) ? modules[name] : loadPackage(name),
    AbortController,
    setTimeout,
    clearTimeout,
    ...globals,
  });
  new Script(output, { filename: file }).runInContext(context);
  return context.module.exports;
}
