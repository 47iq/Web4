package org.iq47.model;

import org.iq47.model.entity.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

@Repository
public interface PointRepository extends JpaRepository<Point, Long> {
    Collection<Point> findAllByUserUid(Long userId);

    @Transactional
    Collection<Point> deleteAllByUserUid(Long userId);
}
