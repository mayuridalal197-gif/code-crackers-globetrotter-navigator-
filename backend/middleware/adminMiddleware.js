// Middleware to allow access only to admin users
const adminMiddleware = (req, res, next) => {

    // authMiddleware must run before this middleware
    // because req.user is created by authMiddleware
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    // Check user's role
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }

    // User is authenticated and is an admin
    next();
};

module.exports = adminMiddleware;