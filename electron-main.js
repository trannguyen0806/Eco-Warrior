// Electron entry — mở 1 cửa sổ desktop chạy game web/ ở chế độ offline.
// Không sửa code game; chỉ wrap thành .exe.

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 640,
    resizable: false,
    autoHideMenuBar: true,
    title: 'Eco-Warrior',
    icon: path.join(__dirname, 'web', 'assets', 'sprites', 'plant_stage_3.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  Menu.setApplicationMenu(null); // ẩn menubar mặc định
  win.loadFile(path.join(__dirname, 'web', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
