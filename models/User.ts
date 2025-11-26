import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "@/types";

export interface IUserDocument extends Omit<User, "_id">, mongoose.Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    usn: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    room: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: false,
    },
    course: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    emergencyContact: {
      name: {
        type: String,
        required: false,
      },
      relation: {
        type: String,
        required: false,
      },
      phone: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password as string, 10);
  this.set("password", hashedPassword);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel: Model<IUserDocument> =
  (mongoose.models?.User as Model<IUserDocument>) || mongoose.model<IUserDocument>("User", userSchema);

export default UserModel;
