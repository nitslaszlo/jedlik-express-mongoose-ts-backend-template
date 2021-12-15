import HttpException from "./HttpException";
export default class UserWithThatEmailAlreadyExistsException extends HttpException {
    constructor(email) {
        super(400, `User with email ${email} already exists`);
    }
}
//# sourceMappingURL=UserWithThatEmailAlreadyExistsException.js.map