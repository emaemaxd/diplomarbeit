import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let ExhibitCardComponent = class ExhibitCardComponent {
    constructor(galleryService) {
        this.galleryService = galleryService;
        this.count = 0;
        this.deleteEvent = new EventEmitter();
        this.imageName = '';
    }
    ngOnInit() {
        this.imageName = this.getImageName();
    }
    delete() {
        this.deleteEvent.emit(this.count);
    }
    getImageName() {
        console.log(this.exhibit);
        if (this.exhibit) {
            const fileTypeOfExhibit = this.galleryService.getFileTypeCategoryByFileType(this.exhibit.data_type) ?? '';
            console.log(fileTypeOfExhibit);
            return fileTypeOfExhibit.concat("icon.svg");
        }
        return '';
    }
};
__decorate([
    Input('exhibit')
], ExhibitCardComponent.prototype, "exhibit", void 0);
__decorate([
    Input('count')
], ExhibitCardComponent.prototype, "count", void 0);
__decorate([
    Output('delete')
], ExhibitCardComponent.prototype, "deleteEvent", void 0);
ExhibitCardComponent = __decorate([
    Component({
        selector: 'app-exhibit-card',
        templateUrl: './exhibit-card.component.html',
        styleUrls: ['./exhibit-card.component.scss']
    })
], ExhibitCardComponent);
export { ExhibitCardComponent };
//# sourceMappingURL=exhibit-card.component.js.map