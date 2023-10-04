package org.threeDPortfolioGallery.workloads;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;

import jakarta.persistence.*;


import java.util.List;

@Entity
public class Room extends PanacheEntity {

    public String name;

    public String thumbnail_url;

    public String room_wall_url;

    public String wall_mat_url;
    public String room_floor_url;

    public String floor_mat_url;

    public int floorRepeatTexture;

    // relationships <3
    @JsonIgnore
    @OneToMany(mappedBy = "room")
    public List<Exhibition> exhibition;

    // @JsonIgnore
    @OneToMany(mappedBy = "room")
    public List<Position> positions;
}
