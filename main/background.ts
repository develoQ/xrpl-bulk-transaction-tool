import { IpcMainEvent, app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import wallet from './libs/wallet';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('wallet-create', (event: IpcMainEvent, _: string) => {
  const { address } = wallet.create()
  event.sender.send('wallet-create', { address })
})
ipcMain.on('wallet-delete', (event: IpcMainEvent, message: {address:string}) => {
  wallet.delete(message.address)
  event.sender.send('wallet-delete', { })
})
ipcMain.on('wallet-getAll', (event: IpcMainEvent, _: string) => {
  const addresses = wallet.getAll()
  event.sender.send('wallet-getAll', { addresses })
})
ipcMain.on('wallet-sign', (event: IpcMainEvent, message: { address: string, txJson: any }) => {
  const { txJson } = wallet.sign(message.address, message.txJson)
  event.sender.send('wallet-sign', { txJson })
})
ipcMain.on('wallet-bulksign', (event: IpcMainEvent, message: { address: string, txJsons: any[] }) => {
  const result = wallet.bulksign(message.address, message.txJsons)
  event.sender.send('wallet-bulksign', ...result)
})
