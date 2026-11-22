import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subscription, finalize, switchMap, take, tap, timer } from 'rxjs';

import { ServerApi } from '../api/server.api';
import { toServerStatus } from '../mappers/server.mapper';
import { IApiError } from '../models/api-error.model';
import { INewServerDraft, IServer, TServerAction, TServerStatus } from '../models/server.model';

// EC2 tarda minutos en arrancar e instalar Minecraft, así que el polling
// dura unos 2 minutos (40 consultas de 3 s).
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 40;

// Estados que cambian solos y necesitan polling hasta llegar a uno terminal.
const TRANSITIONAL_STATUSES: TServerStatus[] = ['pending', 'installing', 'starting', 'stopping'];

export function isTransitional(status: TServerStatus): boolean {
  return TRANSITIONAL_STATUSES.includes(status);
}

@Injectable({ providedIn: 'root' })
export class ServerStore {
  private readonly api = inject(ServerApi);
  private pollSubscription: Subscription | null = null;

  readonly servers = signal<IServer[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly saving = signal(false);

  readonly selected = signal<IServer | null>(null);
  readonly selectedLoading = signal(false);
  readonly selectedError = signal<string | null>(null);
  readonly actingAction = signal<TServerAction | null>(null);
  readonly actionError = signal<string | null>(null);

  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.listServers().subscribe({
      next: (servers) => {
        this.servers.set(servers);
        this.loading.set(false);
      },
      error: (err: IApiError) => {
        this.error.set(
          err.code === 'NETWORK'
            ? 'No hay conexión con el servidor. Revisa que el backend esté activo.'
            : 'No pudimos cargar tus servidores.',
        );
        this.loading.set(false);
      },
    });
  }

  create(draft: INewServerDraft): Observable<IServer> {
    this.saving.set(true);
    return this.api.createServer(draft).pipe(
      tap((server) => this.servers.update((list) => [...list, server])),
      finalize(() => this.saving.set(false)),
    );
  }

  loadById(id: string): void {
    this.stopPolling();
    this.selected.set(null);
    this.selectedError.set(null);
    this.selectedLoading.set(true);
    this.actionError.set(null);

    this.api.getServer(id).subscribe({
      next: (server) => {
        this.applySelected(server);
        this.selectedLoading.set(false);
        if (isTransitional(server.status)) {
          this.poll(id);
        }
      },
      error: (err: IApiError) => {
        this.selectedError.set(this.detailErrorMessage(err));
        this.selectedLoading.set(false);
      },
    });
  }

  executeAction(id: string, action: TServerAction): void {
    if (this.actingAction()) return;

    this.actingAction.set(action);
    this.actionError.set(null);

    this.api.sendAction(id, action).subscribe({
      next: (statusDto) => {
        // Se aplica el estado que confirma el backend y después se sigue el progreso.
        this.patchSelectedStatus(toServerStatus(statusDto));
        this.actingAction.set(null);
        if (isTransitional(toServerStatus(statusDto))) {
          this.poll(id);
        }
      },
      error: (err: IApiError) => {
        this.actionError.set(err.message);
        this.actingAction.set(null);
      },
    });
  }

  stopPolling(): void {
    this.pollSubscription?.unsubscribe();
    this.pollSubscription = null;
  }

  private poll(id: string): void {
    this.stopPolling();
    this.pollSubscription = timer(POLL_INTERVAL_MS, POLL_INTERVAL_MS)
      .pipe(
        take(MAX_POLL_ATTEMPTS),
        switchMap(() => this.api.getServer(id)),
      )
      .subscribe({
        next: (server) => {
          this.applySelected(server);
          if (!isTransitional(server.status)) {
            this.stopPolling();
          }
        },
        error: () => this.stopPolling(),
      });
  }

  // Mensaje para la tarjeta de error de la vista de detalle.
  private detailErrorMessage(err: IApiError): string {
    switch (err.code) {
      case 'NOT_FOUND':
      case 'VALIDATION':
        return 'No encontramos este servidor.';
      case 'NETWORK':
        return 'No hay conexión con el servidor. Revisa que el backend esté activo.';
      default:
        return 'No pudimos obtener el estado del servidor.';
    }
  }

  private applySelected(server: IServer): void {
    this.selected.set(server);
    this.servers.update((list) => list.map((s) => (s.id === server.id ? server : s)));
  }

  private patchSelectedStatus(status: TServerStatus): void {
    const current = this.selected();
    if (!current) return;
    this.applySelected({ ...current, status });
  }
}
