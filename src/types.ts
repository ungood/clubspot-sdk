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

export class Shifts extends Parse.Object {
  static parseClassName = 'shifts';

  constructor() {
    super(Shifts.parseClassName);
  }
}

Parse.Object.registerSubclass(Shifts.parseClassName, Shifts);
Parse.Object.registerSubclass(Camps.parseClassName, Camps);
Parse.Object.registerSubclass(UserClub.parseClassName, UserClub);
