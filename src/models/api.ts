import { IApi } from '../interfaces/IApi';
import mongoose from 'mongoose';


const Api = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter name of the API'],
    },

    version: {
      type: String,
    },

    source: {
      type: String,
    },

    published: {
      type: Boolean,
      lowercase: true,
      index: true,
    },

    remoteApi: {
      type: [mongoose.Schema.Types.ObjectId],
    },

  },
  { timestamps: true },
);

export default mongoose.model<IApi & mongoose.Document>('Api', Api);
