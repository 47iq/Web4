package org.iq47.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.iq47.converter.UserDTOConverter;
import org.iq47.model.RoleRepository;
import org.iq47.model.UserRepository;
import org.iq47.model.entity.Role;
import org.iq47.model.entity.User;
import org.iq47.network.UserDTO;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;

    @Override
    public UserDTO saveUser(UserDTO userDto) {
        User userEntity = UserDTOConverter.dtoToEntity(userDto);
        System.out.println(userEntity);
        // making roles persistent from transient
        Set<Role> rolePersistSet = userEntity.getRoleSet().stream()
                .map(rt -> roleRepo.findByRoleName(rt.getRoleName()))
                .collect(Collectors.toSet());
        userEntity.setRoleSet(rolePersistSet);
        User savedEntity = userRepo.save(userEntity);
        System.out.println(savedEntity);
        return UserDTOConverter.entityToDto(savedEntity);
    }

    @Override
    public Collection<UserDTO> getUsers() {
        return userRepo.findAll().stream().map(UserDTOConverter::entityToDto).collect(Collectors.toList());
    }

    @Override
    public boolean userExistByName(String username) {
        return (userRepo.findByUsername(username).isPresent());
    }

    @Override
    public boolean userExistById(Long id) {
        return userRepo.findById(id).isPresent();
    }
}
