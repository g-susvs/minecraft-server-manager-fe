import { Injectable, inject, signal } from '@angular/core';
import { Observable, Subscription, finalize, switchMap, take, tap, timer } from 'rxjs';

import { ServerApi } from '../api/server.api';
import { INewServerDraft, IServer, TServerAction, TServerStatus } from '../models/server.model';

// Intervalo y límite del polling de estado en la vista de detalle.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 10;

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
      error: () => {
        this.error.set('No pudimos cargar tus servidores.');
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
      error: (err: { code?: string }) => {
        this.selectedError.set(
          err.code === 'NOT_FOUND'
            ? 'No encontramos este servidor.'
            : 'No pudimos obtener el estado del servidor.',
        );
        this.selectedLoading.set(false);
      },
    });
  }

  executeAction(id: string, action: TServerAction): void {
    if (this.actingAction()) return;

    this.actingAction.set(action);
    this.actionError.set(null);

    this.api.sendAction(id, action).subscribe({
      next: (server) => {
        this.applySelected(server);
        this.actingAction.set(null);
        this.poll(id);
      },
      error: () => {
        this.actionError.set('No se pudo completar la acción. Intenta de nuevo.');
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

  private applySelected(server: IServer): void {
    this.selected.set(server);
    this.servers.update((list) => list.map((s) => (s.id === server.id ? server : s)));
  }
}
