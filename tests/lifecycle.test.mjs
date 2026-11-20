import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { Script, createContext } from 'node:vm';
import { test } from 'node:test';
import React from 'react';
import { renderToString } from 'react-dom/server';
import ts from 'typescript';

const loadPackage = createRequire(import.meta.url);
function loadModule(file, globals = {}, modules = {}) {
  const output = ts.transpileModule(readFileSync(resolve(file), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  const context = createContext({
    module: { exports }, exports,
    require: (name) => Object.hasOwn(modules, name) ? modules[name] : loadPackage(name),
    ...globals,
  });
  new Script(output, { filename: file }).runInContext(context);
  return context.module.exports;
}
function browserFixture() {
  const listeners = new Map();
  const intervals = new Map();
  let nextId = 0;
  const window = {
    addEventListener(name, callback) { listeners.set(name, callback); },
    removeEventListener(name, callback) { if (listeners.get(name) === callback) listeners.delete(name); },
    setInterval(callback, delay) { intervals.set(++nextId, { callback, delay }); return nextId; },
    clearInterval(id) { intervals.delete(id); },
    innerHeight: 500, scrollY: 0,
  };
  return { window, listeners, intervals };
}

test('SSR uses stable placeholders without invoking browser-only reads', () => {
  const client = loadModule('src/lib/utils/client-snapshot.ts');
  const chat = loadModule('src/lib/utils/chatwoot.ts');
  let reads = 0;
  function Fixture() {
    const hint = client.useClientSnapshot(() => { reads += 1; throw new Error('Browser read during SSR'); });
    const hydrated = client.useHasHydrated();
    const dark = client.useThemeSnapshot();
    const ready = chat.useChatwootReady();
    return React.createElement('div', {
      'data-hint': String(hint), 'data-hydrated': String(hydrated),
      'data-dark': String(dark), 'data-ready': String(ready),
    });
  }
  const html = renderToString(React.createElement(Fixture));
  assert.equal(reads, 0);
  assert.match(html, /data-hint="null"/);
  assert.match(html, /data-hydrated="false"/);
  assert.match(html, /data-dark="null"/);
  assert.match(html, /data-ready="false"/);
});

test('Chatwoot readiness handles preloaded SDK, late events and cleanup', () => {
  const fixture = browserFixture();
  const chat = loadModule('src/lib/utils/chatwoot.ts', { window: fixture.window });
  let changes = 0;
  const cleanup = chat.subscribeToChatwoot(() => { changes += 1; }, 500);
  assert.equal(fixture.intervals.size, 1);
  fixture.listeners.get('chatwoot:ready')();
  assert.equal(changes, 0, 'A premature event does not establish SDK availability');
  assert.equal(fixture.intervals.size, 1);
  fixture.window.$chatwoot = { toggle() {} };
  fixture.listeners.get('chatwoot:ready')();
  assert.equal(changes, 1);
  assert.equal(fixture.intervals.size, 0);
  cleanup();
  assert.equal(fixture.listeners.size, 0);
  const cleanupPreloaded = chat.subscribeToChatwoot(() => { changes += 1; }, 500);
  assert.equal(fixture.intervals.size, 0, 'No polling is needed for an already-loaded SDK');
  cleanupPreloaded();
  assert.equal(fixture.listeners.size, 0);
});

test('Chatwoot fallback polling stops when ready and on unmount', () => {
  const fixture = browserFixture();
  const chat = loadModule('src/lib/utils/chatwoot.ts', { window: fixture.window });
  let changes = 0;
  const cleanup = chat.subscribeToChatwoot(() => { changes += 1; }, 400);
  const timer = [...fixture.intervals.values()][0];
  assert.equal(timer.delay, 400);
  timer.callback();
  assert.equal(changes, 0);
  fixture.window.$chatwoot = { toggle() {} };
  timer.callback();
  assert.equal(changes, 1);
  assert.equal(fixture.intervals.size, 0);
  cleanup();
  delete fixture.window.$chatwoot;
  const pendingCleanup = chat.subscribeToChatwoot(() => { changes += 1; }, 400);
  pendingCleanup();
  assert.equal(fixture.intervals.size, 0);
  assert.equal(fixture.listeners.size, 0);
});

test('theme observation targets the document class and disconnects', () => {
  const html = {};
  const observers = [];
  let notifications = 0;
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target, options) { this.target = target; this.options = options; }
    disconnect() { this.disconnected = true; }
  }
  const client = loadModule('src/lib/utils/client-snapshot.ts', { MutationObserver: Observer, document: { documentElement: html } });
  const cleanup = client.subscribeToTheme(() => { notifications += 1; });
  const observer = observers[0];
  assert.equal(observer.target, html);
  assert.equal(observer.options.attributeFilter[0], 'class');
  observer.callback();
  assert.equal(notifications, 1);
  cleanup();
  assert.equal(observer.disconnected, true);
});

test('engagement clock starts in the effect and milestones fire once per path', () => {
  const fixture = browserFixture();
  const effects = [];
  const refs = [];
  const scrollEvents = [];
  const timeEvents = [];
  let index = 0;
  let pathname = '/first';
  let now = 0;
  let rendering = true;
  const tracker = loadModule('src/lib/analytics/engagement-tracker.tsx', {
    window: fixture.window,
    document: { documentElement: { scrollHeight: 1000 } },
    Date: { now() { assert.equal(rendering, false, 'Clock reads must not happen during render'); return now; } },
  }, {
    react: { useRef(value) { const position = index++; refs[position] ??= { current: value }; return refs[position]; }, useEffect(effect) { effects.push(effect); } },
    'next/navigation': { usePathname: () => pathname },
    './constants': loadModule('src/lib/analytics/constants.ts'),
    './events': { trackScrollDepth: (...args) => scrollEvents.push(args), trackTimeOnPage: (...args) => timeEvents.push(args) },
  });
  tracker.EngagementTracker();
  rendering = false;
  const cleanup = effects.pop()();
  fixture.window.scrollY = 375;
  fixture.listeners.get('scroll')();
  fixture.listeners.get('scroll')();
  assert.deepEqual(scrollEvents, [[25, '/first'], [50, '/first'], [75, '/first']]);
  now = 60000;
  [...fixture.intervals.values()][0].callback();
  [...fixture.intervals.values()][0].callback();
  assert.deepEqual(timeEvents, [[30, '/first'], [60, '/first']]);
  cleanup();
  assert.equal(fixture.intervals.size, 0);
  assert.equal(fixture.listeners.size, 0);
  pathname = '/second'; index = 0; rendering = true;
  tracker.EngagementTracker();
  rendering = false;
  const nextCleanup = effects.pop()();
  now = 90000;
  [...fixture.intervals.values()][0].callback();
  assert.deepEqual(timeEvents.at(-1), [30, '/second']);
  nextCleanup();
});
