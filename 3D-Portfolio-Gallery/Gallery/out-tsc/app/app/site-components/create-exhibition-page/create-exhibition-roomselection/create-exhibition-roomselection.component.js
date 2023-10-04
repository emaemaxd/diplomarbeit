import { __decorate } from "tslib";
import { Component } from '@angular/core';
let CreateExhibitionRoomselectionComponent = class CreateExhibitionRoomselectionComponent {
    constructor(gs, cs) {
        this.cs = cs;
        this.rooms = [];
        this.filteredRoom = [];
        this.selectedRoom_id = undefined;
        gs.getAllRooms().subscribe(res => {
            this.rooms = res;
            this.filteredRoom = this.rooms.filter(value => { return value.positions.length > cs.wizExhibits.value.length; });
        });
        cs.wizRoom.subscribe(value => {
            if (value) {
                this.selectedRoom_id = value.id;
            }
        });
    }
    selectRoom(selectedId) {
        let tempRoom = this.getLocalRoomById(selectedId);
        if (tempRoom.length == 1) {
            this.cs.wizRoom.next(tempRoom[0]);
            this.cs.saveRoom();
        }
    }
    getFilteredRooms() {
        return this.rooms.filter(value => {
            return value.positions.length < this.cs.wizExhibits.value.length;
        });
    }
    getLocalRoomById(id) {
        return this.rooms.filter(value => { return value.id == id; });
    }
};
CreateExhibitionRoomselectionComponent = __decorate([
    Component({
        selector: 'app-create-exhibition-roomselection',
        templateUrl: './create-exhibition-roomselection.component.html',
        styleUrls: ['./create-exhibition-roomselection.component.scss']
    })
], CreateExhibitionRoomselectionComponent);
export { CreateExhibitionRoomselectionComponent };
//# sourceMappingURL=create-exhibition-roomselection.component.js.map