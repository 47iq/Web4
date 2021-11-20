package org.iq47.network;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
public class PointDTO {

    private Long userId;
    private double coordinateX;
    private double coordinateY;
    private double radius;
    private Boolean hit;
    private LocalDateTime ldt;
    private Long pointId;

    public static Builder newBuilder() {
        return new PointDTO().new Builder();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PointDTO that = (PointDTO) o;
        return Double.compare(that.pointId, pointId) == 0 && Double.compare(that.coordinateX, coordinateX) == 0 && Double.compare(that.coordinateY, coordinateY) == 0 && Double.compare(that.radius, radius) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(pointId, coordinateX, coordinateY, radius);
    }

    //builder
    public class Builder {
        private Builder() {
        }

        public Builder setCoordinateX(double coordinateX) {
            PointDTO.this.coordinateX = coordinateX;
            return this;
        }

        public Builder setCoordinateY(double coordinateY) {
            PointDTO.this.coordinateY = coordinateY;
            return this;
        }

        public Builder setRadius(double radius) {
            PointDTO.this.radius = radius;
            return this;
        }

        public Builder setHit(Boolean hit) {
            PointDTO.this.hit = hit;
            return this;
        }

        public Builder setLocalTime(LocalDateTime ldt) {
            PointDTO.this.ldt = ldt;
            return this;
        }

        public Builder setUserId(Long userId) {
            PointDTO.this.userId = userId;
            return this;
        }

        public Builder setPointId(Long pointId) {
            PointDTO.this.pointId = pointId;
            return this;
        }

        public PointDTO build() {
            return PointDTO.this;
        }
    }
}
