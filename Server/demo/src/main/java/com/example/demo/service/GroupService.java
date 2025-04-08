package com.example.demo.service;

import com.example.demo.model.Group;
import com.example.demo.model.GroupMember;
import com.example.demo.model.User;
import com.example.demo.repository.GroupMemberRepository;
import com.example.demo.repository.GroupRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;

    public GroupService(GroupRepository groupRepository, UserRepository userRepository, GroupMemberRepository groupMemberRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Transactional
    public Group createGroup(Group group) {
        // Validate user existence for createdBy
        Long userId = group.getCreatedBy().getUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));
        group.setCreatedBy(user);

        // Save the group
        return groupRepository.save(group);
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group getGroupById(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Group with ID " + id + " not found"));
    }

    @Transactional
    public void deleteGroup(Long groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new RuntimeException("Group with ID " + groupId + " not found");
        }
        groupRepository.deleteById(groupId);
    }

    @Transactional
    public Group addMemberToGroup(Long groupId, Long userId) {
        Group group = getGroupById(groupId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        // Check if user is already a member
        if (groupMemberRepository.existsByUserAndGroup(user, group)) {
            throw new RuntimeException("User is already a member of this group");
        }

        GroupMember groupMember = new GroupMember();
        groupMember.setGroup(group);
        groupMember.setUser(user);
        groupMemberRepository.save(groupMember);
        return group;
    }

    @Transactional
    public Group removeMemberFromGroup(Long groupId, Long userId) {
        Group group = getGroupById(groupId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        groupMemberRepository.deleteByUserAndGroup(user, group);
        return group;
    }

    public List<Group> getGroupsByUser(Long userId) {
        return groupMemberRepository.findGroupsByUserId(userId);
    }
}
