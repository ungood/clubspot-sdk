import winston from "winston";
import { Club, ClubOption } from "./club.js";
import { Parse, field, register } from "./parse.js";
import { ClubspotCommand, ListCommand } from "./program.js";
import { Archivable } from "./clubspot.js";

interface CampAttributes extends Archivable {
  startDate?: Date;
  name?: string;
  event_tags?: object[];
}

@register
export class Camp extends Parse.Object<CampAttributes> {
  static className = 'camps';

  @field()
  accessor startDate: Date;

  @field()
  accessor name: string;

  @field()
  accessor archived: boolean;

  @field()
  accessor public: boolean;

  @field('waitlist_accepted_logic')
  accessor waitlistAcceptedLogic: boolean;

  @field()
  accessor pending: boolean;

  @field('event_tags')
  accessor eventTags: object[];

  constructor() {
    super(Camp.className, {});
  }
}


class ListCampsCommand extends ListCommand<Camp> {
  constructor() {
    super();
    this.addOption(new ClubOption());
  }

  override query() {
    let query = new Parse.Query(Camp);
    winston.debug("foo", this.opts().club);
    this.opts().club?.(query);
    return query;
  }

  override map(value: Camp) {
    return value.toJSON();
  }
}

export default function buildCommand(parent: ClubspotCommand) {
  return parent.command("camps")
    .addCommand(new ListCampsCommand());
}
