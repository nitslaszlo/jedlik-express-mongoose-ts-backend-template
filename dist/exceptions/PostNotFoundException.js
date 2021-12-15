import HttpException from "./HttpException";
export default class PostNotFoundException extends HttpException {
    constructor(id) {
        super(404, `Post with id ${id} not found`);
    }
}
//# sourceMappingURL=PostNotFoundException.js.map