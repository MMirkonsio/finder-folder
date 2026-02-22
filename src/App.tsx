import { useState } from 'react';
import FileSearchChat from './components/FileSearchChat';
import ServerConfig from './components/ServerConfig';
import AdminPanel from './components/AdminPanel';

function App() {
  const [configKey, setConfigKey] = useState(0);

  const handleConfigSaved = () => {
    setConfigKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <FileSearchChat key={configKey} />
      <ServerConfig onConfigSaved={handleConfigSaved} />
      <AdminPanel />
    </div>
  );
}

export default App;
