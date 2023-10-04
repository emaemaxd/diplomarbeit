import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl } from "@angular/forms";
import { map } from "rxjs";
let SearchTagsComponent = class SearchTagsComponent {
    constructor(galleryService) {
        this.galleryService = galleryService;
        this.selectedTagIds = new EventEmitter();
        this.separatorKeysCodes = [ENTER, COMMA];
        this.tagCtrl = new FormControl('');
        this.tags = [];
        this.allTags = [];
        this.allTagsTitle = [];
        galleryService.getAllTags().subscribe((res) => {
            console.log("Loaded Tags: ", res);
            this.allTagsTitle = res.map(value => { return value.category_title; });
            this.allTags = res;
            if (this.alreadySelectedTagIds) {
                console.log("Already went through");
                let alreadyTags = this.allTags.filter(value => {
                    let index = this.alreadySelectedTagIds?.findIndex(value1 => { return value1 == value.id; }) ?? -1;
                    console.log(index);
                    if (index != -1) {
                        this.alreadySelectedTagIds?.splice(index, 1);
                        return true;
                    }
                    return false;
                });
                if (alreadyTags.length > 0) {
                    console.log(alreadyTags);
                    this.tags.push(...alreadyTags);
                }
            }
        });
        this.filteredTags = this.tagCtrl.valueChanges.pipe(map((fruit) => (fruit ? this._filter(fruit) : this.allTagsTitle.slice())));
    }
    ngOnInit() {
    }
    add(event) {
        const value = (event.value || '').trim();
        let index = this.allTagsTitle.indexOf(value);
        // Add our fruit
        if (value && index > -1) {
            this.chooseTag(this.allTags[index]);
        }
        // Clear the input value
        event.chipInput.clear();
        this.tagCtrl.setValue(null);
    }
    remove(fruit) {
        const index = this.tags.map((value) => { return value.category_title; }).indexOf(fruit);
        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }
    selected(event) {
        this.chooseTag(this.allTags[this.allTagsTitle.indexOf(event.option.viewValue)]);
        this.fruitInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
    }
    chooseTag(value) {
        if (this.tags.indexOf(value) == -1) {
            this.tags.push(value);
            this.selectedTagIds.emit(this.tags.map((value) => { return value.id; }));
        }
    }
    _filter(value) {
        console.log("Tag Filter", value);
        const filterValue = value.toLowerCase();
        console.log(this.allTags);
        return this.allTags.map(function (tag) { return tag.category_title; }).filter(tagTitle => tagTitle.toLowerCase().includes(filterValue));
    }
};
__decorate([
    Input("alreadySelectedTags")
], SearchTagsComponent.prototype, "alreadySelectedTagIds", void 0);
__decorate([
    Output()
], SearchTagsComponent.prototype, "selectedTagIds", void 0);
__decorate([
    ViewChild('fruitInput')
], SearchTagsComponent.prototype, "fruitInput", void 0);
SearchTagsComponent = __decorate([
    Component({
        selector: 'app-search-tags',
        templateUrl: './search-tags.component.html',
        styleUrls: ['./search-tags.component.scss']
    })
], SearchTagsComponent);
export { SearchTagsComponent };
//# sourceMappingURL=search-tags.component.js.map