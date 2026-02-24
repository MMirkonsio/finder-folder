import { 
  FileText, 
  Table, 
  FileSpreadsheet, 
  Presentation, 
  Eye, 
  FolderOpen, 
  EyeOff 
} from "lucide-react";
import { useState } from "react";
import { FileRecord, getFileUrl } from '../lib/api';

interface FileResultProps {
  file: FileRecord;
  serverUrl: string;
}

const iconMap: Record<string, React.ElementType> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  ppt: Presentation,
  pptx: Presentation,
  txt: FileText,
  csv: Table,
  default: FileText,
};

export default function FileResult({ file, serverUrl }: FileResultProps) {
  const [showPreview, setShowPreview] = useState(false);
  
  const Icon = iconMap[file.file_type.toLowerCase()] || iconMap.default;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileColors = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'pdf') return { text: 'text-red-500', bg: 'bg-red-500/15' };
    if (['doc', 'docx'].includes(t)) return { text: 'text-blue-500', bg: 'bg-blue-500/15' };
    if (['xls', 'xlsx', 'csv'].includes(t)) return { text: 'text-green-500', bg: 'bg-green-500/15' };
    return { text: 'text-primary', bg: 'bg-primary/15' };
  };

  const handleOpen = () => {
    // Attempt to use the native Electron shell to open the folder locally
    if ((window as any).electron && (window as any).electron.openPath) {
      (window as any).electron.openPath(file.absolute_path || file.file_path);
    } else {
      // Fallback to proxy if opening in standard browser context
      const proxyUrl = getFileUrl(file.id, serverUrl);
      window.open(proxyUrl, '_blank');
    }
  };

  return (
    <div className="animate-fade-in group space-y-0">
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 backdrop-blur-sm px-4 py-3 transition-colors hover:bg-file-hover">
        {/* Icon */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${getFileColors(file.file_type).bg}`}>
          <Icon className={`h-5 w-5 ${getFileColors(file.file_type).text}`} />
        </div>
        
        {/* Name & path */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors" title={file.file_name}>
            {file.file_name}
          </p>
          <p className="truncate font-mono text-[10px] text-muted-foreground mt-0.5 opacity-70" title={file.absolute_path || file.file_path}>
            {file.file_path}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
            <span>Modificado: {new Date(file.last_modified).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-1.5 ml-2">
          <button
            onClick={handleOpen}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary/50 text-muted-foreground transition-all hover:bg-primary/20 hover:text-primary hover:border-primary/30"
            title="Abrir ubicación"
          >
            <FolderOpen className="h-4 w-4" />
          </button>
          
          {['pdf', 'jpg', 'jpeg', 'png'].includes(file.file_type.toLowerCase()) && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex h-8 w-8 items-center justify-center rounded-md border border-border transition-all ${
                showPreview 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-secondary/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title={showPreview ? "Ocultar" : "Previsualizar"}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {showPreview && (
        <div className="animate-fade-in mx-4 rounded-b-md border border-t-0 border-border bg-background/50 backdrop-blur-md p-4 shadow-xl">
          {file.file_type.toLowerCase() === 'pdf' ? (
            <iframe 
              src={getFileUrl(file.id, serverUrl)} 
              className="w-full h-96 rounded border border-border bg-white"
            />
          ) : ['jpg', 'jpeg', 'png'].includes(file.file_type.toLowerCase()) ? (
            <img 
              src={getFileUrl(file.id, serverUrl)} 
              alt={file.file_name}
              className="max-w-full h-auto rounded mx-auto"
            />
          ) : (
            <div className="font-mono text-xs text-muted-foreground bg-muted/30 p-3 rounded overflow-auto max-h-60">
              Contenido de previsualización no disponible para este formato directamente. 
              <button 
                onClick={handleOpen}
                className="block mt-2 text-primary hover:underline"
              >
                Abrir en nueva pestaña
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
