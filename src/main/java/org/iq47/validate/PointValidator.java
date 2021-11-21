package org.iq47.validate;

import org.iq47.model.entity.Point;
import org.iq47.network.request.PointCheckRequest;

import java.util.Optional;

public interface PointValidator {
    Optional<String> getErrorMessage(PointCheckRequest point);
}
