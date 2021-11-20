package org.iq47;
import lombok.extern.slf4j.Slf4j;
import org.iq47.model.entity.Role;
import org.iq47.security.userDetails.UserRole;
import org.iq47.service.RoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@Slf4j
public class DataBaseLoader {

    // saving roles
    @Bean
    CommandLineRunner runRoles(RoleService roleService) {
        return args -> {
            Arrays.stream(UserRole.values()).forEach(role ->
                    log.info("Preloading " + roleService.saveRole(new Role(role))));
        };
    }
}
