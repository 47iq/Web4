package org.iq47.controller;

import lombok.extern.slf4j.Slf4j;
import org.iq47.model.entity.RefreshToken;
import org.iq47.model.entity.User;
import org.iq47.network.UserDTO;
import org.iq47.network.request.LoginRequest;
import org.iq47.network.request.PointCheckRequest;
import org.iq47.network.request.RefreshRequest;
import org.iq47.network.request.RegisterRequest;
import org.iq47.network.response.JwtResponse;
import org.iq47.network.response.RefreshResponse;
import org.iq47.network.response.ResponseWrapper;
import org.iq47.security.JwtTokenService;
import org.iq47.security.userDetails.CustomUserDetails;
import org.iq47.security.userDetails.UserRole;
import org.iq47.service.RefreshTokenService;
import org.iq47.service.UserService;
import org.iq47.validate.PointValidator;
import org.iq47.validate.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.common.exceptions.InvalidRequestException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/users")
@Slf4j
public class AuthorizationController {

    private final JwtTokenService authService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final UserValidator userValidator;

    private final String TOKEN_TYPE = "Bearer";

    @Autowired
    public AuthorizationController(JwtTokenService jwtTokenService, AuthenticationManager authenticationManager, UserService userService, RefreshTokenService refreshTokenService, PointValidator pointValidator, UserValidator userValidator) {
        this.authService = jwtTokenService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.userValidator = userValidator;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            if (req.getUsername() == null || req.getUsername().equals("")) {
                throw new InvalidRequestException("Invalid request data: username is not set.");
            }
            if (req.getPassword() == null || req.getPassword().equals("")) {
                throw new InvalidRequestException("Invalid request data: password is not set.");
            }

            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());

            String accessToken = authService.createToken(userDetails);
            // delete if existed
            Optional<String> refreshTokenOptional = refreshTokenService.updateRefreshToken(userDetails.getId());
            if (!refreshTokenOptional.isPresent()) {
                throw new InvalidRequestException("User is not found in database");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(new JwtResponse(accessToken, TOKEN_TYPE,
                    refreshTokenOptional.get(), userDetails.getId(), userDetails.getUsername(), roles));

        } catch (InvalidRequestException | BadCredentialsException ex) {
            return ResponseEntity.badRequest().body(new ResponseWrapper(ex.getMessage()));
        } catch (Exception ex) {
            return reportError(req, ex);
        }
    }

    @PostMapping(value = "/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            if (req.getUsername() == null || req.getUsername().equals("")) {
                throw new InvalidRequestException("Invalid request data: username is not set");
            }
            if (req.getPassword() == null || req.getPassword().equals("")) {
                throw new InvalidRequestException("Invalid request data: password is not set");
            }
            if (userService.userExistByName(req.getUsername())) {
                throw new InvalidRequestException(String.format("User with username '%s' already exists", req.getUsername()));
            }
            Optional<String> message = userValidator.getErrorMessage(req);
            if (message.isPresent()) {
                throw new InvalidRequestException(message.get());
            }
            UserDTO userDto = new UserDTO(req.getUsername(), req.getPassword());
            Set<UserRole> roleSet = new HashSet<>();
            roleSet.add(UserRole.ROLE_USER);
            userDto.setRoleSet(roleSet);
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.saveUser(userDto));

        } catch (InvalidRequestException ex) {
            return ResponseEntity.badRequest().body(new ResponseWrapper(ex.getMessage()));
        }  catch (Exception ex) {
            return reportError(req, ex);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshRequest req) {
        try {
            // refresh token
            Optional<RefreshToken> optionalRTE = refreshTokenService.findByRefreshTokenName(req.getRefreshToken());
            if (!optionalRTE.isPresent()) {
                throw new InvalidRequestException("Token not found");
            }
            User userEntity = optionalRTE.get().getUserEntity();
            Optional<String> optionalRToken = refreshTokenService.updateRefreshToken(userEntity.getUid());
            if (!optionalRToken.isPresent()) {
                throw new InvalidRequestException("User is not present in database");
            }
            // access token
            CustomUserDetails customUserDetails = CustomUserDetails.build(userEntity);
            String accessToken = authService.createToken(customUserDetails);

            return ResponseEntity.status(HttpStatus.CREATED).body(new RefreshResponse(accessToken, optionalRToken.get(), TOKEN_TYPE));

        } catch (InvalidRequestException ex) {
            return ResponseEntity.badRequest().body(new ResponseWrapper(ex.getMessage()));
        }  catch (Exception ex) {
            return reportError(req, ex);
        }
    }

    private ResponseEntity<ResponseWrapper> reportError(Object req, Exception e) {
        if(req != null)
            log.error(String.format("Got %s while processing %s", e.getClass(), req));
        else
            log.error(String.format("Got %s while processing request", e.getClass()));
        return ResponseEntity.internalServerError().body(new ResponseWrapper("Something went wrong"));
    }
}
