import { IAutor } from 'app/entities/autor/autor.model';
import { IEditora } from 'app/entities/editora/editora.model';
import { IIdioma } from 'app/entities/idioma/idioma.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { FormatoLivro } from 'app/entities/enumerations/formato-livro.model';

export interface ILivro {
  id: number;
  titulo?: string | null;
  subtitulo?: string | null;
  ano?: number | null;
  numPags?: number | null;
  isbn?: string | null;
  sinopse?: string | null;
  formato?: keyof typeof FormatoLivro | null;
  capa?: string | null;
  capaContentType?: string | null;
  autor?: IAutor | null;
  editora?: IEditora | null;
  idioma?: IIdioma | null;
  usuarios?: IUsuario[] | null;
}

export type NewLivro = Omit<ILivro, 'id'> & { id: null };
