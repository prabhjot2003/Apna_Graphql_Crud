import * as IUserService from "./user/IUserService";
import UserService from "./user/user.Service";

export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
}

class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;

  constructor() {
    this.user = new UserService();
  
  }
}

export default new AppServiceProxy();