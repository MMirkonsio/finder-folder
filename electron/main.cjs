
const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = !app.isPackaged;
const { fork } = require('child_process');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let serverProcess;

// Variables to store bounds for restoring
let previousBounds = { x: 0, y: 0, width: 450, height: 750 };
let bubbleBounds = null;

// Manejar eventos desde el renderizado
ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
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
    
    // Set strictly fixed size for bubble to prevent OS snapping/resizing
    mainWindow.setMinimumSize(80, 80);
    mainWindow.setMaximumSize(80, 80);
    mainWindow.setBounds({ 
      x: Math.round(newX), 
      y: Math.round(newY), 
      width: bubbleSize, 
      height: bubbleSize 
    }, true);
    mainWindow.setAlwaysOnTop(true, 'floating');
    
    // Store exact bubble bounds for consistent re-minimization
    bubbleBounds = mainWindow.getBounds();
  }
});

ipcMain.on('window-restore-bubble', () => {
  if (mainWindow) {
    bubbleBounds = mainWindow.getBounds(); // Guardar su última posición exacta
    const { screen } = require('electron');
    const primaryDisplay = screen.getDisplayMatching(bubbleBounds);
    const workArea = primaryDisplay.workArea;

    // Restore original size constraints
    mainWindow.setMinimumSize(450, 600);
    mainWindow.setMaximumSize(10000, 10000); // Remove maximum restriction
    
    // Calculate new position: Centered on the bubble's current center
    const chatWidth = previousBounds.width;
    const chatHeight = previousBounds.height;
    
    let newX = bubbleBounds.x + (bubbleBounds.width / 2) - (chatWidth / 2);
    let newY = bubbleBounds.y + (bubbleBounds.height / 2) - (chatHeight / 2);

    // Keep window within screen work area
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

    // Maintain always on top
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
    
    // Actively update bubble bounds during drag
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

  // Installed mode: In production, save data to AppData to avoid permission errors
  const basePath = isDev 
    ? app.getPath('userData') 
    : app.getPath('userData');
  
  const dataDir = path.join(basePath, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'dev.db');
  
  if (!fs.existsSync(dbPath)) {
    console.log('Creando base de datos inicial en carpeta portable...');
    // We get the packaged dev.db from the app resources
    const sourceDb = path.join(process.resourcesPath, 'dev.db');
      
    if (fs.existsSync(sourceDb)) {
      fs.copyFileSync(sourceDb, dbPath);
      console.log('Base de datos copiada exitosamente a', dbPath);
    } else {
      console.error('No se encontró base de datos de origen en', sourceDb);
    }
  }
  
  // Asegurar siempre que la base de datos tenga permisos de escritura en Windows
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

  // In production, the server files are bundled inside resources/app
  // Or in app.asar depending on builder config
  const projectRoot = isDev 
    ? path.join(__dirname, '..')
    : path.join(process.resourcesPath, 'app.asar.unpacked');

  const serverPath = path.join(projectRoot, 'server', 'index.js');
  console.log(`Ruta del servidor resuelta: ${serverPath}`);

  const env = { 
    ...process.env, 
    PORT: 3001,
    DATABASE_URL: `file:${dbPath.replace(/\\/g, '/')}`
  };

  const { fork } = require('child_process');
  
  // Use fork to let Electron seamlessly execute the wrapped server inside the ASAR bundle.
  // Installed mode: save logs in the AppData data folder
  const basePath = isDev 
    ? app.getPath('userData') 
    : app.getPath('userData');
    
  const dataDir = path.join(basePath, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const logPath = path.join(dataDir, 'server.log');
  fs.writeFileSync(logPath, `Iniciando log del servidor... ${new Date().toISOString()}\n`);

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
    fs.appendFileSync(logPath, `[PROC_ERR]: ${err.message}\n`);
  });

  serverProcess.on('close', (code) => {
    console.log(`Servidor cerrado con código ${code}`);
    fs.appendFileSync(logPath, `[CLOSE]: Code ${code}\n`);
  });
}

function createWindow() {
  const iconPath = isDev 
    ? path.join(__dirname, '../public/img/LogoHHE 2.webp')
    : path.join(__dirname, '../dist/img/LogoHHE 2.webp');

  mainWindow = new BrowserWindow({
    icon: iconPath,
    itemAlign: 'center',
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

  // Remove default menu
  mainWindow.setMenu(null);

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Se eliminó la apertura de DevTools a petición del usuario
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Manejar apertura de enlaces externos en el navegador del sistema
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.on('ready', () => {
  startServer();
  createWindow();

  // Check for updates automatically in production
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
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
