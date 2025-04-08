package com.example.demo.service;

import com.example.demo.model.Group;
import com.example.demo.model.GroupMember;
import com.example.demo.model.User;
import com.example.demo.repository.GroupMemberRepository;
import com.example.demo.repository.GroupRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public GroupMemberService(GroupMemberRepository groupMemberRepository, GroupRepository groupRepository, UserRepository userRepository) {
        this.groupMemberRepository = groupMemberRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    public GroupMember addMemberToGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group with ID " + groupId + " not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found"));

        GroupMember groupMember = new GroupMember();
        groupMember.setGroup(group);
        groupMember.setUser(user);

        return groupMemberRepository.save(groupMember);
    }

    public List<GroupMember> getAllMembersByGroup(Long groupId) {
        return groupMemberRepository.findAll()
                .stream()
                .filter(member -> member.getGroup().getGroupId().equals(groupId))
                .toList();
    }

    public void removeMemberFromGroup(Long id) {
        groupMemberRepository.deleteById(id);
    }
}
