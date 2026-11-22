// info-card: tarjeta genérica DUMB standalone con OnPush.
// - `input()` signals tipados (`title: string`, `rows: InfoRow[]`): la tarjeta
//   no sabe qué muestra, el padre le pasa título + filas y ella itera con `@for`.
// - `@for (row of rows(); track row.label)`: `track` evita re-renderizar filas
//   que no cambiaron — clave en listas con OnPush.
// - Reutilizable: sirve para INFORMACIÓN del servidor o cualquier clave/valor.
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface InfoRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-info-card',
  standalone: true,
  templateUrl: './info-card.html',
  styleUrl: './info-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCard {
  readonly title = input<string>('Información');
  readonly rows = input<InfoRow[]>([]);
  emptyText = input<string>('Sin datos');

  // TODO(alumno): añade un input opcional `emptyText = input('Sin datos')` y muéstralo cuando rows() esté vacío.
}
