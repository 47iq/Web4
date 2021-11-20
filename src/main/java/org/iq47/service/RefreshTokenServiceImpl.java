package org.iq47.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.iq47.model.RefreshTokenRepository;
import org.iq47.model.UserRepository;
import org.iq47.model.entity.User;
import org.iq47.model.entity.RefreshToken;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final UserRepository userRepo;
    private final RefreshTokenRepository refreshTokenRepo;

    @Override
    public Optional<String> createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();
        Optional<User> userOptional = userRepo.findById(userId);

        if (userOptional.isPresent()) {
            refreshToken.setUserEntity(userOptional.get());
        } else {
            return Optional.empty();
        }

        refreshToken.setRefreshToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepo.save(refreshToken);
        return Optional.of(refreshToken.getRefreshToken());
    }

    @Override
    public int deleteByUserId(Long userId) {
        Optional<User> userOptional = userRepo.findById(userId);
        // how many records were deleted
        return userOptional.map(refreshTokenRepo::deleteByUserEntity).orElse(0);
    }

    @Override
    public Optional<String> updateRefreshToken(Long userId) {
        this.deleteByUserId(userId);
        return this.createRefreshToken(userId);
    }

    @Override
    public Optional<RefreshToken> findByRefreshTokenName(String refreshToken) {
        RefreshToken tokenEntity = refreshTokenRepo.findByRefreshToken(refreshToken);
        return tokenEntity == null ? Optional.empty() : Optional.of(tokenEntity);
    }
}
