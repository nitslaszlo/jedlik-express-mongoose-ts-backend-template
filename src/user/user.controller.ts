import * as express from "express";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import postModel from "../post/post.model";
import loggerMiddleware from "../middleware/logger.middleware";

export default class UserController implements Controller {
    public path = "/users";
    public router = express.Router();
    private post = postModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id/posts`, [authMiddleware, loggerMiddleware], this.getAllPostsOfUser);
    }

    private getAllPostsOfUser = async (request: RequestWithUser, response: express.Response) => {
        const userId = request.params.id;
        if (userId === request.user._id.toString()) {
            const posts = await this.post.find({ author: userId });
            response.send(posts);
        }
    };
}
