import { Injectable, inject, signal } from '@angular/core';

import { ServerApi } from '../api/server.api';
import { Server } from '../models/server.model';

@Injectable({ providedIn: 'root' })
export class ServerStore {
  private readonly api = inject(ServerApi);

  readonly servers = signal<Server[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

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
}
