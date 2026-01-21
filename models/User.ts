import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "AGENT" | "USER";
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "AGENT", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", userSchema);
