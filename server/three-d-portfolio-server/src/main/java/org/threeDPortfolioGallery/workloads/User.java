package org.threeDPortfolioGallery.workloads;


import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;

import jakarta.persistence.*;


import java.util.List;

@Entity
@Table(name="Users")        // causes exception if not here because "User" (in Postgres) is reserved
public class User extends PanacheEntity {

    @Column(nullable = false, length = 20)
    public String user_name;

    public String email;

    public String icon_url;

    @Column(nullable = false)
    public String password;

    // relationship exhibition
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    public List<Exhibition> exhibitions;

    public static User create(String user_name, String email, String iconUrl, String password, List<Exhibition> exhibitions) {
        User user = new User();
        user.user_name = user_name;
        user.email = email;
        user.icon_url = iconUrl;
        user.password = password;
        user.exhibitions = exhibitions;
        return user;
    }
}
