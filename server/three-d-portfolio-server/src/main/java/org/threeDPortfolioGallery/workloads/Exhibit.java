package org.threeDPortfolioGallery.workloads;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;



@Entity
public class Exhibit extends PanacheEntity {
    public String url;
    public String data_type;
    public String title;
    public String description;
    public int scale;
    @Column(length = 1)
    public String alignment;

    // relationships <3
    @JsonIgnore
    @ManyToOne// das gleiche nur für hibernate specific stuff: @OnDelete(action = OnDeleteAction.CASCADE)
    public Exhibition exhibition;

    @JsonIgnore
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    public Theme theme;

    @ManyToOne
    public Position position;

    public Exhibit(String url, String data_type, String title, String description, int scale, String alignment) {
        this.url = url;
        this.data_type = data_type;
        this.title = title;
        this.description = description;
        this.scale = scale;
        this.alignment = alignment;
    }

    public Exhibit() {
    }
}
