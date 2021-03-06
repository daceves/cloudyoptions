import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * Agendash config
   */
  agendash: {
    user: 'agendash',
    password: '123456'
  },
  /**
   * API configs
   */
  api: {
    prefix: '/v1',
  },
  /**
   * Mailgun email credentials
   */
  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  },
  /**
   * Google Client ID
   */
  google_oauth_client_id : process.env.CLIENT_ID,
  /**
   * Apigee Credentials
   */
  apigeeMgmtConnection: {
    type: process.env.APIGEE_CONNECTION_TYPE || 'googleapi',
    username: process.env.APIGEE_CONNECTION_USERNAME || 'dago.aceves+flash1@gmail.com',
    password: process.env.APIGEE_CONNECTION_PASSWORD || 'p87G!Ck23',
    oganizations: process.env.APIGEE_CONNECTION_PASSWORD || 'dagoacevesflash1-eval',
    mgmtEndpoint: process.env.APIGEE_CONNECTION_MGMT_ENDPOINT
  }
};
