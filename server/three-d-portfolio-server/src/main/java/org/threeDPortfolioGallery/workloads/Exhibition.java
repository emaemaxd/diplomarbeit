package org.threeDPortfolioGallery.workloads;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;


import java.util.List;
import java.util.Set;

@Entity
public class Exhibition extends PanacheEntity {

    public String thumbnail_url;

    public String title;

    public String description;

    // relationships <3
    @OneToMany(mappedBy = "exhibition", cascade = CascadeType.REMOVE)
    public List<Exhibit> exhibits;

    @JsonIgnore
    @ManyToOne
    public User user;

    @ManyToOne
    public Room room;

    @ManyToMany
    @JoinTable(
            name = "exhibitions_categories",
            joinColumns = @JoinColumn(name = "exhibition_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    public Set<Category> categories;
}
