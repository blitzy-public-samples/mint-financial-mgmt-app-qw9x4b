import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

// TODO: Import the actual PostgreSQL configuration once it's available
// import { postgresqlConfig } from '../../config/postgresql.config';

// TODO: Import the actual UserInterface once it's available
// import { UserInterface } from '../../../shared/interfaces/user.interface';

@Table({ tableName: 'users' })
export class UserModel extends Model {
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  password_hash!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  first_name!: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  last_name!: string;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
  })
  date_of_birth!: Date;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  created_at!: Date;

  @Column({
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  })
  updated_at!: Date;

  toJSON(): object {
    const values = Object.assign({}, this.get());
    delete values.password_hash;
    return values;
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

export const initializeUserModel = (sequelize: Sequelize): typeof UserModel => {
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
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (user: UserModel) => {
          if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
          }
        },
        beforeUpdate: async (user: UserModel) => {
          if (user.changed('password_hash')) {
            user.password_hash = await bcrypt.hash(user.password_hash, 10);
          }
        },
      },
    }
  );

  return UserModel;
};

// TODO: Implement password hashing mechanism using bcrypt before saving to database
// TODO: Set up email uniqueness constraint and validation
// TODO: Implement password strength validation rules
// TODO: Add indexes for frequently queried fields (e.g., email)