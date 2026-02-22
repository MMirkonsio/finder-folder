import { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, ServerConfig as ServerConfigType } from '../lib/supabase';

interface ServerConfigProps {
  onConfigSaved: () => void;
}

export default function ServerConfig({ onConfigSaved }: ServerConfigProps) {
  const [serverUrl, setServerUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('server_config')
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setServerUrl(data.server_url);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const saveConfig = async () => {
    if (!serverUrl.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa una URL válida' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const { data: existing } = await supabase
        .from('server_config')
        .select('id')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('server_config')
          .update({ server_url: serverUrl })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('server_config')
          .insert({ server_url: serverUrl });

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'Configuración guardada exitosamente' });
      onConfigSaved();
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Configuración del servidor"
      >
        <Settings size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Configuración del Servidor</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="serverUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  URL del Servidor Local
                </label>
                <input
                  id="serverUrl"
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  placeholder="http://192.168.1.100:8000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Ingresa la URL base de tu servidor de archivos local
                </p>
              </div>

              {message && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <span className="text-sm">{message.text}</span>
                </div>
              )}

              <button
                onClick={saveConfig}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {isSaving ? 'Guardando...' : 'Guardar Configuración'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
