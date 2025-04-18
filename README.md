# Better Builder Pattern

A TypeScript library that implements an enhanced builder pattern with automatic method generation, nested property support, and custom method integration.

## Features

- Automatic generation of `with*` methods based on interface properties
- Full type safety with TypeScript
- Support for nested object properties
- Custom method integration with proper typing
- Chainable API
- Array property support
- Type-safe `build()` method
- Default data support with fallback values

## Installation

```bash
npm install better-builder-pattern
# or
yarn add better-builder-pattern
```

## Usage

Here's a complete example of how to use the library:

```typescript
import { Builder } from 'better-builder-pattern';

// Define your interface
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

// Define custom methods type (optional)
type FooCustomMethods = {
  withValidation: (this: Foo, isValid: boolean) => Foo;
}

// Create a builder instance with custom methods
const FooBuilder = Builder<Foo, FooCustomMethods>({
  withValidation(this: Foo, isValid: boolean): Foo {
    this.id = isValid ? 'valid-id' : 'invalid-id';
    return this;
  },
});

// Use the builder
const data = FooBuilder()
  .withId('123')
  .withName('test')
  .withValidation(true)
  .withItem({
    foo: {
      bar: {
        nested: {
          baz: 'value'
        }
      }
    }
  })
  .withRelation([
    { id: '1', value: 'value1' },
    { id: '2', value: 'value2' }
  ])
  .withMetadata({
    id: 'meta1',
    key: 'key1'
  })
  .build();
```

## Features in Detail

### Automatic Method Generation
The library automatically generates `with*` methods for all properties in your interface, maintaining proper TypeScript types.

### Nested Properties
Support for deeply nested object properties with full type safety:

```typescript
.withItem({
  foo: {
    bar: {
      nested: {
        baz: 'value'
      }
    }
  }
})
```

### Custom Methods
Add your own custom methods to the builder while maintaining type safety:

```typescript
type CustomMethods = {
  withValidation: (this: YourType, isValid: boolean) => YourType;
}

const YourBuilder = Builder<YourType, CustomMethods>({
  withValidation(this: YourType, isValid: boolean): YourType {
    // Your custom logic here
    return this;
  },
});
```

### Default Data
Provide default values that will be used as fallbacks when properties aren't explicitly set:

```typescript
// Define default data
const defaultUser = {
  id: 'default-id',
  name: 'Default User',
  address: {
    street: 'Default Street',
    city: 'Default City',
    zipCode: '00000',
    country: 'Default Country'
  }
};

// Create a builder with default data
const UserBuilder = Builder<User>({}, defaultUser);

// Use default values
const user1 = UserBuilder().build();
// Result: { id: 'default-id', name: 'Default User', address: {...} }

// Override specific values
const user2 = UserBuilder()
  .withName('Custom User')
  .withAddress({
    street: 'Custom Street',
    city: 'Custom City',
    zipCode: '11111',
    country: 'Custom Country'
  })
  .build();
// Result: { id: 'default-id', name: 'Custom User', address: {...} }
```

### Array Support
Built-in support for array properties:

```typescript
.withRelation([
  { id: '1', value: 'value1' },
  { id: '2', value: 'value2' }
])
```

## Type Safety

The library is built with TypeScript and provides full type safety:
- All generated methods are properly typed
- Nested properties maintain their type information
- Custom methods are type-checked
- The `build()` method returns the complete object with proper typing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 