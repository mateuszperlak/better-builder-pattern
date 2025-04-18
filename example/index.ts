import { Builder } from '../src/builder'

interface Foo {
  id: string;
  name: string;
  item: {
    foo: {
      bar: {
        nested: {
          baz: string;
        };
      };
    };
  };
  relation: {
    id: string;
    value: string;
  }[];
  metadata: {
    id: string;
    key: string;
  };
}

// Define custom methods type
type FooCustomMethods = {
  withKek: (this: Foo, value: boolean) => Foo;
}

// Default data that will be used as fallback
const defaultFoo: Partial<Foo> = {
  id: 'default-id',
  name: 'default-name',
  item: {
    foo: {
      bar: {
        nested: {
          baz: 'default-baz'
        }
      }
    }
  }
}

// Create a builder instance with custom methods and default data
const FooBuilder = Builder<Foo, FooCustomMethods>({
  withKek(this: Foo, value: boolean): Foo {
    this.id = value ? 'kek' : 'not-kek'
    return this
  },
}, defaultFoo)

// Example usage with default data
const data1 = FooBuilder().build()
console.log('Data with defaults:', data1)

// Example usage overriding some defaults
const data2 = FooBuilder()
  .withId('123')
  .withName('test')
  .withKek(true)
  .build()
console.log('Data with overrides:', data2)

// Example usage with full override
const data3 = FooBuilder()
  .withId('123')
  .withName('test')
  .withKek(true)
  .withItem({
    foo: {
      bar: {
        nested: {
          baz: 'value',
        },
      },
    },
  })
  .withRelation([
    { id: '1', value: 'value1' },
    { id: '2', value: 'value2' },
  ])
  .withMetadata({
    id: 'meta1',
    key: 'key1',
  })
  .build()
console.log('Data with full override:', data3)
