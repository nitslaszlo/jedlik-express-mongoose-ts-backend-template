import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import HttpException from "../exceptions/HttpException";
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export default function validationMiddleware(type, skipMissingProperties = false) {
    return (req, res, next) => {
        validate(plainToInstance(type, req.body), { skipMissingProperties }).then((errors) => {
            if (errors.length > 0) {
                const message = errors.map((error) => Object.values(error.constraints)).join(", ");
                next(new HttpException(400, message));
            }
            else {
                next();
            }
        });
    };
}
// Links:
// class-transformer: https://www.jsdocs.io/package/class-transformer#plainToInstance
// class-validator: https://github.com/typestack/class-validator
//# sourceMappingURL=validation.middleware.js.map