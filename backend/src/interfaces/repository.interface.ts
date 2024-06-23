export interface IRepository<T, K> {
  getById(id: string): Promise<T>;
  getList(offset: number, limit: number): Promise<T[]>;
  create(data: K): Promise<T>;
  update(data: K): Promise<T>;
  delete(id: string): Promise<T>;
}
