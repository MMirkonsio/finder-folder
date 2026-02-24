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
  const [isMinimized, setIsMinimized] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  
  // Custom dragging state for the bubble
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadServerConfig();
    loadStats();
    addWelcomeMessage();
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
      text: '¡Hola! Soy tu asistente de búsqueda de archivos. ¿En qué puedo ayudarte hoy?',
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
      const results = await api.searchFiles(query);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: results.length > 0
          ? `Encontré ${results.length} archivo${results.length > 1 ? 's' : ''} que coinciden con "${query}":`
          : `No encontré archivos que coincidan con "${query}". Intenta con otros términos.`,
        files: results,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error en búsqueda:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: error.message || 'Ocurrió un error al buscar archivos. Por favor intenta nuevamente.',
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

      {/* Interfaz principal del Chat */}
      <div className={`flex flex-col h-[100vh] bg-background text-foreground selection:bg-primary/30 overflow-hidden rounded-xl border border-border shadow-2xl ${isMinimized ? 'hidden' : ''}`}>
        {/* Custom Title Bar / Drag Area */}
        <div 
          className="h-8 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-end px-4 shrink-0"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
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
                <h1 className="text-base font-bold tracking-tight">Hellema Holland</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">En línea</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={clearChat}
                className="p-1.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-destructive"
                title="Limpiar chat"
              >
                <Trash2 className="w-4 h-4" />
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

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((message) => {
            const isBot = message.role === 'bot';
            return (
              <div key={message.id} className={`animate-fade-in flex ${isBot ? "" : "flex-row-reverse"}`}>
                
                <div className={`max-w-full w-full space-y-4 ${isBot ? "" : "text-right"}`}>
                  <div className={`inline-block rounded-2xl px-5 py-3 text-sm shadow-sm border border-border/50 ${
                    isBot 
                      ? message.isError
                         ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 max-w-[95%]"
                         : "bg-chat-bot text-foreground max-w-[95%]" 
                      : "bg-primary text-primary-foreground font-medium max-w-[85%]"
                  }`}>
                    {message.isError ? (
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{message.text}</span>
                      </div>
                    ) : (
                      message.text
                    )}
                  </div>
                  
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
