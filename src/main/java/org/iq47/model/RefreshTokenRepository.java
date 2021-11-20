package org.iq47.model;

import org.iq47.model.entity.User;
import org.iq47.model.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    @Transactional
    int deleteByUserEntity(User userEntity);

    RefreshToken findByRefreshToken(String refreshToken);
}
