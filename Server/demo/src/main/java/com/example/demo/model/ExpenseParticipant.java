package com.example.demo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "expense_participants")
public class ExpenseParticipant {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal shareAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, APPROVE_SETTLE, SETTLED
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Expense getExpense() {
        return expense;
    }

    public void setExpense(Expense expense) {
        this.expense = expense;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getShareAmount() {
        return shareAmount;
    }

    public void setShareAmount(BigDecimal shareAmount) {
        this.shareAmount = shareAmount;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
