import { Schema, model } from "mongoose";
import IRecipe from "./recipe.interface";
// https://mongoosejs.com/docs/typescript.html
// https://mongoosejs.com/docs/validation.html

const recipeSchema = new Schema<IRecipe>(
    {
        author: {
            ref: "User",
            type: Schema.Types.ObjectId,
        }, // idegen kulcs beállítása 1pont
        recipeName: String,
        imageURL: String,
        description: String,
        dateAdded: Date,
        isGlutenFree: Boolean,
        prepTime: Number,
        easyOfPrep: Number,
    },
    { versionKey: false },
);

const recipeModel = model<IRecipe>("Recipes", recipeSchema);

export default recipeModel;
