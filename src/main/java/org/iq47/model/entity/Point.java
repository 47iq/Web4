package org.iq47.model.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "points")
public class Point {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "x")
    private double coordinateX;
    @Column(name = "y")
    private double coordinateY;
    @Column(name = "r")
    private double radius;
    @Column(name = "hit")
    private Boolean hit;
    @Column(name = "local_time")
    private LocalDateTime ldt;

    @ManyToOne
    @JoinColumn(name = "user_uid", referencedColumnName = "uid")
    private User user;

    public Point(double coordinateX, double coordinateY, double radius, User user) {
        this.coordinateX = coordinateX;
        this.coordinateY = coordinateY;
        this.radius = radius;
        if (hit == null) {
            this.calculate();
        }
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point that = (Point) o;
        return Double.compare(that.coordinateX, coordinateX) == 0 &&
                Double.compare(that.coordinateY, coordinateY) == 0 &&
                Double.compare(that.radius, radius) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(coordinateX, coordinateY, radius);
    }

    void calculate() {
        int offset = 180;
        hit = calculateHit(coordinateX, coordinateY, radius);
        ldt = ZonedDateTime.now(ZoneOffset.UTC).plusMinutes(offset).toLocalDateTime();
    }

    boolean calculateHit(double x, double y, double r) {
        return (x >= 0 && y <= 0 && y >= -r && x <= r) ||
                (x >= 0 && y >= 0 && x * x + y * y <= r/2 * r/2) ||
                (x <= 0 && y <= 0 && y >= -r/2 && (y >= (-x - r/2)) && x >= -r/2);
    }
}