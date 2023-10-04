import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let NavbarServiceService = class NavbarServiceService {
    constructor() {
        this.visible = false;
        this.white = false;
    }
    hide() {
        this.visible = false;
    }
    show() {
        this.visible = true;
    }
    changeWhite() {
        this.white = true;
    }
    toggle() {
        this.visible = !this.visible;
    }
};
NavbarServiceService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    Injectable()
], NavbarServiceService);
export { NavbarServiceService };
//# sourceMappingURL=navbar-service.service.js.map