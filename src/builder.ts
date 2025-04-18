/**
 * Type for a custom method
 */

export type CustomMethod<T, Args extends unknown[], R> = (this: T, ...args: Args) => R;

type WithPrefix<K extends string> = `with${Capitalize<K>}`;

/**
 * Type for the builder instance with strongly typed methods
 */
export type BuilderInstance<T, M extends Record<string, CustomMethod<T, any[], any>>> = {
  [K in keyof T & string as WithPrefix<K>]: (
    value: T[K],
  ) => BuilderInstance<T, M>;
} & {
  [K in keyof M]: M[K] extends CustomMethod<T, infer Args, infer R>
    ? (...args: Args) => BuilderInstance<T, M>
    : never;
} & {
  build(): T;
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

export function Builder<T extends object, M extends Record<string, CustomMethod<T, any[], any>> = Record<string, never>>(
  customMethods: M = {} as M,
): () => BuilderInstance<T, M> {
  return () => {
    const data = {} as T

    const builder = new Proxy({
      build: () => deepClone(data),
      ...Object.entries(customMethods).reduce<Record<string,(...args: any[]) => BuilderInstance<T, M>>>((acc, [key, method]) => {
        acc[key] = function(this: T, ...args: any[]) {
          method.apply(data, args)
          return builder
        }
        return acc
      }, {}),
    } as BuilderInstance<T, M>, {
      get(target: BuilderInstance<T, M>, prop: string | symbol): unknown {
        if (prop in target) {
          return target[prop as keyof BuilderInstance<T, M>]
        }

        if (
          typeof prop === 'string'
          && prop.startsWith('with')
          && prop.length > 4
        ) {
          const propName = prop.charAt(4).toLowerCase() + prop.slice(5) as keyof T

          const method = function(value: T[keyof T]) {
            data[propName] = deepClone(value)
            return builder
          }

          const typedTarget = target as unknown as Record<string, (value: T[keyof T]) => BuilderInstance<T, M>>
          typedTarget[prop] = method

          return method
        }

        return undefined
      },
    })

    return builder
  }
}
