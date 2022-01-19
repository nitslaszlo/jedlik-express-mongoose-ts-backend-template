import { Types } from "mongoose";
export default interface Recipe {
    _id: Types.ObjectId | string;
    author: Types.ObjectId | string;
    recipeName: string;
    imageURL: string;
    description: string;
    ingredients: string[];
}
