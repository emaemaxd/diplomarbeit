import { __decorate, __param } from "tslib";
import { Component, Input, ViewChild, Inject } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BoxGeometry, Vector3 } from "three";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
let ThreeRoomComponent = class ThreeRoomComponent {
    constructor(createService, dialog, gs) {
        this.createService = createService;
        this.dialog = dialog;
        this.gs = gs;
        this.room_uuid = [];
        this.mode = "create";
        this.exArray = [];
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.loader = new GLTFLoader();
        this.raycaster = new THREE.Raycaster();
        this.collisionRaycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.potests = new BoxGeometry(20, 70, 20);
        this.basic_material = new THREE.MeshBasicMaterial({ color: 0x00ee00, opacity: .5 });
        this.isAboutToDestroy = false;
        this.dialogOpen = false;
        this.selectedObjects = [];
        this.object_uuid_holder = [];
        this.theme_list = [];
        this.camera_height = 100;
        this.setup = () => {
            this.camera = new THREE.PerspectiveCamera(50, this.lookupSize.nativeElement.offsetWidth / this.lookupSize.nativeElement.offsetHeight, 0.1, 1500);
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.threeCanvas.nativeElement
            });
            this.renderer?.setSize(this.lookupSize.nativeElement.offsetWidth, this.lookupSize.nativeElement.offsetHeight);
            this.scene.background = new THREE.Color(0xf7f8fa);
            this.camera?.position.set(-1.8, this.camera_height, 2.7);
            if (this.mode == "create") {
                this.controls = new OrbitControls(this.camera, this.renderer.domElement);
                this.camera?.position.set(-1.8, 180, 10);
            }
            else {
                this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
                this.controls.lookSpeed = 0.2;
                this.controls.movementSpeed = 100;
                this.controls.lookVertical = false;
                this.controls.mouseDragOn = false;
                this.controls.autoForward = false;
                this.threeCanvas.nativeElement.addEventListener('pointerdown', (event) => {
                    // calculate pointer position in normalized device coordinates
                    // (-1 to +1) for both components
                    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
                    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
                    this.clickExhibit();
                });
                this.threeCanvas.nativeElement.addEventListener('pointermove', (event) => {
                    // calculate pointer position in normalized device coordinates
                    // (-1 to +1) for both components
                    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
                    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
                    this.hoverExhibit();
                });
                this.camera2 = this.camera.clone();
                document.addEventListener('keydown', (event) => {
                    this.handleCollision();
                });
            }
        };
        this.animate = () => {
            if (!this.isAboutToDestroy && (!this.dialogOpen)) {
                this.animationid = requestAnimationFrame(this.animate);
            }
            this.controls?.update(this.clock.getDelta());
            if (this.mode != "create") {
                var cameraChanged = this.compareCameras(this.camera, this.camera2);
                if (cameraChanged) {
                    this.detectCollision();
                }
            }
            this.renderer?.render(this.scene, this.camera);
            this.composer?.render();
            if (this.mode != "create") {
                this.camera2?.copy(this.camera);
            }
        };
        this.theme_list = gs.getThemeList();
        createService.wizRoom.subscribe(room => {
            this.room = room;
            this.setupRoom(room);
        });
    }
    ngOnInit() {
        if (this.mode == "view") {
            if (this.viewExhibitionId) {
                this.gs.getExhibitonById(this.viewExhibitionId).subscribe(value => {
                    this.room = value.room;
                    this.viewExhibition = value;
                    console.log(this.viewExhibition);
                    this.setupRoom(this.viewExhibition.room, this.viewExhibition);
                });
            }
        }
    }
    setupRoom(room, exhibition) {
        if (room != undefined) {
            //Load Room
            if (this.room_uuid.length > 0) {
                this.room_uuid.forEach(room_uuid => { this.clearScene(room_uuid); });
                this.room_uuid = [];
            }
            console.log("Loading Room");
            this.gs.getFile(room.room_wall_url.replace("/", "%2F")).subscribe(downloadedWall => {
                const wall_url = URL.createObjectURL(downloadedWall);
                console.log("loaded wall", room.room_wall_url);
                this.loader.load(wall_url, (gltf) => {
                    gltf.scene.scale.y = 350;
                    var material = new THREE.MeshLambertMaterial({
                        color: 0xceb8cf,
                        emissive: 0xceb8cf,
                        emissiveIntensity: 0.15,
                        side: THREE.DoubleSide
                    });
                    gltf.scene.traverse(function (node) {
                        if (node instanceof THREE.Mesh) {
                            node.material = material;
                        }
                    });
                    this.room_uuid.push(gltf.scene.uuid);
                    this.scene.add(gltf.scene);
                });
            });
            this.gs.getFile(room.room_floor_url.replace("/", "%2F")).subscribe(downloadedFloor => {
                const floor_url = URL.createObjectURL(downloadedFloor);
                console.log("loaded floor", room.room_floor_url);
                this.loader.load(floor_url, (gltf) => {
                    this.scene.add(gltf.scene);
                    this.room_uuid.push(gltf.scene.uuid);
                    let texture = new THREE.TextureLoader().load("assets/three-d-objects/textures/woodfloor/Wood_Floor_007_COLOR.jpg", (tex) => {
                        //tex.repeat = new Vector2(2, 2);
                        tex.wrapS = THREE.RepeatWrapping;
                        tex.wrapT = THREE.RepeatWrapping;
                        tex.repeat.set(6, 6);
                        //tex.needsUpdate = true;
                        //cube.scale.set(1.0, tex.image.height / tex.image.width, 1.0);
                    });
                    var material = new THREE.MeshLambertMaterial({
                        map: texture,
                        emissiveIntensity: 0.15,
                        side: THREE.DoubleSide
                    });
                    gltf.scene.traverse(function (node) {
                        if (node instanceof THREE.Mesh) {
                            node.material = material;
                        }
                    });
                });
            });
            // Load exhibit based on the positionConfigList
            if (this.mode == "create") {
                this.createService.wizPositionConfigList.subscribe(values => {
                    this.loadExhibits(values, room);
                });
            }
            else {
                var posConfigArr = [];
                for (let i = 0; i < exhibition.exhibits.length; i++) {
                    let posConfig = {};
                    console.log(exhibition.exhibits[i]);
                    posConfig.exhibit_url = exhibition.exhibits[i].url;
                    posConfig.title = exhibition.exhibits[i].title;
                    posConfig.description = exhibition.exhibits[i].description;
                    posConfig.position_id = exhibition.exhibits[i].position.id;
                    posConfig.exhibit_type = exhibition.exhibits[i].data_type;
                    posConfig.alignment = exhibition.exhibits[i].alignment;
                    posConfig.scale_factor = exhibition.exhibits[i].scale;
                    posConfigArr.push(posConfig);
                }
                this.loadExhibits(posConfigArr, room);
            }
        }
    }
    loadExhibits(values, room) {
        console.log("UUid in the Scene that sould be cleared", this.object_uuid_holder);
        // reverts changes from previews configuration
        for (let uuid of this.object_uuid_holder) {
            this.clearScene(uuid);
        }
        this.object_uuid_holder = [];
        console.log(values);
        for (let value of values) {
            // If there is no position don't draw the object
            if (value.position_id == undefined || value.position_id == -1) {
                continue;
            }
            console.log("Loading 3D Data Url: ", value.exhibit_url);
            this.gs.getFile(value.exhibit_url).subscribe(downloadedExhibit => {
                const fileType = this.gs.getFileTypeCategoryByFileType(value.exhibit_type);
                const url = URL.createObjectURL(downloadedExhibit);
                const currentPosition = room.positions.find(position => { return position.id == value.position_id; });
                let x = currentPosition?.x ?? 0;
                //let y = this.potests.parameters.height
                let z = currentPosition?.y ?? 0;
                //console.log("Loading 3d Model: Position #", value.position_id, " ", x, y, z)
                switch (fileType) {
                    case '3d':
                        let theme = this.theme_list.find(theme => { return theme.id == value.material_id; });
                        let sockelSize = new Vector3(0, 0, 0);
                        let podestUrl = 'assets/three-d-objects/podest.gltf';
                        if (theme != null) {
                            console.log(theme);
                            podestUrl = `assets/three-d-objects/${theme.mat_wall_or_object}`;
                        }
                        //Load Sockels
                        this.loader.load(podestUrl, (gltf) => {
                            sockelSize = this.getSize(gltf.scene);
                            gltf.scene.position.set(x, 0, z);
                            this.room_uuid.push(gltf.scene.uuid);
                            this.object_uuid_holder.push(gltf.scene.uuid);
                            this.scene.add(gltf.scene);
                            console.log("Loading 3d Data");
                            this.loader.load(url, (gltf) => {
                                value.uuid = gltf.scene.uuid;
                                this.object_uuid_holder.push(gltf.scene.uuid);
                                if (this.mode == "view") {
                                    this.exArray.push(value);
                                }
                                let size = this.getSize(gltf.scene);
                                gltf.scene.scale.set(1 / size.x * value.scale_factor, 1 / size.y * value.scale_factor, 1 / size.z * value.scale_factor);
                                // Alignment / Positioning
                                let y = sockelSize.y; //this.getSize(gltf.scene).y
                                switch (value.alignment) {
                                    case "l":
                                        z += 1 / size.z * value.scale_factor;
                                        break;
                                    case "r":
                                        z -= 1 / size.z * value.scale_factor;
                                        break;
                                    case "t":
                                        x += 1 / size.x * value.scale_factor;
                                        break;
                                    case "b":
                                        x -= 1 / size.x * value.scale_factor;
                                }
                                gltf.scene.position.set(x, y, z);
                                console.log(x, y, z);
                                //gltf.scene
                                this.scene.add(gltf.scene);
                            });
                        });
                        break;
                    default:
                        console.log("Loading Image");
                        let texture;
                        if (fileType == 'video') {
                            const video = () => {
                                const vid = document.createElement("video");
                                vid.crossOrigin = "anonymous";
                                vid.controls = false;
                                vid.loop = true;
                                vid.muted = true;
                                vid.autoplay = true;
                                vid.src = url;
                                vid.load();
                                vid.play();
                                return vid;
                            };
                            texture = new THREE.VideoTexture(video());
                        }
                        else {
                            texture = new THREE.TextureLoader().load(url, (tex) => {
                                tex.needsUpdate = true;
                                cube.scale.set(1.0, tex.image.height / tex.image.width, 1.0);
                            });
                        }
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(1, 1);
                        const geometry = new THREE.BoxGeometry(100, 100, .1);
                        const material = new THREE.MeshBasicMaterial({ map: texture });
                        const cube = new THREE.Mesh(geometry, material);
                        if (this.mode == "view") {
                            this.exArray.push(value);
                        }
                        value.uuid = cube.uuid;
                        this.object_uuid_holder.push(cube.uuid);
                        let cube_size = this.getSize(cube);
                        cube.position.set(x, cube_size.y / 2 + this.camera_height / 2, z);
                        cube.rotation.set(0, THREE.MathUtils.degToRad(currentPosition?.rotation ?? 0), 0);
                        this.scene.add(cube);
                        break;
                }
            });
        }
    }
    clearScene(uuid) {
        if (uuid) {
            const object = this.scene.getObjectByProperty('uuid', uuid);
            if (object) {
                this.scene.remove(object);
                object.clear();
            }
        }
    }
    ngAfterViewInit() {
        this.setup();
        //Light
        const bulbGeometry = new THREE.BoxGeometry(10000, 1, 10000);
        const bulbLight = new THREE.PointLight(0xffffff, 5, 2000, 3);
        const bulbMat = new THREE.MeshStandardMaterial({
            emissive: 0xffffff,
            emissiveIntensity: 1,
            color: 0x000000
        });
        bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
        bulbLight.position.set(0, 600, 0);
        bulbLight.castShadow = true;
        this.scene.add(bulbLight);
        //const ambientLight = new AmbientLight('white', 1000);
        this.animate();
    }
    onResize($event) {
        if (this.camera) {
            this.camera.aspect = this.lookupSize.nativeElement.offsetWidth / this.lookupSize.nativeElement.offsetHeight;
            console.log(this.camera.aspect);
            console.log(this.lookupSize.nativeElement.offsetWidth / this.lookupSize.nativeElement.offsetHeight);
        }
        if (this.renderer) {
            this.renderer?.setSize(this.lookupSize.nativeElement.offsetWidth, this.lookupSize.nativeElement.offsetHeight);
        }
    }
    openDialog(enterAnimationDuration, exitAnimationDuration) {
        const dialogRef = this.dialog.open(ExhibitDialog, {
            maxWidth: '100vw',
            maxHeight: '50vh',
            width: '100%',
            height: '100%',
            data: { description: this.objectDescription, title: this.objectTitle, objectUrl: this.objectUrl, dataType: this.objectDataType, allExhbits: this.exArray },
            enterAnimationDuration,
            exitAnimationDuration,
        });
        this.dialogOpen = true;
        console.log(this.animationid);
        cancelAnimationFrame(this.animationid);
        this.clock.stop();
        dialogRef.afterClosed().subscribe(r => {
            this.dialogOpen = false;
            this.animate();
            this.clock.start();
        });
    }
    handleCollision() {
        this.detectCollision();
        this.clock.start();
    }
    clickExhibit() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        var values = this.exArray;
        for (let value of values) {
            console.log(value);
            if (value.uuid == intersects[0].object.parent?.parent?.uuid || value.uuid == intersects[0].object.uuid) {
                if (value.uuid != null) {
                    const object = this.scene.getObjectByProperty('uuid', value.uuid);
                    this.objectDescription = value.description;
                    this.objectTitle = value.title;
                    this.objectUrl = value.exhibit_url;
                    this.objectDataType = value.exhibit_type;
                    if (!this.dialogOpen)
                        this.openDialog('1000ms', '300ms');
                }
            }
        }
    }
    hoverExhibit() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        var values = this.exArray;
        for (let value of values) {
            if (value.uuid != null) {
                if (value.uuid == intersects[0].object.parent?.parent?.uuid || value.uuid == intersects[0].object.uuid) {
                    const object = this.scene.getObjectByProperty('uuid', value.uuid);
                    const renderPass = new RenderPass(this.scene, this.camera);
                    this.composer = new EffectComposer(this.renderer);
                    this.composer.addPass(renderPass);
                    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
                    this.composer.addPass(outlinePass);
                    this.addSelectedObjects(object);
                    outlinePass.selectedObjects = this.selectedObjects;
                }
            }
        }
    }
    addSelectedObjects(object) {
        this.selectedObjects = [];
        this.selectedObjects.push(object);
    }
    detectCollision() {
        this.collisionRaycaster.set(this.camera.position, this.camera2.position.normalize());
        this.collisionRaycaster.far = 100;
        const intersects = this.collisionRaycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            this.clock.stop();
        }
    }
    ngOnDestroy() {
        this.isAboutToDestroy = true;
        this.scene.clear();
    }
    getSize(scene) {
        return new THREE.Box3().setFromObject(scene).getSize(new Vector3());
    }
    compareCameras(camera, camera2) {
        if (camera.position.x == camera2.position.x && camera.position.y == camera2.position.y) {
            return false;
        }
        else {
            return true;
        }
    }
};
__decorate([
    Input('mode')
], ThreeRoomComponent.prototype, "mode", void 0);
__decorate([
    Input('viewExhibitionId')
], ThreeRoomComponent.prototype, "viewExhibitionId", void 0);
__decorate([
    ViewChild('threeCanvas')
], ThreeRoomComponent.prototype, "threeCanvas", void 0);
__decorate([
    ViewChild('lookupSize')
], ThreeRoomComponent.prototype, "lookupSize", void 0);
ThreeRoomComponent = __decorate([
    Component({
        selector: 'app-three-room',
        templateUrl: './three-room.component.html',
        styleUrls: ['./three-room.component.scss']
    })
], ThreeRoomComponent);
export { ThreeRoomComponent };
let ExhibitDialog = class ExhibitDialog {
    constructor(data, dialogRef, gs, zone) {
        this.data = data;
        this.dialogRef = dialogRef;
        this.gs = gs;
        this.zone = zone;
        this.isAboutToDestroy = false;
        this.sceneDetail = new THREE.Scene();
        this.loaderDetail = new GLTFLoader();
        this.setup = () => {
            if (this.fileType == '3d') {
                this.rendererDetail = new THREE.WebGLRenderer({
                    canvas: this.threeDetailCanvas.nativeElement,
                    //antialias: true
                });
                this.cameraDetail = new THREE.PerspectiveCamera(100, this.lookUpSizeDetail.nativeElement.offsetWidth / this.lookUpSizeDetail.nativeElement.offsetWidth, 0.1, 1000);
                this.cameraDetail?.position.set(-1.8, 180, 10);
                this.controlsDetail = new OrbitControls(this.cameraDetail, this.rendererDetail.domElement);
                this.sceneDetail.background = new THREE.Color(0xf7f8fa);
            }
        };
        this.animate = () => {
            console.log(this.fileType);
            if (this.fileType == '3d') {
                if (!this.isAboutToDestroy) {
                    requestAnimationFrame(this.animate);
                }
                this.controlsDetail?.update();
                this.rendererDetail?.render(this.sceneDetail, this.cameraDetail);
            }
        };
    }
    ngOnInit() {
        this.title = this.data.title;
        this.desc = this.data.description;
        console.log(this.data.allExhbits);
        this.checkDataType(this.data.dataType, this.data.objectUrl);
    }
    ngOnDestroy() {
        this.isAboutToDestroy = true;
        this.sceneDetail.clear();
    }
    ngAfterViewInit() {
        if (this.fileType == "3d") {
            this.setup();
            this.animate();
            this.loadExhibit(this.objectUrl);
        }
    }
    checkDataType(dataType, objectUrl) {
        this.fileType = this.gs.getFileTypeCategoryByFileType(dataType);
        console.log(this.fileType);
        this.objectUrl = objectUrl;
        if (this.fileType == "3d") {
            this.setup();
            this.animate();
            this.loadExhibit(this.objectUrl);
        }
        if (this.fileType == 'image') {
            this.thumbnail = objectUrl;
            this.thumbnail = "http://localhost:8080/api/exhibitions/downloadImageFile/" + this.thumbnail?.replace("/", "%2F");
        }
        if (this.fileType == 'video') {
            this.videoSrc = objectUrl;
            this.videoSrc = "http://localhost:8080/api/exhibitions/download/" + this.videoSrc?.replace("/", "%2F");
        }
    }
    prevEx() {
        if (this.data.allExhbits.length > 1) {
            for (let i = 0; i < this.data.allExhbits.length; i++) {
                if (this.title == this.data.allExhbits[i].title) {
                    if (i != 0) {
                        console.log(this.data.allExhbits[i].title);
                        this.title = this.data.allExhbits[i - 1].title;
                        this.desc = this.data.allExhbits[i - 1].description;
                        this.checkDataType(this.data.allExhbits[i - 1].exhibit_type, this.data.allExhbits[i - 1].exhibit_url);
                    }
                    else {
                        this.title = this.data.allExhbits[this.data.allExhbits.length - 1].title;
                        this.desc = this.data.allExhbits[this.data.allExhbits.length - 1].description;
                        this.checkDataType(this.data.allExhbits[this.data.allExhbits.length - 1].exhibit_type, this.data.allExhbits[this.data.allExhbits.length - 1].exhibit_url);
                    }
                    break;
                }
            }
        }
    }
    nextEx() {
        if (this.data.allExhbits.length > 1) {
            for (let i = 0; i < this.data.allExhbits.length; i++) {
                if (this.title == this.data.allExhbits[i].title) {
                    if (i != this.data.allExhbits.length - 1) {
                        console.log(this.data.allExhbits[i].title);
                        this.title = this.data.allExhbits[i + 1].title;
                        this.desc = this.data.allExhbits[i + 1].description;
                        this.checkDataType(this.data.allExhbits[i + 1].exhibit_type, this.data.allExhbits[i + 1].exhibit_url);
                    }
                    else {
                        this.title = this.data.allExhbits[0].title;
                        this.desc = this.data.allExhbits[0].description;
                        this.checkDataType(this.data.allExhbits[0].exhibit_type, this.data.allExhbits[0].exhibit_url);
                    }
                    break;
                }
            }
        }
    }
    loadExhibit(objectUrl) {
        this.sceneDetail.clear();
        console.log(objectUrl);
        this.gs.getFile(objectUrl).subscribe(downloadedExhibit => {
            const url = URL.createObjectURL(downloadedExhibit);
            this.loaderDetail.load(url, (gltf) => {
                this.sceneDetail.add(gltf.scene);
            });
            //Light
            const bulbGeometry = new THREE.SphereGeometry(.02, 16, 8);
            const bulbLight = new THREE.PointLight(0xffee88, 3, 1000, 2);
            const bulbMat = new THREE.MeshStandardMaterial({
                emissive: 0xffffee,
                emissiveIntensity: 1,
                color: 0x000000
            });
            bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
            bulbLight.position.set(0, 100, 0);
            bulbLight.castShadow = true;
            this.sceneDetail.add(bulbLight);
        });
    }
};
__decorate([
    ViewChild('threeDetailCanvas')
], ExhibitDialog.prototype, "threeDetailCanvas", void 0);
__decorate([
    ViewChild('lookUpSizeDetail')
], ExhibitDialog.prototype, "lookUpSizeDetail", void 0);
ExhibitDialog = __decorate([
    Component({
        selector: 'exhibit-dialog',
        templateUrl: 'exhibit-dialog.html',
        styleUrls: ['./three-room.component.scss']
    }),
    __param(0, Inject(MAT_DIALOG_DATA))
], ExhibitDialog);
export { ExhibitDialog };
//# sourceMappingURL=three-room.component.js.map