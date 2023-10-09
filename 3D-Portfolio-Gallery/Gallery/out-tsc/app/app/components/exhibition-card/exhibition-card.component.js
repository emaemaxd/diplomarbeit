import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let ExhibitionCardComponent = class ExhibitionCardComponent {
    constructor(gs) {
        this.gs = gs;
        this.isDeleteMode = false;
        this.deleteEvent = new EventEmitter();
    }
    ngOnInit() {
        console.log(this.exhibition?.exhibition);
        this.thumbnail = this.exhibition?.exhibition.thumbnail_url;
        this.thumbnail = "https://student.cloud.htl-leonding.ac.at/e.halilovic/api/exhibitions/downloadImageFile/" + this.thumbnail?.replace("/", "%2F");
    }
    onDelete() {
        this.deleteEvent.emit(this.exhibition?.exhibition);
    }
};
__decorate([
    Input('exhibtion')
], ExhibitionCardComponent.prototype, "exhibition", void 0);
__decorate([
    Input('delete')
], ExhibitionCardComponent.prototype, "isDeleteMode", void 0);
__decorate([
    Output('delete')
], ExhibitionCardComponent.prototype, "deleteEvent", void 0);
ExhibitionCardComponent = __decorate([
    Component({
        selector: 'app-exhibition-card',
        templateUrl: './exhibition-card.component.html',
        styleUrls: ['./exhibition-card.component.scss']
    })
], ExhibitionCardComponent);
export { ExhibitionCardComponent };
//# sourceMappingURL=exhibition-card.component.js.map