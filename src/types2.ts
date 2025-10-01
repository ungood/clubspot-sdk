import Parse from 'parse/node.js';

/**
 * Registers a subclass of Parse.Object with Parse. Requires that className be a static property of the class.
 */
export function register<T extends Parse.Object>(
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
export function field<This extends Parse.Object, Value>(fieldName?: string) {
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




// includes:
// "campObject.clubObject.mailchimpAccount.mailchimpCredentials,
// billing_registration.customer,
// participantsArray.tierObject,
// sessionJoinObjects.campSessionObject,
// sessionJoinObjects.campClassObject.subclassesArray,
// sessionJoinObjects.subclassObject"
@register
export class Registration extends Parse.Object {
  static className = "registrations";

  @field()
  accessor application: boolean;

  @field()
  accessor archived: boolean;

  // Pointers
  // billing_registration --> billing_registration
  // campObject -> camps
  // classes[] -> campClasses
  // sessions[] -> campSessions
  // clubObject -> clubs
  // participantsArray --> participants
  // sessionJoinObjects[] -> campSessions

  @field()
  accessor confirmedAt: Date;

  @field()
  accessor firstName: string;

  @field()
  accessor lastName: string;

  @field()
  accessor participantNames: string[];

  @field()
  accessor status: string;

  @field("waiver_status")
  accessor waiverStatus: string;
}

// Shifts are used for golf schedules
@register
export class Shift extends Parse.Object {
  static className = 'shifts';

  constructor() {
    super(Shift.className);
  }
}

// Golf courses for the club
@register
export class Courses extends Parse.Object {
  static className = 'courses';

  constructor(){
    super(Courses.className);
  }
}

