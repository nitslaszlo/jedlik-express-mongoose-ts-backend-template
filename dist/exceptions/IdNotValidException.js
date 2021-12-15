import HttpException from "./HttpException";
export default class IdNotValidException extends HttpException {
    constructor(id) {
        super(404, `This ${id} id is not valid.`);
    }
}
//# sourceMappingURL=IdNotValidException.js.map