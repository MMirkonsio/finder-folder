import { useState, useEffect } from 'react';
import { Database, Upload, RefreshCw, CheckCircle, AlertCircle, Code } from 'lucide-react';

export default function AdminPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({ total_files: 0, last_scan: null as string | null });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showScript, setShowScript] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/sync-files`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats({
          total_files: data.total_files,
          last_scan: data.config?.last_scan || null,
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSyncing(true);
    setSyncResult(null);

    try {
      const text = await file.text();
      const files = JSON.parse(text);

      const response = await fetch(
        `${supabaseUrl}/functions/v1/sync-files`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSyncResult({
          success: true,
          message: `Sincronización completada: ${result.inserted} insertados, ${result.updated} actualizados de ${result.processed} procesados`,
        });
        loadStats();
      } else {
        setSyncResult({
          success: false,
          message: result.error || 'Error al sincronizar archivos',
        });
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error al procesar el archivo',
      });
    } finally {
      setIsSyncing(false);
      event.target.value = '';
    }
  };

  const scriptExample = `#!/usr/bin/env node
// Script para escanear archivos del servidor y sincronizar con Supabase
// Guardar como: scan-files.js
// Ejecutar: node scan-files.js

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = '${supabaseUrl}';
const SUPABASE_ANON_KEY = '${supabaseAnonKey}';

// CONFIGURAR: Ruta raíz de tu servidor de archivos
const ROOT_PATH = '/path/to/your/shared/files';

function scanDirectory(dir, baseUrl = '') {
  const files = [];

  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
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
            file_path: '/' + relativePath.replace(/\\\\/g, '/'),
            file_size: stats.size,
            file_type: ext || 'unknown',
            owner_user: '', // Obtener del sistema si está disponible
            last_modified: stats.mtime.toISOString(),
          });
        } catch (err) {
          console.error(\`Error leyendo archivo \${fullPath}:\`, err.message);
        }
      }
    }
  } catch (err) {
    console.error(\`Error escaneando directorio \${dir}:\`, err.message);
  }

  return files;
}

async function syncFiles(files) {
  const batchSize = 1000;
  let totalSynced = 0;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    try {
      const response = await fetch(\`\${SUPABASE_URL}/functions/v1/sync-files\`, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: batch }),
      });

      const result = await response.json();

      if (response.ok) {
        totalSynced += result.processed;
        console.log(\`Lote \${Math.floor(i / batchSize) + 1}: \${result.processed} archivos procesados\`);
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

  console.log(\`\\nArchivos encontrados: \${files.length} (en \${scanTime}s)\`);
  console.log('Sincronizando con la base de datos...\\n');

  const syncStart = Date.now();
  const synced = await syncFiles(files);
  const syncTime = ((Date.now() - syncStart) / 1000).toFixed(2);

  console.log(\`\\n✅ Sincronización completada!\`);
  console.log(\`Total archivos: \${synced}\`);
  console.log(\`Tiempo de sincronización: \${syncTime}s\`);
}

main().catch(console.error);`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
        title="Panel de administración"
      >
        <Database size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="text-blue-600" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Estadísticas del Sistema</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Archivos Indexados</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.total_files.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última Sincronización</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {stats.last_scan
                        ? new Date(stats.last_scan).toLocaleString()
                        : 'Nunca'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={loadStats}
                  className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <RefreshCw size={16} />
                  Actualizar estadísticas
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Upload className="text-green-600" size={24} />
                  <h3 className="text-lg font-semibold text-gray-800">Sincronizar Archivos</h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Carga un archivo JSON con la lista de archivos de tu servidor. Usa el script de ejemplo a continuación.
                </p>

                <label className="block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    disabled={isSyncing}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </label>

                {isSyncing && (
                  <div className="mt-3 flex items-center gap-2 text-blue-600">
                    <RefreshCw className="animate-spin" size={20} />
                    <span>Sincronizando archivos...</span>
                  </div>
                )}

                {syncResult && (
                  <div className={`mt-3 flex items-center gap-2 p-3 rounded-lg ${
                    syncResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {syncResult.success ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                    <span className="text-sm">{syncResult.message}</span>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Code className="text-purple-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-800">Script de Sincronización</h3>
                  </div>
                  <button
                    onClick={() => setShowScript(!showScript)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    {showScript ? 'Ocultar' : 'Mostrar script'}
                  </button>
                </div>

                {showScript && (
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs">{scriptExample}</pre>
                  </div>
                )}

                <div className="mt-3 space-y-2 text-sm text-gray-600">
                  <p className="font-semibold text-gray-800">Instrucciones:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Copia el script y guárdalo como <code className="bg-gray-100 px-1 rounded">scan-files.js</code> en tu servidor</li>
                    <li>Instala Node.js si no lo tienes instalado</li>
                    <li>Modifica la variable <code className="bg-gray-100 px-1 rounded">ROOT_PATH</code> con la ruta de tu servidor</li>
                    <li>Ejecuta: <code className="bg-gray-100 px-1 rounded">node scan-files.js</code></li>
                    <li>El script escaneará automáticamente y sincronizará con la base de datos</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
