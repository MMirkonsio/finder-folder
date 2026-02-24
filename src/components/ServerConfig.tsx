import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, X, Loader } from 'lucide-react';
import { api } from '../lib/api';

interface ServerConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

const PREDEFINED_PATHS = [
  { id: 0, title: "📁 Recursos Humanos", path: "\\\\192.168.0.7\\archivos_hhe\\RRHH", desc: "Contratos, Finiquitos y Documentación de Personal" },
  { id: 1, title: "📄 Gestión de Contratos", path: "\\\\192.168.0.7\\archivos_hhe\\Gestion Contratos", desc: "Acuerdos Comerciales y Contratos de Servicios" },
  { id: 2, title: "📊 Finanzas", path: "\\\\192.168.0.7\\archivos_hhe\\Finanzas", desc: "Reportes Financieros y Contabilidad" },
  { id: 3, title: "🛒 Compras", path: "\\\\192.168.0.7\\archivos_hhe\\Compras", desc: "Órdenes de Compra y Gestión de Proveedores" },
  { id: 4, title: "💰 Contabilidad", path: "\\\\192.168.0.7\\archivos_hhe\\Contabilidad", desc: "Libros, Balances y Documentos Contables" },
  { id: 5, title: "🧾 Facturas", path: "\\\\192.168.0.7\\archivos_hhe\\Facturas", desc: "Facturación Electrónica y Comprobantes" },
  { id: 6, title: "🚛 Logística", path: "\\\\192.168.0.7\\archivos_hhe\\Logistica", desc: "Guías de Despacho y Control de Inventarios" },
];

export default function ServerConfig({ isOpen, onClose, onConfigSaved }: ServerConfigProps) {
  const [serverUrl, setServerUrl] = useState('');
  const [rootPaths, setRootPaths] = useState<string[]>(Array(10).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    try {
      const config = await api.getConfig();
      if (config) {
        setServerUrl(config.server_url);
        setRootPaths([
          config.root_path || '',
          config.root_path_2 || '',
          config.root_path_3 || '',
          config.root_path_4 || '',
          config.root_path_5 || '',
          config.root_path_6 || '',
          config.root_path_7 || '',
          config.root_path_8 || '',
          config.root_path_9 || '',
          config.root_path_10 || ''
        ]);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      await api.saveConfig({
        server_url: serverUrl,
        root_path: rootPaths[0],
        root_path_2: rootPaths[1],
        root_path_3: rootPaths[2],
        root_path_4: rootPaths[3],
        root_path_5: rootPaths[4],
        root_path_6: rootPaths[5],
        root_path_7: rootPaths[6],
        root_path_8: rootPaths[7],
        root_path_9: rootPaths[8],
        root_path_10: rootPaths[9],
      });
      setStatus({ type: 'success', message: 'Configuración guardada correctamente' });
      onConfigSaved();
      setTimeout(() => onClose(), 1500);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Error al guardar la configuración' });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePath = (index: number, pathValue: string) => {
    const newPaths = [...rootPaths];
    if (newPaths[index] === pathValue) {
      newPaths[index] = '';
    } else {
      newPaths[index] = pathValue;
    }
    setRootPaths(newPaths);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in text-foreground">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="text-primary" size={20} />
            <h2 className="text-lg font-bold">Configuración</h2>
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
              const isChecked = rootPaths[item.id] === item.path;
              return (
                <label 
                  key={item.id} 
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-primary/10 border-primary shadow-sm' 
                      : 'bg-card border-border hover:bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center h-5 mt-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePath(item.id, item.path)}
                      className="w-5 h-5 rounded border-gray-400 text-primary focus:ring-primary/50 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isChecked ? 'text-primary' : 'text-foreground'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate leading-relaxed">
                      {item.desc}
                    </p>
                    {isChecked && (
                      <p className="text-[9px] font-mono text-primary/70 mt-1.5 truncate">
                        Ruta: {item.path}
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {status && (
            <div className={`flex items-center gap-3 p-3 rounded-xl text-xs font-medium animate-fade-in ${
              status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{status.message}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold transition-all shadow-lg hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {isLoading ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
