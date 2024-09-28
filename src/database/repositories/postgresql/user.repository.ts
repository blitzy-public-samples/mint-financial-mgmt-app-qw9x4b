import { Op } from 'sequelize';
import { UserModel } from '../../models/postgresql/user.model';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { RepositoryInterface } from '../../interfaces/repository.interface';

export class UserRepository implements RepositoryInterface<UserInterface> {
  private model: typeof UserModel;

  constructor(userModel: typeof UserModel) {
    this.model = userModel;
  }

  async create(userData: UserInterface): Promise<UserInterface> {
    // Validate user data
    this.validateUserData(userData);

    // Create a new user using UserModel.create()
    const createdUser = await this.model.create(userData);

    return createdUser.toJSON() as UserInterface;
  }

  async findById(id: string): Promise<UserInterface | null> {
    const user = await this.model.findByPk(id);
    return user ? user.toJSON() as UserInterface : null;
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    const user = await this.model.findOne({ where: { email } });
    return user ? user.toJSON() as UserInterface : null;
  }

  async update(id: string, userData: Partial<UserInterface>): Promise<UserInterface | null> {
    const user = await this.model.findByPk(id);

    if (user) {
      const updatedUser = await user.update(userData);
      return updatedUser.toJSON() as UserInterface;
    }

    return null;
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.model.findByPk(id);

    if (user) {
      await user.destroy();
      return true;
    }

    return false;
  }

  async findAll(): Promise<UserInterface[]> {
    const users = await this.model.findAll();
    return users.map(user => user.toJSON() as UserInterface);
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.model.findOne({ where: { email } });

    if (user) {
      return user.validatePassword(password);
    }

    return false;
  }

  private validateUserData(userData: UserInterface): void {
    // Implement user data validation logic here
    // Throw an error if validation fails
  }
}

export function createUserRepository(userModel: typeof UserModel): UserRepository {
  return new UserRepository(userModel);
}

// Human tasks:
// TODO: Implement proper error handling and logging for database operations
// TODO: Add pagination support for the findAll method
// TODO: Implement additional query methods as needed (e.g., findByName, findByDateRange)
// TODO: Add unit tests for all repository methods