import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TServerAction, TServerStatus } from '../../../../core/models/server.model';
import { ServerStore } from '../../../../core/state/server.store';
import { CostSignal, CostSignalState } from '../../../../shared/ui/cost-signal/cost-signal';
import { InfoCard, InfoRow } from '../../../../shared/ui/info-card/info-card';
import { IpDisplay, IpDisplayState } from '../../../../shared/ui/ip-display/ip-display';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { DIFFICULTY_LABELS } from '../../content/create.content';
import { DETAIL_CONTENT } from '../../content/detail.content';

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

// Ancho de la barra de progreso en cada estado transitorio.
const PROGRESS_WIDTHS: Partial<Record<TServerStatus, string>> = {
  pending: 'w-1/4',
  starting: 'w-1/4',
  installing: 'w-1/2',
  stopping: 'w-3/4',
};

// Estados en los que el botón principal apaga el servidor (o lo estaría apagando).
const STOP_ACTION_STATUSES: TServerStatus[] = ['running-ready', 'pending', 'starting', 'installing'];

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
  readonly content = DETAIL_CONTENT;

  // Filas de la tarjeta de información, derivadas del servidor cargado.
  readonly infoRows = computed<InfoRow[]>(() => {
    const server = this.store.selected();
    if (!server) return [];
    return [
      { label: this.content.infoLabels.difficulty, value: DIFFICULTY_LABELS[server.difficulty] },
      { label: this.content.infoLabels.id, value: server.id },
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

  progressWidthFor(status: TServerStatus): string {
    return PROGRESS_WIDTHS[status] ?? '';
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
    return this.isStopAction(status) ? this.content.actionStop : this.content.actionStart;
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
