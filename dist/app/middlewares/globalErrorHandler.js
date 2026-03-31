"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("../../generated/prisma/client");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const env_1 = require("../../config/env");
const sanitizeError = (error) => {
    if (env_1.envVars.NODE_ENV === "production" && error.code?.startsWith("P")) {
        return {
            message: "Database operation failed",
            errorDetails: null,
        };
    }
    return error;
};
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || http_status_1.default.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = "Validation Error";
        error = err;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = http_status_1.default.CONFLICT;
            message = "Duplicate Key error";
            error = err.meta;
        }
        if (err.code === "P2025") {
            statusCode = http_status_1.default.NOT_FOUND;
            message = "Requested resource not found";
            error = err;
        }
        if (err.code === "P1001") {
            statusCode = http_status_1.default.NOT_FOUND;
            message = "Something went wrong";
            error = err;
        }
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        error = err;
    }
    const sanitizedError = sanitizeError(error);
    res.status(statusCode).json({
        success,
        message,
        error: sanitizedError,
    });
};
exports.default = globalErrorHandler;
