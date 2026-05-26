import { useState, useEffect, useRef } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, X, Loader, Square } from 'lucide-react';
import { api, SyncStatus } from '../lib/api';

interface ServerConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

const PREDEFINED_PATHS = [
  { id: 0, title: "📁 Recursos Humanos",     path: "\\\\192.168.0.7\\archivos_hhe\\RRHH",             desc: "Contratos, Finiquitos y Documentación de Personal" },
  { id: 1, title: "📄 Gestión de Contratos", path: "\\\\192.168.0.7\\archivos_hhe\\Gestion Contratos", desc: "Acuerdos Comerciales y Contratos de Servicios" },
  { id: 2, title: "📊 Finanzas",             path: "\\\\192.168.0.7\\archivos_hhe\\Finanzas",          desc: "Reportes Financieros y Contabilidad" },
  { id: 3, title: "🛒 Compras",              path: "\\\\192.168.0.7\\archivos_hhe\\Compras",           desc: "Órdenes de Compra y Gestión de Proveedores" },
  { id: 4, title: "💰 Contabilidad",         path: "\\\\192.168.0.7\\archivos_hhe\\Contabilidad",      desc: "Libros, Balances y Documentos Contables" },
  { id: 5, title: "🧾 Facturas",             path: "\\\\192.168.0.7\\archivos_hhe\\Facturas",          desc: "Facturación Electrónica y Comprobantes" },
  { id: 6, title: "🚛 Logística",            path: "\\\\192.168.0.7\\archivos_hhe\\Logistica",         desc: "Guías de Despacho y Control de Inventarios" },
];

export default function ServerConfig({ isOpen, onClose, onConfigSaved }: ServerConfigProps) {
  const [serverUrl, setServerUrl] = useState('');
  const [rootPaths, setRootPaths] = useState<(string | null)[]>(Array(10).fill(null));
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [syncState, setSyncState] = useState<SyncStatus | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  // Rutas que ya estaban configuradas cuando se abrió el panel (para detectar las nuevas)
  const savedPathsRef = useRef<(string | null)[]>(Array(10).fill(null));

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  // Polling del estado de sincronización mientras el modal está abierto.
  // Permite mostrar el botón "Cancelar" en tiempo real y reflejar progreso.
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const s = await api.getSyncStatus();
        if (!cancelled) setSyncState(s);
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 1500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isOpen]);

  const handleCancelScan = async () => {
    // Feedback INMEDIATO sin esperar al servidor — el polling después confirma
    setIsCancelling(true);
    setStatus({ type: 'success', message: 'Cancelación solicitada. Deteniendo escaneo...' });
    try {
      await api.cancelScan();
      // Refrescar status enseguida para detectar el cambio antes del próximo poll
      try {
        const s = await api.getSyncStatus();
        setSyncState(s);
      } catch {}
    } catch (e: any) {
      setStatus({ type: 'error', message: e.message || 'Error cancelando escaneo' });
      setIsCancelling(false);
    }
  };

  // Cuando el servidor confirma que ya no está escaneando, limpiar el flag local
  useEffect(() => {
    if (syncState && !syncState.isScanning && isCancelling) {
      setIsCancelling(false);
    }
  }, [syncState, isCancelling]);

  const loadConfig = async () => {
    try {
      const config = await api.getConfig();
      if (config) {
        setServerUrl(config.server_url);
        const paths = [
          config.root_path || null,
          config.root_path_2 || null,
          config.root_path_3 || null,
          config.root_path_4 || null,
          config.root_path_5 || null,
          config.root_path_6 || null,
          config.root_path_7 || null,
          config.root_path_8 || null,
          config.root_path_9 || null,
          config.root_path_10 || null,
        ];
        setRootPaths(paths);
        // Snapshot de lo que ya estaba guardado para comparar al guardar
        savedPathsRef.current = [...paths];
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    // Calcular newPaths ANTES de guardar (savedPathsRef todavía refleja el estado previo)
    const newPaths = rootPaths.filter((p, i) => {
      if (!p || !p.trim()) return false;
      const wasAlready = savedPathsRef.current[i]?.trim();
      return wasAlready !== p.trim();
    }) as string[];

    try {
      await api.saveConfig({
        server_url: serverUrl,
        root_path: rootPaths[0] || '',
        root_path_2: rootPaths[1] || '',
        root_path_3: rootPaths[2] || '',
        root_path_4: rootPaths[3] || '',
        root_path_5: rootPaths[4] || '',
        root_path_6: rootPaths[5] || '',
        root_path_7: rootPaths[6] || '',
        root_path_8: rootPaths[7] || '',
        root_path_9: rootPaths[8] || '',
        root_path_10: rootPaths[9] || '',
      });

      // FIX persistencia: sincronizar el snapshot con lo recién guardado.
      // Sin esto, si el usuario hace uncheck → save → recheck, el segundo save
      // no detecta el path como "nuevo" porque savedPathsRef todavía lo tenía.
      savedPathsRef.current = [...rootPaths];

      if (newPaths.length > 0) {
        setStatus({
          type: 'success',
          message: `Guardado. Indexando ${newPaths.length} carpeta${newPaths.length > 1 ? 's' : ''} nueva${newPaths.length > 1 ? 's' : ''} en segundo plano...`,
        });
        // Escanear solo las carpetas nuevas (no bloquea — corre en background)
        api.scanFilesFromServer(newPaths).catch(console.error);
        // No auto-cerrar si arrancamos un scan: dejar al usuario ver progreso y opción de cancelar
      } else {
        setStatus({ type: 'success', message: 'Configuración guardada correctamente.' });
        setTimeout(() => onClose(), 1500);
      }

      onConfigSaved();
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Error al guardar la configuración' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePath = (index: number, defaultPath: string) => {
    const newPaths = [...rootPaths];
    if (newPaths[index] !== null) {
      newPaths[index] = null;
    } else {
      newPaths[index] = defaultPath;
    }
    setRootPaths(newPaths);
  };

  const updatePath = (index: number, newValue: string) => {
    const newPaths = [...rootPaths];
    newPaths[index] = newValue;
    setRootPaths(newPaths);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in text-foreground">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Settings className="text-primary" size={20} />
              <h2 className="text-lg font-bold">Configuración</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-xs text-muted-foreground mb-4">
              Selecciona las carpetas del servidor NAS que deseas incluir en el motor de búsqueda. Solo se indexarán los archivos de las carpetas marcadas.
            </p>

            {PREDEFINED_PATHS.map((item) => {
              const isChecked = rootPaths[item.id] !== null;
              return (
                <div
                  key={item.id}
                  onClick={() => togglePath(item.id, item.path)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${isChecked
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-card border-border hover:bg-secondary/30'
                    }`}
                >
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="w-5 h-5 rounded border-gray-400 text-primary focus:ring-primary/50 cursor-pointer pointer-events-none"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isChecked ? 'text-primary' : 'text-foreground'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate leading-relaxed">
                      {item.desc}
                    </p>
                    {isChecked ? (
                      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={rootPaths[item.id] || ''}
                          onChange={(e) => updatePath(item.id, e.target.value)}
                          className="w-full bg-background border border-primary/40 rounded-md px-2 py-1.5 text-[11px] font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                          placeholder={item.path}
                        />
                      </div>
                    ) : (
                      <p className="text-[9px] font-mono text-muted-foreground/50 mt-1.5 truncate">
                        Ruta por defecto: {item.path}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {status && (
            <div className={`flex items-center gap-3 p-3 rounded-xl text-xs font-medium animate-fade-in ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{status.message}</span>
            </div>
          )}

          {/* Barra de progreso + botón cancelar mientras hay scan en curso */}
          {syncState?.isScanning && (
            <div className="space-y-3 p-3 rounded-xl bg-primary/5 border border-primary/20 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary uppercase tracking-wider">
                  {syncState.status === 'scanning' && 'Escaneando...'}
                  {syncState.status === 'indexing' && 'Indexando cambios...'}
                  {syncState.status === 'deleting' && 'Limpiando DB...'}
                  {syncState.cancelRequested && 'Deteniendo...'}
                </span>
                <span className="font-mono text-foreground">
                  {syncState.processed.toLocaleString()} / {syncState.total.toLocaleString()}
                </span>
              </div>
              {syncState.currentFile && (
                <p className="text-[10px] text-muted-foreground truncate font-mono">
                  {syncState.currentFile}
                </p>
              )}
              <button
                type="button"
                onClick={handleCancelScan}
                disabled={isCancelling || syncState.cancelRequested}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
              >
                <Square size={12} fill="currentColor" />
                {isCancelling || syncState.cancelRequested ? 'Cancelando...' : 'Cancelar Sincronización'}
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || syncState?.isScanning}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold transition-all shadow-lg hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              title={syncState?.isScanning ? 'Cancela el escaneo en curso antes de guardar' : ''}
            >
              {isLoading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {isLoading
                ? 'Guardando...'
                : syncState?.isScanning
                  ? 'Sincronización en curso...'
                  : 'Guardar Configuración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
