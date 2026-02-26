import { useState, useEffect, useRef } from 'react';
import { Search, Bot, Database, Settings, X, Minus, AlertTriangle, Trash2 } from 'lucide-react';
import { api, FileRecord } from '../lib/api';
import FolderGroup from './FolderGroup';
import FilePreviewModal from './FilePreviewModal';

// Función auxiliar para agrupar archivos por su carpeta contenedora
const groupFilesByPath = (files: FileRecord[]) => {
  return files.reduce((acc, file) => {
    // Extraer directorio padre de la ruta (hasta la última barra)
    const dirMatch = file.file_path.match(/^(.*)[\/\\]/);
    const dir = dirMatch ? dirMatch[1] : '/';
    if (!acc[dir]) {
      acc[dir] = [];
    }
    acc[dir].push(file);
    return acc;
  }, {} as Record<string, FileRecord[]>);
};

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  files?: FileRecord[];
  isError?: boolean;
  hasRestrictedOnly?: boolean;
}

interface FileSearchChatProps {
  onOpenConfig: () => void;
  onOpenAdmin: () => void;
}

export default function FileSearchChat({ onOpenConfig, onOpenAdmin }: FileSearchChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [totalFiles, setTotalFiles] = useState(0);
  const [appVersion, setAppVersion] = useState<string>('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const [updateInfo, setUpdateInfo] = useState<{version?: string, downloaded: boolean} | null>(null);
  
  // Custom dragging state for the bubble
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadServerConfig();
    loadStats();
    addWelcomeMessage();
    if ((window as any).electron) {
      if ((window as any).electron.getAppVersion) {
        (window as any).electron.getAppVersion().then((v: string) => setAppVersion(v));
      }
      if ((window as any).electron.onUpdateAvailable) {
        (window as any).electron.onUpdateAvailable((version: string) => {
          setUpdateInfo({ version, downloaded: false });
        });
      }
      if ((window as any).electron.onUpdateDownloaded) {
        (window as any).electron.onUpdateDownloaded((version: string) => {
          setUpdateInfo({ version, downloaded: true });
        });
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSearching]);

  // Asegurar scroll al fondo cuando se restaura la ventana
  useEffect(() => {
    if (!isMinimized) {
      // Usar un pequeño timeout para asegurar que el elemento ya no tiene 'hidden' y el navegador puede calcular el scroll
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isMinimized]);

  const loadServerConfig = async () => {
    try {
      const config = await api.getConfig();
      if (config) {
        setServerUrl(config.server_url);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setTotalFiles(data.total_files || 0);
    } catch (error) {
      console.error('Error cargando total de archivos:', error);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'bot',
      text: '¡Hola! Soy HellemaBOT. Puedo ayudarte a encontrar archivos rápidamente en la red. ¿Qué estás buscando hoy?',
    };
    setMessages([welcomeMessage]);
  };

  const searchFiles = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSearching(true);
    setInput('');

    try {
      const resp = await api.searchFiles(query);
      
      let results: FileRecord[] = [];
      let botText = '';
      let isRefined = false;

      if (Array.isArray(resp)) {
        results = resp;
      } else {
        if (resp.refine_needed) {
          isRefined = true;
          botText = resp.message || 'Encontré demasiados archivos. Por favor, especifica más.';
        } else {
          results = resp.files || [];
        }
      }

      // Ordenar: más antiguos arriba, más nuevos abajo
      results.sort((a, b) => new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime());

      const accessibleOnly = results.filter(f => f.has_access !== false);
      const allRestricted = results.length > 0 && accessibleOnly.length === 0;

      if (!isRefined) {
        botText = accessibleOnly.length > 0
          ? `Encontré ${accessibleOnly.length} archivo${accessibleOnly.length > 1 ? 's' : ''} que coinciden con "${query}":`
          : results.length > 0 
            ? "" 
            : `No encontré archivos que coincidan con "${query}". Intenta con otros términos.`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: botText,
        files: results,
        hasRestrictedOnly: allRestricted
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error en búsqueda:', error);
      
      let errorText = error.message || 'Ocurrió un error al buscar archivos. Por favor intenta nuevamente.';
      if (errorText.toLowerCase().includes('failed to fetch') || errorText.toLowerCase().includes('network error') || errorText.toLowerCase().includes('fetch')) {
        errorText = 'No se pudo conectar al servidor. Verifique su conexión de red o comuníquese con Soporte TI de Hellema Holland.';
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: errorText,
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSearching) {
      searchFiles(input);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'initial',
      role: 'bot',
      text: '¡Hola! Soy HellemaBOT. Puedo ayudarte a encontrar archivos rápidamente en la red. ¿Qué estás buscando hoy?'
    }]);
    setShowClearModal(false);
  };

  const handleClose = () => {
    if ((window as any).electron && (window as any).electron.closeApp) {
      (window as any).electron.closeApp();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    if ((window as any).electron && (window as any).electron.minimizeToBubble) {
      (window as any).electron.minimizeToBubble();
    }
  };

  const handleRestore = () => {
    setIsMinimized(false);
    if ((window as any).electron && (window as any).electron.restoreFromBubble) {
      (window as any).electron.restoreFromBubble();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.screenX, y: e.screenY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.screenX - dragStart.x;
    const dy = e.screenY - dragStart.y;
    
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      setHasMoved(true);
      if ((window as any).electron && (window as any).electron.dragBubble) {
        (window as any).electron.dragBubble({ deltaX: dx, deltaY: dy });
      }
      setDragStart({ x: e.screenX, y: e.screenY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
    if (!hasMoved) {
      handleRestore();
    }
  };

  return (
    <>
      {/* Burbuja minimizada (Bot) */}
      <div className={`w-[80px] h-[80px] bg-transparent flex items-center justify-center overflow-hidden select-none ${!isMinimized ? 'hidden' : ''}`}>
        <div 
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl cursor-move transition-transform active:scale-95 border border-primary-foreground/20"
          title="Arrastrar o hacer clic para restaurar"
        >
          <Bot size={32} className="pointer-events-none" />
        </div>
      </div>

      {showClearModal && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-in text-foreground p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">¿Limpiar Chat?</h3>
                <p className="text-sm text-muted-foreground mt-2">Esta acción borrará todo el historial de conversación y de búsqueda actual.</p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={clearChat}
                  className="flex-1 py-2.5 rounded-xl font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-md shadow-destructive/20"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interfaz principal del Chat */}
      <div className={`flex flex-col h-[100vh] bg-background text-foreground selection:bg-primary/30 overflow-hidden rounded-xl border border-border shadow-2xl ${isMinimized ? 'hidden' : ''}`}>
        {/* Custom Title Bar / Drag Area */}
        <div 
          className="h-8 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 shrink-0"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground select-none" style={{ WebkitAppRegion: 'no-drag' } as any}>
            {appVersion && `(v${appVersion})`}
          </p>
        <div className="flex items-center gap-1 relative z-50" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button 
            type="button"
            onClick={onOpenConfig}
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-all cursor-pointer"
            title="Configuración"
          >
            <Settings size={14} />
          </button>
          <button 
            type="button"
            onClick={onOpenAdmin}
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-all cursor-pointer"
            title="Administrador"
          >
            <Database size={14} />
          </button>
          <div className="w-px h-4 bg-border mx-1"></div>
          <button 
            type="button"
            onClick={handleMinimize}
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-all cursor-pointer"
            title="Minimizar a Burbuja"
          >
            <Minus size={14} />
          </button>
          <button 
            type="button"
            onClick={handleClose}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all cursor-pointer"
            title="Cerrar"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Header (Simplified) */}
      <header className="bg-card/30 backdrop-blur-xl border-b border-border z-10 transition-all shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 px-2 py-1 rounded-xl">
              <img src="./img/LogoHHE 2.webp" alt="Logo Hellema Holland" className="h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">Hellema Holland BOT</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">En línea</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowClearModal(true)}
                className="p-1.5 hover:bg-destructive/10 rounded-full transition-colors text-muted-foreground hover:text-destructive"
                title="Limpiar chat"
              >
                <Trash2 className="w-[18px] h-[18px]" />
              </button>
              <div className="flex items-center gap-2 bg-secondary/30 border border-border px-3 py-1 rounded-full">
                <span className="text-[10px] font-mono font-medium text-muted-foreground">
                  {totalFiles.toLocaleString()} archivos
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {updateInfo && (
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-3 flex items-center justify-between animate-fade-in shrink-0">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-primary">
              {updateInfo.downloaded 
                ? `Nueva actualización ${updateInfo.version ? `v${updateInfo.version} ` : ''}lista para instalar.`
                : `Descargando actualización ${updateInfo.version ? `v${updateInfo.version}` : ''}...`}
            </p>
          </div>
          {updateInfo.downloaded && (
            <button
              onClick={() => (window as any).electron?.installUpdate?.()}
              className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
            >
              Reiniciar y Actualizar
            </button>
          )}
        </div>
      )}

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message) => {
            const isBot = message.role === 'bot';
            return (
              <div key={message.id} className={`animate-fade-in flex ${isBot ? "" : "flex-row-reverse"}`}>
                <div className={`max-w-full w-full space-y-4 ${isBot ? "" : "text-right"}`}>
                  {/* Solo mostrar la burbuja si hay texto o es un error */}
                  {(message.text !== "" || message.isError) && (
                    <div className={`inline-block rounded-2xl px-5 py-3 text-sm shadow-sm border border-border/50 ${
                      isBot 
                        ? message.isError
                           ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 max-w-[95%]"
                           : "bg-chat-bot text-foreground max-w-[95%]" 
                        : "bg-primary text-primary-foreground font-medium max-w-[85%]"
                    }`}>
                      {message.isError ? (
                        <div className="flex items-start gap-3 text-left">
                          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{message.text}</span>
                        </div>
                      ) : (
                        message.text
                      )}
                    </div>
                  )}
                  
                  {message.hasRestrictedOnly && (
                    <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 flex items-start gap-4 text-left text-yellow-600 dark:text-yellow-500 animate-fade-in shadow-md w-full">
                      <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-base font-bold mb-1">Resultado Restringido</p>
                        <p className="text-sm sm:text-base font-medium leading-relaxed">
                          Usted no tiene acceso a esta carpeta del servidor. Comuníquese con Soporte TI de Hellema Holland.
                        </p>
                      </div>
                    </div>
                  )}

                  {message.files && message.files.length > 0 && (
                    <div className="w-full mt-4 flex flex-col text-left">
                      {Object.entries(groupFilesByPath(message.files)).map(([path, files]) => (
                        <FolderGroup  
                          key={path} 
                          path={path} 
                          files={files} 
                          serverUrl={serverUrl} 
                          onPreview={(file) => setPreviewFile(file)}
                          defaultOpen={messages.indexOf(message) === messages.length - 1}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSearching && (
            <div className="animate-fade-in flex">
              <div className="inline-block rounded-2xl bg-chat-bot px-5 py-3 text-sm text-muted-foreground shadow-sm border border-border/50">
                Buscando los archivos del servidor...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="bg-background/80 backdrop-blur-md border-t border-border p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className={`transition-colors ${isSearching ? "text-primary animate-pulse" : "text-muted-foreground group-focus-within:text-primary"}`} size={20} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Busca archivos del servidor...'
              className="w-full pl-12 pr-28 py-4 bg-card border border-border rounded-2xl focus:ring-0 focus:border-primary transition-all outline-none text-sm placeholder:text-muted-foreground/60 shadow-lg group-hover:border-border/80"
              disabled={isSearching}
            />
            <button
              type="submit"
              disabled={isSearching || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 font-semibold text-xs uppercase tracking-wider"
            >
              {isSearching ? 'Buscando' : 'Buscar'}
            </button>
          </form>
        </div>
      </div>
      </div>
      
      <FilePreviewModal 
        file={previewFile}
        serverUrl={serverUrl}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}
