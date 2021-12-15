import * as jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import userModel from "../user/user.model";
export default async function authMiddleware(req, res, next) {
    const cookies = req.cookies;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret);
            const id = verificationResponse._id;
            const user = await userModel.findById(id);
            if (user) {
                req.user = user;
                next();
            }
            else {
                next(new WrongAuthenticationTokenException());
            }
        }
        catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    }
    else {
        next(new AuthenticationTokenMissingException());
    }
}
//# sourceMappingURL=auth.middleware.js.map