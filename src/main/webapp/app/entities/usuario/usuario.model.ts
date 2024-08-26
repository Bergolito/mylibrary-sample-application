import { ILivro } from 'app/entities/livro/livro.model';

export interface IUsuario {
  id: number;
  nome?: string | null;
  email?: string | null;
  senha?: string | null;
  livros?: ILivro[] | null;
}

export type NewUsuario = Omit<IUsuario, 'id'> & { id: null };
