package org.iq47.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    Long uid;

    @Column(nullable = false, unique = true)
    String username;

    @Column(nullable = false)
    String password;


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(
                    name = "user_id",
                    referencedColumnName = "uid"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id",
                    referencedColumnName = "id"
            ))
    private Collection<Role> roleSet;

    public User(String username, String password) {
        this.password = password;
        this.username = username;
    }

    public User(String username, String password, Collection<Role> roleSet) {
        this.username = username;
        this.password = password;
        this.roleSet = roleSet;
        //todo

    }

    public User() {

    }
}
