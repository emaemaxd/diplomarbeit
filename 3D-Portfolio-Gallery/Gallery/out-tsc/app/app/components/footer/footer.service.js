import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let FooterService = class FooterService {
    constructor() { this.visible = false; }
    hide() {
        this.visible = false;
    }
    show() {
        this.visible = true;
    }
    toggle() {
        this.visible = !this.visible;
    }
};
FooterService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    Injectable()
], FooterService);
export { FooterService };
//# sourceMappingURL=footer.service.js.map