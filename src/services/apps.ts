import { Service, Inject } from 'typedi';
import config from '../config';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';


@Service()
/**
 * This service is intended to service apps in the context a developer.
 */
export default class Apps {
  constructor(
      @Inject('userModel') private userModel : Models.UserModel,
      @Inject('logger') private logger,
      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async dashboardApps(userInputDTO: IUserInputDTO, limit, offset): Promise<any> {
    try {
      return [{name: 'item'}];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private fetchApps(user) {
    
  }
}
