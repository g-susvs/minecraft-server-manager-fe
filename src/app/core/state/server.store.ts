import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';

import { ServerApi } from '../api/server.api';
import { INewServerDraft, IServer } from '../models/server.model';

@Injectable({ providedIn: 'root' })
export class ServerStore {
  private readonly api = inject(ServerApi);

  readonly servers = signal<IServer[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly saving = signal(false);

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
}
