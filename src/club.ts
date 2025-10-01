
import winston from "winston";
import { Parse, field, register } from "./parse.js";
import { ClubspotCommand, ListCommand, QueryOption } from "./program.js";
import { InvalidArgumentError, Option } from "commander";

interface ClubAttributes {
  name: string;
}

@register
export class Club extends Parse.Object<ClubAttributes> {
  static className = "clubs";

  @field()
  accessor name: string;

  constructor(attributes: ClubAttributes) {
    super(Club.className, attributes);
  }

  // TODO: Every Parse.Object will have this, so how can we define this once?
  public static get(id: string): Promise<Club> {
    return new Parse.Query(Club).get(id);
  }
}

interface UserClubAttributes {
  clubObject: Club;
  userObject: Parse.User;

  accepted?: boolean;
  admin?: boolean;
  manager?: boolean;
  permissions?: string[];

}

@register
export class UserClub extends Parse.Object<UserClubAttributes> {
  static className = 'user_club';

  constructor(attributes: UserClubAttributes) {
    super(UserClub.className, attributes);
  }
}

/**
 * An option that can be added to commands to limit results to a particular club.
 * By default, this should be used on all/most list commands.
 */
export class ClubOption extends QueryOption<Club> {
  constructor() {
    super("--club <id>", "The id of the Clubspot club to limit results to.");
    this.env("CLUBSPOT_CLUB_ID");
  }

  apply(query: Parse.Query<Club>, value: string): void {
    query
      .include("clubObject")
      .equalTo("clubObject.objectId", value);
  }
}

class ListClubsCommand extends ListCommand<UserClub> {
  constructor() {
    super();
  }

  override query() {
    return new Parse.Query(UserClub)
      .include('clubObject')
      .equalTo('userObject', this.user);
  }

  map(userClub: UserClub) {
    const club = userClub.get('clubObject');

    return {
      "id": club.id,
      "name": club.get("name"),
      "admin": userClub.get('admin'),
      "manager": userClub.get('manager'),
      "permissions": userClub.get('permissions')
    };
  }
}

export default function buildCommand(parent: ClubspotCommand) {
  return parent.command("clubs")
    .addCommand(new ListClubsCommand());
}
