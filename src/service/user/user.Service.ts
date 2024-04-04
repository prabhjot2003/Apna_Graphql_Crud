import Joi from "joi";
import UserStore from "./user.Store";
import IUSER from "../../utils/interface/IUser";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
// import ErrorMessageEnum from "../../utils/enum/errorMessageEnum";
import * as IUserService from "./IUserService";
// import { IAppServiceProxy } from "../appServiceProxy";
import { toError } from "../../utils/interface/common";
import bcrypt from "bcrypt";


export default class UserService implements IUserService.IUserServiceAPI {
  private userStore = new UserStore();
  // private proxy: IAppServiceProxy;

  // constructor(proxy: IAppServiceProxy) {
  //   this.proxy = proxy;
  // }


  public createUser = async (
    request: IUserService.IRegisterUserRequest
  ): Promise<IUserService.IRegisterUserResponse> => {
    const response: IUserService.IRegisterUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      name: Joi.string().required(),
      age: Joi.number().optional(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      status: Joi.string().optional(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { name, age, email, password, status } = params.value;

    let existingUser: IUSER;
    try {
      existingUser = await this.userStore.getByAttributes({ email });
      if (existingUser && existingUser.email) {
        // const errorMsg = ErrorMessageEnum.EMAIL_ALREADY_EXIST;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError("errorMsg");
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }

    // Hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    // Save the user to storage
    const attributes: IUSER = {
      name,
      age,
      email,
      password: hashPassword,
      status,
    };

    let user: IUSER;
    try {
      user = await this.userStore.createUser(attributes);
      response.status = STATUS_CODES.OK;
      response.user = user;
      return response;
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
  };





  /* Login user api */

  public login = async (
    request: IUserService.ILoginUserRequest
  ): Promise<IUserService.ILoginUserResponse> => {
    const response: IUserService.ILoginUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }
    const { email, password } = params.value;

    let user: IUSER;
    try {

      user = await this.userStore.getByAttributes({ email });

      if (!user) {
        // const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
        response.status = STATUS_CODES.UNAUTHORIZED;
        response.error = toError("errorMsg");
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }


    const isValid = await bcrypt.compare(password, user?.password);

    if (!isValid || !user?.password) {
      // const errorMsg = ErrorMessageEnum.INVALID_CREDENTIALS;
      response.status = STATUS_CODES.UNAUTHORIZED;
      response.error = toError("errorMsg");
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.user = user;
    return response;
  };





  /**
   * Get user by Id
   */
  public get = async (
    request: IUserService.IGetUserRequest
  ): Promise<IUserService.IGetUserResponse> => {
    const response: IUserService.IGetUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE,
    };

    const schema = Joi.object().keys({
      _id: Joi.string().required(),
    });

    const params = schema.validate(request);

    if (params.error) {
      console.error(params.error);
      response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
      response.error = toError(params.error.details[0].message);
      return response;
    }

    const { _id } = params.value;
    let user: IUSER;
    try {
      user = await this.userStore.getByAttributes({ _id });

      //if user's id is incorrect
      if (!user) {
        // const errorMsg = ErrorMessageEnum.INVALID_USER_ID;
        response.status = STATUS_CODES.BAD_REQUEST;
        response.error = toError("errorMsg");
        return response;
      }
    } catch (e) {
      console.error(e);
      response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.error = toError(e.message);
      return response;
    }
    response.status = STATUS_CODES.OK;
    response.user = user;
    return response;
  };



/* update Api */
public async UpdateUser(request: IUserService.IupdateUserRequest): Promise<IUserService.IupdateUserResponse> {
    const { _id, params } = request;
  
    try {
      const schema = Joi.object().keys({
        _id: Joi.string().required(),
        params: Joi.object({
          name: Joi.string().required(),
          age: Joi.number().required(),
          email: Joi.string().email().required(),
          password: Joi.string().optional(),
          status: Joi.string().optional()
        }).required()
      });
  
      const { error, value } = schema.validate({ _id, params }, { abortEarly: false });
  
      if (error) {
        return {
          status: STATUS_CODES.UNPROCESSABLE_ENTITY,
          user: null
        };
      }
  
      // Update the user
      let updatedUser
  
      try {
        updatedUser = await this.userStore.UpdateUser(_id,params); // Pass both _id and params to UpdateUser
        if (!updatedUser) {
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            user: null
          };
        }
      } catch (e) {
        console.error("Error updating user:", e);
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          user: null
        };
      }
  
      return {
        status: STATUS_CODES.OK,
        user: updatedUser
      };
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        user: null
      };
    }
  };
  





  /* delete api  */

  public async deleteUser(request: IUserService.IdelteUserRequest): Promise<IUserService.IdeleteUserResponse> {
    const { _id } = request;

    const response: IUserService.IdeleteUserResponse = {
      status: STATUS_CODES.UNKNOWN_CODE
    };

    try {

      const schema = Joi.object().keys({
        _id: Joi.string().required()
      });

      // Validate the request
      const params = schema.validate(request, { abortEarly: false });

      if (params.error) {
        return {
          status: STATUS_CODES.UNPROCESSABLE_ENTITY,

        };
      }

      let deleteUser

      try {
        deleteUser = await this.userStore.deleteUser(_id);

        if (!deleteUser) {

          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,

          };
        }

        return {
          status: STATUS_CODES.OK,
          delete: "success fully deleted"

        }
      } catch (e) {
        console.error(e);
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,

        };
      }

    } catch (error) {
      console.error(error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,

      };
    }
  }


}


