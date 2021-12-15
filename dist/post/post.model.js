import { Schema, model } from "mongoose";
const postSchema = new Schema({
    author: {
        ref: "User",
        type: Schema.Types.ObjectId,
    },
    content: String,
    title: String,
}, { versionKey: false });
const postModel = model("Post", postSchema);
export default postModel;
//# sourceMappingURL=post.model.js.map