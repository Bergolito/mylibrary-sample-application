import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IAutor } from '../autor.model';

@Component({
  standalone: true,
  selector: 'jhi-autor-detail',
  templateUrl: './autor-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AutorDetailComponent {
  autor = input<IAutor | null>(null);

  previousState(): void {
    window.history.back();
  }
}
