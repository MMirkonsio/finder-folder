const API_URL = 'http://127.0.0.1:3001/api';
export const API_BASE_URL = 'http://127.0.0.1:3001';

export interface FileRecord {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  owner_user: string;
  last_modified: string;
  created_at: string;
  updated_at: string;
  absolute_path?: string;
  has_access?: boolean;
}

export interface ServerConfig {
  id: string;
  server_url: string;
  root_path: string | null;
  root_path_2: string | null;
  root_path_3: string | null;
  root_path_4: string | null;
  root_path_5: string | null;
  root_path_6: string | null;
  root_path_7: string | null;
  root_path_8: string | null;
  root_path_9: string | null;
  root_path_10: string | null;
  last_scan: string | null;
  total_files: number;
  created_at: string;
  updated_at: string;
}

export interface SyncStatus {
  isScanning: boolean;
  processed: number;
  total: number;
  currentFile: string;
  status: 'idle' | 'scanning' | 'comparing' | 'deleting' | 'indexing' | 'completed' | 'error';
  error: string | null;
}

export const getFileUrl = (fileId: string, configServerUrl?: string) => {
  // If user has a valid server_url in config, use it, otherwise fallback to local backend
  const base = (configServerUrl && configServerUrl.startsWith('http')) 
    ? configServerUrl 
    : API_BASE_URL;
  
  return `${base}/api/files/${fileId}`;
};

export const api = {
  getStats: async () => {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Error fetching stats');
    return response.json();
  },
  
  searchFiles: async (query: string): Promise<FileRecord[]> => {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Error searching files');
    }
    return response.json();
  },
  
  syncFiles: async (files: any[]) => {
    const response = await fetch(`${API_URL}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files }),
    });
    if (!response.ok) throw new Error('Error syncing files');
    return response.json();
  },

  scanFilesFromServer: async () => {
    const response = await fetch(`${API_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error scanning from server');
    }
    return response.json();
  },

  getSyncStatus: async (): Promise<SyncStatus> => {
    const response = await fetch(`${API_URL}/sync-status`);
    if (!response.ok) throw new Error('Error fetching sync status');
    return response.json();
  },
  
  getConfig: async (): Promise<ServerConfig> => {
    const response = await fetch(`${API_URL}/config`);
    if (!response.ok) throw new Error('Error fetching config');
    return response.json();
  },
  
  saveConfig: async (config: Partial<ServerConfig>) => {
    const response = await fetch(`${API_URL}/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!response.ok) throw new Error('Error saving config');
    return response.json();
  },
};
