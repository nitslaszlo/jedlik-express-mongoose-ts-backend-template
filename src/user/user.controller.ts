import { Router, Request, Response, NextFunction } from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import UserDto from "./user.dto";
import HttpException from "../exceptions/HttpException";
import userModel from "./user.model";
import User from "./user.interface";

export default class UserController implements Controller {
    public path = "/users";
    public router = Router();
    private user = userModel;

    constructor() {
        this.router.get(`${this.path}/:id`, this.getUserById);
        this.router.get(this.path, this.getAllUsers);
        this.router.patch(`${this.path}/:id`, validationMiddleware(UserDto, true), this.modifyUser);
        this.router.delete(`${this.path}/:id`, this.deleteUser);
        this.router.post(this.path, validationMiddleware(UserDto), this.createUser);
    }

    private createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            if (await this.user.findOne({ email: userData.email })) {
                next(new HttpException(400, `User with email ${userData.email} already exists`));
            } else {
                const user = await this.user.create({
                    ...userData,
                });
                res.send(user);
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.user.find().then(users => {
                res.send(users);
            });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const user = await this.user.findById(id).populate("posts");
            if (user) {
                res.send(user);
            } else {
                next(new HttpException(404, `User with id ${id} not found!`));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const userData: User = req.body;
            const user = await this.user.findByIdAndUpdate(id, userData, { new: true });
            if (user) {
                res.send(user);
            } else {
                next(new HttpException(404, `User with id ${id} not found!`));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const successResponse = await this.user.findByIdAndDelete(id);
            if (successResponse) {
                res.sendStatus(200);
            } else {
                next(new HttpException(404, `User with id ${id} not found!`));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
