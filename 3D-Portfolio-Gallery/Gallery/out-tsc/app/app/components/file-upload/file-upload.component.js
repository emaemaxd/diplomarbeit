import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploadOutput } from "../../shared/class/file-upload-output";
import { HttpEventType, HttpResponse } from "@angular/common/http";
let FileUploadComponent = class FileUploadComponent {
    constructor(galleryService) {
        this.galleryService = galleryService;
        this.acceptedMediaTypes = "";
        this.fileSize = 9999999999999;
        this.multipleFilesAllowed = false;
        this.fileOutput = new EventEmitter();
        this.progress = 0;
        this.message = "";
    }
    fileChange(event) {
        // @ts-ignore
        let file = event.target.files[0];
        if (!this.inputCheck(file)) {
            alert("unsupported media type: " + this.message);
            return;
        }
        this.selectedFile = file;
        this.upload(file);
    }
    inputCheck(file) {
        this.message = "";
        if (file == undefined) {
            this.message += "File is null\n";
            return false;
        }
        // checks if selected file has the right file type
        if (this.acceptedMediaTypes) {
            var regex = new RegExp(/(\w+)(?=\|)/g);
            var arrExtension = this.galleryService?.getSupportedFiletypes(this.acceptedMediaTypes)?.join('|').concat('|').match(regex) ?? [];
            regex = new RegExp(`/\.(${arrExtension.join('|')})/`);
            if (!this.galleryService?.getSupportedFiletypes(this.acceptedMediaTypes)?.includes(file.type) || file.name.match(regex)) {
                this.message += "For this application this media type is wrong\n";
                return false;
            }
        }
        // checks if selected file has the right file size
        if (this.fileSize) {
            if (file.size > this.fileSize) {
                this.message += "The file exceeds the size of the limit " + this.fileSize + "bits\n";
                return false;
            }
        }
        return true;
    }
    upload(file) {
        console.log("Upload process begins");
        this.progress = 0;
        const output = file.name.replace(/[\[\]']+/g, '');
        const fd = new FormData();
        fd.append('uploadedFile', file, output);
        this.galleryService.postFile(fd).subscribe({
            next: (event) => {
                console.log(event);
                if (event.type === HttpEventType.UploadProgress) {
                    this.progress = Math.round(100 * event.loaded / event.total);
                }
                else if (event instanceof HttpResponse) {
                    console.log("Uploading Suc; Resp: ", event.body);
                    // Example URL
                    // src/main/resources/files/exhibits/file5cheese.gltf
                    const serverFileName = event.body;
                    if (serverFileName.length > 0) {
                        const fuo = new FileUploadOutput(serverFileName.replace("/", "%2F"), (serverFileName.split('.').pop() ?? "").toLowerCase());
                        this.fileOutput.emit(fuo);
                    }
                }
            }
        });
    }
};
__decorate([
    Input('acceptedMediaTypes')
], FileUploadComponent.prototype, "acceptedMediaTypes", void 0);
__decorate([
    Input('fileSize')
], FileUploadComponent.prototype, "fileSize", void 0);
__decorate([
    Input('multipleFilesAllowed')
], FileUploadComponent.prototype, "multipleFilesAllowed", void 0);
__decorate([
    Output()
], FileUploadComponent.prototype, "fileOutput", void 0);
FileUploadComponent = __decorate([
    Component({
        selector: 'app-file-upload',
        templateUrl: './file-upload.component.html',
        styleUrls: ['./file-upload.component.scss']
    })
], FileUploadComponent);
export { FileUploadComponent };
//# sourceMappingURL=file-upload.component.js.map