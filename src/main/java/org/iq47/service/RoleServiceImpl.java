package org.iq47.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.iq47.model.RoleRepository;
import org.iq47.model.entity.Role;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepo;

    @Override
    public Role saveRole(Role roleEntity) {
        return roleRepo.save(roleEntity);
    }

    @Override
    public void removeRole(Role roleEntity) {
        roleRepo.delete(roleEntity);
    }
}
