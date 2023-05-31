import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const childComments = new Schema(
  {
    childComments:[{
      type: String,
      require: true,
    }],
    parentComments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'parentComments'
    },
  },
  { timestamps: true }
);

export default model("childComments", childComments);