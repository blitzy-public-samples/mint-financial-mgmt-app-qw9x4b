import { DatabaseModels, QueryParams, SortOrder, PaginationParams } from '../types';

/**
 * Generic interface for database repositories in the Mint Replica application.
 * This interface provides a standard set of methods that should be implemented
 * by all repository classes, ensuring consistency across different database models.
 */
export interface Repository<T extends DatabaseModels> {
  /**
   * Creates a new record in the database.
   * @param data The data to create the new record.
   * @returns A promise that resolves to the created record.
   */
  create(data: T): Promise<T>;

  /**
   * Finds a record by its ID.
   * @param id The ID of the record to find.
   * @returns A promise that resolves to the found record or null if not found.
   */
  findById(id: string): Promise<T | null>;

  /**
   * Finds a single record based on query parameters.
   * @param params The query parameters to use for finding the record.
   * @returns A promise that resolves to the found record or null if not found.
   */
  findOne(params: QueryParams): Promise<T | null>;

  /**
   * Finds all records matching the query parameters.
   * @param params The query parameters to use for finding the records.
   * @param pagination The pagination parameters for the query.
   * @param sort The sorting parameters for the query.
   * @returns A promise that resolves to an array of found records.
   */
  findAll(params: QueryParams, pagination: PaginationParams, sort: Record<string, SortOrder>): Promise<T[]>;

  /**
   * Updates a record in the database.
   * @param id The ID of the record to update.
   * @param data The data to update the record with.
   * @returns A promise that resolves to the updated record.
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Deletes a record from the database.
   * @param id The ID of the record to delete.
   * @returns A promise that resolves to true if the record was deleted, false otherwise.
   */
  delete(id: string): Promise<boolean>;

  /**
   * Counts the number of records matching the query parameters.
   * @param params The query parameters to use for counting the records.
   * @returns A promise that resolves to the number of matching records.
   */
  count(params: QueryParams): Promise<number>;
}

// Human tasks:
// TODO: Review and validate the Repository interface methods against the specific requirements of the Mint Replica application
// TODO: Consider adding any additional methods that might be necessary for specific database operations in the application
// TODO: Ensure that the interface is compatible with both PostgreSQL and MongoDB operations