import { describe, test, expect } from 'vitest'
import { Builder } from '../src/builder'

describe('Builder Pattern', () => {
  test('creates a builder with basic properties', () => {
    interface User {
      id: string;
      name: string;
      email: string;
    }

    const UserBuilder = Builder<User>()

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withEmail('john@example.com')
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  test('supports custom methods', () => {
    interface User {
      id: string;
      name: string;
      email: string;
    }

    type UserCustomMethods = {
      withFullName: (this: User, firstName: string, lastName: string) => User;
    };

    const UserBuilder = Builder<User, UserCustomMethods>({
      withFullName(this: User, firstName: string, lastName: string): User {
        this.name = `${firstName} ${lastName}`
        return this
      },
    })

    const user = UserBuilder()
      .withId('123')
      .withFullName('John', 'Doe')
      .withEmail('john@example.com')
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  test('supports nested objects', () => {
    interface Address {
      street: string;
      city: string;
      zipCode: string;
    }

    interface User {
      id: string;
      name: string;
      address: Address;
    }

    const UserBuilder = Builder<User>()

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withAddress({
        street: '123 Main St',
        city: 'Anytown',
        zipCode: '12345',
      })
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        zipCode: '12345',
      },
    })
  })

  test('supports arrays', () => {
    interface User {
      id: string;
      name: string;
      tags: string[];
    }

    const UserBuilder = Builder<User>()

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withTags(['developer', 'typescript', 'builder'])
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      tags: ['developer', 'typescript', 'builder'],
    })
  })

  test('deep clones values', () => {
    interface User {
      id: string;
      name: string;
      metadata: Record<string, any>;
    }

    const UserBuilder = Builder<User>()

    const metadata = { role: 'admin', permissions: ['read', 'write'] }

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withMetadata(metadata)
      .build()

    metadata.role = 'user'
    metadata.permissions.push('delete')

    expect(user.metadata).toEqual({
      role: 'admin',
      permissions: ['read', 'write'],
    })
  })

  test('handles the example from example/index.ts', () => {
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

    type FooCustomMethods = {
      withKek: (this: Foo, value: boolean) => Foo;
    }

    const FooBuilder = Builder<Foo, FooCustomMethods>({
      withKek(this: Foo, value: boolean): Foo {
        this.id = value ? 'kek' : 'not-kek'
        return this
      },
    })

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

    expect(data).toEqual({
      id: 'kek',
      name: 'test',
      item: {
        foo: {
          bar: {
            nested: {
              baz: 'value',
            },
          },
        },
      },
      relation: [
        { id: '1', value: 'value1' },
        { id: '2', value: 'value2' },
      ],
      metadata: {
        id: 'meta1',
        key: 'key1',
      },
    })
  })

  test('supports multiple custom methods', () => {
    interface User {
      id: string;
      name: string;
      email: string;
      role: string;
      isActive: boolean;
    }

    type UserCustomMethods = {
      withFullName: (this: User, firstName: string, lastName: string) => User;
      withAdminRole: (this: User) => User;
      withActiveStatus: (this: User, isActive: boolean) => User;
    };

    const UserBuilder = Builder<User, UserCustomMethods>({
      withFullName(this: User, firstName: string, lastName: string): User {
        this.name = `${firstName} ${lastName}`
        return this
      },
      withAdminRole(this: User): User {
        this.role = 'admin'
        return this
      },
      withActiveStatus(this: User, isActive: boolean): User {
        this.isActive = isActive
        return this
      },
    })

    const user = UserBuilder()
      .withId('123')
      .withFullName('John', 'Doe')
      .withEmail('john@example.com')
      .withAdminRole()
      .withActiveStatus(true)
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
    })
  })

  test('supports deeply nested custom methods', () => {
    interface Address {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    }

    interface User {
      id: string;
      name: string;
      address: Address;
    }

    type UserCustomMethods = {
      withUSAddress: (this: User, street: string, city: string, zipCode: string) => User;
    };

    const UserBuilder = Builder<User, UserCustomMethods>({
      withUSAddress(this: User, street: string, city: string, zipCode: string): User {
        this.address = {
          street,
          city,
          zipCode,
          country: 'USA',
        }
        return this
      },
    })

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withUSAddress('123 Main St', 'Anytown', '12345')
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        zipCode: '12345',
        country: 'USA',
      },
    })
  })

  test('handles empty objects', () => {
    type Empty = Record<string, never>;

    const EmptyBuilder = Builder<Empty>()

    const empty = EmptyBuilder().build()

    expect(empty).toEqual({})
  })

  test('handles objects with optional properties', () => {
    interface User {
      id: string;
      name: string;
      email?: string;
      age?: number;
    }

    const UserBuilder = Builder<User>()

    const user1 = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .build()

    expect(user1).toEqual({
      id: '123',
      name: 'John Doe',
    })

    const user2 = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withEmail('john@example.com')
      .withAge(30)
      .build()

    expect(user2).toEqual({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    })
  })

  test('handles objects with readonly properties', () => {
    interface User {
      readonly id: string;
      name: string;
    }

    const UserBuilder = Builder<User>()

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
    })
  })

  test('handles objects with union types', () => {
    interface User {
      id: string;
      name: string;
      status: 'active' | 'inactive' | 'pending';
    }

    const UserBuilder = Builder<User>()

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withStatus('active')
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      status: 'active',
    })
  })

  test('handles objects with intersection types', () => {
    interface Person {
      name: string;
      age: number;
    }

    interface Employee {
      id: string;
      department: string;
    }

    type User = Person & Employee;

    const UserBuilder = Builder<User>()

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withAge(30)
      .withDepartment('Engineering')
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      age: 30,
      department: 'Engineering',
    })
  })

  test('handles custom methods with no parameters', () => {
    interface User {
      id: string;
      name: string;
      isAdmin: boolean;
    }

    type UserCustomMethods = {
      asAdmin: (this: User) => User;
    };

    const UserBuilder = Builder<User, UserCustomMethods>({
      asAdmin(this: User): User {
        this.isAdmin = true
        return this
      },
    })

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .asAdmin()
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      isAdmin: true,
    })
  })

  test('handles custom methods with multiple parameters', () => {
    interface User {
      id: string;
      name: string;
      address: {
        street: string;
        city: string;
        zipCode: string;
        country: string;
      };
    }

    type UserCustomMethods = {
      withAddress: (this: User, street: string, city: string, zipCode: string, country: string) => User;
    };

    const UserBuilder = Builder<User, UserCustomMethods>({
      withAddress(this: User, street: string, city: string, zipCode: string, country: string): User {
        this.address = { street, city, zipCode, country }
        return this
      },
    })

    const user = UserBuilder()
      .withId('123')
      .withName('John Doe')
      .withAddress('123 Main St', 'Anytown', '12345', 'USA')
      .build()

    expect(user).toEqual({
      id: '123',
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        zipCode: '12345',
        country: 'USA',
      },
    })
  })
})
