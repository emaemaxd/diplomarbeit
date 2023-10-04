package org.threeDPortfolioGallery.workloads.dto;

import lombok.Data;
import org.threeDPortfolioGallery.workloads.Position;

import java.util.List;

@Data
public class ReturnRoomDTO {
    public Long id; String name; String room_wall_url; String wall_mat_url;
    public String room_floor_url; String floor_mat_url;
    public List<Position> positions;

    public ReturnRoomDTO(Long id, String name, String room_wall_url, String wall_mat_url, String room_floor_url, String floor_mat_url, List<Position> positions) {
        this.id = id;
        this.name = name;
        this.room_wall_url = room_wall_url;
        this.wall_mat_url = wall_mat_url;
        this.room_floor_url = room_floor_url;
        this.floor_mat_url = floor_mat_url;
        this.positions = positions;
    }

    public ReturnRoomDTO() {
    }
}
