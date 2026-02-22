import { FileText, Eye, ExternalLink, User, HardDrive } from 'lucide-react';
import { FileRecord } from '../lib/supabase';

interface FileResultProps {
  file: FileRecord;
  serverUrl: string;
}

export default function FileResult({ file, serverUrl }: FileResultProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(type)) {
      return '🖼️';
    } else if (['pdf'].includes(type)) {
      return '📄';
    } else if (['doc', 'docx'].includes(type)) {
      return '📝';
    } else if (['xls', 'xlsx'].includes(type)) {
      return '📊';
    } else if (['zip', 'rar', '7z'].includes(type)) {
      return '🗜️';
    } else if (['mp4', 'avi', 'mkv', 'mov'].includes(type)) {
      return '🎬';
    } else if (['mp3', 'wav', 'flac'].includes(type)) {
      return '🎵';
    }
    return '📁';
  };

  const handleOpen = () => {
    const fullUrl = `${serverUrl}${file.file_path}`;
    window.open(fullUrl, '_blank');
  };

  const handlePreview = () => {
    const fullUrl = `${serverUrl}${file.file_path}`;
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      const fileType = file.file_type.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileType)) {
        previewWindow.document.write(`
          <html>
            <head><title>Preview: ${file.file_name}</title></head>
            <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#000;">
              <img src="${fullUrl}" style="max-width:100%;max-height:100vh;" />
            </body>
          </html>
        `);
      } else if (fileType === 'pdf') {
        previewWindow.location.href = fullUrl;
      } else if (['mp4', 'webm', 'ogg'].includes(fileType)) {
        previewWindow.document.write(`
          <html>
            <head><title>Preview: ${file.file_name}</title></head>
            <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#000;">
              <video controls style="max-width:100%;max-height:100vh;">
                <source src="${fullUrl}" type="video/${fileType}">
              </video>
            </body>
          </html>
        `);
      } else if (['mp3', 'wav', 'ogg'].includes(fileType)) {
        previewWindow.document.write(`
          <html>
            <head><title>Preview: ${file.file_name}</title></head>
            <body style="margin:0;padding:20px;background:#1a1a1a;color:#fff;">
              <h2>${file.file_name}</h2>
              <audio controls style="width:100%;">
                <source src="${fullUrl}" type="audio/${fileType}">
              </audio>
            </body>
          </html>
        `);
      } else {
        previewWindow.location.href = fullUrl;
      }
    }
  };

  const copyPath = () => {
    navigator.clipboard.writeText(file.file_path);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{getFileIcon(file.file_type)}</div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
            {file.file_name}
          </h3>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <HardDrive size={14} />
              <button
                onClick={copyPath}
                className="font-mono text-xs truncate hover:text-blue-600 transition-colors"
                title="Clic para copiar ruta"
              >
                {file.file_path}
              </button>
            </div>

            {file.owner_user && (
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{file.owner_user}</span>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs">
              <span className="font-medium">{file.file_type.toUpperCase()}</span>
              <span>{formatFileSize(file.file_size)}</span>
              <span>{new Date(file.last_modified).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handlePreview}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye size={18} />
          Previsualizar
        </button>

        <button
          onClick={handleOpen}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <ExternalLink size={18} />
          Abrir
        </button>
      </div>
    </div>
  );
}
