package org.example.gamerscove.repositories;

import org.example.gamerscove.domain.entities.ReviewEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends CrudRepository<ReviewEntity, Long> {

    List<ReviewEntity> findByUser_Id(Long userId);
    List<ReviewEntity> findByGame_Id(Long gameId);
}