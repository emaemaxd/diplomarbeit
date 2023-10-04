import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
let CreateExhibitionPageComponent = class CreateExhibitionPageComponent {
    constructor(createService, navbar, footer) {
        this.createService = createService;
        this.selectedIndex = 0;
        this.stepsCompleted = [];
        this.exhibitionList = [];
        navbar.white = false;
        navbar.hide();
        footer.hide();
        this.selectedIndex = this.createService.getSelectedState();
    }
    ngOnInit() {
        this.stepsCompleted = new Array(this.stepper?.steps.length).fill(false);
        this.createService.wizMetadata.subscribe(value => {
            this.stepsCompleted[0] = value != undefined;
        });
        this.createService.wizExhibits.subscribe(value => {
            this.stepsCompleted[1] = value.length > 0;
        });
        this.createService.wizRoom.subscribe(value => {
            this.stepsCompleted[2] = value != undefined;
        });
    }
    selectionChanged(event) {
    }
    upload() {
        this.createService.upload();
    }
};
__decorate([
    ViewChild('stepper')
], CreateExhibitionPageComponent.prototype, "stepper", void 0);
CreateExhibitionPageComponent = __decorate([
    Component({
        selector: 'app-create-exhibition-page',
        templateUrl: './create-exhibition-page.component.html',
        styleUrls: ['./create-exhibition-page.component.scss']
    })
], CreateExhibitionPageComponent);
export { CreateExhibitionPageComponent };
//# sourceMappingURL=create-exhibition-page.component.js.map