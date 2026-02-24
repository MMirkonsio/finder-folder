import { useState } from 'react';
import FileSearchChat from './components/FileSearchChat';
import ServerConfig from './components/ServerConfig';
import AdminPanel from './components/AdminPanel';

function App() {
  const [configKey, setConfigKey] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleConfigSaved = () => {
    setConfigKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <FileSearchChat 
        key={configKey} 
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
      
      <ServerConfig 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
        onConfigSaved={handleConfigSaved} 
      />
      
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />
    </div>
  );
}

export default App;
