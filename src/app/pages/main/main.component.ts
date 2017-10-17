import { Component, OnInit, NgZone, Inject, ViewChild, ElementRef } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { SettingsModel } from '../../models/settings.model';
import { ScanSessionModel } from '../../models/scan-session.model';
import { Storage } from '../../services/storage.service';
import { StringComponentModel } from '../../models/string-component.model';

import { ElectronService } from '../../services/electron.service';
import { UtilsService } from '../../services/utils.service';
import { ConfigService } from '../../services/config.service';
import { remote } from 'electron';
import { ProtocolsActions } from '../../models/protocols-const';
import { ScanModel } from '../../models/scan.model';
import {
    RequestModelPutScan,
    RequestModelDeleteScan,
    RequestModelDeleteScanSession,
    RequestModelSetScanSessions,
    RequestModelPutScanSession,
    RequestModel,
    RequestModelUpdateScanSession
} from '../../models/request.model';

@Component({
    selector: 'bps-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
    @ViewChild('settingsModal') public settingsModal: ModalDirective;
    @ViewChild('infoModal') public infoModal: ModalDirective;
    @ViewChild('scanSessionsListElement', { read: ElementRef }) public scanSessionsListElement: ElementRef;
    @ViewChild('scanSessionListElement', { read: ElementRef }) public scanSessionListElement: ElementRef;

    public scanSessions: ScanSessionModel[] = [];
    public selectedScanSession: ScanSessionModel;
    public animateLast = false;

    public qrCodeUrl = '';

    public settings: SettingsModel = new SettingsModel();
    public openAtLogin = false;

    public availableComponents: StringComponentModel[] = this.getAvailableComponents();
    private getAvailableComponents(): StringComponentModel[] {
        return [
            { name: 'BACKSPACE', value: 'backspace', type: 'key' },
            { name: 'DELETE', value: 'delete', type: 'key' },
            { name: 'ALT', value: 'ALT', type: 'key' },
            { name: 'ENTER', value: 'enter', type: 'key' },
            { name: 'TAB', value: 'tab', type: 'key' },
            { name: 'ESCAPE', value: 'escape', type: 'key' },
            { name: '&uarr;', value: 'up', type: 'key' },
            { name: '&rarr;', value: 'right', type: 'key' },
            { name: '&darr;', value: 'down', type: 'key' },
            { name: '&larr;', value: 'left', type: 'key' },
            { name: 'HOME', value: 'home', type: 'key' },
            { name: 'END', value: 'end', type: 'key' },
            { name: 'PAGEUP', value: 'pageup', type: 'key' },
            { name: 'PAGEDOWN', value: 'pagedown', type: 'key' },
            { name: 'COMMAND', value: 'command', type: 'key' },
            { name: 'ALT', value: 'alt', type: 'key' },
            { name: 'CONTROL', value: 'control', type: 'key' },
            { name: 'SHIFT', value: 'shift', type: 'key' },
            { name: 'RIGHT_SHIFT', value: 'right_shift', type: 'key' },
            { name: 'SPACE', value: 'space', type: 'key' },

            { name: 'TIMESTAMP', value: 'Date.now()', type: 'variable' },
            { name: 'DATE', value: 'new Date().toLocaleDateString()', type: 'variable' },
            { name: 'TIME', value: 'new Date().toLocaleTimeString()', type: 'variable' },
            { name: 'DATE_TIME', value: 'new Date().toLocaleDateTimeString()', type: 'variable' },
            // { name: 'SCAN_INDEX', value: 'scan_index', type: 'variable' },
            { name: 'DEVICE_NAME', value: 'deviceName', type: 'variable' },

            { name: 'Custom text (click to edit)', value: 'Custom text', type: 'text' },

            { name: 'barcode.substr(start, end)', value: 'barcode.substr(start, end)', type: 'function' },
            { name: 'barcode.replace(searchvalue, newvalue)', value: 'barcode.replace(searchvalue, newvalue)', type: 'function' },
            { name: 'BARCODE', value: 'BARCODE', type: 'barcode' },
        ];
    }

    constructor(
        private storage: Storage,
        private dragulaService: DragulaService,
        public electronService: ElectronService,
        private ngZone: NgZone,
        private utilsService: UtilsService,
    ) {
        if (this.electronService.isElectron()) {
            this.electronService.ipcRenderer.on(ProtocolsActions.ACTION_SET_SCAN_SESSIONS, (e, request: RequestModelSetScanSessions) => {
                this.ngZone.run(() => {
                    this.scanSessions = request.scanSessions;
                    this.save();
                });
            });

            this.electronService.ipcRenderer.on(ProtocolsActions.ACTION_PUT_SCAN_SESSION, (e, request: RequestModelPutScanSession) => {
                this.ngZone.run(() => {
                    this.scanSessions.unshift(request.scanSessions);
                    this.selectedScanSession = this.scanSessions[0];
                    this.scanSessionsListElement.nativeElement.scrollTop = 0;
                    this.save();
                });
            });

            this.electronService.ipcRenderer.on(ProtocolsActions.ACTION_PUT_SCAN, (e, request: RequestModelPutScan) => {
                this.ngZone.run(() => {

                    const alredInIndex = this.scanSessions.findIndex(x => x.id === request.scanSessionId);
                    if (alredInIndex !== -1) {
                        if (request.scan.repeated) {
                            // TODO: animate the already present scan
                        } else {
                            this.scanSessionListElement.nativeElement.scrollTop = 0;
                            this.animateLast = true; setTimeout(() => this.animateLast = false, 500);

                            this.scanSessions[alredInIndex].scannings.unshift(request.scan);
                            this.selectedScanSession = this.scanSessions[alredInIndex];
                        }
                    } else {
                        // TODO: request a scan sessions sync
                    }
                    this.save();
                });
            });

            this.electronService.ipcRenderer.on(ProtocolsActions.ACTION_DELETE_SCAN, (e, request: RequestModelDeleteScan) => {
                this.ngZone.run(() => {

                    const scanSessionIndex = this.scanSessions.findIndex(x => x.id === request.scanSessionId);
                    if (scanSessionIndex !== -1) {
                        const scanIndex = this.scanSessions[scanSessionIndex]
                            .scannings.findIndex(x => x.id === request.scan.id);
                        this.scanSessions[scanSessionIndex].scannings.splice(scanIndex, 1);
                    }
                    this.save();
                });
            });

            this.electronService.ipcRenderer.on(ProtocolsActions.ACTION_DELETE_SCAN_SESSION,
                (e, request: RequestModelDeleteScanSession) => {
                    this.ngZone.run(() => {
                        const scanSessionIndex = this.scanSessions.findIndex(x => x.id === request.scanSessionId);
                        if (scanSessionIndex !== -1) {
                            this.scanSessions.splice(scanSessionIndex, 1);
                            this.save();
                        }
                    });
                });

            this.electronService.ipcRenderer.on(ProtocolsActions.ACTION_UPDATE_SCAN_SESSION,
                (e, request: RequestModelUpdateScanSession) => {
                    this.ngZone.run(() => {
                        const scanSessionIndex = this.scanSessions.findIndex(x => x.id === request.scanSessionId);
                        if (scanSessionIndex !== -1) {
                            this.scanSessions[scanSessionIndex].name = request.scanSessionName;
                            this.scanSessions[scanSessionIndex].date = request.scanSessionDate;
                            this.save();
                        }
                    });
                });

            this.electronService.ipcRenderer.send('settings', this.settings);
            this.openAtLogin = this.electronService.app.getLoginItemSettings().openAtLogin;
            this.utilsService.getQrCodeUrl().then((url: string) => this.qrCodeUrl = url);
        }
        this.settings = this.storage.settings;
    }

    ngOnInit() {
        this.dragulaService.drop.subscribe(value => {
            if (value[3].className.indexOf('components-available') !== -1) {
                this.availableComponents = this.getAvailableComponents();
            }
        });

        this.dragulaService.out.subscribe(value => {
            if (value[3].className.indexOf('components-typed') !== -1) {
                this.dragulaService.find('components').drake.remove();
            }
        });

        this.settingsModal.onHide.subscribe(() => {
            this.storage.settings = this.settings;
            if (this.electronService.isElectron()) {
                this.electronService.ipcRenderer.send('settings', this.settings);
            }
        });
        this.scanSessions = this.storage.scanSessions;
    }

    save() {
        this.storage.scanSessions = this.scanSessions;
    }

    onOpenAtLoginClick(checked) {
        this.setOpenAtLogin(checked);
    }

    setOpenAtLogin(openAtLogin) {
        if (this.electronService.isElectron()) {
            this.electronService.app.setLoginItemSettings({ openAtLogin: openAtLogin });
        }
    }

    getWebSiteUrl() {
        return ConfigService.URL_WEBSITE;
    }

    getWebSiteName() {
        return ConfigService.WEB_SITE_NAME;
    }

    getGitHubServer() {
        return ConfigService.URL_GITHUB_SERVER;
    }

    getGitHubApp() {
        return ConfigService.URL_GITHUB_APP;
    }

    getMail() {
        return ConfigService.URL_MAIL;
    }

}
