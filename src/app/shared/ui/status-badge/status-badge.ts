// status-badge: componente DUMB standalone con OnPush.
// - `input()` crea un signal de solo-lectura: el padre pasa `status` y el
//   template lo lee como `status()`; sin setters ni ngOnChanges.
// - `ChangeDetectionStrategy.OnPush`: solo se re-renderiza cuando cambia el
//   signal de entrada, ideal para UI presentacional.
// - `standalone: true`: se importa directo, sin NgModule.
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ServerStatus =
  | 'stopped'
  | 'pending'
  | 'installing'
  | 'running-ready'
  | 'stopping'
  | 'starting'
  | 'network-error';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadge {
  readonly status = input.required<ServerStatus>();

  // Solo mapeo presentacional estado -> estilos/texto (cero lógica de negocio).
  readonly pillClass = computed(() => {
    switch (this.status()) {
      case 'running-ready':
        return 'bg-[#4AA63D]/15 text-[#55B847] border-[#4AA63D]/40';
      case 'pending':
      case 'installing':
      case 'stopping':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'network-error':
        return 'bg-[#DC2626]/10 text-[#F87171] border-[#DC2626]/40';
      default:
        return 'bg-[#2D3F56]/40 text-[#94A3B8] border-[#2D3F56]';
    }
  });

  readonly dotClass = computed(() => {
    switch (this.status()) {
      case 'running-ready':
        return 'bg-[#55B847]';
      case 'pending':
      case 'installing':
      case 'stopping':
        return 'bg-amber-400 animate-pulse';
      case 'network-error':
        return 'bg-[#DC2626]';
      default:
        return 'bg-[#64748B]';
    }
  });

  readonly label = computed(() => {
    switch (this.status()) {
      case 'running-ready':
        return 'En línea';
      case 'pending':
        return 'Pendiente';
      case 'installing':
        return 'Instalando';
      case 'stopping':
        return 'Deteniendo';
      case 'network-error':
        return 'Error de red';
      case 'starting':
        return 'Iniciando';
      default:
        return 'Detenido';
    }
  });
}
