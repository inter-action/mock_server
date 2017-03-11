

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

export class AppError extends Error {
    constructor(msg: string, public status = 500, public others: object = {}, public name: string = "AppError") {
        super(msg);
        Error.captureStackTrace(this)
    }
}

export class ValidationError extends AppError {
    constructor(msg: string, status = 401, others: object = {}) {
        super(msg, status, others, "ValidationError");
    }
}
