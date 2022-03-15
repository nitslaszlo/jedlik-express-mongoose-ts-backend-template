import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        _id: Number,
        email: String,
        name: String,
        password: String,
    },
    { versionKey: false },
);

const userModel = model("user", userSchema);

export default userModel;
