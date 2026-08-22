const { pool } = require("../_config/database");


// Check whether a trip belongs to the logged-in user
const verifyTripOwnership = async (tripId, userId) => {

    const [trips] = await pool.execute(
        `SELECT id
         FROM trips
         WHERE id = ? AND user_id = ?`,
        [tripId, userId]
    );

    if (trips.length === 0) {
        throw new Error("Trip not found or access denied");
    }

    return true;
};


// Create or update the total budget of a trip
const setTripBudget = async (tripId, userId, totalBudget) => {

    // Verify that the trip belongs to the logged-in user
    await verifyTripOwnership(tripId, userId);

    // Insert budget if it doesn't exist,
    // otherwise update the existing budget
    await pool.execute(
        `INSERT INTO trip_budgets (trip_id, total_budget)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE
         total_budget = VALUES(total_budget)`,
        [tripId, totalBudget]
    );

    return getBudgetSummary(tripId, userId);
};


// Add a new expense
const createExpense = async (
    tripId,
    userId,
    category,
    title,
    amount,
    expenseDate,
    notes
) => {

    // Verify trip ownership
    await verifyTripOwnership(tripId, userId);

    // Insert expense
    const [result] = await pool.execute(
        `INSERT INTO trip_expenses
        (
            trip_id,
            category,
            title,
            amount,
            expense_date,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            tripId,
            category || "other",
            title,
            amount,
            expenseDate || null,
            notes || null
        ]
    );

    return {
        id: result.insertId,
        trip_id: tripId,
        category: category || "other",
        title,
        amount,
        expense_date: expenseDate || null,
        notes: notes || null
    };
};


// Get all expenses of a trip
const getTripExpenses = async (tripId, userId) => {

    // Verify ownership before returning expenses
    await verifyTripOwnership(tripId, userId);

    const [expenses] = await pool.execute(
        `SELECT
            id,
            trip_id,
            category,
            title,
            amount,
            expense_date,
            notes,
            created_at,
            updated_at
         FROM trip_expenses
         WHERE trip_id = ?
         ORDER BY expense_date DESC, created_at DESC`,
        [tripId]
    );

    return expenses;
};


// Get one expense
const getExpenseById = async (expenseId, userId) => {

    const [expenses] = await pool.execute(
        `SELECT
            e.id,
            e.trip_id,
            e.category,
            e.title,
            e.amount,
            e.expense_date,
            e.notes,
            e.created_at,
            e.updated_at
         FROM trip_expenses AS e
         INNER JOIN trips AS t
             ON e.trip_id = t.id
         WHERE e.id = ?
         AND t.user_id = ?`,
        [expenseId, userId]
    );

    if (expenses.length === 0) {
        throw new Error("Expense not found");
    }

    return expenses[0];
};


// Delete an expense
const deleteExpense = async (expenseId, userId) => {

    const [result] = await pool.execute(
        `DELETE e
         FROM trip_expenses AS e
         INNER JOIN trips AS t
             ON e.trip_id = t.id
         WHERE e.id = ?
         AND t.user_id = ?`,
        [expenseId, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Expense not found");
    }

    return true;
};


// Get budget + total spent + remaining budget
const getBudgetSummary = async (tripId, userId) => {

    // Verify ownership
    await verifyTripOwnership(tripId, userId);

    // Get total budget
    const [budgetRows] = await pool.execute(
        `SELECT total_budget
         FROM trip_budgets
         WHERE trip_id = ?`,
        [tripId]
    );

    // Get total expenses
    const [expenseRows] = await pool.execute(
        `SELECT COALESCE(SUM(amount), 0) AS total_spent
         FROM trip_expenses
         WHERE trip_id = ?`,
        [tripId]
    );

    const totalBudget = budgetRows.length > 0
        ? Number(budgetRows[0].total_budget)
        : 0;

    const totalSpent = Number(expenseRows[0].total_spent);

    const remainingBudget = totalBudget - totalSpent;

    return {
        trip_id: tripId,
        total_budget: totalBudget,
        total_spent: totalSpent,
        remaining_budget: remainingBudget
    };
};


module.exports = {
    setTripBudget,
    createExpense,
    getTripExpenses,
    getExpenseById,
    deleteExpense,
    getBudgetSummary
};