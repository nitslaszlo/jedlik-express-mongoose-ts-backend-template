import { Schema, model } from "mongoose";

const authorSchema = new Schema(
    {
        _id: Number,
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    { versionKey: false },
);

const authorModel = model("author", authorSchema, "authors");

export default authorModel;
