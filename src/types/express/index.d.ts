import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IApi } from '../../interfaces/IApi';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type ApiModel = Model<IApi & Document>;
  }
}
