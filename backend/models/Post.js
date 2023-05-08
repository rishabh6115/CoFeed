import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    caption: String,
    pic: String,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    author: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isPublic: [
      {
        type: Boolean,
        default: false,
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
