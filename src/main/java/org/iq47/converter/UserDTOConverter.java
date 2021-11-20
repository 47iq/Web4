package org.iq47.converter;

import org.iq47.model.entity.Role;
import org.iq47.model.entity.User;
import org.iq47.network.UserDTO;

import java.util.Set;
import java.util.stream.Collectors;

public class UserDTOConverter {
    public static User dtoToEntity(UserDTO userDto) {
        Set<Role> roleSet = userDto.getRoleSet().stream().map(Role::new).collect(Collectors.toSet());
        return new User(userDto.getUsername(),
                userDto.getPassword(),
                roleSet);
    }

    public static UserDTO entityToDto(User userEntity) {
        return new UserDTO(userEntity.getUid(),
                userEntity.getUsername(),
                userEntity.getPassword(),
                userEntity.getRoleSet().stream().map(Role::getRoleName).collect(Collectors.toSet()));
    }
}
