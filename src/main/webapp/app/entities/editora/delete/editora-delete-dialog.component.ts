import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEditora } from '../editora.model';
import { EditoraService } from '../service/editora.service';

@Component({
  standalone: true,
  templateUrl: './editora-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EditoraDeleteDialogComponent {
  editora?: IEditora;

  protected editoraService = inject(EditoraService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.editoraService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
