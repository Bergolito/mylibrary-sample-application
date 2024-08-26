import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAutor } from 'app/entities/autor/autor.model';
import { AutorService } from 'app/entities/autor/service/autor.service';
import { IEditora } from 'app/entities/editora/editora.model';
import { EditoraService } from 'app/entities/editora/service/editora.service';
import { IIdioma } from 'app/entities/idioma/idioma.model';
import { IdiomaService } from 'app/entities/idioma/service/idioma.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { FormatoLivro } from 'app/entities/enumerations/formato-livro.model';
import { LivroService } from '../service/livro.service';
import { ILivro } from '../livro.model';
import { LivroFormService, LivroFormGroup } from './livro-form.service';

@Component({
  standalone: true,
  selector: 'jhi-livro-update',
  templateUrl: './livro-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class LivroUpdateComponent implements OnInit {
  isSaving = false;
  livro: ILivro | null = null;
  formatoLivroValues = Object.keys(FormatoLivro);

  autorsSharedCollection: IAutor[] = [];
  editorasSharedCollection: IEditora[] = [];
  idiomasSharedCollection: IIdioma[] = [];
  usuariosSharedCollection: IUsuario[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected livroService = inject(LivroService);
  protected livroFormService = inject(LivroFormService);
  protected autorService = inject(AutorService);
  protected editoraService = inject(EditoraService);
  protected idiomaService = inject(IdiomaService);
  protected usuarioService = inject(UsuarioService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: LivroFormGroup = this.livroFormService.createLivroFormGroup();

  compareAutor = (o1: IAutor | null, o2: IAutor | null): boolean => this.autorService.compareAutor(o1, o2);

  compareEditora = (o1: IEditora | null, o2: IEditora | null): boolean => this.editoraService.compareEditora(o1, o2);

  compareIdioma = (o1: IIdioma | null, o2: IIdioma | null): boolean => this.idiomaService.compareIdioma(o1, o2);

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ livro }) => {
      this.livro = livro;
      if (livro) {
        this.updateForm(livro);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('mylibraryApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const livro = this.livroFormService.getLivro(this.editForm);
    if (livro.id !== null) {
      this.subscribeToSaveResponse(this.livroService.update(livro));
    } else {
      this.subscribeToSaveResponse(this.livroService.create(livro));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILivro>>): void {
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

  protected updateForm(livro: ILivro): void {
    this.livro = livro;
    this.livroFormService.resetForm(this.editForm, livro);

    this.autorsSharedCollection = this.autorService.addAutorToCollectionIfMissing<IAutor>(this.autorsSharedCollection, livro.autor);
    this.editorasSharedCollection = this.editoraService.addEditoraToCollectionIfMissing<IEditora>(
      this.editorasSharedCollection,
      livro.editora,
    );
    this.idiomasSharedCollection = this.idiomaService.addIdiomaToCollectionIfMissing<IIdioma>(this.idiomasSharedCollection, livro.idioma);
    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      ...(livro.usuarios ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.autorService
      .query()
      .pipe(map((res: HttpResponse<IAutor[]>) => res.body ?? []))
      .pipe(map((autors: IAutor[]) => this.autorService.addAutorToCollectionIfMissing<IAutor>(autors, this.livro?.autor)))
      .subscribe((autors: IAutor[]) => (this.autorsSharedCollection = autors));

    this.editoraService
      .query()
      .pipe(map((res: HttpResponse<IEditora[]>) => res.body ?? []))
      .pipe(map((editoras: IEditora[]) => this.editoraService.addEditoraToCollectionIfMissing<IEditora>(editoras, this.livro?.editora)))
      .subscribe((editoras: IEditora[]) => (this.editorasSharedCollection = editoras));

    this.idiomaService
      .query()
      .pipe(map((res: HttpResponse<IIdioma[]>) => res.body ?? []))
      .pipe(map((idiomas: IIdioma[]) => this.idiomaService.addIdiomaToCollectionIfMissing<IIdioma>(idiomas, this.livro?.idioma)))
      .subscribe((idiomas: IIdioma[]) => (this.idiomasSharedCollection = idiomas));

    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) =>
          this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, ...(this.livro?.usuarios ?? [])),
        ),
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
