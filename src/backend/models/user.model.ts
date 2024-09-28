import { DataTypes, Model, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

// Define the User interface based on the provided specification
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
}

class UserModel extends Model<User> implements User {
  public id!: string;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public passwordHash!: string;
  public dateOfBirth!: Date;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Class method to initialize the model
  public static initModel(sequelize: Sequelize): typeof UserModel {
    UserModel.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        passwordHash: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dateOfBirth: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
      }
    );

    return UserModel;
  }
}

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

// Function to compare a password with a hashed password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}

export { UserModel };
```

This implementation includes the following features:

1. We import the necessary dependencies from Sequelize and bcrypt.
2. We define a User interface based on the provided specification.
3. We create a UserModel class that extends Sequelize's Model and implements the User interface.
4. The initModel static method initializes the User model with Sequelize, defining the schema and options.
5. We implement the hashPassword and comparePassword functions using bcrypt for secure password handling.
6. We export the UserModel class and the password-related functions.

Here are the pending human tasks as comments:

```typescript
// TODO: Implement proper error handling for password hashing and comparison functions
// TODO: Set up database indexes for frequently queried fields (e.g., email)
// TODO: Implement data validation and sanitization for user input
// TODO: Consider implementing a method for password reset functionality