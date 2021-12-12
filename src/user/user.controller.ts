import * as express from "express";
import * as mongoose from "mongoose";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "./user.dto";
import UserNotFoundException from "../exceptions/UserNotFoundException";
import IdNotValidException from "../exceptions/IdNotValidException";
import HttpException from "../exceptions/HttpException";
import userModel from "./user.model";
import postModel from "../post/post.model";
import User from "./user.interface";

export default class UserController implements Controller {
    public path = "/users";
    public router = express.Router();
    private user = userModel;
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/posts/:id`, authMiddleware, this.getAllPostsOfUserByID);
        this.router.get(`${this.path}/posts/`, authMiddleware, this.getAllPostsOfLoggedUser);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
        this.router.get(this.path, authMiddleware, this.getAllUsers);

        this.router.patch(`${this.path}/:id`, [authMiddleware, validationMiddleware(CreateUserDto, true)], this.modifyUser);

        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteUser);
    }

    private getAllUsers = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            this.user.find().then(users => {
                response.send(users);
            });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getUserById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.params.id;
            if (mongoose.Types.ObjectId.isValid(id)) {
                const user = await this.user.findById(id);
                if (user) {
                    response.send(user);
                } else {
                    next(new UserNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.params.id;
            if (mongoose.Types.ObjectId.isValid(id)) {
                const userData: User = request.body;
                const user = await this.user.findByIdAndUpdate(id, userData, { new: true });
                if (user) {
                    response.send(user);
                } else {
                    next(new UserNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.params.id;
            if (mongoose.Types.ObjectId.isValid(id)) {
                const successResponse = await this.user.findByIdAndDelete(id);
                if (successResponse) {
                    response.sendStatus(200);
                } else {
                    next(new UserNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getAllPostsOfLoggedUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.user._id.toString(); // Stored user's ID in Cookie
            const posts = await this.post.find({ author: id });
            response.send(posts);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getAllPostsOfUserByID = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.params.id;
            if (mongoose.Types.ObjectId.isValid(id)) {
                const posts = await this.post.find({ author: id });
                response.send(posts);
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
