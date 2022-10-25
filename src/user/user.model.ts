import { Schema, model } from "mongoose";
import IUser from "./user.interface";

const addressSchema = new Schema(
    {
        city: String,
        country: String,
        street: String,
    },
    { versionKey: false },
);

const userSchema = new Schema<IUser>(
    {
        address: addressSchema,
        email: {
            type: String,
            required: true,
        },
        email_address_confirm: {
            type: String,
            required: true,
        },
        email_verified: {
            type: Boolean,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role_bits: {
            type: Number,
            required: true,
        },
    },
    { versionKey: false },
);

const userModel = model<IUser>("User", userSchema);

export default userModel;
