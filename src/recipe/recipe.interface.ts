import { Types } from "mongoose";
export default interface IRecipe {
    _id: Types.ObjectId | string;
    author: Types.ObjectId | string;
    recipeName: string;
    imageURL: string;
    description: string;
    dateAdded: Date;
    isGlutenFree: boolean;
    prepTime: number;
    easyOfPrep: number;
}
