export interface IIdioma {
  id: number;
  nome?: string | null;
  descricao?: string | null;
}

export type NewIdioma = Omit<IIdioma, 'id'> & { id: null };
