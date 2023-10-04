import { __decorate } from "tslib";
import { Component } from "@angular/core";
let RoomPageComponent = class RoomPageComponent {
    constructor(navbar, footer, route, gs) {
        this.navbar = navbar;
        this.footer = footer;
        this.route = route;
        this.gs = gs;
        this.exhibtion = {};
    }
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
        });
        this.navbar.white = true;
        this.navbar.hide();
        this.footer.hide();
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
};
RoomPageComponent = __decorate([
    Component({
        selector: 'app-room-page',
        templateUrl: './room-page.component.html',
        styleUrls: ['./room-page.component.scss'],
    })
], RoomPageComponent);
export { RoomPageComponent };
//# sourceMappingURL=room-page.component.js.map