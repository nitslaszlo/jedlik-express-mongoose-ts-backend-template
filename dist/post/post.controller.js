import { Router } from "express";
import { Types } from "mongoose";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import IdNotValidException from "../exceptions/IdNotValidException";
import HttpException from "../exceptions/HttpException";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import postModel from "./post.model";
export default class PostController {
    path = "/posts";
    router = Router();
    post = postModel;
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllPosts);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getPostById);
        this.router.patch(`${this.path}/:id`, [authMiddleware, validationMiddleware(CreatePostDto, true)], this.modifyPost);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePost);
        this.router.post(this.path, [authMiddleware, validationMiddleware(CreatePostDto)], this.createPost);
    }
    getAllPosts = async (req, res, next) => {
        try {
            // const posts = await this.post.find().populate("author", "-password");
            const posts = await this.post.find();
            res.send(posts);
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
    getPostById = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const post = await this.post.findById(id).populate("author", "-password");
                if (post) {
                    res.send(post);
                }
                else {
                    next(new PostNotFoundException(id));
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
    modifyPost = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const postData = req.body;
                const post = await this.post.findByIdAndUpdate(id, postData, { new: true });
                if (post) {
                    res.send(post);
                }
                else {
                    next(new PostNotFoundException(id));
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
    createPost = async (req, res, next) => {
        try {
            const postData = req.body;
            const createdPost = new this.post({
                ...postData,
                author: req.user._id,
            });
            const savedPost = await createdPost.save();
            await savedPost.populate("author", "-password");
            res.send(savedPost);
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
    deletePost = async (req, res, next) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const successResponse = await this.post.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(200);
                }
                else {
                    next(new PostNotFoundException(id));
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
}
//# sourceMappingURL=post.controller.js.map