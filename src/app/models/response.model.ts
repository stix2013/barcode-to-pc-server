import { ProtocolsActions } from './protocols-const';

export abstract class ResponseModel {
    readonly action: string;
    public abstract fromObject(obj: any): ResponseModel;

    // public static readonly ACTION_HELO = 'helo';
    // public static readonly ACTION_PONG = 'pong';
}

export class ResponseModelHelo {
    action: 'helo';
    version: string;

    public fromObject(obj: ({version: string})) {
        this.version = obj.version;
        return this;
    }
}


export class ResponseModelPong extends ResponseModel {
    action = 'pong';

    public fromObject(obj: ({})) {
        return this;
    }
}
