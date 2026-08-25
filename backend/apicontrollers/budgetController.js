const budgetServices = require("../_services/budgetServices");


// Validate budget amount
const validateBudget = (totalBudget) => {
    const errors = [];

    if (
        totalBudget === undefined ||
        totalBudget === null ||
        totalBudget === ""
    ) {
        errors.push("Total budget is required");
    } else if (
        Number.isNaN(Number(totalBudget)) ||
        Number(totalBudget) <= 0
    ) {
        errors.push("Total budget must be greater than 0");
    }

    return errors;
};


// Validate expense data
const validateExpense = (category, title, amount) => {
    const errors = [];

    const allowedCategories = [
        "transport",
        "accommodation",
        "food",
        "activities",
        "shopping",
        "other"
    ];

    if (!allowedCategories.includes(category)) {
        errors.push("Invalid expense category");
    }

    if (!title || title.trim().length === 0) {
        errors.push("Expense title is required");
    }

    if (
        amount === undefined ||
        amount === null ||
        amount === "" ||
        Number.isNaN(Number(amount)) ||
        Number(amount) <= 0
    ) {
        errors.push("Expense amount must be greater than 0");
    }

    return errors;
};


// Set or update trip budget
const setTripBudget = async (req, res) => {
    try {
        const tripId = Number(req.params.tripId);
        const { totalBudget } = req.body;

        // Validate trip ID
        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        // Validate budget
        const errors = validateBudget(totalBudget);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Get authenticated user's ID from JWT
        const userId = req.user.id;

        // Create/update budget
        const summary = await budgetServices.setTripBudget(
            tripId,
            userId,
            Number(totalBudget)
        );

        return res.status(200).json({
            success: true,
            message: "Trip budget saved successfully",
            data: {
                budget: summary
            }
        });

    } catch (error) {

        if (error.message === "Trip not found or access denied") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Set budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Add an expense
const createExpense = async (req, res) => {
    try {
        const tripId = Number(req.params.tripId);

        const {
            category,
            title,
            amount,
            expenseDate,
            notes
        } = req.body;

        // Validate trip ID
        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        // Validate expense data
        const errors = validateExpense(
            category,
            title,
            amount
        );

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Get authenticated user ID
        const userId = req.user.id;

        // Create expense
        const expense = await budgetServices.createExpense(
            tripId,
            userId,
            category,
            title.trim(),
            Number(amount),
            expenseDate || null,
            notes ? notes.trim() : null
        );

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            data: {
                expense
            }
        });

    } catch (error) {

        if (error.message === "Trip not found or access denied") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Create expense error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get all expenses of a trip
const getTripExpenses = async (req, res) => {
    try {
        const tripId = Number(req.params.tripId);

        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        const userId = req.user.id;

        const expenses = await budgetServices.getTripExpenses(
            tripId,
            userId
        );

        return res.status(200).json({
            success: true,
            data: {
                expenses
            }
        });

    } catch (error) {

        if (error.message === "Trip not found or access denied") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Get expenses error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get one expense
const getExpenseById = async (req, res) => {
    try {
        const expenseId = Number(req.params.id);

        if (!Number.isInteger(expenseId) || expenseId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID"
            });
        }

        const userId = req.user.id;

        const expense = await budgetServices.getExpenseById(
            expenseId,
            userId
        );

        return res.status(200).json({
            success: true,
            data: {
                expense
            }
        });

    } catch (error) {

        if (error.message === "Expense not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Get expense error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const expenseId = Number(req.params.id);

        if (!Number.isInteger(expenseId) || expenseId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID"
            });
        }

        const userId = req.user.id;

        await budgetServices.deleteExpense(
            expenseId,
            userId
        );

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {

        if (error.message === "Expense not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Delete expense error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get budget summary
const getBudgetSummary = async (req, res) => {
    try {
        const tripId = Number(req.params.tripId);

        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        const userId = req.user.id;

        const summary = await budgetServices.getBudgetSummary(
            tripId,
            userId
        );

        return res.status(200).json({
            success: true,
            data: {
                budget: summary
            }
        });

    } catch (error) {

        if (error.message === "Trip not found or access denied") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Get budget summary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    setTripBudget,
    createExpense,
    getTripExpenses,
    getExpenseById,
    deleteExpense,
    getBudgetSummary
};
