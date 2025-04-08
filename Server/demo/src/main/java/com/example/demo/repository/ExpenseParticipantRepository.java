package com.example.demo.repository;

import com.example.demo.model.ExpenseParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseParticipantRepository extends JpaRepository<ExpenseParticipant, Long> {
    List<ExpenseParticipant> findByExpense_ExpenseId(Long expenseId);

    List<ExpenseParticipant> findByUser_UserIdAndStatusAndExpense_PaidBy_UserId(Long userId, ExpenseParticipant.Status status, Long paidById);

    List<ExpenseParticipant> findByExpense_PaidBy_UserIdAndStatus(Long payeeId, ExpenseParticipant.Status status);
}
