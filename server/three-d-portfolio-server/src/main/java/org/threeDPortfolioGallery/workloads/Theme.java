package org.threeDPortfolioGallery.workloads;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.smallrye.common.constraint.NotNull;

import jakarta.persistence.*;


import java.lang.reflect.Type;
import java.util.List;

@Entity
public class Theme extends PanacheEntity {

    public String name;
    public String thumbnail_url;

    public String container_url;

    public String container_mat_url;

    public float light_intensity;

    // relations
    @OneToMany(mappedBy = "theme")
    @JsonIgnore
    public List<Exhibit> exhibits;
}
