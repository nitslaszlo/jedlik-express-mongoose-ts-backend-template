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
        this.router.get(this.path, this.getAllRecipes);
        this.router.get(`${this.path}/:id`, this.getRecipeById);
        this.router.get(`${this.path}/:keyword/:orderby/:direction`, this.getRecipes);
        this.router.patch(`${this.path}/:id`, validationMiddleware(RecipeDto, true), this.modifyRecipe);
        this.router.delete(`${this.path}/:id`, this.deleteRecipes);
        this.router.post(this.path, validationMiddleware(RecipeDto), this.createRecipe);
    }

    private getAllRecipes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const recipes = await this.recipeM.find();
            res.send(recipes);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getRecipes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const keyword = req.params.keyword;
            // const orderby = req.params.orderby;
            // const direction = req.params.direction == "ASC" ? "" : "-"; // ASC or DESC
            let recipes = [];
            const regex = new RegExp(keyword, "i");
            // recipes = await this.recipeM
            //     .find({ $or: [{ recipeName: { $regex: regex } }, { description: { $regex: regex } }] })
            //     .sort(`${direction}${orderby}`)
            //     .populate("author", "-password -_id"); // 1pont 1pont
            // res.send(recipes);
            recipes = await this.recipeM.aggregate([
                {
                    $lookup: {
                        from: "User", // other table name
                        localField: "author", // name of users table field
                        foreignField: "_id", // name of userinfo table field
                        as: "user_info", // alias for userinfo table
                    },
                },
                { $unwind: "$user_info" },
                {
                    $match: {
                        $or: [{ "$user_info.recipeName": regex }],
                    },
                },
            ]);
            res.send(recipes);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const recipe = await this.recipeM.findById(id);
            if (recipe) {
                res.send(recipe);
            } else {
                next(new HttpException(404, `Recipe with id ${id} not found!`));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyRecipe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const recipeData: IRecipe = req.body;
            const recipe = await this.recipeM.findByIdAndUpdate(id, recipeData, { new: true });
            if (recipe) {
                res.send(recipe);
            } else {
                next(new HttpException(404, `Recipe with id ${id} not found!`));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private createRecipe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const recipeData: IRecipe = req.body;
            const createdRecipe = new this.recipeM({
                ...recipeData,
            });
            const savedRecipe = await createdRecipe.save();
            res.send(savedRecipe);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteRecipes = async (req: Request, res: Response, next: NextFunction) => {
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
