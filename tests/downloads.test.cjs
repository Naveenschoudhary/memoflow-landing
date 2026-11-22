const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const urlFor = version => `https://github.com/Naveenschoudhary/memoflow-models/releases/download/v${version}/MemoFlow-${version}.dmg`;

// Exercise the production modules with controlled network/database boundaries.
function loadModule(file, globals = {}, imports = {}) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(source, {
    module, exports: module.exports, URL, Response, AbortSignal,
    process: { env: {} }, console: { error() {}, warn() {} },
    require(name) {
      if (name in imports) return imports[name];
      throw new Error(`Unexpected import: ${name}`);
    },
    ...globals,
  }, { filename: file });
  return module.exports;
}

function resolver(apiVersion, appcastVersion) {
  return loadModule('src/lib/release.ts', {
    fetch: async url => {
      if (url.includes('api.github.com')) {
        return Response.json({ tag_name: `v${apiVersion}`, assets: [{
          name: `MemoFlow-${apiVersion}.dmg`, browser_download_url: urlFor(apiVersion),
        }] });
      }
      return new Response(`<rss><channel><item><sparkle:version>${appcastVersion}</sparkle:version><enclosure url="${urlFor(appcastVersion)}"/></item></channel></rss>`);
    },
  });
}

test('a stale GitHub cache falls back to the current appcast', async () => {
  const release = await resolver('0.8.0', '0.8.1').getLatestRelease();
  assert.equal(release.version, '0.8.1');
  assert.equal(release.dmgUrl, urlFor('0.8.1'));
});

test('two stale sources cannot downgrade the known published version', async () => {
  assert.equal((await resolver('0.8.0', '0.8.0').getLatestRelease()).version, '0.8.1');
});

test('network failures still return the known published download', async () => {
  const release = loadModule('src/lib/release.ts', { fetch: async () => { throw new Error('offline'); } });
  assert.equal((await release.getLatestRelease()).dmgUrl, urlFor('0.8.1'));
});

test('future releases remain discoverable', async () => {
  assert.equal((await resolver('0.8.2', '0.8.1').getLatestRelease()).version, '0.8.2');
});

test('a later stale response cannot downgrade the last known good release', async () => {
  let version = '0.8.2';
  const releases = loadModule('src/lib/release.ts', { fetch: async url => url.includes('api.github.com')
    ? Response.json({ tag_name: `v${version}`, assets: [{ name: `MemoFlow-${version}.dmg`, browser_download_url: urlFor(version) }] })
    : new Response('') });
  assert.equal((await releases.getLatestRelease()).version, '0.8.2');
  version = '0.8.1';
  assert.equal((await releases.getLatestRelease()).version, '0.8.2');
});

function downloadRoute(row, releases) {
  const queries = [];
  const route = loadModule('src/app/api/download/[id]/route.ts', {}, {
    '@/lib/db': { db: { async execute(sql, params) {
      queries.push({ sql, params });
      return sql.includes('SELECT') ? [[...(row ? [row] : [])]] : [{}];
    } } },
    '@/lib/release': releases,
    'next/navigation': { redirect(location) { throw Object.assign(new Error('redirect'), { location }); } },
  });
  return { route, queries };
}

const request = new Request('https://memoflow.app/api/download/test-token');
const params = { params: Promise.resolve({ id: 'test-token' }) };

test('an email token storing 0.8.0 downloads 0.8.1 and records the actual target', async () => {
  const { route, queries } = downloadRoute({ download_link: urlFor('0.8.0'), expired: 0 }, resolver('0.8.0', '0.8.1'));
  const response = await route.GET(request, params);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), urlFor('0.8.1'));
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.equal(queries[1].params[0], urlFor('0.8.1'));
  assert.equal(queries[1].params[1], 'test-token');
});

test('expired links retain their expiry and do not look up a release', async () => {
  let lookedUp = false;
  const { route, queries } = downloadRoute({ expired: 1 }, { getLatestRelease() { lookedUp = true; } });
  await assert.rejects(route.GET(request, params), error => error.location === '/download/expired');
  assert.equal(lookedUp, false);
  assert.match(queries[1].sql, /status = 'expired'/);
});

test('unknown tokens remain a 404 without resolving or tracking a download', async () => {
  const { route, queries } = downloadRoute(null, { getLatestRelease() { throw new Error('must not run'); } });
  assert.equal((await route.GET(request, params)).status, 404);
  assert.equal(queries.length, 1);
});
