package com.example.demo.service;

import com.example.demo.model.Expense;
import com.example.demo.model.ExpenseParticipant;
import com.example.demo.model.User;
import com.example.demo.repository.ExpenseParticipantRepository;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseParticipantService {

    @Autowired
    private ExpenseParticipantRepository expenseParticipantRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    public ExpenseParticipant addParticipant(ExpenseParticipant participant) {
        Expense expense = expenseRepository.findById(participant.getExpense().getExpenseId())
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        User user = userRepository.findById(participant.getUser().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        participant.setExpense(expense);
        participant.setUser(user);

        return expenseParticipantRepository.save(participant);
    }

    public List<ExpenseParticipant> getParticipantsByExpense(Long expenseId) {
        return expenseParticipantRepository.findByExpense_ExpenseId(expenseId);
    }
}
