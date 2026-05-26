/**
 * Smoke test del backend — ejecutar con: node smoke-test.js
 *
 * IMPORTANTE: La app Electron DEBE estar abierta antes de correr este script
 * (la app arranca el servidor backend en localhost:3001).
 *
 * Flujo recomendado:
 *   Terminal 1:  pnpm run electron:dev   ← deja la app abierta
 *   Terminal 2:  node smoke-test.js      ← corre el smoke test aquí
 *
 * Requisitos:
 *   - Node.js >= 18 (fetch global)
 *   - Servidor backend escuchando en 127.0.0.1:3001
 */

const BASE = 'http://127.0.0.1:3001/api';

let passed = 0;
let failed = 0;
const fails = [];

const log = (icon, name, extra = '') => {
  console.log(`${icon} ${name}${extra ? '  → ' + extra : ''}`);
};

async function expect(name, fn) {
  try {
    await fn();
    passed++;
    log('✅', name);
  } catch (e) {
    failed++;
    const detail = e?.cause?.code || e.message;
    fails.push({ name, error: detail });
    log('❌', name, detail);
  }
}

async function fetchJson(path, opts = {}) {
  const res = await fetch(BASE + path, opts);
  const txt = await res.text();
  let body;
  try { body = JSON.parse(txt); } catch { body = txt; }
  return { status: res.status, body };
}

// Pre-flight: verificar que el servidor responde antes de correr todo
async function preflightCheck() {
  try {
    const res = await fetch(BASE + '/stats');
    if (res.ok) return true;
    console.error(`\n❌ El servidor respondió con HTTP ${res.status} a /stats — algo está mal en el backend.\n`);
    return false;
  } catch (e) {
    const code = e?.cause?.code || e.message;
    console.error('\n❌ NO SE PUDO CONECTAR al servidor en ' + BASE);
    console.error('   Causa:', code);
    console.error('');
    console.error('   Soluciones probables:');
    if (code === 'ECONNREFUSED') {
      console.error('   • La app Electron no está abierta — ábrela primero con: pnpm run electron:dev');
      console.error('   • El servidor falló al arrancar — revisa server.log:');
      console.error('     %APPDATA%\\Hellema Holland ChatBot\\data\\server.log');
    } else if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
      console.error('   • Problema con la resolución de 127.0.0.1 (raro). Verifica /etc/hosts o hosts file.');
    } else {
      console.error('   • Verifica que el puerto 3001 no esté ocupado por otro proceso:');
      console.error('     netstat -ano | findstr :3001');
    }
    console.error('');
    console.error('   Si fetch no existe: requiere Node.js 18 o superior.');
    console.error('   Versión actual:', process.version);
    console.error('');
    return false;
  }
}

async function run() {
  console.log('\n=== SMOKE TEST — servidor en ' + BASE + ' ===');
  console.log('Node:', process.version);
  console.log('');

  console.log('Verificando conectividad...');
  const ok = await preflightCheck();
  if (!ok) {
    process.exit(2);
  }
  console.log('✓ Servidor responde. Iniciando tests...\n');

  // 1. Salud básica
  await expect('GET /stats devuelve total_files', async () => {
    const { status, body } = await fetchJson('/stats');
    if (status !== 200) throw new Error('status ' + status);
    if (typeof body.total_files !== 'number') throw new Error('total_files no es number');
  });

  await expect('GET /sync-status devuelve flags estándar', async () => {
    const { status, body } = await fetchJson('/sync-status');
    if (status !== 200) throw new Error('status ' + status);
    if (typeof body.isScanning !== 'boolean') throw new Error('isScanning no es boolean');
    if (!['idle', 'scanning', 'indexing', 'deleting', 'completed', 'error', 'cancelled'].includes(body.status)) {
      throw new Error('status inválido: ' + body.status);
    }
  });

  await expect('GET /config devuelve schema correcto', async () => {
    const { status, body } = await fetchJson('/config');
    if (status !== 200) throw new Error('status ' + status);
    if (!('server_url' in body)) throw new Error('falta server_url');
    if (!('root_path' in body)) throw new Error('falta root_path');
    if (!('root_path_10' in body)) throw new Error('falta root_path_10 (migración no aplicada)');
  });

  // 2. Búsqueda — casos válidos
  await expect('GET /search vacía retorna array', async () => {
    const { body } = await fetchJson('/search?q=');
    if (!Array.isArray(body)) throw new Error('debería ser []');
  });

  await expect('GET /search con palabra retorna array o {files}', async () => {
    const { body } = await fetchJson('/search?q=test');
    const ok = Array.isArray(body) || Array.isArray(body.files);
    if (!ok) throw new Error('no es array ni {files}');
  });

  // 3. Búsqueda — casos borde y de seguridad
  await expect('GET /search con SQL injection NO crashea', async () => {
    const evil = encodeURIComponent("'; DROP TABLE FileRecord; --");
    const { status } = await fetchJson('/search?q=' + evil);
    if (status === 500) throw new Error('crashea con injection — riesgo de seguridad');
  });

  await expect('GET /search con caracteres especiales', async () => {
    const q = encodeURIComponent('%_<script>"\'');
    const { status } = await fetchJson('/search?q=' + q);
    if (status >= 500) throw new Error('status ' + status);
  });

  await expect('GET /search con acentos y typos', async () => {
    const q = encodeURIComponent('documentación nicoolas');
    const { status } = await fetchJson('/search?q=' + q);
    if (status >= 500) throw new Error('status ' + status);
  });

  await expect('GET /search con prefijo usuario:', async () => {
    const { status } = await fetchJson('/search?q=' + encodeURIComponent('usuario:test'));
    if (status >= 500) throw new Error('status ' + status);
  });

  await expect('GET /search con frase exacta', async () => {
    const { status } = await fetchJson('/search?q=' + encodeURIComponent('"informe anual"'));
    if (status >= 500) throw new Error('status ' + status);
  });

  // 4. Files proxy
  await expect('GET /files/:id con UUID inexistente → 404', async () => {
    const { status } = await fetchJson('/files/00000000-0000-0000-0000-000000000000');
    if (status !== 404) throw new Error('esperado 404, recibido ' + status);
  });

  await expect('GET /files/:id con UUID inválido NO crashea (500)', async () => {
    const { status } = await fetchJson('/files/not-a-uuid');
    if (status === 500) throw new Error('crashea — debe responder 404 o 400');
  });

  // 5. Config — escritura idempotente
  let originalConfig;
  await expect('GET /config para snapshot original', async () => {
    const { body } = await fetchJson('/config');
    originalConfig = body;
  });

  await expect('POST /config con path inválido devuelve invalidPaths', async () => {
    const fake = 'C:\\path\\que\\no\\existe\\jamas\\xyz123';
    const payload = {
      ...originalConfig,
      root_path_10: fake,
    };
    const { status, body } = await fetchJson('/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (status !== 200) throw new Error('status ' + status);
    if (!Array.isArray(body.invalidPaths) || !body.invalidPaths.includes(fake)) {
      throw new Error('invalidPaths no contiene el path falso');
    }
  });

  await expect('POST /config restaurando estado original', async () => {
    const { status } = await fetchJson('/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(originalConfig),
    });
    if (status !== 200) throw new Error('status ' + status);
  });

  // 6. Cancel — sin scan en curso
  await expect('POST /scan/cancel sin scan → success:false', async () => {
    const { body } = await fetchJson('/scan/cancel', { method: 'POST' });
    if (body.success !== false) throw new Error('debería retornar success:false');
  });

  // 7. Scan — con paths inválidos
  await expect('POST /scan con paths inexistentes → error 400', async () => {
    const { status, body } = await fetchJson('/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['C:\\noexiste\\fake'] }),
    });
    if (status !== 400) throw new Error('esperado 400, recibido ' + status);
    if (!body.error) throw new Error('falta error en body');
  });

  // 8. Sync manual
  await expect('POST /sync con array vacío', async () => {
    const { status } = await fetchJson('/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: [] }),
    });
    if (status !== 200) throw new Error('status ' + status);
  });

  await expect('POST /sync sin body → 400', async () => {
    const { status } = await fetchJson('/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (status !== 400) throw new Error('esperado 400, recibido ' + status);
  });

  // Resumen
  console.log('\n=== Resultado ===');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  if (fails.length > 0) {
    console.log('\nFallos:');
    fails.forEach(f => console.log(`  • ${f.name}: ${f.error}`));
    process.exit(1);
  }
  process.exit(0);
}

run().catch(e => {
  console.error('Error fatal en el runner:', e);
  process.exit(2);
});
