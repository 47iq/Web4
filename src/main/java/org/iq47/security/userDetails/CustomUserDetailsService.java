package org.iq47.security.userDetails;

import lombok.RequiredArgsConstructor;
import org.iq47.model.UserRepository;
import org.iq47.model.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final Optional<User> userEntity = userRepo.findByUsername(username);

        if (!userEntity.isPresent()) {
            throw new UsernameNotFoundException("User " + username + " not found.");
        }

        return CustomUserDetails.build(userEntity.get());
    }
}
