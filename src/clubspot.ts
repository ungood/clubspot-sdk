import Parse from 'parse/node.js';
import { UserClub } from './types.js';

export class Clubspot {
  /**
   * Initializes the Parse SDK to the main Clubspot API.
   */
  public constructor() {
    Parse.CoreManager.set('SERVER_URL', 'https://theclubspot.com/parse');
    Parse.initialize('myclubspot2017');
    console.debug('Parse initialized.');
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
    console.debug(`Found user ${username} for email ${email}`);

    return Parse.User.logIn(username, password);
  }

  public async findClubsForUser(user: Parse.User): Promise<UserClub[]> {
    const query = new Parse.Query(UserClub)
      .equalTo('userObject', user)
      .include('clubObject')
      .limit(10);

    return query.find();
    //return results.map(userClub => userClub.get("clubObject"));
  }
}
