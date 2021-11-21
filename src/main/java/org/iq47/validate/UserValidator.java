package org.iq47.validate;

import org.iq47.model.entity.User;
import org.iq47.network.request.RegisterRequest;

import java.util.Optional;

public interface UserValidator {
    Optional<String> getErrorMessage(RegisterRequest request);
}
