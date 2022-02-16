import { Schema, model } from "mongoose";
import User from "./user.interface";

const userSchema = new Schema<User>(
    {
        email: String,
        name: String,
        password: String,
    },
    { versionKey: false },
);

const userModel = model<User>("User", userSchema);

export default userModel;
