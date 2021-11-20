package org.iq47.security;

import lombok.RequiredArgsConstructor;
import org.iq47.security.filter.JwtFilterConfigurer;
import org.iq47.security.userDetails.CustomUserDetailsService;
import org.iq47.security.userDetails.UserRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtTokenService jwtProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // enable CORS support
        http.cors().configurationSource(request -> new CorsConfiguration().applyPermitDefaultValues());
        // httpBasic - let you enable/disable http basic authentication
        http.httpBasic().disable();
        // disable cross site request forgery
        http.csrf().disable();
        // stateless sessions
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeRequests()

                // points
                .antMatchers("/api/points/check/*").hasAnyAuthority(
                        UserRole.ROLE_USER.getAuthority())
                .antMatchers("/api/points/get/*").hasAnyAuthority(
                        UserRole.ROLE_USER.getAuthority())
                .antMatchers("/api/points/clear/*").hasAnyAuthority(
                        UserRole.ROLE_USER.getAuthority())
                // disable everything else
                .anyRequest().permitAll();

        // If a user try to access a resource without having enough permissions
//        http.exceptionHandling().accessDeniedPage("/login");

        http.apply(new JwtFilterConfigurer(jwtProvider));
    }

    // remove encoding of password, cuz they are encoded on client-base server
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence charSequence) {
                return charSequence.toString();
            }

            @Override
            public boolean matches(CharSequence charSequence, String s) {
                return charSequence.toString().equals(s);
            }
        };
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder());
    }
}