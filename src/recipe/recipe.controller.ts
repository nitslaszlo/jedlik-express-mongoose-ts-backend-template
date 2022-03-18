import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import RecipeDto from "./recipe.dto";
import HttpException from "../exceptions/HttpException";
import IRecipe from "./recipe.interface";
import recipeModel from "./recipe.model";
import validationMiddleware from "../middleware/validation.middleware";

export default class RecipeController implements Controller {
    public path = "/recipes";
    public router = Router();
    private recipeM = recipeModel;

    constructor() {
        this.router.get(this.path, this.getAll);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.get(`${this.path}/:keyword/:orderby/:direction`, this.getDocuments);
        this.router.patch(`${this.path}/:id`, validationMiddleware(RecipeDto, true), this.modifyDocument);
        this.router.delete(`${this.path}/:id`, this.deleteDocument);
        this.router.post(this.path, validationMiddleware(RecipeDto), this.createDocument);
    }

    private getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const recipes = await this.recipeM.find().populate("author", "-password -_id");
            res.send(recipes);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getDocuments = async (req: Request, res: Response, next: NextFunction) => {
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
            next(new HttpException(400, error.message));
        }
    };

    private getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const document = await this.recipeM.findById(id);
            if (document) {
                res.send(document);
            } else {
                next(new HttpException(404, `Recipe with id ${id} not found!`));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const body: IRecipe = req.body;
            const updatedDoc = await this.recipeM.findByIdAndUpdate(id, body, { new: true });
            if (updatedDoc) {
                res.send(updatedDoc);
            } else {
                next(new HttpException(404, `Recipe with id ${id} not found!`));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private createDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: IRecipe = req.body;
            const createdDocument = new this.recipeM({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const successResponse = await this.recipeM.findByIdAndDelete(id);
            if (successResponse) {
                res.sendStatus(200);
            } else {
                next(new HttpException(404, `Recipe with id ${id} not found!`));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
