import { __decorate } from "tslib";
import { Component } from '@angular/core';
let HomePageComponent = class HomePageComponent {
    constructor(navbar, footer, gs) {
        this.navbar = navbar;
        this.footer = footer;
        this.gs = gs;
        this.exhibitions = [];
    }
    ngOnInit() {
        this.navbar.show();
        this.footer.show();
        this.gs.getAllExhibitions().subscribe(res => this.exhibitions = res);
    }
};
HomePageComponent = __decorate([
    Component({
        selector: 'app-home-page',
        templateUrl: './home-page.component.html',
        styleUrls: ['./home-page.component.scss']
    })
], HomePageComponent);
export { HomePageComponent };
//# sourceMappingURL=home-page.component.js.map