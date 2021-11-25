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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
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
        http.httpBasic().disable();
        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.authorizeRequests()
                .antMatchers("/*").permitAll()
                .antMatchers("/built/**").permitAll()
                .antMatchers("/api/users/**").permitAll()
                .antMatchers("/api/points/check/*").hasAnyAuthority(
                        UserRole.ROLE_USER.getAuthority())
                .antMatchers("/api/points/get/*").hasAnyAuthority(
                        UserRole.ROLE_USER.getAuthority())
                .antMatchers("/api/points/clear/*").hasAnyAuthority(
                        UserRole.ROLE_USER.getAuthority())
                .anyRequest().authenticated();
        http.apply(new JwtFilterConfigurer(jwtProvider));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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