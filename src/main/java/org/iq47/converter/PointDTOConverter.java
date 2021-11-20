package org.iq47.converter;

import org.iq47.model.entity.Point;
import org.iq47.model.entity.User;
import org.iq47.network.PointDTO;

public class PointDTOConverter {
    public static Point dtoToEntity(PointDTO pointDto, User persistent) {
        return new Point(pointDto.getCoordinateX(), pointDto.getCoordinateY(),
                pointDto.getRadius(), persistent);
    }

    public static PointDTO entityToDto(Point pointEntity) {
        return PointDTO.newBuilder()
                .setUserId(pointEntity.getUser().getUid())
                .setCoordinateX(pointEntity.getCoordinateX())
                .setCoordinateY(pointEntity.getCoordinateY())
                .setLocalTime(pointEntity.getLdt())
                .setHit(pointEntity.getHit())
                .setRadius(pointEntity.getRadius())
                .setPointId(pointEntity.getId()).build();
    }
}
