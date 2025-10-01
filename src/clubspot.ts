import Parse, { CommonAttributes } from 'parse/node.js';
import winston from 'winston';

export interface ClubspotAttributes {
  
}

export class Clubspot {
  /**
   * Initializes the Parse SDK to the main Clubspot API.
   */
  public constructor() {
    const serverUrl = 'https://theclubspot.com/parse';
    const applicationId = 'myclubspot2017'

    Parse.CoreManager.set('SERVER_URL', serverUrl);;
    Parse.initialize(applicationId);
    winston.debug('Parse initialized', { serverUrl, applicationId });
  }

  /**
   * Retrieves a list of users registered with the given email address.
   * TODO: Add mobile phone lookup?
   */
  public retrieveUsersByEmail(email: string): Promise<Parse.User[]> {
    return Parse.Cloud.run('retrieveUsersByEmailOrMobileNumber', {
      email: email,
    });
  }

  /**
   * Logs into Parse with the given email address and password.
   */
  public async login(email: string, password: string): Promise<Parse.User> {
    const users = await this.retrieveUsersByEmail(email);

    if (users.length < 1) {
      throw new Error(`No user found with email address: ${email}`);
    }

    const user = users[0] as Parse.User;
    const username = user.getUsername();
    winston.debug('Logged in', { username, email });

    return Parse.User.logIn(username!, password);
  }
}
