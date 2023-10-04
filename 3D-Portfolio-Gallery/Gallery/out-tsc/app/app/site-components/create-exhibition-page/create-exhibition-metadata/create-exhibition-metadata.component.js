import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Metadata } from "../create-exhibition-page.service";
let CreateExhibitionMetadataComponent = class CreateExhibitionMetadataComponent {
    constructor(createService) {
        this.createService = createService;
        this.selectedTagIds = [];
        this.exhibitionName = "";
        this.description = "";
        this.thumbnailUrl = '';
        let value = createService.wizMetadata.value;
        this.exhibitionName = value?.title ?? "";
        this.selectedTagIds = value?.tagIds ?? [];
        this.description = value?.desc ?? "";
        console.log(value?.tagIds);
    }
    change() {
        if (this.exhibitionName != "") {
            this.createService.wizMetadata.next(new Metadata(this.exhibitionName, this.description, this.selectedTagIds, this.thumbnailUrl));
            this.createService.saveMetaDate();
        }
        else {
            this.createService.wizMetadata.next(undefined);
        }
    }
    ngOnInit() {
    }
    thumbnailUploaded(event) {
        this.thumbnailUrl = event.url;
        this.change();
    }
};
CreateExhibitionMetadataComponent = __decorate([
    Component({
        selector: 'app-create-exhibition-metadata',
        templateUrl: './create-exhibition-metadata.component.html',
        styleUrls: ['./create-exhibition-metadata.component.scss']
    })
], CreateExhibitionMetadataComponent);
export { CreateExhibitionMetadataComponent };
//# sourceMappingURL=create-exhibition-metadata.component.js.map