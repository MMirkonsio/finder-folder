import { useState, useEffect, useRef } from 'react';
import { Search, Loader, MessageSquare, Database } from 'lucide-react';
import { supabase, FileRecord } from '../lib/supabase';
import FileResult from './FileResult';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
  files?: FileRecord[];
}

export default function FileSearchChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [totalFiles, setTotalFiles] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadServerConfig();
    loadTotalFiles();
    addWelcomeMessage();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadServerConfig = async () => {
    try {
      const { data } = await supabase
        .from('server_config')
        .select('server_url')
        .maybeSingle();

      if (data) {
        setServerUrl(data.server_url);
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const loadTotalFiles = async () => {
    try {
      const { count } = await supabase
        .from('files_index')
        .select('*', { count: 'exact', head: true });

      setTotalFiles(count || 0);
    } catch (error) {
      console.error('Error cargando total de archivos:', error);
    }
  };

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: 'Hola! Soy tu asistente de búsqueda de archivos. Puedes buscar por nombre de archivo o usuario. Por ejemplo: "documento.pdf" o "usuario: Juan"',
    };
    setMessages([welcomeMessage]);
  };

  const searchFiles = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSearching(true);

    try {
      let results: FileRecord[] = [];

      if (query.toLowerCase().startsWith('usuario:')) {
        const username = query.substring(8).trim();
        const { data, error } = await supabase
          .from('files_index')
          .select('*')
          .ilike('owner_user', `%${username}%`)
          .order('last_modified', { ascending: false })
          .limit(50);

        if (error) throw error;
        results = data || [];
      } else {
        const searchTerms = query.split(' ').filter(t => t.length > 0);
        let queryBuilder = supabase
          .from('files_index')
          .select('*');

        searchTerms.forEach(term => {
          queryBuilder = queryBuilder.or(`file_name.ilike.%${term}%,file_path.ilike.%${term}%`);
        });

        const { data, error } = await queryBuilder
          .order('last_modified', { ascending: false })
          .limit(50);

        if (error) throw error;
        results = data || [];
      }

      const systemMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: results.length > 0
          ? `Encontré ${results.length} archivo${results.length > 1 ? 's' : ''} que coinciden con tu búsqueda:`
          : 'No encontré archivos que coincidan con tu búsqueda. Intenta con otros términos.',
        files: results,
      };

      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Ocurrió un error al buscar archivos. Por favor intenta nuevamente.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSearching(false);
      setInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSearching) {
      searchFiles(input);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Buscador de Archivos</h1>
                <p className="text-sm text-gray-600">Sistema de búsqueda optimizado</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Database size={20} className="text-blue-600" />
              <div className="text-sm">
                <span className="font-semibold text-gray-800">{totalFiles.toLocaleString()}</span>
                <span className="text-gray-600"> archivos indexados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-3xl rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white shadow-md text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>

              {message.files && message.files.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {message.files.map((file) => (
                    <FileResult key={file.id} file={file} serverUrl={serverUrl} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {isSearching && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md rounded-lg px-4 py-3 flex items-center gap-3">
                <Loader className="animate-spin text-blue-600" size={20} />
                <span className="text-gray-600">Buscando archivos...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Busca por nombre de archivo o escribe "usuario: nombre"'
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSearching}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Ejemplos: "documento.pdf", "usuario: Juan", "reporte 2024"
          </p>
        </div>
      </div>
    </div>
  );
}
