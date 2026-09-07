/**
 * Verifica que el paquete generado sea autosuficiente.
 *
 * Por qué existe: en la v0.0.17 se excluyeron `onnxruntime-web` y `sharp` del
 * instalador porque en Node nunca se ejecutan. Pero @xenova/transformers los
 * importa de forma ESTATICA, así que Node los resuelve al cargar el módulo y el
 * servidor moría con ERR_MODULE_NOT_FOUND. No se detectó al probar porque la app
 * se ejecutó desde dentro del repo: Node subió por el árbol de directorios y
 * encontró las dependencias en el node_modules del proyecto. La app instalada,
 * fuera del repo, no tiene ese respaldo.
 *
 * Este script recorre los imports estáticos del código empaquetado y comprueba
 * que cada paquete exista DENTRO del propio paquete.
 *
 * Uso: node verify-package.cjs [ruta a win-unpacked/resources/app]
 * Sin argumento usa la salida de la version actual de package.json.
 */
const fs = require('fs');
const path = require('path');

const appDir = process.argv[2] || path.join(
  __dirname,
  'Releases_Generados',
  'v' + require('./package.json').version,
  'win-unpacked', 'resources', 'app'
);

if (!fs.existsSync(appDir)) {
  console.error(`[verify-package] No existe la carpeta empaquetada:\n  ${appDir}`);
  process.exit(2);
}

const pkgNodeModules = path.join(appDir, 'node_modules');

// Carpetas cuyo código se ejecuta en el proceso del servidor.
const SCAN_DIRS = [
  path.join(appDir, 'server'),
  path.join(pkgNodeModules, '@xenova', 'transformers', 'src'),
];

const IMPORT_RE = /^\s*import\s+(?:[\w*{},\s]+\s+from\s+)?['"]([^'"]+)['"]/gm;
const builtin = new Set(require('module').builtinModules);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.js') || e.name.endsWith('.mjs')) out.push(p);
  }
  return out;
}

const required = new Map(); // paquete -> archivo que lo importa

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    const src = fs.readFileSync(file, 'utf8');
    let m;
    IMPORT_RE.lastIndex = 0;
    while ((m = IMPORT_RE.exec(src)) !== null) {
      const spec = m[1];
      // Ignorar rutas relativas, absolutas, builtins y node:
      if (spec.startsWith('.') || spec.startsWith('/') || spec.startsWith('node:')) continue;
      const base = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (builtin.has(base)) continue;
      if (!required.has(base)) required.set(base, path.relative(appDir, file));
    }
  }
}

const faltantes = [];
for (const [pkg, importer] of required) {
  if (!fs.existsSync(path.join(pkgNodeModules, ...pkg.split('/')))) {
    faltantes.push({ pkg, importer });
  }
}

console.log(`[verify-package] ${required.size} dependencias importadas estaticamente.`);

if (faltantes.length > 0) {
  console.error('\n[verify-package] FALLO: faltan paquetes en el instalador.');
  console.error('  El servidor moriria con ERR_MODULE_NOT_FOUND al instalarse fuera del repo.\n');
  for (const f of faltantes) {
    console.error(`  - "${f.pkg}"  (importado por ${f.importer})`);
  }
  console.error('\n  Revisa las exclusiones de "build.files" en package.json.\n');
  process.exit(1);
}

console.log('[verify-package] OK: el paquete es autosuficiente.');
