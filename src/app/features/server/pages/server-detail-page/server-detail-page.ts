import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  TDifficulty,
  TServerAction,
  TServerStatus,
} from '../../../../core/models/server.model';
import { ServerStore } from '../../../../core/state/server.store';
import { CostSignal, CostSignalState } from '../../../../shared/ui/cost-signal/cost-signal';
import { InfoCard, InfoRow } from '../../../../shared/ui/info-card/info-card';
import { IpDisplay, IpDisplayState } from '../../../../shared/ui/ip-display/ip-display';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';

// Textos de la vista de detalle según el diseño de Pen (no coinciden con el badge de la lista).
const BADGE_LABELS: Record<TServerStatus, string> = {
  stopped: 'Apagado',
  pending: 'Encendiendo…',
  starting: 'Encendiendo…',
  installing: 'Instalando Minecraft…',
  'running-ready': 'Encendido',
  stopping: 'Apagando…',
  'network-error': 'Desconocido',
};

// Qué muestra el bloque de IP en cada estado.
const IP_STATES: Record<TServerStatus, IpDisplayState> = {
  stopped: 'placeholder',
  pending: 'loading',
  starting: 'loading',
  installing: 'waiting',
  'running-ready': 'ready',
  stopping: 'fading',
  'network-error': 'unavailable',
};

// Estados transitorios con barra de progreso y su texto.
const PROGRESS_BY_STATUS: Partial<Record<TServerStatus, { label: string; width: string }>> = {
  pending: { label: 'Iniciando máquina…', width: 'w-1/4' },
  starting: { label: 'Iniciando máquina…', width: 'w-1/4' },
  installing: { label: 'Descargando e instalando…', width: 'w-1/2' },
  stopping: { label: 'Guardando mundo y apagando…', width: 'w-3/4' },
};

// Estados en los que el botón principal apaga el servidor (o lo estaría apagando).
const STOP_ACTION_STATUSES: TServerStatus[] = ['running-ready', 'pending', 'starting', 'installing'];

const DIFFICULTY_LABELS: Record<TDifficulty, string> = {
  pacifica: 'Pacífica',
  facil: 'Fácil',
  normal: 'Normal',
  dificil: 'Difícil',
};

function costStateFor(status: TServerStatus): CostSignalState | undefined {
  switch (status) {
    case 'stopped':
      return 'off';
    case 'running-ready':
      return 'on';
    case 'stopping':
      return 'turning-off';
    default:
      return undefined;
  }
}

@Component({
  selector: 'app-server-detail-page',
  imports: [RouterLink, StatusBadge, IpDisplay, CostSignal, InfoCard],
  templateUrl: './server-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerDetailPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  readonly store = inject(ServerStore);

  readonly badgeLabels = BADGE_LABELS;

  // Filas de la tarjeta de información, derivadas del servidor cargado.
  readonly infoRows = computed<InfoRow[]>(() => {
    const server = this.store.selected();
    if (!server) return [];
    return [
      { label: 'Dificultad', value: DIFFICULTY_LABELS[server.difficulty] },
      { label: 'ID', value: server.id },
    ];
  });

  private serverId = '';

  ngOnInit(): void {
    this.serverId = this.route.snapshot.paramMap.get('id') ?? '';
    this.store.loadById(this.serverId);
  }

  ngOnDestroy(): void {
    this.store.stopPolling();
  }

  retry(): void {
    this.store.loadById(this.serverId);
  }

  toggle(status: TServerStatus): void {
    const action: TServerAction = status === 'running-ready' ? 'stop' : 'start';
    this.store.executeAction(this.serverId, action);
  }

  ipStateFor(status: TServerStatus): IpDisplayState {
    return IP_STATES[status];
  }

  progressFor(status: TServerStatus): { label: string; width: string } | undefined {
    return PROGRESS_BY_STATUS[status];
  }

  costStateFor(status: TServerStatus): CostSignalState | undefined {
    return costStateFor(status);
  }

  // El botón solo funciona en estados terminales en los que tiene sentido actuar.
  canAct(status: TServerStatus): boolean {
    return (status === 'stopped' || status === 'running-ready') && this.store.actingAction() === null;
  }

  isStopAction(status: TServerStatus): boolean {
    return STOP_ACTION_STATUSES.includes(status);
  }

  actionLabel(status: TServerStatus): string {
    return this.isStopAction(status) ? 'Apagar servidor' : 'Encender servidor';
  }

  actionClass(status: TServerStatus): string {
    if (!this.canAct(status)) {
      return 'bg-[#243044] text-[#94A3B8] cursor-not-allowed';
    }
    return this.isStopAction(status)
      ? 'bg-[#DC2626] text-white hover:bg-[#EF4444]'
      : 'bg-[#4AA63D] text-white hover:bg-[#55B847]';
  }

  copyAddress(address: string | null): void {
    if (!address) return;
    void navigator.clipboard?.writeText(address).catch(() => undefined);
  }
}
