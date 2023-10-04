import { __decorate } from "tslib";
import { Component } from '@angular/core';
let NavbarComponent = class NavbarComponent {
    constructor(navbar, auth) {
        this.navbar = navbar;
        this.auth = auth;
        const userId = localStorage.getItem('user_id') ?? '';
        auth.getUser(userId).subscribe(user => {
            this.user = user;
        });
    }
    ngOnInit() {
        this.navbar.white = false;
        this.navbar.visible = true;
    }
};
NavbarComponent = __decorate([
    Component({
        selector: 'app-navbar',
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.scss']
    })
], NavbarComponent);
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map