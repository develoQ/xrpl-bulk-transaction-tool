import { ipcRenderer } from "electron";

export default {
  walletCreate: () => {
    return new Promise<string>((resolve) => {
      ipcRenderer.on("wallet-create", (event, arg) => {
        ipcRenderer.removeAllListeners("wallet-create");
        resolve(arg.address);
      });
      ipcRenderer.send("wallet-create");
    })
  },
  delete: (address: string) => {
    return new Promise<void>((resolve) => {
      ipcRenderer.on("wallet-delete", (event, arg) => {
        ipcRenderer.removeAllListeners("wallet-create");
        resolve();
      });
      ipcRenderer.send("wallet-delete", { address });
    })
  },
  getAll: () => {
    return new Promise<string[]>((resolve) => {
      ipcRenderer.on("wallet-getAll", (event, arg) => {
        ipcRenderer.removeAllListeners("wallet-getAll");
        resolve(arg.addresses);
      });
      ipcRenderer.send("wallet-getAll");
    })
  },
  bulksign: (address: string, txJsons: any[]) => {
    return new Promise<{ txJson: Record<string, any>; txBlob: string; hash: string }[]>((resolve) => {
      ipcRenderer.on("wallet-bulksign", (event, ...arg) => {
        ipcRenderer.removeAllListeners("wallet-bulksign");
        resolve([...arg])
      });
      ipcRenderer.send("wallet-bulksign", { address, txJsons });
    })
  },
}
