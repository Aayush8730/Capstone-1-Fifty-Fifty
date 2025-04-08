package com.example.demo.controller;

import com.example.demo.model.Group;
import com.example.demo.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        Group savedGroup = groupService.createGroup(group);
        return ResponseEntity.status(201).body(savedGroup);
    }

    @GetMapping
    public ResponseEntity<List<Group>> getAllGroups() {
        List<Group> groups = groupService.getAllGroups();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        Group group = groupService.getGroupById(id);
        return ResponseEntity.ok(group);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> addMemberToGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        Group updatedGroup = groupService.addMemberToGroup(groupId, userId);
        return ResponseEntity.ok(updatedGroup);
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> removeMemberFromGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        Group updatedGroup = groupService.removeMemberFromGroup(groupId, userId);
        return ResponseEntity.ok(updatedGroup);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getGroupsByUser(@PathVariable Long userId) {
        List<Group> groups = groupService.getGroupsByUser(userId);
        return ResponseEntity.ok(groups);
    }
}
