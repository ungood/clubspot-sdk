import Parse from 'parse/node.js';

export class UserClub extends Parse.Object {
  static parseClassName = 'user_club';

  constructor() {
    super(UserClub.parseClassName);
  }
}

export class Camps extends Parse.Object {
  static parseClassName = 'camps';

  constructor() {
    super(Camps.parseClassName);
  }
}

export class Golf_Schedules extends Parse.Object {
  static parseClassName = 'shifts';

  constructor() {
    super(Golf_Schedules.parseClassName);
  }
}

Parse.Object.registerSubclass(Golf_Schedules.parseClassName, Golf_Schedules);
Parse.Object.registerSubclass(Camps.parseClassName, Camps);
Parse.Object.registerSubclass(UserClub.parseClassName, UserClub);
