import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IEditora } from '../editora.model';

@Component({
  standalone: true,
  selector: 'jhi-editora-detail',
  templateUrl: './editora-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EditoraDetailComponent {
  editora = input<IEditora | null>(null);

  previousState(): void {
    window.history.back();
  }
}
