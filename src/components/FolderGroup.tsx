import React, { useState, memo } from 'react';
import { 
  FileText, 
  Eye, 
  FolderOpen,
  ChevronDown, 
  ChevronRight,
  FileSpreadsheet,
  Presentation,
  Table,
  Lock
} from 'lucide-react';
import { FileRecord, getFileUrl } from '../lib/api';

interface FolderGroupProps {
  path: string;
  files: FileRecord[];
  serverUrl: string;
  onPreview: (file: FileRecord) => void;
  defaultOpen?: boolean;
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

const getFileColors = (type: string) => {
  const t = type.toLowerCase();
  if (t === 'pdf') return { text: 'text-red-500', bg: 'bg-red-500/15', groupHoverBg: 'group-hover:bg-red-500/20' };
  if (['doc', 'docx'].includes(t)) return { text: 'text-blue-500', bg: 'bg-blue-500/15', groupHoverBg: 'group-hover:bg-blue-500/20' };
  if (['xls', 'xlsx', 'csv'].includes(t)) return { text: 'text-green-500', bg: 'bg-green-500/15', groupHoverBg: 'group-hover:bg-green-500/20' };
  return { text: 'text-primary', bg: 'bg-primary/10', groupHoverBg: 'group-hover:bg-primary/20' };
};

const FolderGroup = memo(function FolderGroup({ 
  path, 
  files, 
  serverUrl, 
  onPreview, 
  defaultOpen = false 
}: FolderGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleOpen = (file: FileRecord) => {
    if ((window as any).electron && (window as any).electron.openPath) {
      (window as any).electron.openPath(file.absolute_path || file.file_path);
    } else {
      const proxyUrl = getFileUrl(file.id, serverUrl);
      window.open(proxyUrl, '_blank');
    }
  };

  return (
    <div className="mb-4 bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Cabecera de la carpeta */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between p-3 bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-colors border-b border-border"
      >
        <div className="flex items-center gap-3 w-full min-w-0 pr-4">
          <h3 className="font-medium text-xs text-foreground tracking-wide truncate" title={path || '/'}>{path || '/'}</h3>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="text-xs bg-secondary/50 px-2 py-1 rounded-full text-foreground">
            {files.length} archivo{files.length !== 1 && 's'}
          </span>
          {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Lista de archivos */}
      {isOpen && (
        <div className="relative py-2">
          {files.map((file, index) => {
            const isLast = index === files.length - 1;
            const Icon = iconMap[file.file_type.toLowerCase()] || iconMap.default;
            const colors = getFileColors(file.file_type);
            const canPreview = ['pdf', 'jpg', 'jpeg', 'png'].includes(file.file_type.toLowerCase());

            return (
              <div key={file.id} className="relative flex flex-col ml-11 mr-3 my-0.5">
                
                {/* L-Shape Branch (Curva de la rama) */}
                <div 
                  className="absolute border-l-[2px] border-b-[2px] border-border/50 rounded-bl-[16px] pointer-events-none z-0 transition-all duration-300"
                  style={{
                    left: '-22px', 
                    top: index === 0 ? '-10px' : '-24px', 
                    bottom: '50%',
                    width: '22px' 
                  }}
                />

                {/* Vertical Trunk Line (Línea vertical) */}
                {!isLast && (
                  <div 
                    className="absolute border-l-[2px] border-border/50 pointer-events-none z-0 transition-all duration-300"
                    style={{
                      left: '-22px',
                      top: '50%', 
                      bottom: '-24px', 
                    }}
                  />
                )}

                <div className={`relative z-10 flex items-center justify-between p-2 rounded-lg group transition-colors m-1 ${file.has_access === false ? 'opacity-70 bg-secondary/10 cursor-not-allowed' : 'hover:bg-secondary/30'}`} title={file.has_access === false ? 'No tienes permisos de red para acceder a este archivo.' : ''}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`p-2 rounded-lg transition-colors ${file.has_access === false ? 'bg-secondary text-muted-foreground/50' : `${colors.bg} ${colors.groupHoverBg}`}`}>
                      {file.has_access === false ? <Lock className="w-4 h-4 text-muted-foreground/70" /> : <Icon className={`w-4 h-4 ${colors.text}`} />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium transition-colors truncate ${file.has_access === false ? 'text-muted-foreground/70 line-through' : 'text-foreground/90 group-hover:text-foreground'}`} title={file.file_name}>
                        {file.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 opacity-70 truncate" title={file.absolute_path || file.file_path}>
                        {file.has_access === false ? 'Acceso no disponible 🚫' : `Modificado: ${new Date(file.last_modified).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  {file.has_access !== false && (
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                      <button 
                        onClick={() => handleOpen(file)}
                        title="Abrir ubicación" 
                        className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <FolderOpen className="w-4 h-4"/>
                      </button>
                      {canPreview && (
                        <button 
                          onClick={() => onPreview(file)}
                          title="Ver archivo" 
                          className="p-1.5 rounded-md transition-colors hover:bg-secondary text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="w-4 h-4"/>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default FolderGroup;
