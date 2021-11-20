package org.iq47.security;

import org.iq47.security.userDetails.CustomUserDetails;
import org.springframework.security.core.Authentication;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface JwtTokenService {
    String createToken(CustomUserDetails userDetails);
    Authentication getAuthentication(String token);
    String getUsernameFromToken(String token);
    String resolveToken(HttpServletRequest req);
    boolean validateToken(String token);
}
