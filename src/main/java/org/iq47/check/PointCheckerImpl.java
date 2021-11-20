package org.iq47.check;

import org.iq47.model.entity.Point;
import org.springframework.stereotype.Component;

@Component
public class PointCheckerImpl implements PointChecker{

    @Override
    public boolean isHit(Point point) {
        return false;
    }
}
