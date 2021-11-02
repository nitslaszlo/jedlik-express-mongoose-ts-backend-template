import * as express from "express";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import loggerMiddleware from "../middleware/logger.middleware";
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
        this.router.get(this.path, [authMiddleware, loggerMiddleware], this.getAllPosts);
        this.router.get(`${this.path}/:id`, [authMiddleware, loggerMiddleware], this.getPostById);
        // eslint-disable-next-line prettier/prettier
        // this.router.all(`${this.path}/*`, [authMiddleware, loggerMiddleware])
        this.router.patch(`${this.path}/:id`, [authMiddleware, loggerMiddleware, validationMiddleware(CreatePostDto, true)], this.modifyPost);
        this.router.delete(`${this.path}/:id`, [authMiddleware, loggerMiddleware], this.deletePost);
        this.router.post(this.path, [authMiddleware, loggerMiddleware, validationMiddleware(CreatePostDto)], this.createPost);
    }

    private getAllPosts = async (request: express.Request, response: express.Response) => {
        const posts = await this.post.find().populate("author", "-password");
        response.send(posts);
    };

    private getPostById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const post = await this.post.findById(id);
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    };

    private modifyPost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const postData: Post = request.body;
        const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
        if (post) {
            response.send(post);
        } else {
            next(new PostNotFoundException(id));
        }
    };

    private createPost = async (request: RequestWithUser, response: express.Response) => {
        const postData: CreatePostDto = request.body;
        const createdPost = new this.post({
            ...postData,
            author: request.user._id,
        });
        const savedPost = await createdPost.save();
        await await savedPost.populate("author", "-password");
        response.send(savedPost);
    };

    private deletePost = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        const successResponse = await this.post.findByIdAndDelete(id);
        if (successResponse) {
            response.sendStatus(200);
        } else {
            next(new PostNotFoundException(id));
        }
    };
}
