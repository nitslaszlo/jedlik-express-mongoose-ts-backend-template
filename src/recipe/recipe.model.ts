import { Schema, model } from "mongoose";
import IRecipe from "./recipe.interface";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html

const recipeSchema = new Schema<IRecipe>(
    {
        author: {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
        recipeName: {
            type: String,
            required: true,
        },
        imageURL: String,
        description: String,
        dateAdded: {
            type: Date,
            default: Date.now,
        },
        isGlutenFree: Boolean,
        prepTime: Number,
        easyOfPrep: {
            type: Number,
            min: [1, "Too few stars"],
            max: 5,
        },
    },
    { versionKey: false },
);

const recipeModel = model<IRecipe>("Recipes", recipeSchema);

export default recipeModel;
