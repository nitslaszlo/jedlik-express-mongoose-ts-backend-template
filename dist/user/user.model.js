import { Schema, model } from "mongoose";
const addressSchema = new Schema({
    city: String,
    country: String,
    street: String,
}, { versionKey: false });
const userSchema = new Schema({
    address: addressSchema,
    email: String,
    name: String,
    password: String,
}, { versionKey: false });
const userModel = model("User", userSchema);
export default userModel;
//# sourceMappingURL=user.model.js.map