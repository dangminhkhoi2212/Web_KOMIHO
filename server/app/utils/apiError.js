class ApiError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'ApiError';
        this.message = message;
        this.status = code;
    }
}

export default ApiError;
