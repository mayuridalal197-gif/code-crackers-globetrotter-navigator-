const errorMiddleware = (err, req, res, next) => {

    console.error("=================================");
    console.error("SERVER ERROR:");
    console.error(err);
    console.error("=================================");


    return res.status(500).json({

        success: false,

        message:
            err.message || "Internal server error.",

        error:
            process.env.NODE_ENV === "development"
                ? err.stack
                : undefined

    });

};


module.exports = errorMiddleware;
