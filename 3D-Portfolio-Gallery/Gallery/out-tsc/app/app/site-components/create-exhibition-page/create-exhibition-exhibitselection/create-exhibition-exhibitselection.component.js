import { __decorate } from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { Exhibit } from "../../../shared/class/exhibit";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import produce from "immer";
let CreateExhibitionExhibitselectionComponent = class CreateExhibitionExhibitselectionComponent {
    constructor(cs, bs) {
        this.cs = cs;
        this.bs = bs;
        this.changedExhibitlistEvent = new EventEmitter();
        this.exhibitForm = new FormGroup({
            name: new FormControl('', Validators.required),
            desc: new FormControl('')
        });
        this.exhibitCollection = [];
        this.cs.wizExhibits.subscribe(value => {
            this.exhibitCollection = value;
        });
    }
    ngOnInit() {
    }
    addExhibit() {
        if (this.exhibitFile) {
            // Update Value in Service
            let temp = this.cs.wizExhibits.value;
            temp.push(new Exhibit(this.exhibitCollection.length, this.exhibitFile.url, this.exhibitFile.filetype, this.exhibitForm.value.name ?? "unnamed", this.exhibitForm.value.desc ?? "", undefined, undefined, undefined));
            this.cs.wizExhibits.next(temp);
            this.cs.saveExhibit();
            this.exhibitForm.controls['name'].setValue("");
            this.exhibitForm.controls['desc'].setValue("");
        }
    }
    deleteExhibit($event) {
        if ($event == 0 && this.exhibitCollection.length == 1) {
            this.cs.wizExhibits.next(produce(this.cs.wizExhibits.value, draft => { draft.shift(); }));
        }
        else {
            this.cs.wizExhibits.next(produce(this.cs.wizExhibits.value, draft => { draft.splice($event, 1); }));
        }
        this.cs.saveExhibit();
    }
    changeFile($event) {
        this.exhibitFile = $event;
    }
};
__decorate([
    Output('changedExhibitList')
], CreateExhibitionExhibitselectionComponent.prototype, "changedExhibitlistEvent", void 0);
CreateExhibitionExhibitselectionComponent = __decorate([
    Component({
        selector: 'app-create-exhibition-exhibitselection',
        templateUrl: './create-exhibition-exhibitselection.component.html',
        styleUrls: ['./create-exhibition-exhibitselection.component.scss']
    })
], CreateExhibitionExhibitselectionComponent);
export { CreateExhibitionExhibitselectionComponent };
//# sourceMappingURL=create-exhibition-exhibitselection.component.js.map