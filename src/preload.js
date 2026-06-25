const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    obtenerCanciones: (ruta) => ipcRenderer.invoke('leer-carpeta-musica', ruta),
    cerrarApp: () => ipcRenderer.send('action-cerrar'),
    minimizarApp: () => ipcRenderer.send('action-minimizar'),
    seleccionarCarpeta: () => ipcRenderer.invoke('select-folder'),
    obtenerRutaGuardada: () => ipcRenderer.invoke('get-saved-path')
});