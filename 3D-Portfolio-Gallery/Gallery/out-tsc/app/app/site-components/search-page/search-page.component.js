import { __decorate } from "tslib";
import { Component, ViewEncapsulation } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap, tap } from "rxjs";
let SearchPageComponent = class SearchPageComponent {
    constructor(navbar, footer, galleryService) {
        this.navbar = navbar;
        this.footer = footer;
        this.galleryService = galleryService;
        this.keyUp$ = new Subject;
        this.isLoading = false;
        this.searchResults = [];
        this.categories = [];
        this.filter_icon = "filter_alt";
        this.selectedCategories = [];
    }
    ngOnInit() {
        this.navbar.show();
        this.footer.show();
        this.galleryService.getAllExhibitions().subscribe(res => this.searchResults = res);
        this.galleryService.getAllCatagories().subscribe((c) => {
            this.categories = c;
            console.log(this.categories);
        });
        this.keyUp$.pipe(filter(term => term.length >= 3), debounceTime(500), distinctUntilChanged(), tap(() => this.isLoading = true), switchMap(searchTerm => this.galleryService.getAllSearch(searchTerm)), tap(() => this.isLoading = false)).subscribe(exhibitions => this.searchResults = exhibitions);
    }
    getCategories() {
        this.filter_icon = "check_circle_outline";
    }
    onMenuClose() {
        this.filter_icon = "filter_alt";
        let searchString = "";
        for (let i = 0; i < this.selectedCategories.length; i++) {
            searchString += this.selectedCategories[i] + ",";
        }
        if (this.selectedCategories.length > 0) {
            this.galleryService.getExhibitonByIds(searchString).subscribe(e => {
                this.searchResults = e;
            });
        }
        else {
            this.galleryService.getAllExhibitions().subscribe(res => this.searchResults = res);
        }
    }
    addCategory(id) {
        if (!this.selectedCategories.find(c => c == id)) {
            this.selectedCategories.push(id);
        }
        else {
            for (var i = 0; i < this.selectedCategories.length; i++) {
                if (this.selectedCategories[i] === id) {
                    this.selectedCategories.splice(i, 1);
                }
            }
        }
    }
};
SearchPageComponent = __decorate([
    Component({
        selector: 'app-search-page',
        templateUrl: './search-page.component.html',
        styleUrls: ['./search-page.component.scss'],
        encapsulation: ViewEncapsulation.None,
    })
], SearchPageComponent);
export { SearchPageComponent };
//# sourceMappingURL=search-page.component.js.map