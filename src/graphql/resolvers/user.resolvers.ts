
import { ApolloError } from "apollo-server-express";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import proxy from "../../service/appServiceProxy";
import * as IUserService from "../../service/user/IUserService";

export default {
  Query: {


    async getUser(parent, args) {
      const { _id } = args;

      const request: IUserService.IGetUserRequest = {
        _id,
      };
      let response: IUserService.IGetUserResponse;
      try {
        response = await proxy.user.get(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response?.user;
    },
  },



  Mutation: {
    async registerUser(parent, args) {
      const {
        user: { name, age, email, password, status },
      } = args;

      const request: IUserService.IRegisterUserRequest = {
        name,
        age,
        email,
        password,
        status,
      };

      let response: IUserService.IRegisterUserResponse;

      try {
        response = await proxy.user.createUser(request);

        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }

      return response;
    },

    async updateUser(parent, args) {
      const { _id, params } = args;

      try {
        const response = await proxy.user.UpdateUser({ _id, params });
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(response.error.message);
        }
        return response.user
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },








    async login(parents, args) {
      const { email, password } = args;

      const request: IUserService.ILoginUserRequest = {
        email,
        password,
      };

      let response: IUserService.ILoginUserResponse = {
        status: STATUS_CODES.UNKNOWN_CODE,
      };

      try {
        response = await proxy.user.login(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(
            response.error.message,
            response.status.toString()
          );
        }
      } catch (e) {
        throw e;
      }
      return response;
    },



    async deleteUser(parent, args) {
      const { _id } = args;
      const request: IUserService.IdelteUserRequest = { _id };

      let response: IUserService.IdeleteUserResponse;

      try {
        response = await proxy.user.deleteUser(request);
        if (response.status !== STATUS_CODES.OK) {
          throw new ApolloError(response.error.message);
        }
        return response.delete;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    }

  },

};

