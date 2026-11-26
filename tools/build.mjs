// Bundles both games into single HTML files in dist/. No dependencies: `node tools/build.mjs`
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(root, p), 'utf8');
const page = body => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html,body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style></head><body>${body}</body></html>`;
function bundle(game, files) {
  const js = [read('shared/gear.js'), ...files.map(f => read(`games/${game}/src/${f}.js`))].join('\n');
  const html = page(read(`games/${game}/shell.html`).replace('<!--SCRIPTS-->', () => '<script>\n' + js.replace(/<\/script/g, '<\\/script') + '\n</script>'));
  mkdirSync(join(root, 'dist', game), { recursive: true });
  writeFileSync(join(root, 'dist', game, 'index.html'), html);
  console.log(`dist/${game}/index.html  ${(html.length / 1024).toFixed(0)} KB`);
}
// The story game expects its files in this order; gear.js must come after powers.js there.
function bundleStory() {
  const order = ['powers', '@gear', 'data', 'paint', 'core', 'story_ren', 'story_lyra', 'story_torvin', 'story_kaida', 'story_new', 'story_arc', 'story_side', 'ui'];
  const js = order.map(f => f === '@gear' ? read('shared/gear.js') : read(`games/story/src/${f}.js`)).join('\n');
  const html = page(read('games/story/shell.html').replace('<!--SCRIPTS-->', () => '<script>\n' + js.replace(/<\/script/g, '<\\/script') + '\n</script>'));
  mkdirSync(join(root, 'dist', 'story'), { recursive: true });
  writeFileSync(join(root, 'dist', 'story', 'index.html'), html);
  console.log(`dist/story/index.html  ${(html.length / 1024).toFixed(0)} KB`);
}
bundle('awakening', ['a_math', 'b_mesh', 'c_shaders', 'd_world', 'e_render', 'f_body', 'f_chars', 'g_game', 'h_ui', 'i_main']);
bundleStory();
writeFileSync(join(root, 'dist', 'index.html'), page(`<title>The Seven Crowns</title><style>body{background:#07060d;color:#f1ebf8;font-family:Georgia,serif;display:grid;place-items:center;min-height:100vh;text-align:center}a{display:block;margin:14px auto;padding:16px 26px;border:1px solid #e8c36a;border-radius:14px;color:#fff;text-decoration:none;font-size:20px;max-width:320px;background:linear-gradient(180deg,#4a3590,#22174a)}h1{font-weight:400;letter-spacing:.06em;font-size:44px}p{color:#b0a6c4}</style><main><h1>The Seven Crowns</h1><p>Choose how you want to play.</p><a href="awakening/">Awakening · 3D chapter</a><a href="story/">The Gathering · story RPG</a></main>`));
console.log('dist/index.html');
