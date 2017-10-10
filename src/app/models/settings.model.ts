import { StringComponentModel } from './string-component.model';

export class SettingsModel {
    enableRealtimeStrokes = true;
    enableOpenInBrowser = false;
    typedString: StringComponentModel[] = [
        { name: 'BARCODE', value: 'barcode', type: 'barcode' },
        { name: 'ENTER', value: 'enter', type: 'key' }
    ];
    newLineCharacter = 'CRLF';
    enableQuotes = true;
}
