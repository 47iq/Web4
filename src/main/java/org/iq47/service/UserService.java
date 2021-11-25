package org.iq47.service;

import org.iq47.network.UserDTO;

import java.util.Collection;

public interface UserService {
    UserDTO saveUser(UserDTO userDto);

    boolean userExistByName(String username);
}
