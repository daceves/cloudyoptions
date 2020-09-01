import { Service, Inject } from 'typedi';
import config from '../config';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { IApi, IApiInputDTO } from '../interfaces/IApi';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';

@Service()
/**
 * This service is intended to service apps in the context a developer.
 */
export default class Apis {
  constructor(
      @Inject('userModel') private userModel : Models.UserModel,
      @Inject('apiModel') private apiModel : Models.ApiModel,
      @Inject('logger') private logger,
      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createApi(api: IApiInputDTO): Promise<any> {
    try {
      // We'll do some validation later for now we'll let the interface cover our needs.
      const apiResult = await this.apiModel.create(api);
      return apiResult;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getApiById(apiId: String ) {
    try {
      console.log("API ID", apiId);
      const apiResult = await this.apiModel.findById(apiId);
      return apiResult;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getUserApis(limit = 10, offset = 0) {
    try {
      // TODO: Make this an aggregate
      const apiResult = await this.apiModel.find({published: true}).skip(offset).limit(limit);
      return apiResult;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private fetchApps(user) {
    
  }
}

