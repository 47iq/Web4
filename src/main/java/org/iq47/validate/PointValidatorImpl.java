package org.iq47.validate;

import org.iq47.model.entity.Point;
import org.iq47.network.request.PointCheckRequest;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PointValidatorImpl implements PointValidator {

    @Override
    public Optional<String> getErrorMessage(PointCheckRequest point) {
        if(point.getX() == null)
            return Optional.of("X must be set");
        if(point.getX().isNaN() || point.getX().isInfinite())
            return Optional.of("X must be a number");
        if(point.getX() <= -3 || point.getX() >= 3)
            return Optional.of("X must be in range (-3; 3)");
        if(point.getY() == null)
            return Optional.of("Y must be set");
        if(point.getY().isNaN() || point.getY().isInfinite())
            return Optional.of("Y must be a number");
        if(point.getY() <= -5 || point.getY() >= 5)
            return Optional.of("Y must be in range (-5; 5)");
        if(point.getR() == null)
            return Optional.of("R must be set");
        if(point.getR().isNaN() || point.getR().isInfinite())
            return Optional.of("R must be a number");
        if(point.getR() <= -3 || point.getR() >= 3)
            return Optional.of("R must be in range (-3; 3)");
        return Optional.empty();
    }
}
