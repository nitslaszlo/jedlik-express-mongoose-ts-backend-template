import { Router } from "express";
import { Types } from "mongoose";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "./user.dto";
import UserNotFoundException from "../exceptions/UserNotFoundException";
import IdNotValidException from "../exceptions/IdNotValidException";
import HttpException from "../exceptions/HttpException";
import userModel from "./user.model";
import postModel from "../post/post.model";
export default class UserController {
    path = "/users";
    router = Router();
    user = userModel;
    post = postModel;
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes(): void {
        this.router.get(`${this.path}/posts/:id`, authMiddleware, this.getAllPostsOfUserByID);
        this.router.get(`${this.path}/posts/`, authMiddleware, this.getAllPostsOfLoggedUser);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
        this.router.get(this.path, authMiddleware, this.getAllUsers);
        this.router.patch(`${this.path}/:id`, [authMiddleware, validationMiddleware(CreateUserDto, true)], this.modifyUser);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteUser);
    }
    getAllUsers = async (req, res, next) => {
        try {
            this.user.find().then(users => {
                res.send(users);
            });
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
    getUserById = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                // const userQuery = this.user.findById(id);
                // if (request.query.withPosts === "true") {
                //     userQuery.populate("posts").exec();
                // }
                const user = await this.user.findById(id).populate("posts");
                if (user) {
                    res.send(user);
                }
                else {
                    next(new UserNotFoundException(id));
                }
            }
            else {
                next(new IdNotValidException(id));
            }
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
    modifyUser = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const userData = req.body;
                const user = await this.user.findByIdAndUpdate(id, userData, { new: true });
                if (user) {
                    res.send(user);
                }
                else {
                    next(new UserNotFoundException(id));
                }
            }
            else {
                next(new IdNotValidException(id));
            }
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
    deleteUser = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const successResponse = await this.user.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(200);
                }
                else {
                    next(new UserNotFoundException(id));
                }
            }
            else {
                next(new IdNotValidException(id));
            }
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
    getAllPostsOfLoggedUser = async (req, res, next) => {
        try {
            const id = req.user._id; // Stored user's ID in Cookie
            const posts = await this.post.find({ author: id });
            res.send(posts);
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
    getAllPostsOfUserByID = async (req, res, next) => {
        try {
            if (Types.ObjectId.isValid(req.params.id)) {
                const id = req.params.id;
                const posts = await this.post.find({ author: id });
                res.send(posts);
            }
            else {
                next(new IdNotValidException(req.params.id));
            }
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
//# sourceMappingURL=user.controller.js.map