// https://mongoosejs.com/docs/validation.html

import { Schema, model } from "mongoose";
import Recipe from "./recipe.interface";

const recipeSchema = new Schema<Recipe>(
    {
        author: {
            ref: "User",
            type: Schema.Types.ObjectId,
        },
        recipeName: String,
        imageURL: String,
        description: String,
        ingredients: Array,
    },
    { versionKey: false },
);

const recipeModel = model<Recipe>("Recipes", recipeSchema);

export default recipeModel;
