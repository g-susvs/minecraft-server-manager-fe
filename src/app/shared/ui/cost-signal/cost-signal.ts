// cost-signal: banner DUMB standalone con OnPush.
// - Un solo `input()` signal (`state`) gobierna todo el render; el mapeo
//   estado -> colores/texto vive en `computed()` presentacionales.
// - OnPush + signals: el banner se actualiza solo cuando el padre cambia
//   `state`, sin suscripciones ni efectos.
// - Dumb puro: no sabe qué es "costo", solo pinta el mensaje que le toca.
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CostSignalState = 'off' | 'on' | 'turning-off';

@Component({
  selector: 'app-cost-signal',
  standalone: true,
  templateUrl: './cost-signal.html',
  styleUrl: './cost-signal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostSignal {
  readonly state = input<CostSignalState>('off');

  readonly bannerClass = computed(() => {
    switch (this.state()) {
      case 'on':
        return 'border-[#DC2626]/40 bg-[#DC2626]/10';
      case 'turning-off':
        return 'border-amber-500/30 bg-amber-500/10';
      default:
        return 'border-[#4AA63D]/30 bg-[#4AA63D]/10';
    }
  });

  readonly title = computed(() => {
    switch (this.state()) {
      case 'on':
        return 'Encendido';
      case 'turning-off':
        return 'Apagando…';
      default:
        return 'Apagado';
    }
  });

  readonly message = computed(() => {
    switch (this.state()) {
      case 'on':
        return 'El servidor está encendido y genera costo.';
      case 'turning-off':
        return 'Dejará de generar costo en unos instantes.';
      default:
        return 'No generas costo mientras está apagado.';
    }
  });

  readonly dotClass = computed(() =>
    this.state() === 'on'
      ? 'bg-[#DC2626]'
      : this.state() === 'turning-off'
        ? 'bg-amber-400 animate-pulse'
        : 'bg-[#55B847]',
  );

  // TODO(alumno): añade el icono SVG distinto por estado (check / rayo / reloj) con @switch en el template.
}
