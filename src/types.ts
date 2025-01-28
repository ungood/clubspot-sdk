import Parse from 'parse/node.js';

/**
 * Registers a subclass of Parse.Object with Parse. Requires that className be a static property of the class.
 */
function register<T extends Parse.Object>(
  clazz: new (options?: any) => T,
  context: ClassDecoratorContext,
): void {
  context.addInitializer(() => {
    const className = (clazz as any)['className'] as string;
    if (className === undefined) {
      throw TypeError('className must be defined on Parse.Objects');
    }

    Parse.Object.registerSubclass(className, clazz);
  });
}

/**
 * A decorator that wraps accessors into getter/setters using Parse.
 * @param name The field name configured in Parse. Defaults to the accessor's name.
 */
function field<This extends Parse.Object, Value>(fieldName?: string) {
  return function (
    _target: ClassAccessorDecoratorTarget<This, Value>,
    context: ClassAccessorDecoratorContext<This, Value>,
  ) {
    const name = fieldName ?? context.name.toString();
    const result: ClassAccessorDecoratorResult<This, Value> = {
      get: function () {
        return this.get(name);
      },
      set: function (value: Value) {
        this.set(name, value);
      },
    };

    return result;
  };
}

@register
export class UserClub extends Parse.Object {
  static className = 'user_club';

  @field()
  accessor accepted: boolean | undefined;

  @field()
  accessor admin: boolean | undefined;

  @field()
  accessor manager: boolean | undefined;

  @field()
  accessor permissions: string[];

  constructor() {
    super(UserClub.className);
  }
}

@register
export class Camp extends Parse.Object {
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
    super(Camp.className);
  }
}

@register
export class Shift extends Parse.Object {
  static className = 'shifts';

  constructor() {
    super(Shift.className);
  }
}
