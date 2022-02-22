import { Schema, model } from "mongoose";
import IUser from "./user.interface";

const userSchema = new Schema<IUser>(
    {
        _id: Number,
        email: String,
        name: String,
        password: String,
    },
    { versionKey: false },
);

const userModel = model<IUser>("User", userSchema);

export default userModel;
