export class AddExhibitionDTO {
    constructor(title, description, room_id, user_id, category_ids, exhibits, thumbnail_url) {
        this.thumbnail_url = thumbnail_url;
        this.title = title;
        this.description = description;
        this.room_id = room_id;
        this.user_id = user_id;
        this.category_ids = category_ids;
        this.exhibits = exhibits;
    }
}
export class AddExhibitDTO {
    constructor(data_type, description, title, url, scale = 1, alignment = 'c', theme_id, position_id) {
        this.data_type = data_type;
        this.description = description;
        this.title = title;
        this.url = url;
        this.scale = scale;
        this.alignment = alignment;
        this.theme_id = theme_id;
        this.position_id = position_id;
    }
}
//# sourceMappingURL=addExhibitionDTO.js.map