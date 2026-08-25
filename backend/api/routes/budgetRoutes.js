const express = require("express");

const budgetController = require("../apiControllers/budgetController");
const authMiddleware = require("../_middleware/authMiddleware");

const router = express.Router();


// Set or update trip budget
// PUT /api/budget/trips/:tripId
router.put(
    "/trips/:tripId",
    authMiddleware,
    budgetController.setTripBudget
);


// Get budget summary
// GET /api/budget/trips/:tripId
router.get(
    "/trips/:tripId",
    authMiddleware,
    budgetController.getBudgetSummary
);


// Add an expense to a trip
// POST /api/budget/trips/:tripId/expenses
router.post(
    "/trips/:tripId/expenses",
    authMiddleware,
    budgetController.createExpense
);


// Get all expenses of a trip
// GET /api/budget/trips/:tripId/expenses
router.get(
    "/trips/:tripId/expenses",
    authMiddleware,
    budgetController.getTripExpenses
);


// Get one expense
// GET /api/budget/expenses/:id
router.get(
    "/expenses/:id",
    authMiddleware,
    budgetController.getExpenseById
);


// Delete an expense
// DELETE /api/budget/expenses/:id
router.delete(
    "/expenses/:id",
    authMiddleware,
    budgetController.deleteExpense
);


module.exports = router;
