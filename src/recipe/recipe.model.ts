import { Schema, model } from "mongoose";
import IRecipe from "./recipe.interface";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html

const recipeSchema = new Schema<IRecipe>(
    {
        recipeName: String,
        imageURL: String,
        description: String,
        dateAdded: Date,
        isGlutenFree: Boolean,
        prepTime: Number,
        easyOfPrep: {
            type: Number,
            min: 1,
            max: 5,
        },
    },
    { versionKey: false },
);

const recipeModel = model<IRecipe>("Recipes", recipeSchema);

export default recipeModel;
