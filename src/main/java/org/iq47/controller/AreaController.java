package org.iq47.controller;

import lombok.extern.slf4j.Slf4j;
import org.iq47.exception.PointSaveException;
import org.iq47.network.PointDTO;
import org.iq47.network.request.PointCheckRequest;
import org.iq47.network.response.ResponseWrapper;
import org.iq47.security.userDetails.CustomUserDetails;
import org.iq47.service.PointService;
import org.iq47.validate.PointValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/points")
@Slf4j
public class AreaController {

    private final PointService pointService;
    private final PointValidator pointValidator;

    @Autowired
    public AreaController(PointService pointService, PointValidator pointValidator) {
        this.pointService = pointService;
        this.pointValidator = pointValidator;
    }

    @PostMapping("/check")
    public ResponseEntity<?> check(@RequestBody PointCheckRequest req) {
        try {
            Optional<String> error = pointValidator.getErrorMessage(req);
            if(error.isPresent())
                throw new InvalidRequestException(error.get());
            Long userId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
            return save(userId, req);
        } catch (PointSaveException | InvalidRequestException ex) {
            return ResponseEntity.badRequest().body(new ResponseWrapper(ex.getMessage()));
        } catch (Exception e) {
            return reportError(req, e);
        }
    }

    private ResponseEntity<ResponseWrapper> reportError(Object req, Exception e) {
        if(req != null)
            log.error(String.format("Got %s while processing %s", e.getClass(), req));
        else
            log.error(String.format("Got %s while processing request", e.getClass()));
        return ResponseEntity.internalServerError().body(new ResponseWrapper("Something went wrong"));
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

    @GetMapping("/get")
    public ResponseEntity<?> get() {
        try {
            Long userId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
            return ResponseEntity.ok().body(pointService.getPointsByUserId(userId));
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().body(new ResponseWrapper("Access denied"));
        } catch (Exception e) {
            return reportError(null, e);
        }
    }


    @PostMapping("/clear")
    public ResponseEntity<?> clear() {
        try {
            Long userId = ((CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
            return ResponseEntity.ok().body(pointService.removePointsByUserId(userId));
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().body(new ResponseWrapper("Access denied"));
        } catch (Exception e) {
            return reportError(null, e);
        }
    }
}
