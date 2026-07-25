/**
 * Shared interface that all data repositories must implement.
 * Ensures consistent method signatures for basic CRUD across the entire application.
 * T = Entity Model Type
 * CreateDTO = Data required to create
 * UpdateDTO = Data required to update
 */
export interface IBaseRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T | null>;
  findAll(params?: Record<string, unknown>): Promise<T[]>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  /**
   * We exclusively use soft deletes per the architecture rules.
   */
  softDelete(id: string): Promise<boolean>;
}
