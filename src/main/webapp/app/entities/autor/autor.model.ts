export interface IAutor {
  id: number;
  nome?: string | null;
}

export type NewAutor = Omit<IAutor, 'id'> & { id: null };
