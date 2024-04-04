import IUSER from "../../utils/interface/IUser";
import { Document, Schema, Model, model } from "mongoose";
import UserMongo from "../../models/user.Model";
import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";

export interface IUserModel extends IUSER, Document {
  _id: string;
}
export const UserSchema = new Schema(UserMongo);
export const User: Model<IUserModel> = model<IUserModel>("User", UserSchema);

export default class UserStore {
  public static OPERATION_UNSUCCESSFUL = class extends Error {
    constructor() {
      super("An error occured while processing the request.");
    }
  };

  /**
   * creating new user and saving in Database
   */
  async createUser(userInput: IUSER): Promise<IUSER> {
    const user = new User(userInput);
    let savedUser: IUSER;
    try {
      savedUser = await user.save();
    } catch (error) {
      return error;
    }
    return savedUser;
  }


   public async UpdateUser(_id: string, params: any): Promise<IUserModel | null> {
    try {
      // Find the user by userId and update with provided params
      const updatedUser: IUserModel | null = await User.findByIdAndUpdate(_id, params, { new: true }).lean();
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error(ErrorMessageEnum.DATABASE_ERROR);
    }
  }
  


/**
   *Get by attributes in object form
   */
  public async getByAttributes(attributes: object): Promise<IUSER> {
    try {
      return await User.findOne(attributes).lean();
    } catch (e) {
      return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
    }
  };


  public async deleteUser(_id: string): Promise<IUserModel | null> {
    try {
      const deleteUser:any = await User.findByIdAndDelete(_id).lean();
      return deleteUser;

    } catch (error) {
      console.error(error);

      throw new Error(ErrorMessageEnum.DATABASE_ERROR);
    }
  }

}

