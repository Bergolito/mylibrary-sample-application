import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IIdioma, NewIdioma } from '../idioma.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IIdioma for edit and NewIdiomaFormGroupInput for create.
 */
type IdiomaFormGroupInput = IIdioma | PartialWithRequiredKeyOf<NewIdioma>;

type IdiomaFormDefaults = Pick<NewIdioma, 'id'>;

type IdiomaFormGroupContent = {
  id: FormControl<IIdioma['id'] | NewIdioma['id']>;
  nome: FormControl<IIdioma['nome']>;
  descricao: FormControl<IIdioma['descricao']>;
};

export type IdiomaFormGroup = FormGroup<IdiomaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IdiomaFormService {
  createIdiomaFormGroup(idioma: IdiomaFormGroupInput = { id: null }): IdiomaFormGroup {
    const idiomaRawValue = {
      ...this.getFormDefaults(),
      ...idioma,
    };
    return new FormGroup<IdiomaFormGroupContent>({
      id: new FormControl(
        { value: idiomaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(idiomaRawValue.nome),
      descricao: new FormControl(idiomaRawValue.descricao),
    });
  }

  getIdioma(form: IdiomaFormGroup): IIdioma | NewIdioma {
    return form.getRawValue() as IIdioma | NewIdioma;
  }

  resetForm(form: IdiomaFormGroup, idioma: IdiomaFormGroupInput): void {
    const idiomaRawValue = { ...this.getFormDefaults(), ...idioma };
    form.reset(
      {
        ...idiomaRawValue,
        id: { value: idiomaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): IdiomaFormDefaults {
    return {
      id: null,
    };
  }
}
