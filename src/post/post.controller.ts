import * as express from "express";
import * as mongoose from "mongoose";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import IdNotValidException from "../exceptions/IdNotValidException";
import HttpException from "../exceptions/HttpException";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import Post from "./post.interface";
import postModel from "./post.model";

export default class PostController implements Controller {
    public path = "/posts";
    public router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllPosts);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getPostById);
        this.router.patch(`${this.path}/:id`, [authMiddleware, validationMiddleware(CreatePostDto, true)], this.modifyPost);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);
        this.router.post(this.path, [authMiddleware, validationMiddleware(CreatePostDto)], this.createPost);
    }

    private getAllPosts = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            // const posts = await this.post.find().populate("author", "-password");
            const posts = await this.post.find();
            response.send(posts);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.params.id;
            if (mongoose.Types.ObjectId.isValid(id)) {
                const post = await this.post.findById(id).populate("author", "-password");
                if (post) {
                    response.send(post);
                } else {
                    next(new PostNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.params.id;
            if (mongoose.Types.ObjectId.isValid(id)) {
                const postData: Post = request.body;
                const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
                if (post) {
                    response.send(post);
                } else {
                    next(new PostNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {}
    };

    private createPost = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const postData: Post = request.body;
            const createdPost = new this.post({
                ...postData,
                author: request.user._id,
            });
            const savedPost = await createdPost.save();
            await savedPost.populate("author", "-password");
            response.send(savedPost);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const id = request.params.id;
            if (mongoose.Types.ObjectId.isValid(id)) {
                const successResponse = await this.post.findByIdAndDelete(id);
                if (successResponse) {
                    response.sendStatus(200);
                } else {
                    next(new PostNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
