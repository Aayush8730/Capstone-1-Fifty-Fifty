package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_members")
public class GroupMember {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false, referencedColumnName = "groupId", foreignKey = @ForeignKey(name = "fk_group_member_group"))
    private Group group;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "userId", foreignKey = @ForeignKey(name = "fk_group_member_user"))
    private User user;

    @Column(nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    // Getters and Setters

    public GroupMember(Long id, Group group, User user, LocalDateTime joinedAt) {
        this.id = id;
        this.group = group;
        this.user = user;
        this.joinedAt = joinedAt;
    }

    public GroupMember() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
