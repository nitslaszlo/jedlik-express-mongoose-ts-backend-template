import { Types } from "mongoose";
export default interface User {
    _id: Types.ObjectId | string;
    name: string;
    email: string;
    email_verified: boolean;
    picture: string;
    password: string;
    role_bits: number;
    address?: {
        street: string;
        city: string;
        country: string;
    };
}
