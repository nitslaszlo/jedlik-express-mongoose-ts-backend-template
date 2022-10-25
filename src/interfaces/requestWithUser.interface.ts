import { Request } from "express";
import IUser from "../user/user.interface";

export default interface RequestWithUser extends Request {
    user: IUser;
}
