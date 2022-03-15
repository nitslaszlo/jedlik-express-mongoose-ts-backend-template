import { Schema, model } from "mongoose";

const userSchema = new Schema(
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
        password: {
            type: String,
            required: true,
        },
    },
    { versionKey: false },
);

const userModel = model("user", userSchema);

export default userModel;
