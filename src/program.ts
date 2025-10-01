import { Command, InvalidArgumentError, Option } from 'commander';
import { Clubspot } from '../src/clubspot.js';
import winston from 'winston';
import { consoleFormat } from 'winston-console-format';

/**
 * A base class for all Commands that logs into Clubspot
 */
export class ClubspotCommand extends Command {
  protected get user(): Parse.User {
    return this.optsWithGlobals().user;
  }

  override createCommand(name?: string): Command {
    return new ClubspotCommand(name);
  }
}

function parseIntOption(value: string): number {
  const parsed = parseInt(value);
  if(isNaN(parsed)) {
    throw new InvalidArgumentError('Not a number');
  }
  return parsed;
}

/**
 * An type of Option that is used to modify a Parse.Query object. Subclasses should
 * implement the apply method to apply the option value to a query object.
 *
 * The Option value returned will be a function that can be called like:
 * command.opts().foo?.(query);
 */
export abstract class QueryOption<T extends Parse.Object> extends Option {
  constructor(flags: string, description?: string) {
    super(flags, description);

    this.argParser((value) => {
      let func = (query: Parse.Query<T>) => {
        console.log(query);
        this.apply(query, value);
      }
      return func;
    });
  }

  abstract apply(query: Parse.Query<T>, value: string): void;
}

export abstract class ListCommand<T extends Parse.Object> extends ClubspotCommand {
  objectClass;

  constructor() {
    super("list");
    this.alias("ls");
    this.option("--archived [value]", "If true, will include archived results.", false);
    this.option("--limit <number>", "The number of results to return.", parseIntOption, 10);
    this.action(this.run);
  }

  protected async run() {
    let query = new Parse.Query()

    if(this.opts().archived === false) {
      query = query.equalTo('archived', false);
    }

    if(this.opts().limit !== undefined) {
      query = query.limit(this.opts().limit);
    }

    winston.debug('Running query', query.toJSON());

    const results = await query.find();
    const mapped = results.map(this.mapResult);

    winston.info("Results", mapped);
    //console.table(mapped);
  }

  protected async modifyQuery(query: Parse.Query<T>) {}

  protected mapResult(value: T) {
    return value;
  }

  abstract query(): Parse.Query<T>;
  abstract map(value: T): any;
}

function configureLogging(pretty: boolean, debug: boolean, colors: boolean) {
  let formats = [
    winston.format.timestamp(),
    winston.format.ms(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ];

  if(colors) {
    formats.push(winston.format.colorize());
  }

  if(pretty) {
    formats.push(consoleFormat({
      showMeta: true,
      metaStrip: ["timestamp"],
      inspectOptions: {
        depth: Infinity,
        colors: colors,
        maxArrayLength: Infinity,
        breakLength: 120,
        compact: Infinity,
      },
    }));
  }

  winston.configure({
    level: debug ? 'debug' : 'info',
    format: winston.format.combine(...formats),
    transports: new winston.transports.Console(),
  });
}

/**
 * Builds the root clubspot command.
 */
export default function buildCommand() {

  return new ClubspotCommand('clubspot')
    .addOption(new Option("-u, --username <username>").env("CLUBSPOT_EMAIL"))
    .addOption(new Option("-p, --password <password>").env("CLUBSPOT_PASSWORD"))
    .addOption(new Option("--debug").env("DEBUG"))
    .addOption(new Option("--no-pretty"))
    .addOption(new Option("--no-colors"))
    .hook('preSubcommand', async (command: ClubspotCommand) => {
      const opts = command.opts();
      configureLogging(opts.pretty, opts.debug, opts.colors);

      const clubspot = new Clubspot();
      const user = await clubspot.login(command.opts().username, command.opts().password);
      command.setOptionValue("user", user);
    });
}
