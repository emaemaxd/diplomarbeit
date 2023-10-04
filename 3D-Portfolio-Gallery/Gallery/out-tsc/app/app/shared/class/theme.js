export class Theme {
    constructor(id, thumbnail_url, mat_wall_or_object, light_intensity, isFor3D = true, mat_floor, model_path) {
        this.id = id;
        this.thumbnail_url = thumbnail_url;
        this.mat_wall_or_object = mat_wall_or_object;
        this.mat_floor = mat_floor;
        this.light_intensity = light_intensity;
        this.model_path = model_path;
        this.isFor3D = isFor3D;
    }
}
//# sourceMappingURL=theme.js.map