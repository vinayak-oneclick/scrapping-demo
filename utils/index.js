const successResponse = (req, res, data, status, success) =>
    res.send({
        status,
        data,
        success,
    });

const errorResponse = (
        req,
        res,
        errorMessage = "Something went wrong",
        code = 500,
        error = {}
    ) =>
    res.status(code).json({
        code,
        errorMessage,
        error,
        data: null,
        success: false,
    });

module.exports = { successResponse, errorResponse };