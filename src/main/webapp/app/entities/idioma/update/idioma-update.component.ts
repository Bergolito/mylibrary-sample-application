import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IIdioma } from '../idioma.model';
import { IdiomaService } from '../service/idioma.service';
import { IdiomaFormService, IdiomaFormGroup } from './idioma-form.service';

@Component({
  standalone: true,
  selector: 'jhi-idioma-update',
  templateUrl: './idioma-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class IdiomaUpdateComponent implements OnInit {
  isSaving = false;
  idioma: IIdioma | null = null;

  protected idiomaService = inject(IdiomaService);
  protected idiomaFormService = inject(IdiomaFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: IdiomaFormGroup = this.idiomaFormService.createIdiomaFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ idioma }) => {
      this.idioma = idioma;
      if (idioma) {
        this.updateForm(idioma);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const idioma = this.idiomaFormService.getIdioma(this.editForm);
    if (idioma.id !== null) {
      this.subscribeToSaveResponse(this.idiomaService.update(idioma));
    } else {
      this.subscribeToSaveResponse(this.idiomaService.create(idioma));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIdioma>>): void {
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

  protected updateForm(idioma: IIdioma): void {
    this.idioma = idioma;
    this.idiomaFormService.resetForm(this.editForm, idioma);
  }
}
