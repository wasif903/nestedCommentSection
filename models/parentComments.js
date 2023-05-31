import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const ParentComment = new Schema(
  {
    parentComment: {
      type: String,
      require: true,
    },
},
  { timestamps: true }
);

export default model("ParentComment", ParentComment);