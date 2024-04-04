import STATUS_CODES from "src/utils/enum/StatusCodesEnum";
import IUSER from "../../utils/interface/IUser";
import { IResponse } from "../../utils/interface/common";

export interface IUserServiceAPI {
  createUser(request: IRegisterUserRequest): Promise<IRegisterUserResponse>;

  get(request: IGetUserRequest): Promise<IGetUserResponse>;
  
  login(request: ILoginUserRequest): Promise<ILoginUserResponse>;
  
  UpdateUser(request: IupdateUserRequest) : Promise<IupdateUserResponse>;

  deleteUser(request: IdelteUserRequest) : Promise<IdeleteUserResponse>;
}

/* delete interface */

export interface IdelteUserRequest {
  _id: string,
 
}

export interface IdeleteUserResponse extends IResponse {
 delete?:any
status : STATUS_CODES;

}



/* updateUSer interafce */

export interface IupdateUserRequest {
  params:{
  name: string;
  age: number;
  email: string;
  password: string;
  status: string;
  }
  _id? : string
}

export interface IupdateUserResponse extends IResponse {
  user?: IUSER;
  status : STATUS_CODES;
}






/*  Create user */
export interface IRegisterUserRequest {
  name: string;
  age: number;
  email: string;
  password: string;
  status: string;
}

export interface IRegisterUserResponse extends IResponse {
  user?: IUSER;
  status : STATUS_CODES;
}





/* Get User Proxy */

export interface IGetUserRequest {
  _id: string;
}
export interface IGetUserResponse extends IResponse {
  user?: IUSER;
}




/* login interface */
export interface ILoginUserRequest {
  email: string;
  password: string;
}


export interface ILoginUserResponse extends IResponse {
  user?: IUSER;
}

