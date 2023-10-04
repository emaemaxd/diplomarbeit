import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let RoomCardComponent = class RoomCardComponent {
    constructor(gallery) {
        this.gallery = gallery;
        this.imageUrl = "";
    }
    ngOnInit() {
        this.imageUrl = this.gallery.getValidImageString(this.room?.thumbnail_url ?? "");
        console.log("asdf", this.room);
    }
};
__decorate([
    Input()
], RoomCardComponent.prototype, "room", void 0);
RoomCardComponent = __decorate([
    Component({
        selector: 'app-room-card',
        templateUrl: './room-card.component.html',
        styleUrls: ['./room-card.component.scss']
    })
], RoomCardComponent);
export { RoomCardComponent };
//# sourceMappingURL=room-card.component.js.map