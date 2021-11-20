package org.iq47.service;

import org.iq47.model.entity.Point;
import org.iq47.network.PointDTO;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PointService {
    Optional<PointDTO> savePoint(PointDTO point);

    Collection<PointDTO> getPointsByUserId(Long userId);

    Collection<PointDTO> removePointsByUserId(Long userId);
}
