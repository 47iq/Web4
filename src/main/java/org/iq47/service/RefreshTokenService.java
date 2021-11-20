package org.iq47.service;

import org.iq47.model.entity.RefreshToken;

import java.util.Optional;

public interface RefreshTokenService {
    Optional<String> createRefreshToken(Long userId);

    Optional<String> updateRefreshToken(Long userId);

    int deleteByUserId(Long userId);

    Optional<RefreshToken> findByRefreshTokenName(String refreshToken);
}
