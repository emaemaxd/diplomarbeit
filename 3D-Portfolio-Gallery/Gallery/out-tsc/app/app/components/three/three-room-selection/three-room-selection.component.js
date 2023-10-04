import { __decorate } from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
let ThreeRoomSelectionComponent = class ThreeRoomSelectionComponent {
    constructor() {
        this.srcModel = "";
        this.srcTexture = "";
        this.scene = new THREE.Scene();
        this.loader = new GLTFLoader().setPath('assets/three-d-objects/room/');
        this.textureLoader = new THREE.TextureLoader();
        this.setup = () => {
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.threeCanvas.nativeElement,
                antialias: true
            });
            this.camera = new THREE.PerspectiveCamera(100, this.lookupSize.nativeElement.offsetWidth / this.lookupSize.nativeElement.offsetHeight, 0.1, 1000);
            this.onResize();
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.scene.background = new THREE.Color(0xf7f8fa);
            this.camera?.position.set(-1.8, 100, 2.7);
        };
        this.animate = () => {
            requestAnimationFrame(this.animate);
            this.controls?.update();
            this.renderer?.render(this.scene, this.camera);
        };
    }
    ngAfterViewInit() {
        this.setup();
        this.loadRoom();
        this.animate();
    }
    ngOnChanges(changes) {
        this.loadRoom();
    }
    loadRoom() {
        if (this.srcModel != "") {
            this.scene.clear();
            this.loader.load('walls/' + this.srcModel, (gltf) => {
                this.scene.add(gltf.scene);
            });
            this.loader.load('floor/' + this.srcModel, (gltf) => {
                this.scene.add(gltf.scene);
            });
        }
    }
    onResize() {
        if (this.camera) {
            this.camera.aspect = this.lookupSize.nativeElement.offsetWidth / this.lookupSize.nativeElement.offsetHeight;
        }
        if (this.renderer) {
            this.renderer.setSize(this.lookupSize.nativeElement.offsetWidth, this.lookupSize.nativeElement.offsetHeight);
        }
    }
};
__decorate([
    ViewChild('threeCanvas')
], ThreeRoomSelectionComponent.prototype, "threeCanvas", void 0);
__decorate([
    ViewChild('lookupSize')
], ThreeRoomSelectionComponent.prototype, "lookupSize", void 0);
__decorate([
    Input("srcModel")
], ThreeRoomSelectionComponent.prototype, "srcModel", void 0);
__decorate([
    Input("srcTexture")
], ThreeRoomSelectionComponent.prototype, "srcTexture", void 0);
ThreeRoomSelectionComponent = __decorate([
    Component({
        selector: 'app-three-room-selection',
        templateUrl: './three-room-selection.component.html',
        styleUrls: ['./three-room-selection.component.scss']
    })
], ThreeRoomSelectionComponent);
export { ThreeRoomSelectionComponent };
//# sourceMappingURL=three-room-selection.component.js.map