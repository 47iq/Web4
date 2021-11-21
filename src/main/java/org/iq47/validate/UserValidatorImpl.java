package org.iq47.validate;

import org.iq47.model.entity.User;
import org.iq47.network.request.RegisterRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserValidatorImpl implements UserValidator{

    @Override
    public Optional<String> getErrorMessage(RegisterRequest req) {
        if(req.getUsername() == null)
            return Optional.of("Username must be present");
        if(req.getPassword() == null)
            return Optional.of("Password must be present");
        if(req.getUsername().length() > 12)
            return Optional.of("Username must be not more than 12 characters long");
        if(req.getUsername().length() < 4)
            return Optional.of("Username must be at least 4 characters long");
        if((req.getUsername().charAt(0) >= '0') && (req.getUsername().charAt(0) <= '9'))
            return Optional.of("Username must start with a letter");
        if(req.getPassword().length() > 20)
            return Optional.of("Password must be not more than 20 characters long");
        if(req.getPassword().length() < 6)
            return Optional.of("Password must be at least 6 characters long");
        return Optional.empty();
    }
}
