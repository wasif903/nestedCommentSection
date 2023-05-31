import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const nestedReplies = new Schema(
  {
    nestedReplies: [{
      type: String,
      require: true,
    }],
    parentComments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'parentComments'
    },
    childComments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'childComments'
    },
  },
  { timestamps: true }
);

export default model("nestedReplies", nestedReplies);