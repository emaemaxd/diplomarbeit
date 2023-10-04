import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let BlobService = class BlobService {
    constructor() { }
    cleanB64AndToBlob(b64Data) {
        var strArr = b64Data.split(/[,;:]/);
        if (strArr[0] != 'data' || strArr[2] != 'base64') {
            console.error("something wrong here" + strArr);
        }
        return this.b64ToBlob(strArr[3], strArr[1]);
    }
    b64ToBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.toString() ?? "");
            reader.readAsDataURL(blob);
        });
    }
};
BlobService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], BlobService);
export { BlobService };
//# sourceMappingURL=blob.service.js.map