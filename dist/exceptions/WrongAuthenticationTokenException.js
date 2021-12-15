import HttpException from "./HttpException";
export default class WrongAuthenticationTokenException extends HttpException {
    constructor() {
        super(401, "Wrong authentication token");
    }
}
//# sourceMappingURL=WrongAuthenticationTokenException.js.map