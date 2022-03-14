import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import recipeModel from "./recipe.model";
import userModel from "../user/user.model";

export default class RecipeController implements Controller {
    public path = "/recipes";
    public router = Router();
    private recipeM = recipeModel;
    private userM = userModel;

    constructor() {
        this.router.get(this.path, this.getAll);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.get(`${this.path}/:keyword/:orderby/:direction`, this.getDocuments);
        this.router.patch(`${this.path}/:id`, this.modifyDocument);
        this.router.delete(`${this.path}/:id`, this.deleteDocument);
        this.router.post(this.path, this.createDocument);
    }

    private getAll = async (req: Request, res: Response) => {
        try {
            const recipes = await this.recipeM.find().populate("author", "-password -_id");
            res.send(recipes);
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private getDocuments = async (req: Request, res: Response) => {
        try {
            const keyword = req.params.keyword;
            const orderby = req.params.orderby;
            const direction = req.params.direction == "ASC" ? "" : "-"; // ASC or DESC
            let recipes = [];
            const regex = new RegExp(keyword, "i");
            recipes = await this.recipeM
                .find({ $or: [{ recipeName: { $regex: regex } }, { description: { $regex: regex } }] })
                .sort(`${direction}${orderby}`)
                .populate("author", "-password -_id");
            res.send(recipes);
            // Ha mindkét táblából egyszerre kell OR feltétellel szűrni
            // ========================================================
            // recipes = await this.recipeM
            //     .aggregate([
            //         {
            //             $lookup: {
            //                 from: "users",
            //                 localField: "author",
            //                 foreignField: "_id",
            //                 as: "user",
            //             },
            //         },
            //         { $unwind: "$user" },
            //         {
            //             $match: {
            //                 $or: [{ recipeName: { $regex: regex } }, { description: { $regex: regex } }, { "user.name": { $regex: regex } }],
            //             },
            //         },
            //         { $project: { _id: 0, description: 0, "user._id": 0, "user.password": 0 } },
            //     ])
            //     .sort(`${direction}${orderby}`);
            // res.send(recipes);
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const document = await this.recipeM.findById(id).populate("author", "-password -_id");
            if (document) {
                res.send(document);
            } else {
                res.status(404);
                res.send(`Recipe with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private modifyDocument = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const body = req.body;
            const updatedDoc = await this.recipeM.findByIdAndUpdate(id, body, { new: true });
            if (updatedDoc) {
                res.send(updatedDoc);
            } else {
                res.status(404);
                res.send(`Recipe with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private createDocument = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const user = await this.userM.findById(body.author);
            if (user) {
                const createdDocument = new this.recipeM({
                    ...body,
                });
                const savedDocument = await createdDocument.save();
                res.send(savedDocument);
            } else {
                res.status(404);
                res.send(`Athor with id ${body.author} not found in User collection!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private deleteDocument = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const successResponse = await this.recipeM.findByIdAndDelete(id);
            if (successResponse) {
                res.sendStatus(200);
            } else {
                res.status(404);
                res.send(`Recipe with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };
}
