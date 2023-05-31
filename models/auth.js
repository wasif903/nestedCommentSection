import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const AuthSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
    },

    lastName: {
      type: String,
      require: true,
    },

    companyName: {
      type: String,
      require: true,
    },

    VAT_ID: {
      type: String,
      require: true,
    },

    addressLine: {
      type: String,
      require: true,
    },

    zipCode: {
      type: Number,
      require: true,
    },

    city: {
      type: String,
      require: true,
    },

    country: {
      type: String,
      require: true,
    },


    email: {
      type: String,
      require: true,
      unique: true,
    },

    password: {
      type: String,
      require: true,
    },

    roles: {
      type: [String],
      enum: ['User', 'Seller'],
      default: ['User'],
      require: true
    },

    invitation: {
      type: [String],
      enum: ['Pending', 'Accepted'],
    },

    verification: {
      type: Boolean,
      default: false,
    },

    otpCode: {
      type: Number,
      default:null
    },

    otpExpire: {
      type: Date,
      default:null
    }

  },
  { timestamps: true }
);

export default model("Auth", AuthSchema);