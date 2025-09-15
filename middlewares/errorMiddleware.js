export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};

export function asyncTryCatchErrorHandler(passedFunction) {
// Here’s what happens:
// asyncTryCatchErrorHandler(getUserProfile) returns a new function.
// Express registers this returned function as the route handler.
// When a request matches the route, Express calls the returned function once, passing req, res, and next.
// Inside, your original getUserProfile function is called (once) with those arguments.

// if i want to throw a custom error from inside passedFunction then just do
// return next(new ErrorHandler())...

// *Another way to writing this function*
// export const asyncTryCatchErrorHandler
//     = (passedFunction) => (req, res, next) => {
//         Promise.resolve(passedFunction(req, res, next)).catch(next);
//     }
    return function (req, res, next) {
        Promise.resolve(passedFunction(req, res, next)).catch(next);
    }
}
