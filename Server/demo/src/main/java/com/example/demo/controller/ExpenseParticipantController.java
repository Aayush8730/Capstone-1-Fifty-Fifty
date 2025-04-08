package com.example.demo.controller;

import com.example.demo.model.ExpenseParticipant;
import com.example.demo.service.ExpenseParticipantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense-participants")
public class ExpenseParticipantController {

    private final ExpenseParticipantService participantService;

    public ExpenseParticipantController(ExpenseParticipantService participantService) {
        this.participantService = participantService;
    }

    @PostMapping
    public ResponseEntity<ExpenseParticipant> addParticipant(@RequestBody ExpenseParticipant participant) {
        ExpenseParticipant savedParticipant = participantService.addParticipant(participant);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedParticipant);
    }

    @GetMapping("/expense/{expenseId}")
    public ResponseEntity<List<ExpenseParticipant>> getParticipantsByExpense(@PathVariable Long expenseId) {
        List<ExpenseParticipant> participants = participantService.getParticipantsByExpense(expenseId);
        return ResponseEntity.ok(participants);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateParticipantStatus(@PathVariable Long id, @RequestParam String status) {
        participantService.updateParticipantStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id) {
        participantService.deleteParticipant(id);
        return ResponseEntity.noContent().build();
    }
}
