package com.example.demo.repository;

import com.example.demo.model.Group;
import com.example.demo.model.GroupMember;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    @Query("SELECT gm.group FROM GroupMember gm WHERE gm.user.userId = :userId")
    List<Group> findGroupsByUserId(@Param("userId") Long userId);

    boolean existsByUserAndGroup(User user, Group group);
    void deleteByUserAndGroup(User user, Group group);
}

