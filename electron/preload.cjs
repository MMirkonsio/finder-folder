const { contextBridge, ipcRenderer } = require('electron');

// Brindamos acceso seguro a algunas APIs de Electron
contextBridge.exposeInMainWorld('electron', {
  closeApp: () => ipcRenderer.send('window-close'),
  minimizeToBubble: () => ipcRenderer.send('window-minimize-bubble'),
  restoreFromBubble: () => ipcRenderer.send('window-restore-bubble'),
  dragBubble: (data) => ipcRenderer.send('drag-bubble', data),
  openPath: (targetPath) => ipcRenderer.send('open-path', targetPath),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (_, version) => callback(version)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (_, version) => callback(version)),
  installUpdate: () => ipcRenderer.send('install-update'),
});

console.log('Preload script cargado correctamente');
