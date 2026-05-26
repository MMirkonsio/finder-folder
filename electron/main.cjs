
const { app, BrowserWindow, shell, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const { fork } = require('child_process');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

if (process.platform === 'win32') {
  app.setAppUserModelId('com.hellemabot');
}

let mainWindow;
let serverProcess;
let tray = null;
let isQuitting = false;

let previousBounds = { x: 0, y: 0, width: 450, height: 750 };
let bubbleBounds = null;

ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.on('install-update', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('window-minimize-bubble', () => {
  if (mainWindow) {
    previousBounds = mainWindow.getBounds();
    const bubbleSize = 80;

    let newX, newY;
    if (bubbleBounds) {
      newX = bubbleBounds.x;
      newY = bubbleBounds.y;
    } else {
      newX = previousBounds.x + (previousBounds.width / 2) - (bubbleSize / 2);
      newY = previousBounds.y + (previousBounds.height / 2) - (bubbleSize / 2);
    }

    mainWindow.setMinimumSize(80, 80);
    mainWindow.setMaximumSize(80, 80);
    mainWindow.setBounds({
      x: Math.round(newX),
      y: Math.round(newY),
      width: bubbleSize,
      height: bubbleSize
    }, true);
    mainWindow.setAlwaysOnTop(true, 'floating');

    bubbleBounds = mainWindow.getBounds();
  }
});

ipcMain.on('window-restore-bubble', () => {
  if (mainWindow) {
    bubbleBounds = mainWindow.getBounds();
    const { screen } = require('electron');
    const primaryDisplay = screen.getDisplayMatching(bubbleBounds);
    const workArea = primaryDisplay.workArea;

    mainWindow.setMinimumSize(450, 600);
    mainWindow.setMaximumSize(10000, 10000);

    const chatWidth = previousBounds.width;
    const chatHeight = previousBounds.height;

    let newX = bubbleBounds.x + (bubbleBounds.width / 2) - (chatWidth / 2);
    let newY = bubbleBounds.y + (bubbleBounds.height / 2) - (chatHeight / 2);

    if (newX < workArea.x) newX = workArea.x;
    if (newY < workArea.y) newY = workArea.y;
    if (newX + chatWidth > workArea.x + workArea.width) newX = workArea.x + workArea.width - chatWidth;
    if (newY + chatHeight > workArea.y + workArea.height) newY = workArea.y + workArea.height - chatHeight;

    mainWindow.setBounds({
      x: Math.round(newX),
      y: Math.round(newY),
      width: chatWidth,
      height: chatHeight
    }, true);

    mainWindow.setAlwaysOnTop(true, 'floating');
  }
});

ipcMain.on('drag-bubble', (event, { deltaX, deltaY }) => {
  if (mainWindow) {
    const bounds = mainWindow.getBounds();
    const newX = bounds.x + deltaX;
    const newY = bounds.y + deltaY;

    mainWindow.setBounds({
      x: newX,
      y: newY,
      width: bounds.width,
      height: bounds.height
    });

    bubbleBounds = { x: newX, y: newY, width: bounds.width, height: bounds.height };
  }
});

ipcMain.on('open-path', (event, targetPath) => {
  shell.showItemInFolder(targetPath);
});

function setupDatabase() {
  if (isDev) {
    const localDbPath = path.join(__dirname, '..', 'dev.db');
    console.log('Modo dev: Usando base de datos local del proyecto:', localDbPath);
    return localDbPath;
  }

  const dataDir = path.join(app.getPath('userData'), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'dev.db');

  if (!fs.existsSync(dbPath)) {
    console.log('Creando base de datos inicial en carpeta de datos...');
    const sourceDb = path.join(process.resourcesPath, 'dev.db');

    if (fs.existsSync(sourceDb)) {
      fs.copyFileSync(sourceDb, dbPath);
      console.log('Base de datos copiada exitosamente a', dbPath);
    } else {
      console.error('No se encontró base de datos de origen en', sourceDb);
    }
  }

  try {
    if (fs.existsSync(dbPath)) fs.chmodSync(dbPath, 0o666);
  } catch(e) {
    console.error('Fallo al forzar permisos DB:', e);
  }

  return dbPath;
}

function startServer() {
  console.log('Iniciando servidor backend...');
  const dbPath = setupDatabase();
  console.log(`Usando base de datos en: ${dbPath}`);

  const projectRoot = isDev
    ? path.join(__dirname, '..')
    : path.join(process.resourcesPath, 'app');

  const serverPath = path.join(projectRoot, 'server', 'index.js');
  console.log(`Ruta del servidor resuelta: ${serverPath}`);

  const dataDir = path.join(app.getPath('userData'), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const logPath = path.join(dataDir, 'server.log');
  fs.writeFileSync(logPath, `Iniciando log del servidor... ${new Date().toISOString()}\n`);

  const env = {
    ...process.env,
    PORT: '3001',
    DATABASE_URL: `file:${dbPath.replace(/\\/g, '/')}`,
    // Guardar modelos AI en la carpeta de la app para acceso consistente
    TRANSFORMERS_CACHE: path.join(app.getPath('userData'), 'models'),
  };

  serverProcess = fork(serverPath, [], {
    cwd: isDev ? path.join(projectRoot, 'server') : dataDir,
    env: env,
    stdio: 'pipe'
  });

  if (serverProcess.stdout) {
    serverProcess.stdout.on('data', (data) => {
      console.log(`[Server]: ${data}`);
      fs.appendFileSync(logPath, `[OUT]: ${data}\n`);
    });
  }
  if (serverProcess.stderr) {
    serverProcess.stderr.on('data', (data) => {
      console.error(`[Server Error]: ${data}`);
      fs.appendFileSync(logPath, `[ERR]: ${data}\n`);
    });
  }

  serverProcess.on('error', (err) => {
    console.error('[Server] Error de proceso:', err.message);
    fs.appendFileSync(logPath, `[PROC_ERR]: ${err.message}\n`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Servidor cerrado con código ${code}`);
    fs.appendFileSync(logPath, `[CLOSE]: Code ${code}\n`);
  });

  // Retorna una promesa que se resuelve cuando el servidor está listo
  return new Promise((resolve) => {
    let resolved = false;
    const done = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    // El servidor envía 'ready' cuando está escuchando
    serverProcess.on('message', (msg) => {
      if (msg === 'ready') {
        console.log('[Main] Servidor listo y aceptando conexiones.');
        done();
      }
    });

    // Timeout de seguridad: si el servidor no responde en 20s, continuar igual
    setTimeout(() => {
      console.warn('[Main] Timeout esperando servidor. Continuando...');
      done();
    }, 20000);

    serverProcess.on('error', done);
  });
}

function createWindow() {
  const iconPath = isDev
    ? path.join(__dirname, '../public/img/icon.ico')
    : path.join(__dirname, '../dist/img/icon.ico');

  mainWindow = new BrowserWindow({
    icon: iconPath,
    width: 450,
    height: 750,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    title: 'Hellema Holland BOT',
    alwaysOnTop: true,
    show: false,
  });

  mainWindow.setMenu(null);

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (!mainWindow.isVisible()) mainWindow.show();
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('ready', async () => {
    // Esperar que el servidor esté listo antes de mostrar la ventana
    await startServer();
    createWindow();

    const trayIconPath = isDev
      ? path.join(__dirname, '../public/img/icon.ico')
      : path.join(__dirname, '../dist/img/icon.ico');

    tray = new Tray(trayIconPath);
    tray.setToolTip('Hellema Holland BOT');

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Mostrar',
        click: () => {
          if (mainWindow) mainWindow.show();
        }
      },
      { type: 'separator' },
      {
        label: 'Cerrar',
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.focus();
        } else {
          mainWindow.show();
        }
      }
    });

    if (!isDev) {
      autoUpdater.autoDownload = true;
      autoUpdater.autoInstallOnAppQuit = true;
      autoUpdater.checkForUpdates();

      autoUpdater.on('update-available', (info) => {
        if (mainWindow) mainWindow.webContents.send('update-available', info.version);
      });

      autoUpdater.on('update-downloaded', (info) => {
        if (mainWindow) mainWindow.webContents.send('update-downloaded', info.version);
      });
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('quit', () => {
    if (serverProcess) {
      console.log('Cerrando servidor backend...');
      serverProcess.kill();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
}
