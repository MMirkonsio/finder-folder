import { useState, useEffect, useRef } from 'react';
import { Database, Loader, CheckCircle, AlertCircle, RefreshCw, X } from 'lucide-react';
import { api, SyncStatus } from '../lib/api';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [stats, setStats] = useState<{ total_files: number; last_scan: string | null }>({ total_files: 0, last_scan: null });
  const [currentStatus, setCurrentStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStats();
      checkBackgroundSync();
    } else {
      stopPolling();
    }
  }, [isOpen]);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats({ 
        total_files: data.total_files || 0,
        last_scan: data.config?.last_scan || null
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const checkBackgroundSync = async () => {
    try {
      const status = await api.getSyncStatus();
      if (status && status.isScanning) {
        setIsSyncing(true);
        setCurrentStatus(status);
        startPolling();
      }
    } catch (error) {
      console.error('Error checking background sync:', error);
    }
  };

  const startPolling = () => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const status = await api.getSyncStatus();
        setCurrentStatus(status);
        if (!status.isScanning) {
          stopPolling();
          setIsSyncing(false);
          loadStats();
        }
      } catch (error) {
        console.error('Error consultando estado:', error);
      }
    }, 1000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const handleServerScan = async () => {
    try {
      setIsSyncing(true);
      setCurrentStatus({
        isScanning: true,
        processed: 0,
        total: 0,
        currentFile: '',
        status: 'scanning',
        error: null
      });
      await api.scanFilesFromServer();
      startPolling();
    } catch (error: any) {
      setIsSyncing(false);
      const errorMsg = error.message || 'Error desconocido';
      setCurrentStatus({
        isScanning: false,
        processed: 0,
        total: 0,
        currentFile: '',
        status: 'error',
        error: errorMsg
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  const progress = currentStatus?.total && currentStatus.total > 0
    ? Math.round((currentStatus.processed / currentStatus.total) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="text-primary" size={20} />
            <h2 className="text-lg font-bold">Panel de Control</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-secondary/30 rounded-xl p-4 border border-border/50">
            <div className="text-sm text-muted-foreground font-medium mb-1">Archivos Indexados</div>
            <div className="text-3xl font-bold font-mono tracking-tight text-primary">
              {stats.total_files.toLocaleString()}
            </div>
          </div>

          <div>
            <button
              onClick={handleServerScan}
              disabled={isSyncing}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all shadow-lg ${
                isSyncing
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
              }`}
            >
              {isSyncing ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <RefreshCw size={20} />
              )}
              {isSyncing ? 'Sincronizando...' : 'Forzar Sincronización'}
            </button>
            <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-semibold flex flex-col items-center">
              <span>El servidor realiza auto-escaneos frecuentemente en segundo plano</span>
              {stats.last_scan && (
                <span className="mt-1 text-primary/80 lowercase">
                  Última vez: {new Date(stats.last_scan).toLocaleString()}
                </span>
              )}
            </p>
          </div>

          {(isSyncing || (currentStatus && currentStatus.status !== 'idle')) && currentStatus && (
            <div className="space-y-4 pt-4 border-t border-border animate-fade-in">
              <div className="flex justify-between items-end mb-1">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    currentStatus.status === 'idle' ? 'text-green-500' : 
                    currentStatus.status === 'error' ? 'text-red-500' : 'text-primary'
                  }`}>
                    {currentStatus.status === 'scanning' && 'Escaneando archivos...'}
                    {currentStatus.status === 'indexing' && 'Indexando cambios...'}
                    {currentStatus.status === 'deleting' && 'Limpiando base de datos...'}
                    {currentStatus.status === 'idle' && 'Sincronización Completa'}
                    {currentStatus.status === 'error' && 'Error en Sincronización'}
                  </span>
                  {currentStatus.currentFile && (
                    <p className="text-[10px] text-muted-foreground truncate max-w-[200px] mt-0.5">
                      {currentStatus.currentFile}
                    </p>
                  )}
                </div>
                <span className="text-sm font-mono font-bold text-foreground">
                  {progress}%
                </span>
              </div>
              
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/50">
                <div 
                  className={`h-full transition-all duration-300 ${
                    currentStatus.status === 'idle' ? 'bg-green-500' : 
                    currentStatus.status === 'error' ? 'bg-red-500' : 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-muted-foreground bg-muted/20 p-2 rounded">
                <span>Procesados: {currentStatus.processed.toLocaleString()}</span>
                <span>Total: {currentStatus.total.toLocaleString()}</span>
              </div>

              {currentStatus.status === 'idle' && (
                <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-xs font-medium animate-fade-in">
                  <CheckCircle size={16} />
                  <span>Índice actualizado correctamente</span>
                </div>
              )}

              {currentStatus.status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-xs font-medium animate-fade-in">
                  <AlertCircle size={16} />
                  <span>{currentStatus.error || 'Error desconocido'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
