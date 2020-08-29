import { Guser } from '../interfaces/Guser';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

  },
  { timestamps: true },
);

export default mongoose.model<Guser & mongoose.Document>('User', User);
