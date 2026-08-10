
class AppError extends Error {
    constructor(public message: string, public statusCode: number, public code: string = 'APP_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message: string,code='BAD_REQUEST') {
        super(message, 400, code);
    }
}

class UnauthorizedError extends AppError {
    constructor(message: string,code='UNAUTHORIZED') {
        super(message, 401, code);
    }
}

class ForbiddenError extends AppError {
    constructor(message: string,code='FORBIDDEN') {
        super(message, 403, code);
    }
}

class NotFoundError extends AppError {
    constructor(message: string,code='NOT_FOUND') {
        super(message, 404, code    );
    }
}

class InternalServerError extends AppError {
    constructor(message: string,code='INTERNAL_SERVER_ERROR') {
        super(message, 500, code);
    }
}

export { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, InternalServerError };