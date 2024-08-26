import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEditora, NewEditora } from '../editora.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEditora for edit and NewEditoraFormGroupInput for create.
 */
type EditoraFormGroupInput = IEditora | PartialWithRequiredKeyOf<NewEditora>;

type EditoraFormDefaults = Pick<NewEditora, 'id'>;

type EditoraFormGroupContent = {
  id: FormControl<IEditora['id'] | NewEditora['id']>;
  nome: FormControl<IEditora['nome']>;
};

export type EditoraFormGroup = FormGroup<EditoraFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EditoraFormService {
  createEditoraFormGroup(editora: EditoraFormGroupInput = { id: null }): EditoraFormGroup {
    const editoraRawValue = {
      ...this.getFormDefaults(),
      ...editora,
    };
    return new FormGroup<EditoraFormGroupContent>({
      id: new FormControl(
        { value: editoraRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(editoraRawValue.nome),
    });
  }

  getEditora(form: EditoraFormGroup): IEditora | NewEditora {
    return form.getRawValue() as IEditora | NewEditora;
  }

  resetForm(form: EditoraFormGroup, editora: EditoraFormGroupInput): void {
    const editoraRawValue = { ...this.getFormDefaults(), ...editora };
    form.reset(
      {
        ...editoraRawValue,
        id: { value: editoraRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EditoraFormDefaults {
    return {
      id: null,
    };
  }
}
