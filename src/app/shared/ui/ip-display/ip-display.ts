// ip-display: componente DUMB standalone con OnPush.
// - `input()` signals para datos (`address`, `state`): el componente solo
//   MUESTRA, nunca decide cuándo hay IP ni llama a servicios.
// - `output()` emite el evento `copied` al padre cuando se pulsa copiar;
//   el padre hará el portapapeles (el dumb no toca APIs del navegador).
// - Mobile-first 393px: layout en columna que se ensancha con `sm:`.
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type IpDisplayState = 'ready' | 'loading' | 'waiting' | 'fading' | 'unavailable' | 'placeholder';

@Component({
  selector: 'app-ip-display',
  standalone: true,
  templateUrl: './ip-display.html',
  styleUrl: './ip-display.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IpDisplay {
  readonly address = input<string | null>(null);
  readonly state = input<IpDisplayState>('placeholder');

  readonly copied = output<void>();

  readonly showSkeleton = computed(() => this.state() === 'loading' || this.state() === 'waiting');
  readonly isFading = computed(() => this.state() === 'fading');
  readonly canCopy = computed(() => this.state() === 'ready' && !!this.address());

  readonly hint = computed(() => {
    switch (this.state()) {
      case 'loading':
        return 'Obteniendo dirección…';
      case 'waiting':
        return 'Esperando al servidor…';
      case 'fading':
        return 'La dirección cambiará al reiniciar.';
      case 'unavailable':
        return 'Dirección no disponible.';
      default:
        return 'Tu dirección aparecerá aquí.';
    }
  });

  onCopy(): void {
    this.copied.emit();
  }

  // TODO(alumno): muestra un check "¡Copiado!" durante 2s tras emitir (solo UI local, sin servicios).
}
