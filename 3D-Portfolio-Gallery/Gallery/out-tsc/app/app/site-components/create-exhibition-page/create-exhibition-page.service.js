import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { AddExhibitDTO, AddExhibitionDTO } from "../../shared/class/dto/addExhibitionDTO";
let CreateExhibitionPageService = class CreateExhibitionPageService {
    constructor(galleryService, authService, route) {
        this.galleryService = galleryService;
        this.authService = authService;
        this.route = route;
        this.isExhibitionUploadable = false;
        this.METADATAKEY = "metadata";
        this.EXHIBITKEY = "exhibit";
        this.ROOMIKEY = "room";
        this.initialStateExhibits = [];
        this.initialStatePositionConfigList = [];
        this.wizMetadata = new BehaviorSubject(undefined);
        this.wizExhibits = new BehaviorSubject(this.initialStateExhibits);
        this.wizRoom = new BehaviorSubject(undefined);
        this.wizPositionConfigList = new BehaviorSubject(this.initialStatePositionConfigList);
        this.checkSavedData();
    }
    checkSavedData() {
        if (sessionStorage.getItem(this.METADATAKEY)) {
            this.wizMetadata.next(JSON.parse(sessionStorage.getItem(this.METADATAKEY)));
        }
        if (sessionStorage.getItem(this.EXHIBITKEY)) {
            this.wizExhibits.next(JSON.parse(sessionStorage.getItem(this.EXHIBITKEY)));
        }
        if (sessionStorage.getItem(this.ROOMIKEY)) {
            this.wizRoom.next(JSON.parse(sessionStorage.getItem(this.ROOMIKEY)));
        }
    }
    getSelectedState() {
        if (this.wizPositionConfigList.value.length > 0) {
            return 3;
        }
        else if (this.wizRoom.value) {
            return 2;
        }
        else if (this.wizExhibits.value.length > 0) {
            return 1;
        }
        return 0;
    }
    saveMetaDate() {
        if (this.wizMetadata.value != undefined) {
            sessionStorage.setItem(this.METADATAKEY, JSON.stringify(this.wizMetadata.value));
        }
    }
    saveExhibit() {
        if (this.wizExhibits.value.length > 0) {
            sessionStorage.setItem(this.EXHIBITKEY, JSON.stringify(this.wizExhibits.value));
        }
    }
    saveRoom() {
        if (this.wizRoom.value != undefined) {
            sessionStorage.setItem(this.ROOMIKEY, JSON.stringify(this.wizRoom.value));
        }
    }
    upload() {
        if (this.uploadValid()) {
            this.postExhibition();
        }
    }
    uploadValid() {
        console.log("Upload Valid");
        return this.wizMetadata.value != undefined
            && this.wizRoom.value != undefined
            && this.wizPositionConfigList.value.length > 0
            && this.wizExhibits.value.length > 0
            && localStorage.getItem('user_id') != undefined;
    }
    postExhibition() {
        const tempMeta = this.wizMetadata.value;
        const tempRoom = this.wizRoom.value;
        const tempPositionConfig = this.wizPositionConfigList.value;
        const tempExhibitits = this.wizExhibits.value;
        const userId = localStorage.getItem('user_id');
        if (tempMeta != undefined &&
            tempRoom != undefined &&
            tempPositionConfig != undefined &&
            tempExhibitits != undefined &&
            userId != undefined) {
            const tempAddExhibit = tempPositionConfig.filter(value => {
                return value.position_id != -1;
            }).map(value => {
                const exhibit = tempExhibitits.find(value1 => {
                    return value1.url == value.exhibit_url;
                });
                value.material_id = 1;
                if (exhibit != undefined) {
                    return new AddExhibitDTO(exhibit.data_type, exhibit.description, exhibit.title, exhibit.url, value.scale_factor, value.alignment, value.material_id, value.position_id);
                }
                return;
            });
            const tempAddExhibition = new AddExhibitionDTO(tempMeta.title, tempMeta.desc ?? '', tempRoom.id, parseInt(userId), tempMeta.tagIds, tempAddExhibit, tempMeta.thumbnailUrl);
            console.log(tempAddExhibition);
            this.galleryService.postExhibition(tempAddExhibition).subscribe({
                next: _ => {
                    this.clear();
                    this.route.navigate(["/home"]);
                },
                error: err => {
                    console.error("Error at Exhibition Post", err);
                }
            });
        }
    }
    clear() {
        sessionStorage.removeItem(this.ROOMIKEY);
        sessionStorage.removeItem(this.METADATAKEY);
        sessionStorage.removeItem(this.EXHIBITKEY);
        this.wizExhibits.next([]);
        this.wizRoom.next(undefined);
        this.wizMetadata.next(undefined);
        this.wizPositionConfigList.next([]);
    }
};
CreateExhibitionPageService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CreateExhibitionPageService);
export { CreateExhibitionPageService };
export class Metadata {
    constructor(title, desc, tagIds, thumbnailUrl) {
        this.tagIds = [];
        this.title = title;
        this.desc = desc;
        this.tagIds = tagIds;
        this.thumbnailUrl = thumbnailUrl;
    }
}
//# sourceMappingURL=create-exhibition-page.service.js.map