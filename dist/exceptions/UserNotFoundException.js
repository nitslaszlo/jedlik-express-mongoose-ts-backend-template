import HttpException from "./HttpException";
export default class UserNotFoundException extends HttpException {
    constructor(id) {
        super(404, `User with id ${id} not found`);
    }
}
//# sourceMappingURL=UserNotFoundException.js.map