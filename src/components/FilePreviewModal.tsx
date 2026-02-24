import { X, ExternalLink } from 'lucide-react';
import { FileRecord, getFileUrl } from '../lib/api';

interface FilePreviewModalProps {
  file: FileRecord | null;
  serverUrl: string;
  onClose: () => void;
}

export default function FilePreviewModal({ file, serverUrl, onClose }: FilePreviewModalProps) {
  if (!file) return null;

  const fileUrl = getFileUrl(file.id, serverUrl);
  const isPdf = file.file_type.toLowerCase() === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png'].includes(file.file_type.toLowerCase());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fade-in shadow-2xl">
      <div className="bg-card w-full max-w-5xl h-[90vh] rounded-3xl border border-border overflow-hidden flex flex-col shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/20">
          <div className="flex items-center gap-4 min-w-0 pr-4">
            <div className="min-w-0">
               <h2 className="text-base font-bold truncate text-foreground" title={file.file_name}>
                {file.file_name}
              </h2>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5 opacity-70 truncate max-w-lg">
                {file.absolute_path || file.file_path}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
              title="Cerrar previsualización"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-muted/30 relative overflow-hidden flex items-center justify-center p-4 sm:p-8">
          {isPdf ? (
            <iframe 
              src={fileUrl} 
              className="w-full h-full rounded-2xl border border-border bg-white shadow-lg"
              title={file.file_name}
            />
          ) : isImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={fileUrl} 
                alt={file.file_name}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-border bg-white/5"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center max-w-md animate-fade-in">
                <div className="bg-primary/10 p-6 rounded-full mb-4">
                     <FileText size={48} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Este archivo no se puede previsualizar</h3>
                <p className="text-muted-foreground text-sm mb-6">
                    El formato del archivo no permite una vista previa interactiva. 
                    Puedes abrirlo directamente en tu navegador o en la carpeta local.
                </p>
                <div className="flex gap-4">
                    <button 
                         onClick={() => window.open(fileUrl, '_blank')}
                         className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95"
                    >
                        <ExternalLink size={18} />
                        Ver en navegador
                    </button>
                </div>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-3 border-t border-border bg-card/50 flex justify-between items-center text-[11px] font-mono text-muted-foreground">
             <span>Tipo: {file.file_type.toUpperCase()}</span>
             <span>Modificado: {new Date(file.last_modified).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

import { Bot, FileText } from 'lucide-react';
