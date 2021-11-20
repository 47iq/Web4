package org.iq47.controller;

import org.iq47.exception.PointSaveException;
import org.iq47.model.PointRepository;
import org.iq47.network.PointDTO;
import org.iq47.network.request.PointCheckRequest;
import org.iq47.network.response.ResponseWrapper;
import org.iq47.security.userDetails.CustomUserDetails;
import org.iq47.service.PointService;
import org.iq47.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/points")
public class AreaController {

    PointService pointService;
    UserService userService;

    @Autowired
    public AreaController(PointService pointService) {
        this.pointService = pointService;
    }

    @PostMapping("/check")
    public ResponseEntity<?> check(@RequestBody PointCheckRequest req) {
        try {
            checkSaveRequest(req);
            Long userId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
            return save(userId, req);

        } catch (PointSaveException | InvalidRequestException ex) {
            return ResponseEntity.badRequest().body(new ResponseWrapper(ex.getMessage()));
        }
    }

    private ResponseEntity<?> save(Long userId, PointCheckRequest req) throws PointSaveException {
        PointDTO pointDto = PointDTO.newBuilder()
                .setUserId(userId)
                .setCoordinateX(req.getX())
                .setCoordinateY(req.getY())
                .setRadius(req.getR()).build();
        Optional<PointDTO> pointDtoOptional = pointService.savePoint(pointDto);
        if (!pointDtoOptional.isPresent()) {
            throw new PointSaveException("Point has not been saved.");
        }
        return ResponseEntity.ok().body(pointDtoOptional.get());
    }

    private void checkSaveRequest(PointCheckRequest req) throws InvalidRequestException {
        if (req.getX() == null || req.getY() == null) {
            throw new InvalidRequestException("Request data is invalid.");
        }
        if (req.getR() == null || req.getR().isInfinite() || req.getR().isNaN()) {
            throw new InvalidRequestException("Request data is invalid");
        }
    }

    @GetMapping("/get")
    public ResponseEntity<?> get() {
        Long userId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return ResponseEntity.ok().body(pointService.getPointsByUserId(userId));
    }

    @GetMapping("/hello")
    public ResponseEntity<?> hello() {
        return ResponseEntity.ok().body(new ResponseWrapper("hello"));
    }


    @PostMapping("/clear")
    public ResponseEntity<?> clear() {
        Long userId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        return ResponseEntity.ok().body(pointService.removePointsByUserId(userId));
    }
}
