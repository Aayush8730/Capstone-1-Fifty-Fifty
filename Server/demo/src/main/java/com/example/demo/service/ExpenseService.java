package com.example.demo.service;

import com.example.demo.model.Expense;
import com.example.demo.model.ExpenseParticipant;
import com.example.demo.model.Group;
import com.example.demo.model.User;
import com.example.demo.repository.ExpenseParticipantRepository;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.GroupRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public Expense createExpense(Expense expense) {
        // Fetch and validate the group
        Group group = groupRepository.findById(expense.getGroup().getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        // Fetch and validate the user
        User user = userRepository.findById(expense.getPaidBy().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Set valid group and user
        expense.setGroup(group);
        expense.setPaidBy(user);

        return expenseRepository.save(expense);
    }
    @Autowired
    private ExpenseParticipantRepository expenseParticipantRepository;

    public String requestSettlement(Long payerId, Long payeeId) {
        // Find pending expenses where the payee has expenses to be settled with the payer
        List<ExpenseParticipant> pendingExpenses = expenseParticipantRepository
                .findByUser_UserIdAndStatusAndExpense_PaidBy_UserId(payeeId, ExpenseParticipant.Status.PENDING, payerId);

        // If no pending expenses are found, return a message
        if (pendingExpenses.isEmpty()) {
            return "No pending expenses found for settlement.";
        }

        // Update each pending expense status to "APPROVE_SETTLE"
        for (ExpenseParticipant ep : pendingExpenses) {
            ep.setStatus(ExpenseParticipant.Status.APPROVE_SETTLE);
            expenseParticipantRepository.save(ep);
        }

        return "Settlement request sent.";
    }


    public String approveSettlement(Long payeeId, Long payerId) {
        // Find expenses where settlement was requested (APPROVE_SETTLE)
        List<ExpenseParticipant> toSettle = expenseParticipantRepository
                .findByUser_UserIdAndStatusAndExpense_PaidBy_UserId(payeeId, ExpenseParticipant.Status.APPROVE_SETTLE, payerId);

        // If no settlement requests are found, return a message
        if (toSettle.isEmpty()) {
            return "No settlement requests found.";
        }

        // Update the status of each participant to "SETTLED"
        for (ExpenseParticipant ep : toSettle) {
            ep.setStatus(ExpenseParticipant.Status.SETTLED);
            expenseParticipantRepository.save(ep);
        }

        return "Settlement approved.";
    }



    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByGroup(Long groupId) {
        return expenseRepository.findByGroup_GroupId(groupId);
    }

    public void deleteExpense(Long expenseId) {
        expenseRepository.deleteById(expenseId);
    }
}
