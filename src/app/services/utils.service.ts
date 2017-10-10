import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { ConfigService } from './config.service';

@Injectable()
export class UtilsService {


  constructor(
    private electronService: ElectronService,
  ) { }

  getQrCodeUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.electronService.isElectron()) {
        reject();
        return;
      }

      Promise.all([this.getDefaultLocalAddress(), this.getHostname(), this.getLocalAddresses()]).then((results: any[]) => {
        const defaultLocalAddress = results[0];
        const hostname = results[1];
        const localAddresses = results[2];

        const index = localAddresses.indexOf(defaultLocalAddress);
        if (index > -1) { // removes the defaultLocalAddress from the localAddresses list
          localAddresses.splice(index, 1);
        }
        if (defaultLocalAddress) { // Adds the defaultLocalAddress at very beginning of the list
          localAddresses.unshift(defaultLocalAddress);
        }
        // this.ngZone.run(() => {
        resolve(
          ConfigService.CONNECT_URL_BASE +
          '/?h=' + encodeURIComponent(hostname) +
          '&a=' + encodeURIComponent(localAddresses.join('-')));
        // })
      });
    });
  }

  private getLocalAddresses(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.on('localAddresses', (e, localAddresses) => {
        resolve(localAddresses);
      });
      this.electronService.ipcRenderer.send('getLocalAddresses');
    });
  }


  private getDefaultLocalAddress(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.on('defaultLocalAddress', (e, defaultLocalAddress) => {
        resolve(defaultLocalAddress);
      });
      this.electronService.ipcRenderer.send('getDefaultLocalAddress');
    });
  }


  private getHostname(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.electronService.ipcRenderer.on('hostname', (e, hostname) => {
        resolve(hostname);
      });
      this.electronService.ipcRenderer.send('getHostname');
    });
  }
}
