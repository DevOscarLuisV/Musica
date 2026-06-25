const { app, BrowserWindow, ipcMain, dialog } = require('electron'); // 1. Importamos dialog
const path = require('path');
const fs = require('fs');
const configPath = path.join(app.getPath('userData'), 'config.json');

function guardarRuta(ruta) {
  fs.writeFileSync(configPath, JSON.stringify({ ruta }));
}

function cargarRuta() {
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath)).ruta;
    } catch (e) {
      return null;
    }
  }
  return null;
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
    show: true,
    icon: path.join(__dirname, 'assets/icono.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
};

ipcMain.handle('leer-carpeta-musica', async (event, ruta) => {
  let rutaCarpeta = ruta || cargarRuta();

  if (!rutaCarpeta) {
    rutaCarpeta = path.join(__dirname, '..', 'assets', 'musica');
  }

  try {
    if (!fs.existsSync(rutaCarpeta)) {
      console.error("No se encontró la carpeta:", rutaCarpeta);
      return [];
    }

    const archivos = await fs.promises.readdir(rutaCarpeta);

    return archivos
      .filter(archivo => archivo.endsWith('.mp3') || archivo.endsWith('.mp4') || archivo.endsWith('.wav'))
      .map(archivo => {
        const rutaAbsoluta = path.join(rutaCarpeta, archivo);
        return {
          titulo: path.basename(archivo, path.extname(archivo)),
          nombre: 'Artista Local',

          fuente: `file://${rutaAbsoluta}`
        };
      });
  } catch (error) {
    console.error("Error leyendo la carpeta:", error);
    return [];
  }
});


ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (!result.canceled) {
    const rutaSeleccionada = result.filePaths[0];
    guardarRuta(rutaSeleccionada);
    return rutaSeleccionada;
  }
  return null;
});

ipcMain.handle('get-saved-path', () => {
  return cargarRuta();
});

ipcMain.on('action-cerrar', () => {
  app.quit();
});

ipcMain.on('action-minimizar', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

