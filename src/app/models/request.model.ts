import { ScanSessionModel } from './scan-session.model';
import { ScanModel } from './scan.model';

export abstract class RequestModel {
    // protected _action: string;
    // get action() {
    //     return this._action;
    // }

    readonly action: string;
    // i can't put all the fromObject(s) here as static methods because the overload won't work
    // it is because when typescript gets compiled to js the obj type is lost and the methods result all with the same signature
    public abstract fromObject(obj: any): requestModel;
    public static readonly ACTION_PING = 'ping';
    public static readonly ACTION_HELO = 'helo';
    public static readonly ACTION_SET_SCAN_SESSIONS = 'setScanSessions';
    public static readonly ACTION_PUT_SCAN_SESSION = 'putScanSession';
    public static readonly ACTION_PUT_SCAN = 'putScan';
    public static readonly ACTION_DELETE_SCAN_SESSION = 'deleteScanSession';
    public static readonly ACTION_DELETE_SCAN = 'deleteScan';
    public static readonly ACTION_UPDATE_SCAN_SESSION = 'updateScanSession';

    readonly action: string;
    // i can't put all the fromObject(s) here as static methods because the overload won't work
    // it is because when typescript gets compiled to js the obj type is lost and the methods result all with the same signature
    public abstract fromObject(obj: any): RequestModel;
}

export class requestModelPing extends requestModel {
    action = 'ping';

    public fromObject(obj: ({})) {
        return this;
    }
}

export class requestModelHelo extends requestModel {
    action = 'helo';
    deviceName: string;

    public fromObject(obj: ({ deviceName: string })) {
        this.deviceName = obj.deviceName;
        return this;
    }
}

export class RequestModelSetScanSessions extends RequestModel {
    action = 'setScanSessions';
    scanSessions: ScanSessionModel[];
    sendKeystrokes: boolean;

    public fromObject(obj: ({ scanSessions: ScanSessionModel[], sendKeystrokes: boolean })) {
        this.scanSessions = obj.scanSessions;
        this.sendKeystrokes = obj.sendKeystrokes;
        return this;
    }
}

export class RequestModelPutScanSession extends RequestModel {
    action = 'putScanSession';
    scanSessions: ScanSessionModel;
    sendKeystrokes: boolean;

    public fromObject(obj: ({ scanSession: ScanSessionModel })) {
        this.scanSessions = obj.scanSession;
        return this;
    }
}

export class RequestModelPutScan extends RequestModel {
    action = 'putScan';
    scan: ScanModel;
    scanSessionId: number;
    sendKeystrokes: boolean;

    public fromObject(obj: ({ scan: ScanModel, scanSessionId: number, sendKeystrokes: boolean })) {
        this.scan = obj.scan;
        this.scanSessionId = obj.scanSessionId;
        this.sendKeystrokes = obj.sendKeystrokes;
        return this;
    }
}

export class RequestModelDeleteScanSession extends RequestModel {
    action = 'deleteScanSession';
    scanSessionId: number;

    public fromObject(obj: ({ scanSessionId: number })) {
        this.scanSessionId = obj.scanSessionId;
        return this;
    }
}

export class RequestModelDeleteScan extends RequestModel {
    action = 'deleteScan';
    scan: ScanModel;
    scanSessionId: number;

    public fromObject(obj: ({ scan: ScanModel, scanSessionId: number })) {
        this.scan = obj.scan;
        this.scanSessionId = obj.scanSessionId;
        return this;
    }
}

export class RequestModelUpdateScanSession extends RequestModel {
    action = 'updateScanSession';
    scanSessionId: number;
    scanSessionName: string;
    scanSessionDate: Date;

    public fromObject(obj: ({ scanSessionId: number, scanSessionName: string, scanSessionDate: Date })) {
        this.scanSessionId = obj.scanSessionId;
        this.scanSessionName = obj.scanSessionName;
        this.scanSessionDate = obj.scanSessionDate;
        return this;
    }
}
