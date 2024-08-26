import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IIdioma } from '../idioma.model';
import { IdiomaService } from '../service/idioma.service';

@Component({
  standalone: true,
  templateUrl: './idioma-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class IdiomaDeleteDialogComponent {
  idioma?: IIdioma;

  protected idiomaService = inject(IdiomaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.idiomaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
