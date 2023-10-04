import { __decorate } from "tslib";
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Theme } from "./class/theme";
let GalleryService = class GalleryService {
    constructor(httpClient, navbarService) {
        this.httpClient = httpClient;
        this.navbarService = navbarService;
        this.supportedFiletypes = new Map();
        this.URL = "https://student.cloud.htl-leonding.ac.at/e.halilovic/api/";
        this.supportedFiletypes.set('image', ['image/png', 'image/jpeg', 'image/jpg', 'png', 'jpeg', 'jpg']);
        this.supportedFiletypes.set('video', ['mov', 'mp4']);
        this.supportedFiletypes.set('3d', ['gltf', 'obj', 'fbx', 'amf']);
    }
    /*URL = "http://localhost:8080/api/" */
    getFileTypeCategoryByFileType(fileType) {
        return [...this.supportedFiletypes.keys()]
            .find(value => {
            return this.supportedFiletypes.get(value).includes(fileType);
        });
    }
    getAllRooms() {
        return this.httpClient.get(`${this.URL}rooms/all`);
    }
    getAllTags() {
        return this.httpClient.get(`${this.URL}category/all`);
    }
    getAllExhibitions() {
        return this.httpClient.get(this.URL + "exhibitions/all");
    }
    getExhibitonById(id) {
        return this.httpClient.get(this.URL + "exhibitions/" + id);
    }
    getExhibitonByIds(ids) {
        return this.httpClient.get(this.URL + "exhibitions/getByCategoryIds/" + ids);
    }
    getAllSearch(searchTerm) {
        return this.httpClient.get(this.URL + "exhibitions/search/" + searchTerm);
    }
    getAllCatagories() {
        return this.httpClient.get(this.URL + "category/all");
    }
    postExhibit(exhibit) {
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        return this.httpClient.post("assets/fakeendpoints/exhibit.json", exhibit, { headers: httpHeaders });
    }
    getSupportedFiletypes(type = "") {
        for (const key of this.supportedFiletypes.keys()) {
            if (type && key.includes(type)) {
                return this.supportedFiletypes.get(key.toLowerCase());
            }
        }
        var result = [];
        for (const value of this.supportedFiletypes.values()) {
            result.push(value);
        }
        return result.flat();
    }
    getClassificationPerType(type) {
        for (const key of this.supportedFiletypes.keys()) {
            if (type && this.supportedFiletypes.get(key)?.includes(type)) {
                return key;
            }
        }
        return "";
    }
    postFile(fd) {
        const req = new HttpRequest('POST', `${this.URL}exhibitions/upload`, fd, {
            reportProgress: true,
            responseType: "text"
        });
        return this.httpClient.request(req);
    }
    getFile(fileName) {
        return this.httpClient.get(`${this.URL}exhibitions/download/${fileName}`, { responseType: 'blob' });
    }
    getThemeList() {
        return [
            new Theme(1, "./assets/image/podest.png", "podest.gltf", 0, true, "", ""),
            new Theme(2, "./assets/image/podest_01.png", "podest_01.gltf", 0, true, "", ""),
            new Theme(3, "./assets/image/small_podest.png", "small_podest.gltf", 0, true, "", "")
        ];
    }
    postExhibition(tempAddExhibition) {
        return this.httpClient.post(`${this.URL}exhibitions/new`, tempAddExhibition);
    }
    deleteExhibition(id) {
        return this.httpClient.delete(`${this.URL}exhibitions/deleteById/${id}`);
    }
    getValidImageString(url) {
        url = url.replace('/', '%2F');
        return `${this.URL}exhibitions/downloadImageFile/${url}`;
    }
};
GalleryService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], GalleryService);
export { GalleryService };
//# sourceMappingURL=gallery.service.js.map