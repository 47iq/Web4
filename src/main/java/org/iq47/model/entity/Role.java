package org.iq47.model.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.iq47.security.userDetails.UserRole;

import javax.persistence.*;

@Data
@Entity
@NoArgsConstructor
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue
    private long id;

    @Enumerated(EnumType.STRING)
    private UserRole roleName;

    public Role(UserRole roleName) {
        this.roleName = roleName;
    }
}
