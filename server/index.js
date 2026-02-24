import express from 'express';
import cors from 'cors';
import pkg from '../prisma/generated/client/index.js';
const { PrismaClient } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '100mb' }));

// Global sync status
let syncStatus = {
  isScanning: false,
  processed: 0,
  total: 0,
  currentFile: '',
  status: 'idle', // 'idle', 'scanning', 'indexing', 'deleting', 'completed', 'error'
  error: null
};

// Allowed extensions for filtering (Productivity files only)
const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'
]);

// Helper function to upsert a batch of files
async function upsertBatch(batch) {
  if (batch.length === 0) return;
  
  try {
    console.log(`Indexando lote de ${batch.length} archivos...`);
    await prisma.$transaction(
      batch.map(file => {
        const data = {
          file_name: file.file_name,
          file_path: file.file_path,
          file_size: file.file_size,
          file_type: file.file_type,
          owner_user: file.owner_user || '',
          last_modified: new Date(file.last_modified),
        };

        return prisma.fileRecord.upsert({
          where: { file_path: file.file_path },
          update: data,
          create: data,
        });
      })
    );
  } catch (err) {
    console.error('Error upserting batch:', err.message);
  }
}

// Helper function to scan directory recursively (Asynchronous)
async function scanAndIndex(dir, context) {
  try {
    const items = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.name.startsWith('.') || 
          item.name === 'node_modules' || 
          item.name === '$RECYCLE.BIN' || 
          item.name === 'System Volume Information' ||
          item.name.startsWith('~$')) continue;

      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        await scanAndIndex(fullPath, context);
      } else {
        const ext = path.extname(item.name).slice(1).toLowerCase();
        if (ext === 'tmp' || !ALLOWED_EXTENSIONS.has(ext)) continue;

        try {
          const stats = await fs.promises.stat(fullPath);
          const filePath = fullPath.replace(/\\/g, '/');
          const diskTime = stats.mtime.getTime();
          const diskSize = stats.size;

          context.allDiscoveredPaths.add(filePath);
          syncStatus.total++;

          // INCREMENTAL CHECK: Compare with DB snapshot (timestamp and size)
          const dbInfo = context.dbFilesMap.get(filePath);
          
          // Use 2-second tolerance for time (common for NAS/network shares)
          const isSameTime = dbInfo && Math.abs(dbInfo.lastModified - diskTime) < 2000;
          const isSameSize = dbInfo && dbInfo.size === diskSize;

          if (dbInfo && isSameTime && isSameSize) {
            // Unchanged file: Skip indexing but mark as processed immediately
            syncStatus.processed++;
            context.skips++;
            
            // Periodically update the UI file name even when skipping very fast
            if (context.skips % 500 === 0) {
              syncStatus.currentFile = item.name + ' (Omitido)';
            }
          } else {
            // DEBUG: Log first 5 mismatches
            if (context.updates < 5) {
              if (!dbInfo) console.log(`[SYNC] Nuevo: ${filePath}`);
              else console.log(`[SYNC] Modificado: ${filePath} (DB-Time: ${dbInfo.lastModified}, Disk-Time: ${diskTime}, DB-Size: ${dbInfo.size}, Disk-Size: ${diskSize})`);
            }

            // New or modified file: Add to batch
            syncStatus.currentFile = item.name;
            const fileData = {
              file_name: item.name,
              file_path: filePath,
              file_size: diskSize,
              file_type: ext,
              owner_user: '', 
              last_modified: stats.mtime.toISOString(),
            };

            context.batch.push(fileData);

            if (context.batch.length >= 500) {
              const prevStatus = syncStatus.status;
              syncStatus.status = 'indexing';
              await upsertBatch(context.batch);
              syncStatus.processed += context.batch.length;
              context.updates += context.batch.length;
              context.batch = [];
              syncStatus.status = prevStatus;
            }
          }
        } catch (err) {
          console.error(`Error reading ${fullPath}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error(`Error scanning ${dir}:`, err.message);
  }
}

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const totalFiles = await prisma.fileRecord.count();
    const config = await prisma.serverConfig.findUnique({
      where: { id: 'default' }
    });
    res.json({ total_files: totalFiles, config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sync status endpoint
app.get('/api/sync-status', (req, res) => {
  res.json(syncStatus);
});

// Sync files endpoint (manual upload)
app.post('/api/sync', async (req, res) => {
  const { files } = req.body;
  if (!Array.isArray(files)) {
    return res.status(400).json({ error: 'Files array is required' });
  }

  try {
    let processed = 0;
    for (const file of files) {
      const data = {
        file_name: file.file_name,
        file_path: file.file_path,
        file_size: file.file_size,
        file_type: file.file_type,
        owner_user: file.owner_user || '',
        last_modified: new Date(file.last_modified),
      };

      await prisma.fileRecord.upsert({
        where: { file_path: file.file_path },
        update: data,
        create: data,
      });
      processed++;
    }

    const totalFiles = await prisma.fileRecord.count();
    await prisma.serverConfig.upsert({
      where: { id: 'default' },
      update: { total_files: totalFiles, last_scan: new Date() },
      create: { id: 'default', server_url: '', total_files: totalFiles, last_scan: new Date() },
    });

    res.json({ processed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Standalone incremental scan runner
async function runIncrementalScan() {
  if (syncStatus.isScanning) {
    console.log('Omitiendo auto-escaneo: ya hay un escaneo en progreso.');
    return { error: 'Ya hay un escaneo en progreso' };
  }

  try {
    const config = await prisma.serverConfig.findUnique({
      where: { id: 'default' }
    });

    const roots = [
      config?.root_path,
      config?.root_path_2,
      config?.root_path_3,
      config?.root_path_4,
      config?.root_path_5,
      config?.root_path_6,
      config?.root_path_7,
      config?.root_path_8,
      config?.root_path_9,
      config?.root_path_10
    ].filter(r => r && r.trim() !== '');

    if (roots.length === 0) {
      return { error: 'No hay rutas configuradas' };
    }

    const validRoots = roots.filter(r => fs.existsSync(r));
    if (validRoots.length === 0) {
      return { error: 'Ninguna de las rutas configuradas existe en el servidor' };
    }

    // Reset status
    syncStatus = {
      isScanning: true,
      processed: 0,
      total: 0,
      currentFile: '',
      status: 'scanning',
      error: null
    };

    // Run in background (non-blocking)
    (async () => {
      try {
        console.log(`[Auto-Scan] Iniciando escaneo en múltiples rutas:`, validRoots);
        
        // 0. Fetch DB Snapshot for incremental check
        const dbFiles = await prisma.fileRecord.findMany({
          select: { file_path: true, last_modified: true, file_size: true }
        });
        const dbFilesMap = new Map(dbFiles.map(f => [
          f.file_path, 
          { lastModified: f.last_modified.getTime(), size: f.file_size }
        ]));
        console.log(`Snapshot DB cargado: ${dbFilesMap.size} archivos conocidos.`);

        const context = {
          batch: [],
          allDiscoveredPaths: new Set(),
          dbFilesMap: dbFilesMap,
          skips: 0,
          updates: 0
        };

        // 1. Scan and Index incrementally in real-time
        for (const root of validRoots) {
          console.log(`\n>>> Escaneando ruta: ${root}`);
          await scanAndIndex(root, context);
        }
        
        // 2. Process final batch
        if (context.batch.length > 0) {
          const processedInLastBatch = context.batch.length;
          syncStatus.status = 'indexing';
          await upsertBatch(context.batch);
          syncStatus.processed += processedInLastBatch;
          context.updates += processedInLastBatch;
        }

        // 3. Handle deletions (Cleanup) - Check for obsolete files inside EACH valid root path
        syncStatus.status = 'deleting';
        for (const root of validRoots) {
          const normalizedRootPath = root.replace(/\\/g, '/');
          
          const currentDbFiles = await prisma.fileRecord.findMany({ 
            where: {
              file_path: { startsWith: normalizedRootPath }
            },
            select: { file_path: true } 
          });
          
          const toDelete = currentDbFiles
            .filter(f => !context.allDiscoveredPaths.has(f.file_path))
            .map(f => f.file_path);
          
          if (toDelete.length > 0) {
            console.log(`Limpiando ${toDelete.length} archivos eliminados dentro de ${root}...`);
            const deleteBatchSize = 1000;
            for (let i = 0; i < toDelete.length; i += deleteBatchSize) {
              const batch = toDelete.slice(i, i + deleteBatchSize);
              await prisma.fileRecord.deleteMany({
                where: { file_path: { in: batch } }
              });
            }
          }
        }

        const totalFiles = await prisma.fileRecord.count();
        await prisma.serverConfig.update({
          where: { id: 'default' },
          data: { total_files: totalFiles, last_scan: new Date() }
        });

        syncStatus.status = 'idle';
        syncStatus.isScanning = false;
        console.log(`Sync incremental finalizado. Total en DB: ${totalFiles}. Escaneados: ${syncStatus.total}. Actualizados: ${context.updates}. Sin cambios: ${context.skips}`);
      } catch (error) {
        console.error('Error en escaneo:', error);
        syncStatus.status = 'error';
        syncStatus.error = error.message;
        syncStatus.isScanning = false;
      }
    })();

    return { success: true, message: 'Sincronización iniciada' };
  } catch (error) {
    console.error('Core scan runner error:', error);
    return { error: error.message };
  }
}

// Iniciar chequeo automático cada 20 minutos (1,200,000 ms)
setInterval(() => {
  console.log('[Auto-Scan] Disparando escaneo periódico...');
  runIncrementalScan();
}, 20 * 60 * 1000);

// Server-side scan endpoint (Manual Trigger)
app.post('/api/scan', async (req, res) => {
  const result = await runIncrementalScan();
  if (result.error) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// File proxy endpoint to serve local/NAS files over HTTP securely by DB UUID
app.get('/api/files/:id', async (req, res) => {
  try {
    const fileRecord = await prisma.fileRecord.findUnique({
      where: { id: req.params.id }
    });

    if (!fileRecord) {
      return res.status(404).json({ error: 'Archivo no encontrado en el índice' });
    }

    // Convert forward slashes back to native OS slashes
    let absoluteFile = path.normalize(fileRecord.file_path);
    
    // Ensure Windows NAS network share prefix is preserved perfectly
    if (fileRecord.file_path.startsWith('//') && !absoluteFile.startsWith('\\\\')) {
      absoluteFile = '\\\\' + absoluteFile.replace(/^\\/, '');
    }

    if (fs.existsSync(absoluteFile)) {
      return res.sendFile(absoluteFile);
    } else {
      console.log(`[File Proxy Error] Archivo físico perdido en red: ${absoluteFile}`);
      return res.status(404).json({ error: 'El archivo ya no existe físicamente en el disco local o NAS' });
    }
  } catch (error) {
    console.error('File proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search endpoint (Multi-word support with AND logic)
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const config = await prisma.serverConfig.findUnique({ where: { id: 'default' } });
    const roots = [
      config?.root_path,
      config?.root_path_2,
      config?.root_path_3,
      config?.root_path_4,
      config?.root_path_5,
      config?.root_path_6,
      config?.root_path_7,
      config?.root_path_8,
      config?.root_path_9,
      config?.root_path_10
    ].filter(r => r && r.trim() !== '');
    
    // Native absolute paths are already embedded in the DB, just ensure Windows slashes formatting
    const mapWithAbsoluteAndAccess = async (results) => {
      const mapped = results.map(r => ({
        ...r,
        absolute_path: path.normalize(r.file_path)
      }));
      
      return Promise.all(mapped.map(async (file) => {
        try {
          await fs.promises.access(file.absolute_path, fs.constants.R_OK);
          return { ...file, has_access: true };
        } catch (err) {
          return { ...file, has_access: false };
        }
      }));
    };

    const rawQuery = String(q).toLowerCase().trim();
    
    // Support for "usuario:" prefix
    if (rawQuery.startsWith('usuario:')) {
      const userName = rawQuery.replace('usuario:', '').trim();
      const results = await prisma.fileRecord.findMany({
        where: { owner_user: { contains: userName } },
        take: 50,
      });
      return res.json(await mapWithAbsoluteAndAccess(results));
    }

    // Extract exact phrases wrapped in quotes
    const exactPhrases = [];
    let cleanedQuery = rawQuery;
    const phraseRegex = /"([^"]+)"/g;
    let match;
    while ((match = phraseRegex.exec(rawQuery)) !== null) {
      if (match[1].trim().length > 0) {
        exactPhrases.push(match[1].trim());
      }
    }
    cleanedQuery = cleanedQuery.replace(phraseRegex, ' ').trim();

    // Split the remaining query into individual keywords
    const SPANISH_STOP_WORDS = new Set([
      'de', 'del', 'la', 'el', 'y', 'en', 'a', 'los', 'las', 'un', 'una', 'unos', 'unas', 'con', 'por', 'para', 'se', 'su', 'sus', 'o'
    ]);

    const keywords = cleanedQuery
      .split(/\s+/)
      .filter(word => {
        // Keep numbers regardless of length
        if (/^\d+$/.test(word)) return true;
        // Keep words with 2+ characters that are NOT stop words
        return word.length > 2 && !SPANISH_STOP_WORDS.has(word);
      });

    const allTerms = [...exactPhrases, ...keywords];

    if (allTerms.length === 0) {
      const fallbackTerm = rawQuery.replace(/"/g, '').trim();
      if (fallbackTerm) allTerms.push(fallbackTerm);
    }

    if (allTerms.length === 0) {
       return res.json([]);
    }

    // BOT RULES IMPLEMENTATION WITH TYPO FLEXIBILITY
    const makeAccentInsensitive = (term) => term.replace(/[aeiouáéíóúü]/gi, '_');
    
    // Normalize terms to handle repeated characters (e.g., "nicoolas" -> "nicolas")
    const normalizeTypo = (term) => {
      if (term.length <= 3) return term;
      return term.replace(/(.)\1+/g, '$1');
    };

    const getSqlForTerms = (terms) => {
      const conditions = [];
      const params = [];
      const scoreParts = [];
      const nameMatchParts = [];
      
      terms.forEach(term => {
        const pattern = `%${makeAccentInsensitive(term.toLowerCase())}%`;
        const normalizedPattern = `%${makeAccentInsensitive(normalizeTypo(term).toLowerCase())}%`;
        
        conditions.push(`(file_path LIKE ? OR file_path LIKE ?)`);
        params.push(pattern, normalizedPattern);
        
        scoreParts.push(`(CASE WHEN file_path LIKE ? OR file_path LIKE ? THEN 1 ELSE 0 END)`);
        nameMatchParts.push(`(CASE WHEN file_name LIKE ? OR file_name LIKE ? THEN 1 ELSE 0 END)`);
      });

      return { conditions, params, scoreParts, nameMatchParts };
    };

    // PASS 1: Strict AND logic
    const pass1 = getSqlForTerms(allTerms);
    const whereAnd = pass1.conditions.join(' AND ');
    const nameScoreAnd = pass1.nameMatchParts.join(' + ');

    // Use Number() for count to avoid BigInt issues
    const countResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "FileRecord" WHERE ${whereAnd}`, ...pass1.params);
    let totalCount = Number(countResult[0]?.count || 0);
    let rawResults = [];

    if (totalCount > 0) {
      // placeholders: nameScoreAnd (2*N) + whereAnd (2*N) = 4*N.
      // params: ...pass1.params (2*N) + ...pass1.params (2*N) = 4*N. Correct!
      const sqlQuery = `SELECT *, (${nameScoreAnd}) as _name_score FROM "FileRecord" WHERE ${whereAnd} ORDER BY _name_score DESC, last_modified DESC LIMIT 100`;
      rawResults = await prisma.$queryRawUnsafe(sqlQuery, ...pass1.params, ...pass1.params);
    } else if (allTerms.length > 0) {
      // PASS 2: Flexible Fallback
      const pass2 = getSqlForTerms(allTerms);
      const matchScoreExpr = pass2.scoreParts.join(' + ');
      const nameScoreExpr = pass2.nameMatchParts.join(' + ');
      
      // Use subquery to allow filtering by calculated _match_count
      const sqlQuery = `
        SELECT * FROM (
          SELECT *, 
            (${matchScoreExpr}) as _match_count,
            (${nameScoreExpr}) as _name_score 
          FROM "FileRecord"
        ) as sub WHERE _match_count > 0
        ORDER BY _match_count DESC, _name_score DESC, last_modified DESC 
        LIMIT 100
      `;
      
      // params: matchScoreExpr (2*N) + nameScoreExpr (2*N) = 4*N. Correct!
      const results = await prisma.$queryRawUnsafe(sqlQuery, ...pass2.params, ...pass2.params);
      
      if (results.length > 0) {
        const maxMatches = Number(results[0]._match_count);
        // Requirement: match at least 60% of keywords OR (maxMatches - 1)
        const threshold = Math.max(1, Math.floor(allTerms.length * 0.6), maxMatches - 1);
        rawResults = results.filter(r => Number(r._match_count) >= threshold);
        totalCount = rawResults.length;
      }
    }

    // 5. CERO RESULTADOS
    if (totalCount === 0) {
      return res.json([]);
    }

    // 4. PREVENCIÓN DE SATURACIÓN
    if (totalCount > 10) {
      return res.status(200).json({ 
        refine_needed: true, 
        count: totalCount,
        message: `Encontré ${totalCount.toLocaleString()} archivos que coinciden con tu búsqueda. Por favor, especifica más detalles (como el mes o año) para encontrar el archivo correcto.`
      });
    }

    const finalResults = rawResults.map(({ _name_score, _match_count, ...rest }) => rest);
    res.json(await mapWithAbsoluteAndAccess(finalResults));
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Config endpoints
app.get('/api/config', async (req, res) => {
  try {
    const config = await prisma.serverConfig.findUnique({
      where: { id: 'default' }
    });
    res.json(config || { 
      server_url: '', 
      root_path: '', root_path_2: '', root_path_3: '', root_path_4: '', 
      root_path_5: '', root_path_6: '', root_path_7: '', root_path_8: '', 
      root_path_9: '', root_path_10: '',
      total_files: 0 
    });
  } catch (error) {
    console.error('[API Config Error - GET]:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/config', async (req, res) => {
  const { 
    server_url, 
    root_path, root_path_2, root_path_3, root_path_4, 
    root_path_5, root_path_6, root_path_7, root_path_8, 
    root_path_9, root_path_10 
  } = req.body;
  console.log('[API Config POST] Iniciando guardado de configuración...');
  try {
    const defaultServerUrl = server_url || '';
    const updateData = { 
      server_url: defaultServerUrl, 
      root_path, root_path_2, root_path_3, root_path_4,
      root_path_5, root_path_6, root_path_7, root_path_8,
      root_path_9, root_path_10
    };
    const createData = { 
      id: 'default', 
      server_url: defaultServerUrl, 
      root_path, root_path_2, root_path_3, root_path_4,
      root_path_5, root_path_6, root_path_7, root_path_8,
      root_path_9, root_path_10,
      total_files: 0 
    };
    
    const config = await prisma.serverConfig.upsert({
      where: { id: 'default' },
      update: updateData,
      create: createData,
    });
    res.json(config);
  } catch (error) {
    console.error('[API Config Error - POST]:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
