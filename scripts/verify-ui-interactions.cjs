/* Isolated DOM integration tests. Install tools outside the project:
 * npm install --prefix /tmp/lynksell-ui-tools --no-save jsdom@26
 * NODE_PATH=/tmp/lynksell-ui-tools/node_modules node scripts/verify-ui-interactions.cjs
 * API calls, navigation and Server Actions are fixtures; no live writes occur.
 * jsdom verifies state/events, not browser layout or performance.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html lang="id"><head><style>body{margin:0}</style></head><body><div id="root"></div></body></html>', { url: 'http://localhost:3210', pretendToBeVisual: true });
const view = dom.window;
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'File', 'Blob', 'FormData', 'MutationObserver', 'HTMLInputElement', 'HTMLTextAreaElement']) {
  Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? view : name === 'document' ? view.document : view[name] });
}
globalThis.getComputedStyle = view.getComputedStyle.bind(view);
globalThis.requestAnimationFrame = view.requestAnimationFrame.bind(view);
globalThis.cancelAnimationFrame = view.cancelAnimationFrame.bind(view);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const media = [];
function installMedia(win) {
  win.matchMedia = query => {
    const listeners = new Set();
    const result = { media: query, matches: false, addEventListener: (_, callback) => listeners.add(callback), removeEventListener: (_, callback) => listeners.delete(callback), addListener: callback => listeners.add(callback), removeListener: callback => listeners.delete(callback), dispatch(matches) { this.matches = matches; for (const callback of listeners) callback(this); } };
    media.push(result);
    return result;
  };
}
installMedia(view);
class ResizeObserverFixture {
  constructor(callback) { this.callback = callback; }
  observe(target) { this.callback([{ target, contentRect: { width: 620, height: 650 } }]); }
  disconnect() {}
  unobserve() {}
}
class IntersectionObserverFixture {
  constructor(callback, options) { this.callback = callback; this.root = options.root; }
  observe(target) { this.callback([{ target, isIntersecting: true }]); }
  disconnect() {}
  unobserve() {}
}
view.ResizeObserver = globalThis.ResizeObserver = ResizeObserverFixture;
view.IntersectionObserver = globalThis.IntersectionObserver = IntersectionObserverFixture;
const React = require('react');
const { act } = React;
const { createRoot } = require('react-dom/client');
const calls = { api: [], actions: [], routes: [], toasts: [] };
const analysis = { productName: 'Perawatan Harian', category: 'Perawatan', targetPembeli: 'Dewasa', keunggulan: ['Kemasan praktis'], harga: 'Rp 129.000' };
const copy = { headline: 'Rawat diri. Sesederhana ini.', benefits: [{ icon: 'leaf', title: 'Pilihan harian', desc: 'Untuk rutinitas Anda.' }], cta_button: 'Pesan via WhatsApp' };
const fixtures = { '/api/ai/analyze': { success: true, data: analysis }, '/api/upload': { success: true, data: { url: '/demo-product.jpg' } }, '/api/ai/generate': { success: true, data: copy }, '/api/ai/testimonials': { success: true, data: [] } };
globalThis.fetch = async (url, options) => {
  assert.ok(Object.hasOwn(fixtures, url), `Unexpected request: ${url}`);
  calls.api.push({ url, options });
  return { ok: true, json: async () => fixtures[url] };
};
const actions = new Proxy({}, { get: (_, action) => async (...args) => {
  calls.actions.push({ action, args });
  return { success: true, data: action === 'createPageAction' ? { pageId: 'qa-page' } : {} };
} });
const router = { push: url => calls.routes.push(url), refresh() {} };
const load = Module._load;
Module._load = function(request, ...args) {
  if (request.startsWith('@/app/actions/')) return actions;
  if (request === '@/lib/image-compress') return { compressImage: async () => 'data:image/png;base64,aW1hZ2U=' };
  if (request === 'next/navigation') return { useRouter: () => router };
  if (request === 'next/link') return { __esModule: true, default: ({ children, href, ...props }) => React.createElement('a', { href, ...props }, children) };
  if (request === 'next/image') return { __esModule: true, default: ({ src, alt, className, onError }) => React.createElement('img', { src, alt, className, onError }) };
  if (request === 'sonner') { const actual = load.call(this, request, ...args); return { ...actual, toast: new Proxy(actual.toast, { get: (target, method) => (...values) => { calls.toasts.push({ method, text: values[0] }); return target[method](...values); } }) }; }
  return load.call(this, request, ...args);
};
const rootPath = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) { return resolve.call(this, request.startsWith('@/') ? path.join(rootPath, request.slice(2)) : request, ...args); };
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, filename }).outputText, filename);
const { ThemePicker } = require('../components/presentation/ThemePicker.tsx');
const { WizardShell } = require('../components/wizard/WizardShell.tsx');
const { EditorShell } = require('../components/editor/EditorShell.tsx');
const { MotionSurface } = require('../components/presentation/MotionSurface.tsx');
let root;
const container = document.getElementById('root');
const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
async function mount(component) { if (root) await act(async () => root.unmount()); root = createRoot(container); await act(async () => root.render(component)); }
async function click(element) { assert.ok(element, 'Control must exist'); await act(async () => element.click()); }
function button(text) { return [...container.querySelectorAll('button')].find(element => element.textContent.includes(text)); }
async function input(element, value) {
  assert.ok(element);
  const proto = element.tagName === 'TEXTAREA' ? view.HTMLTextAreaElement.prototype : view.HTMLInputElement.prototype;
  await act(async () => { Object.getOwnPropertyDescriptor(proto, 'value').set.call(element, value); element.dispatchEvent(new Event('input', { bubbles: true })); element.dispatchEvent(new Event('change', { bubbles: true })); });
}
async function main() {
  const log = [];
  function PaletteFixture() { const [value, setValue] = React.useState('#eaff00'); return React.createElement(ThemePicker, { value, onChange: setValue }); }
  await mount(React.createElement(PaletteFixture));
  await click(button('Luxury'));
  assert.equal(button('Luxury').getAttribute('aria-pressed'), 'true');
  await click(button('Kustom'));
  assert.equal(container.querySelector('input[type=color]').value, '#eaff00', 'returning to custom preserves the existing accent');
  await input(container.querySelector('input[type=color]'), '#113344');
  assert.equal(button('Kustom').getAttribute('aria-pressed'), 'true');
  await click(button('Fresh')); await click(button('Kustom'));
  assert.equal(container.querySelector('input[type=color]').value, '#113344');
  log.push('PASS palette: presets, initial custom color, custom edits, return to previous color');

  await mount(React.createElement(WizardShell, { brandSlug: 'qa-brand' }));
  assert.equal(container.querySelector('[role=progressbar]').getAttribute('aria-valuenow'), '1');
  assert.equal(button('Lanjut Detail').disabled, true);
  const dropzone = container.querySelector('[aria-busy]');
  const invalid = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(invalid, 'dataTransfer', { value: { files: [new File(['text'], 'invalid.txt', { type: 'text/plain' })] } });
  await act(async () => { dropzone.dispatchEvent(invalid); await sleep(80); });
  assert.equal(calls.api.length, 0);
  assert.ok(document.body.textContent.includes('File harus berupa gambar'), 'invalid file feedback is visible to the user');
  const valid = new Event('drop', { bubbles: true, cancelable: true });
  Object.defineProperty(valid, 'dataTransfer', { value: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] } });
  await act(async () => { dropzone.dispatchEvent(valid); await sleep(20); });
  assert.equal(calls.api.filter(call => call.url === '/api/ai/analyze').length, 1);
  assert.ok(container.querySelector('img[alt="Pratinjau foto produk yang diunggah"]'));
  assert.equal(button('Lanjut Detail').disabled, false);
  await click(button('Lanjut Detail'));
  assert.equal(container.querySelector('[role=progressbar]').getAttribute('aria-valuenow'), '2');
  await input(container.querySelector('#whatsappNumber'), '081234567890');
  assert.equal(container.querySelector('#whatsappNumber').value, '6281234567890');
  await input(container.querySelector('#harga'), '129000');
  await click(button('Luxury'));
  assert.equal(button('Generate Halaman Sekarang').disabled, false);
  await click(button('Kembali'));
  assert.ok(container.querySelector('img[alt="Pratinjau foto produk yang diunggah"]'));
  await click(button('Lanjut Detail'));
  assert.equal(container.querySelector('#whatsappNumber').value, '6281234567890');
  await click(button('Generate Halaman Sekarang'));
  await act(async () => sleep(30));
  assert.deepEqual(calls.api.map(call => call.url), ['/api/ai/analyze', '/api/upload', '/api/ai/generate', '/api/ai/testimonials']);
  const create = calls.actions.filter(call => call.action === 'createPageAction');
  assert.equal(create.length, 1, 'generation submits exactly once');
  assert.equal(create[0].args[0].colorScheme, 'luxury');
  assert.equal(create[0].args[0].whatsappNumber, '6281234567890');
  await act(async () => sleep(1550));
  assert.deepEqual(calls.routes, ['/dashboard/qa-page/edit']);
  log.push('PASS wizard: invalid/valid drop, analysis, preview, three steps, back/forward state, single generation and redirect (all APIs/actions mocked)');

  const before = calls.actions.length;
  await mount(React.createElement(EditorShell, { pageData: { id: 'qa-page', brandName: 'ruang.', productName: 'Perawatan Harian', status: 'draft', colorScheme: 'elegant', copyData: copy } }));
  await click(button('Pratinjau'));
  assert.equal(button('Pratinjau').getAttribute('aria-pressed'), 'true');
  const iframe = container.querySelector('iframe');
  const frameDoc = iframe.contentDocument;
  installMedia(frameDoc.defaultView);
  frameDoc.defaultView.IntersectionObserver = IntersectionObserverFixture;
  frameDoc.open(); frameDoc.write(iframe.getAttribute('srcdoc')); frameDoc.close();
  const scrolls = [];
  frameDoc.defaultView.HTMLElement.prototype.scrollIntoView = function() { scrolls.push(this.id); };
  await act(async () => { iframe.dispatchEvent(new Event('load')); await sleep(20); });
  assert.ok(frameDoc.querySelector('h1').textContent.includes(copy.headline));
  assert.ok(frameDoc.head.querySelector('[data-preview-style]'));
  const anchor = frameDoc.querySelector('a[href="#keunggulan"]');
  const event = new frameDoc.defaultView.MouseEvent('click', { bubbles: true, cancelable: true });
  await act(async () => anchor.dispatchEvent(event));
  assert.equal(event.defaultPrevented, true);
  assert.deepEqual(scrolls, ['keunggulan']);
  const skip = frameDoc.querySelector('.product-skip');
  await act(async () => skip.dispatchEvent(new frameDoc.defaultView.MouseEvent('click', { bubbles: true, cancelable: true })));
  assert.equal(frameDoc.activeElement, frameDoc.getElementById('product-content'), 'skip navigation transfers keyboard focus');
  const buttons = [...container.querySelectorAll('button')];
  await click(buttons.find(item => item.textContent === 'Desktop'));
  assert.equal(iframe.title, 'Pratinjau desktop');
  await click(button('Sunting halaman'));
  await input(container.querySelector('#edit-productName'), 'Nama produk baru');
  await act(async () => sleep(550));
  assert.ok(frameDoc.body.textContent.includes('Nama produk baru'));
  await click(button('3. Tema'));
  await click(button('Luxury'));
  await act(async () => sleep(550));
  assert.equal(frameDoc.querySelector('.product-page').dataset.theme, 'luxury');
  assert.equal(calls.actions.length, before, 'editing preview makes no persistence calls');
  log.push('PASS editor: mobile tabs, iframe styles/content, internal anchors, desktop switch, debounced text/theme updates without saving');

  await mount(React.createElement(MotionSurface, null, React.createElement('p', { 'data-reveal': true, className: 'reveal' }, 'Visible content')));
  await act(async () => { for (const entry of media) entry.dispatch(true); });
  assert.equal(container.querySelector('[data-reveal]').dataset.pending, 'false');
  log.push('PASS reduced motion: reveal stays visible after preference changes');
  await act(async () => root.unmount());
  dom.window.close();
  console.log(log.join('\n'));
}
main().catch(async error => { console.error(error); if (root) await act(async () => root.unmount()); dom.window.close(); process.exitCode = 1; });
