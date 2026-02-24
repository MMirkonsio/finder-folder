const { contextBridge, ipcRenderer } = require('electron');

// Brindamos acceso seguro a algunas APIs de Electron
contextBridge.exposeInMainWorld('electron', {
  closeApp: () => ipcRenderer.send('window-close'),
  minimizeToBubble: () => ipcRenderer.send('window-minimize-bubble'),
  restoreFromBubble: () => ipcRenderer.send('window-restore-bubble'),
  dragBubble: (data) => ipcRenderer.send('drag-bubble', data),
  openPath: (targetPath) => ipcRenderer.send('open-path', targetPath),
});

console.log('Preload script cargado correctamente');
