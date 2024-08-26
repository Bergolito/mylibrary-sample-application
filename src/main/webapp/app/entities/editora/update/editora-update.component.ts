import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEditora } from '../editora.model';
import { EditoraService } from '../service/editora.service';
import { EditoraFormService, EditoraFormGroup } from './editora-form.service';

@Component({
  standalone: true,
  selector: 'jhi-editora-update',
  templateUrl: './editora-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EditoraUpdateComponent implements OnInit {
  isSaving = false;
  editora: IEditora | null = null;

  protected editoraService = inject(EditoraService);
  protected editoraFormService = inject(EditoraFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EditoraFormGroup = this.editoraFormService.createEditoraFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ editora }) => {
      this.editora = editora;
      if (editora) {
        this.updateForm(editora);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const editora = this.editoraFormService.getEditora(this.editForm);
    if (editora.id !== null) {
      this.subscribeToSaveResponse(this.editoraService.update(editora));
    } else {
      this.subscribeToSaveResponse(this.editoraService.create(editora));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEditora>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(editora: IEditora): void {
    this.editora = editora;
    this.editoraFormService.resetForm(this.editForm, editora);
  }
}
