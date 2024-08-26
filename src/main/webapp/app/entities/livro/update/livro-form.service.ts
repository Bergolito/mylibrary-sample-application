import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILivro, NewLivro } from '../livro.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILivro for edit and NewLivroFormGroupInput for create.
 */
type LivroFormGroupInput = ILivro | PartialWithRequiredKeyOf<NewLivro>;

type LivroFormDefaults = Pick<NewLivro, 'id' | 'usuarios'>;

type LivroFormGroupContent = {
  id: FormControl<ILivro['id'] | NewLivro['id']>;
  titulo: FormControl<ILivro['titulo']>;
  subtitulo: FormControl<ILivro['subtitulo']>;
  ano: FormControl<ILivro['ano']>;
  numPags: FormControl<ILivro['numPags']>;
  isbn: FormControl<ILivro['isbn']>;
  sinopse: FormControl<ILivro['sinopse']>;
  formato: FormControl<ILivro['formato']>;
  capa: FormControl<ILivro['capa']>;
  capaContentType: FormControl<ILivro['capaContentType']>;
  autor: FormControl<ILivro['autor']>;
  editora: FormControl<ILivro['editora']>;
  idioma: FormControl<ILivro['idioma']>;
  usuarios: FormControl<ILivro['usuarios']>;
};

export type LivroFormGroup = FormGroup<LivroFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LivroFormService {
  createLivroFormGroup(livro: LivroFormGroupInput = { id: null }): LivroFormGroup {
    const livroRawValue = {
      ...this.getFormDefaults(),
      ...livro,
    };
    return new FormGroup<LivroFormGroupContent>({
      id: new FormControl(
        { value: livroRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      titulo: new FormControl(livroRawValue.titulo),
      subtitulo: new FormControl(livroRawValue.subtitulo),
      ano: new FormControl(livroRawValue.ano),
      numPags: new FormControl(livroRawValue.numPags),
      isbn: new FormControl(livroRawValue.isbn),
      sinopse: new FormControl(livroRawValue.sinopse),
      formato: new FormControl(livroRawValue.formato),
      capa: new FormControl(livroRawValue.capa),
      capaContentType: new FormControl(livroRawValue.capaContentType),
      autor: new FormControl(livroRawValue.autor),
      editora: new FormControl(livroRawValue.editora),
      idioma: new FormControl(livroRawValue.idioma),
      usuarios: new FormControl(livroRawValue.usuarios ?? []),
    });
  }

  getLivro(form: LivroFormGroup): ILivro | NewLivro {
    return form.getRawValue() as ILivro | NewLivro;
  }

  resetForm(form: LivroFormGroup, livro: LivroFormGroupInput): void {
    const livroRawValue = { ...this.getFormDefaults(), ...livro };
    form.reset(
      {
        ...livroRawValue,
        id: { value: livroRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LivroFormDefaults {
    return {
      id: null,
      usuarios: [],
    };
  }
}
