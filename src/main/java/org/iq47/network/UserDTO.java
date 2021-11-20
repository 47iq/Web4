package org.iq47.network;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import org.iq47.security.userDetails.UserRole;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@AllArgsConstructor
public class UserDTO {

    public Long id;
    public String username;
    public String password;
    public Set<UserRole> roleSet;

    public UserDTO(String username, String password) {
        this.username = username;
        this.password = password;
        this.roleSet = new HashSet<>();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDTO that = (UserDTO) o;
        return Objects.equals(username, that.username) && Objects.equals(password, that.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, password);
    }
}
