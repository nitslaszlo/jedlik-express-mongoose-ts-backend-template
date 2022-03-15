import { Request, Response, Router } from "express";
import Controller from "../interfaces/controller.interface";
import recipeModel from "./recipe.model";
import userModel from "./user.model";

export default class recipeController implements Controller {
    public path = "/recipe";
    public router = Router();
    private recipeM = recipeModel;
    private userM = userModel;

    constructor() {
        this.router.get(this.path, this.getAll);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.patch(`${this.path}/:id`, this.modifyDocument);
        this.router.delete(`${this.path}/:id`, this.deleteDocument);
        this.router.post(this.path, this.createDocument);
    }

    private getAll = async (req: Request, res: Response) => {
        try {
            const data = await this.recipeM.find().populate("author", "-password -_id");
            res.send(data);
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
                res.send(`Document with id ${id} not found!`);
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
                res.send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };

    private createDocument = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            const createdDocument = new this.recipeM({
                ...body,
            });
            const savedDocument = await createdDocument.save();
            res.send(savedDocument);
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
                res.send(`Document with id ${id} not found!`);
            }
        } catch (error) {
            res.status(400);
            res.send(error.message);
        }
    };
}
