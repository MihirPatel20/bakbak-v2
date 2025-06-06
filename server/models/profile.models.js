import mongoose, { Schema } from "mongoose";
import { User } from "./user.models.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const profileSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
      default: "John",
    },
    lastName: {
      type: String,
      default: "Doe",
    },
    bio: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      default: "",
    },
    countryCode: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    isPrivate: { type: Boolean, default: false },

    coverImage: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/800x450.png`,
        localPath: "/images/default/profile_cover-1.jpg",
      },
    },
  },
  { timestamps: true }
);

profileSchema.index({
  firstName: "text",
  lastName: "text",
  bio: "text",
  location: "text",
  "account.username": "text",
});

profileSchema.plugin(mongooseAggregatePaginate);

export const SocialProfile = mongoose.model("SocialProfile", profileSchema);
