/* Run: node scripts/verify-ui.cjs. Uses only existing React/TypeScript dependencies.
 * Server-render matrix verifies optional content, safe icons, and CTA contracts.
 * Browser layout / Lighthouse are separate checks; this is not a substitute.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...args);
};
for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => {
    module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true }, filename,
    }).outputText, filename);
  };
}
// Keep the matrix independent of Next's request/config context. ProductImage still
// executes; only the framework's image optimizer boundary is replaced.
const load = Module._load;
Module._load = function(request, ...args) {
  if (request === 'next/image') return { __esModule: true, default: ({ src, alt, className }) => React.createElement('img', { src, alt, className }) };
  return load.call(this, request, ...args);
};
const { LandingPageRenderer } = require('../components/landing/LandingPageRenderer.tsx');
const { productTheme, normalizeHex, relativeLuminance, cleanCopy, PRODUCT_THEMES } = require('../lib/presentation.ts');
const fixture = {
  brandName: 'Ruang Rasa', productName: 'Kopi Pagi', harga: 'Rp 85.000',
  productImageUrl: '/product-fixture.jpg', whatsappNumber: '+62 812-3456-7890',
  copyData: {
    headline: 'Ritual kecil. Hari yang baik.', subheadline: 'Kopi pilihan untuk jeda Anda.',
    pain_points: ['Rasa kopi yang tidak konsisten?', 'Ingin pagi yang lebih tenang?'],
    solution_intro: 'Nikmati setiap jeda.',
    benefits: [{ icon: 'leaf', title: 'Dipilih dengan teliti', desc: 'Biji pilihan untuk rasa seimbang.' }, { icon: 'ShieldCheck', title: 'Kualitas terjaga', desc: 'Dikemas segar.' }, { icon: 'truck', title: 'Dikirim ke rumah', desc: 'Siap menemani pagi Anda.' }, { icon: '__proto__', title: 'Ikon aman', desc: 'Fallback Sparkles.' }],
    urgency_text: 'Batch minggu ini tersedia.', cta_button: 'Pesan kopi', whatsapp_message: 'Halo, saya ingin Kopi Pagi & informasi pengiriman.',
  },
  testimonials: [{ name: 'Nadia', location: 'Bandung', rating: 5, text: 'Enak untuk teman pagi.', source: 'ai' }, { text: 'Pilihan favorit.', rating: 0 }, { text: 'Rating tetap aman.', rating: 999 }],
};
const render = page => renderToStaticMarkup(React.createElement(LandingPageRenderer, { page }));
let cases = 0;
for (const colorScheme of ['elegant', 'bold', 'fresh', 'luxury', '#eaff00', '#fff', '#111111', '#68a4ce', 'invalid']) {
  const full = render({ ...fixture, colorScheme });
  for (const id of ['ringkasan', 'keunggulan', 'ulasan']) assert.ok(full.includes(`id="${id}"`));
  const images = [...full.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual([...new Set(images)], [fixture.productImageUrl], 'one source reused across hero and showcase');
  const links = [...full.matchAll(/href="(https:\/\/wa\.me\/[^\"]+)"/g)].map(m => m[1]);
  assert.equal(links.length, 4, 'nav, hero, closing and mobile CTA');
  assert.equal(new Set(links).size, 1);
  assert.ok(links[0].includes('6281234567890?text=' + encodeURIComponent(fixture.copyData.whatsapp_message)));
  assert.equal((full.match(/Ulasan contoh/g) || []).length, 1);
  assert.ok(full.includes('0 dari 5 bintang'));
  assert.ok(full.includes('5 dari 5 bintang'));
  assert.ok(full.includes('lucide-sparkles'), 'unknown icon resolves to safe fallback');
  const minimal = render({ colorScheme });
  for (const id of ['ringkasan', 'keunggulan', 'ulasan']) assert.ok(!minimal.includes(`id="${id}"`));
  assert.ok(!minimal.includes('wa.me') && !minimal.includes('<img') && !minimal.includes('<h1'));
  const partial = render({ colorScheme, copyData: { benefits: [{}], pain_points: [' ', '✨'] }, testimonials: [{}], harga: 'Rp 50.000' });
  assert.ok(partial.includes('Rp 50.000') && !partial.includes('id="keunggulan"') && !partial.includes('id="ulasan"'));
  const theme = productTheme(colorScheme);
  if (normalizeHex(colorScheme)) {
    const background = relativeLuminance(normalizeHex(colorScheme));
    const foreground = relativeLuminance(theme.style['--product-on-accent']);
    const contrast = (Math.max(background, foreground) + 0.05) / (Math.min(background, foreground) + 0.05);
    assert.ok(contrast >= 4.5, `${colorScheme} contrast ${contrast}`);
    assert.deepEqual(Object.keys(theme.style).sort(), ['--product-accent', '--product-on-accent']);
  }
  cases += 3;
}
// Theme swatches and renderer share a single palette definition. Verify AA for
// default text, muted text, and each preset's action, including luxury surfaces.
const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
for (const theme of PRODUCT_THEMES) {
  assert.ok(css.includes(theme.accent));
  const onAccent = theme.id === 'luxury' ? '#111112' : '#ffffff';
  const a = relativeLuminance(theme.accent), b = relativeLuminance(onAccent);
  assert.ok((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5);
  for (const [ink, bg] of theme.id === 'luxury'
    ? [['#f5f5f7', '#111112'], ['#b2b2b8', '#222224']]
    : [['#1d1d1f', '#ffffff'], ['#656569', '#f5f5f7']]) {
    const x = relativeLuminance(ink), y = relativeLuminance(bg);
    assert.ok((Math.max(x, y) + .05) / (Math.min(x, y) + .05) >= 4.5);
  }
}
const benefitsOnly = render({ copyData: { benefits: [{ title: 'Manfaat pilihan' }] } });
assert.ok(benefitsOnly.includes('<h1') && !benefitsOnly.includes('<h3'), 'sparse benefits keep heading order');
const reviewsOnly = render({ testimonials: [{ text: 'Ulasan pilihan' }] });
assert.ok(reviewsOnly.includes('<h1'), 'reviews without hero still have a page heading');
const brandOnly = render({ brandName: 'Brand' });
assert.ok(!brandOnly.includes('href="#ringkasan"'), 'brand link never targets a missing hero');
assert.equal(cleanCopy('✨ Bersih ❌'), 'Bersih');
assert.equal(productTheme('#invalid').name, 'elegant');
assert.ok(!render({ whatsappNumber: '---' }).includes('wa.me'));
console.log(`PASS: ${cases} server-render cases; presets + custom hex; optional sections; single image source; WA links; icons; AI labels; AA palette contrast.`);

// Optional standalone visual handoff. It contains static examples, not app auth,
// editable content, or live actions. Build first so production CSS is available.
if (process.argv.includes('--review')) {
  const output = process.argv[process.argv.indexOf('--review') + 1] || '/tmp/lynksell-ui-review.html';
  const chunks = path.join(root, '.next/static/chunks');
  let css = fs.readdirSync(chunks).filter(file => file.endsWith('.css')).map(file => fs.readFileSync(path.join(chunks, file), 'utf8')).join('\n');
  assert.ok(css.includes('product-hero'), 'Build before generating the review');
  css = css.replace(/url\(([^)]+\.woff2)\)/g, (match, url) => {
    const font = path.join(root, '.next/static/media', path.basename(url.replace(/["']/g, '')));
    return fs.existsSync(font) ? `url(data:font/woff2;base64,${fs.readFileSync(font).toString('base64')})` : match;
  });
  const imageData = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(root, 'public/demo-product.jpg')).toString('base64');
  const visualFixture = {
    ...fixture, brandName: 'ruang.', productName: 'Perawatan Harian', harga: 'Rp 129.000', productImageUrl: '__DEMO_IMAGE__',
    copyData: {
      headline: 'Rawat diri. Sesederhana ini.', subheadline: 'Ruang kecil untuk rutinitas yang Anda sukai. Kenali produk pilihan untuk keseharian Anda.',
      pain_points: ['Rutinitas terasa terlalu rumit?', 'Ingin lebih banyak waktu untuk diri sendiri?'],
      solution_intro: 'Sedikit langkah. Lebih banyak ruang.',
      benefits: [{ icon: 'leaf', title: 'Pilihan yang dipikirkan.', desc: 'Detail produk dijelaskan dengan jernih, supaya Anda bisa memilih dengan nyaman.' }, { icon: 'shield-check', title: 'Beli dengan tenang.', desc: 'Tanyakan detail dan kebutuhan Anda langsung kepada penjual.' }, { icon: 'truck', title: 'Sampai ke rumah.', desc: 'Diskusikan pilihan pengiriman lewat WhatsApp.' }],
      urgency_text: 'Tanyakan ketersediaan kepada penjual.', cta_button: 'Pesan via WhatsApp', whatsapp_message: 'Halo, saya tertarik dengan Perawatan Harian.',
    },
    testimonials: [{ name: 'Nadia', location: 'Bandung', rating: 5, text: 'Informasinya jelas dan mudah untuk bertanya langsung.', source: 'ai' }, { name: 'Rani', location: 'Jakarta', rating: 4, text: 'Halaman yang rapi. Pilihan produknya mudah dilihat.', source: 'ai' }],
  };
  const pages = {};
  for (const theme of ['elegant', 'bold', 'fresh', 'luxury', '#eaff00']) {
    for (const data of ['full', 'minimal']) {
      const page = data === 'full' ? { ...visualFixture, colorScheme: theme } : { brandName: 'ruang.', productName: 'Perawatan Harian', colorScheme: theme, whatsappNumber: visualFixture.whatsappNumber };
      pages[theme + ':' + data] = render(page).replace(/<img /g, '<img style="position:absolute;inset:0;width:100%;height:100%" ');
    }
  }
  const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>LynkSell — Review UI</title><style>body{margin:0;background:#eaeaee;color:#1d1d1f;font:14px Arial,sans-serif}header{padding:20px;background:#fff;border-bottom:1px solid #ddd}h1{font-size:20px;letter-spacing:-.5px;margin:0 0 8px}p{font-size:12px;color:#656569;line-height:1.6}nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px}label{display:flex;align-items:center;gap:8px;font-size:12px}select,input{min-height:44px;border:1px solid #ccc;border-radius:12px;background:white;padding:0 12px;color:#1d1d1f}#stage{display:flex;justify-content:center;padding:20px;overflow:hidden}#canvas{position:relative}iframe{border:1px solid #c5c5ca;border-radius:24px;background:#fff;transform-origin:top left;display:block}:focus-visible{outline:3px solid #4338b8;outline-offset:3px}</style></head><body><header><h1>LynkSell / Review halaman produk</h1><p>Contoh statis dengan CSS produksi. Semua tema memakai satu sumber foto. Ulasan contoh diberi label. Pemeriksaan visual dan Lighthouse belum dilakukan. Link eksternal dinonaktifkan dalam artefak ini.</p><nav aria-label="Kontrol review"><label>Tema<select id="theme"><option>elegant</option><option>bold</option><option>fresh</option><option>luxury</option><option value="#eaff00">Kustom</option></select></label><label>Warna<input id="color" type="color" value="#eaff00"></label><label>Data<select id="data"><option value="full">Lengkap</option><option value="minimal">Minimal</option></select></label><label>Lebar<select id="width"><option value="390">HP · 390px</option><option value="360">HP · 360px</option><option value="768">Tablet · 768px</option><option value="1280">Desktop · 1280px</option></select></label><span id="status" role="status" style="font-size:12px;color:#656569"></span></nav></header><div id="stage"><div id="canvas"><iframe title="Pratinjau tema produk"></iframe></div></div><script>
const pages=${json(pages)},css=${json(css)},photo=${json(imageData)};
const frame=document.querySelector('iframe'),theme=document.querySelector('#theme'),data=document.querySelector('#data'),width=document.querySelector('#width'),color=document.querySelector('#color'),status=document.querySelector('#status');
function resize(){const w=Number(width.value),s=Math.min(1,(document.querySelector('#stage').clientWidth-40)/w),h=Math.max(400,innerHeight-document.querySelector('header').offsetHeight-40);frame.style.width=w+'px';frame.style.height=h/s+'px';frame.style.transform='scale('+s+')';document.querySelector('#canvas').style.width=w*s+'px';document.querySelector('#canvas').style.height=h+'px';}
function recolor(){if(theme.value!=='#eaff00')return;const p=frame.contentDocument.querySelector('.product-page');if(!p)return;const a=[1,3,5].map(i=>parseInt(color.value.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),l=a[0]*.2126+a[1]*.7152+a[2]*.0722;p.style.setProperty('--product-accent',color.value);p.style.setProperty('--product-on-accent',(l+.05)/.05>1.05/(l+.05)?'#000':'#fff');}
function update(){frame.srcdoc='<!doctype html><html lang="id"><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'body{margin:0;--font-sans:Geist,Arial,sans-serif}</style></head><body>'+pages[theme.value+':'+data.value].replaceAll('__DEMO_IMAGE__',photo)+'</body></html>';status.textContent='Contoh '+data.options[data.selectedIndex].text.toLowerCase();resize();}
frame.addEventListener('load',()=>{recolor();frame.contentDocument.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();const h=a.getAttribute('href');if(h.startsWith('#'))frame.contentDocument.getElementById(h.slice(1))?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});else status.textContent='Link eksternal hanya tersedia pada halaman aplikasi.';});});
theme.addEventListener('change',update);data.addEventListener('change',update);width.addEventListener('change',resize);color.addEventListener('input',()=>{if(theme.value!=='#eaff00'){theme.value='#eaff00';update();}else recolor();});window.addEventListener('resize',resize);update();
</script></body></html>`;
  fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
  fs.writeFileSync(output, html);
  console.log(`Review artifact: ${path.resolve(output)}`);
}
