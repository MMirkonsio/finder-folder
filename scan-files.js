#!/usr/bin/env node
// Script para escanear archivos del servidor y sincronizar con la API LOCAL
// Guardar como: scan-files.js
// Ejecutar: node scan-files.js

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001/api';

// CONFIGURAR: Ruta raíz de tu servidor de archivos
const ROOT_PATH = 'C:/Users/NOTE-MIRKO/Documents/ProyectosCode'; // Ejemplo, ajustar a la ruta real

function scanDirectory(dir, baseUrl = '') {
  const files = [];

  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.name.startsWith('.') || item.name === 'node_modules') continue;

      const fullPath = path.join(dir, item.name);
      const relativePath = path.join(baseUrl, item.name);

      if (item.isDirectory()) {
        files.push(...scanDirectory(fullPath, relativePath));
      } else {
        try {
          const stats = fs.statSync(fullPath);
          const ext = path.extname(item.name).slice(1).toLowerCase();

          files.push({
            file_name: item.name,
            file_path: '/' + relativePath.replace(/\\/g, '/'),
            file_size: stats.size,
            file_type: ext || 'unknown',
            owner_user: '', 
            last_modified: stats.mtime.toISOString(),
          });
        } catch (err) {
          console.error(`Error leyendo archivo ${fullPath}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error(`Error escaneando directorio ${dir}:`, err.message);
  }

  return files;
}

async function syncFiles(files) {
  const batchSize = 1000;
  let totalSynced = 0;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    try {
      const response = await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: batch }),
      });

      const result = await response.json();

      if (response.ok) {
        totalSynced += result.processed;
        console.log(`Lote ${Math.floor(i / batchSize) + 1}: ${result.processed} archivos procesados`);
      } else {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error sincronizando:', error.message);
    }
  }

  return totalSynced;
}

async function main() {
  console.log('Escaneando archivos desde:', ROOT_PATH);
  console.log('Esto puede tomar varios minutos...');

  const startTime = Date.now();
  const files = scanDirectory(ROOT_PATH);
  const scanTime = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\nArchivos encontrados: ${files.length} (en ${scanTime}s)`);
  console.log('Sincronizando con la API local...\n');

  const syncStart = Date.now();
  const synced = await syncFiles(files);
  const syncTime = ((Date.now() - syncStart) / 1000).toFixed(2);

  console.log(`\n✅ Sincronización completada!`);
  console.log(`Total archivos: ${synced}`);
  console.log(`Tiempo de sincronización: ${syncTime}s`);
}

main().catch(console.error);
