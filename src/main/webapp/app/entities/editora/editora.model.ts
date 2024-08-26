export interface IEditora {
  id: number;
  nome?: string | null;
}

export type NewEditora = Omit<IEditora, 'id'> & { id: null };
