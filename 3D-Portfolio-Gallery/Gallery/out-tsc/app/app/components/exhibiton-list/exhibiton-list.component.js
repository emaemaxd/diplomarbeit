import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ExhibitonListComponent = class ExhibitonListComponent {
    constructor(gs) {
        this.gs = gs;
        this.exhibitions = [];
    }
    ngOnInit() {
        this.gs.getAllExhibitions().subscribe(res => this.exhibitions = res);
    }
};
ExhibitonListComponent = __decorate([
    Component({
        selector: 'app-exhibiton-list',
        templateUrl: './exhibiton-list.component.html',
        styleUrls: ['./exhibiton-list.component.scss']
    })
], ExhibitonListComponent);
export { ExhibitonListComponent };
//# sourceMappingURL=exhibiton-list.component.js.map