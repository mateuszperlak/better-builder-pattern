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

// Create a builder instance with custom methods
const FooBuilder = Builder<Foo, FooCustomMethods>({
  withKek(this: Foo, value: boolean): Foo {
    this.id = value ? 'kek' : 'not-kek'

    return this
  },
})

// Example usage
const data = FooBuilder()
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

console.log(data)
