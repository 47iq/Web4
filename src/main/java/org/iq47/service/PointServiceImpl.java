package org.iq47.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.iq47.converter.PointDTOConverter;
import org.iq47.model.UserRepository;
import org.iq47.model.entity.Point;
import org.iq47.model.PointRepository;
import org.iq47.model.entity.User;
import org.iq47.network.PointDTO;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointServiceImpl implements PointService {

    private final PointRepository pointRepo;
    private final UserRepository userRepo;

    @Override
    public Optional<PointDTO> savePoint(PointDTO point) {
        //validation
        Optional<User> userOptional = userRepo.findById(point.getUserId());
        if (!userOptional.isPresent()) {
            return Optional.empty();
        }
        Point pointEntity = PointDTOConverter.dtoToEntity(point, userOptional.get());
        return Optional.of(PointDTOConverter.entityToDto(pointRepo.save(pointEntity)));
    }

    @Override
    public Collection<PointDTO> getPointsByUserId(Long userId) {
        return pointRepo.findAllByUserUid(userId).stream()
                .map(PointDTOConverter::entityToDto).collect(Collectors.toList());
    }

    @Override
    public Collection<PointDTO> removePointsByUserId(Long userId) {
        Collection<Point> pointDtoCollection = pointRepo.deleteAllByUserUid(userId);
        return pointDtoCollection.stream().map(PointDTOConverter::entityToDto).collect(Collectors.toList());
    }
}
