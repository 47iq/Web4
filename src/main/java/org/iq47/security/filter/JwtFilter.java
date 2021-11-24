package org.iq47.security.filter;

import net.minidev.json.JSONObject;
import org.iq47.exception.ProviderException;
import org.iq47.security.JwtTokenService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtProvider;

    public JwtFilter(JwtTokenService jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws ServletException, IOException {
        String token = jwtProvider.resolveToken(req);
        try {
            if (token != null && jwtProvider.validateToken(token)) {
                Authentication auth = jwtProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (ProviderException ex) {
            //this is very important, since it guarantees the user is not authenticated at all
            SecurityContextHolder.clearContext();
            // send response
            res.resetBuffer();
            res.setStatus(ex.getHttpStatus().value());
            res.setHeader("Content-Type", "application/json");
            PrintWriter out = res.getWriter();
            JSONObject object = new JSONObject();
            object.appendField("message", ex.getMessage());
            out.write(object.toJSONString());
            return;
        } catch (Exception ex) {
            // send response
            res.resetBuffer();
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setHeader("Content-Type", "application/json");
            PrintWriter out = res.getWriter();
            JSONObject object = new JSONObject();
            object.appendField("message", ex.getMessage());
            out.write(object.toJSONString());
            return;
            //todo
        }
        filterChain.doFilter(req, res);
    }
}
