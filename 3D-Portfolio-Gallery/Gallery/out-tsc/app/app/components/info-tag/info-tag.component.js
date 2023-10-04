import { __decorate } from "tslib";
import { Component } from '@angular/core';
let InfoTagComponent = class InfoTagComponent {
    constructor() {
        this.visible = false;
    }
    ngOnInit() {
    }
    toggleVisiblity() {
        this.visible = !this.visible;
    }
};
InfoTagComponent = __decorate([
    Component({
        selector: 'app-info-tag',
        templateUrl: './info-tag.component.html',
        styleUrls: ['./info-tag.component.scss']
    })
], InfoTagComponent);
export { InfoTagComponent };
//# sourceMappingURL=info-tag.component.js.map