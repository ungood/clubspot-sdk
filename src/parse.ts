/**
 * Typescript Wrappers around the Parse Javascript SDK.
 * @see https://parseplatform.org/Parse-SDK-JS/api/5.3.0/
 */
import Parse from 'parse/node.js';
export { Parse };


type Constructible<T extends Parse.Object<Parse.Attributes>> = (new (...args: any[]) => Parse.Object<Parse.Attributes>)

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
