import * as mongoose from "mongoose";
import User from "./user.interface";

const addressSchema = new mongoose.Schema(
    {
        city: String,
        country: String,
        street: String,
    },
    { versionKey: false },
);

const userSchema = new mongoose.Schema(
    {
        address: addressSchema,
        email: String,
        name: String,
        password: String,
    },
    { versionKey: false },
);

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
