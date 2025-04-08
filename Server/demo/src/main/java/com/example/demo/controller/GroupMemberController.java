package com.example.demo.controller;

import com.example.demo.model.GroupMember;
import com.example.demo.service.GroupMemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/group-members")
public class GroupMemberController {

    private final GroupMemberService groupMemberService;

    public GroupMemberController(GroupMemberService groupMemberService) {
        this.groupMemberService = groupMemberService;
    }

    @PostMapping("/{groupId}/{userId}")
    public ResponseEntity<GroupMember> addMemberToGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        GroupMember groupMember = groupMemberService.addMemberToGroup(groupId, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(groupMember);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<List<GroupMember>> getAllMembersByGroup(@PathVariable Long groupId) {
        List<GroupMember> members = groupMemberService.getAllMembersByGroup(groupId);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeMemberFromGroup(@PathVariable Long id) {
        groupMemberService.removeMemberFromGroup(id);
        return ResponseEntity.noContent().build();
    }
}
