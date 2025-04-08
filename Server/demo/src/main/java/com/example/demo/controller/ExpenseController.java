package com.example.demo.controller;

import com.example.demo.model.Expense;
import com.example.demo.model.ExpenseParticipant;
import com.example.demo.repository.ExpenseParticipantRepository;
import com.example.demo.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @Autowired
    ExpenseParticipantRepository expenseParticipantRepository;

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense savedExpense = expenseService.createExpense(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Expense>> getExpensesByGroup(@PathVariable Long groupId) {
        List<Expense> expenses = expenseService.getExpensesByGroup(groupId);
        return ResponseEntity.ok(expenses);
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/settle-request/{payerId}")
    public ResponseEntity<String> requestSettlement(@PathVariable Long payerId, @RequestParam Long payeeId) {
        List<ExpenseParticipant> pendingExpenses = expenseParticipantRepository
                .findByUser_UserIdAndStatusAndExpense_PaidBy_UserId(payeeId, ExpenseParticipant.Status.PENDING, payerId);

        if (pendingExpenses.isEmpty()) {
            return ResponseEntity.badRequest().body("No pending expenses found for settlement.");
        }

        for (ExpenseParticipant ep : pendingExpenses) {
            ep.setStatus(ExpenseParticipant.Status.APPROVE_SETTLE);
            expenseParticipantRepository.save(ep);
        }

        return ResponseEntity.ok("Settlement request sent.");
    }

    @PutMapping("/approve-settlement/{payeeId}")
    public ResponseEntity<String> approveSettlement(@PathVariable Long payeeId, @RequestParam Long payerId) {
        List<ExpenseParticipant> toSettle = expenseParticipantRepository
                .findByUser_UserIdAndStatusAndExpense_PaidBy_UserId(payeeId, ExpenseParticipant.Status.APPROVE_SETTLE, payerId);

        if (toSettle.isEmpty()) {
            return ResponseEntity.badRequest().body("No settlement requests found.");
        }

        for (ExpenseParticipant ep : toSettle) {
            ep.setStatus(ExpenseParticipant.Status.SETTLED);
            expenseParticipantRepository.save(ep);
        }

        return ResponseEntity.ok("Settlement approved.");
    }
    @GetMapping("/approve-requests/{payeeId}")
    public ResponseEntity<List<ExpenseParticipant>> getApproveSettlementRequests(@PathVariable Long payeeId) {
        List<ExpenseParticipant> settlementRequests = expenseParticipantRepository
                .findByExpense_PaidBy_UserIdAndStatus(payeeId, ExpenseParticipant.Status.APPROVE_SETTLE);

        if (settlementRequests.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(settlementRequests);
    }
}
