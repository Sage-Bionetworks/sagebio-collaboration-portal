// import ApiError from '../api/api-error';

export default class AuthError extends Error {
    constructor(message) {
        super(message);
        // this.name = this.constructor.name;
        Error.captureStackTrace(this, AuthError);
        // no need for this.stack = (new Error()).stack; thanks to super?
    }
}
