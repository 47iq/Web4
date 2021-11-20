package org.iq47.service;

import org.iq47.model.entity.Role;

public interface RoleService {
    Role saveRole(Role roleEntity);

    void removeRole(Role roleEntity);
}
