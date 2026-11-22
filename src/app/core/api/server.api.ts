import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { INewServerDraft, IServer, TServerAction } from '../models/server.model';

// Mock temporal: sustituir por HttpClient cuando el backend exponga /api/servers.
const INITIAL_SERVERS: IServer[] = [
  {
    id: '1',
    name: 'Survival con amigos',
    difficulty: 'normal',
    worldOptions: { showCoordinates: true, bonusChest: false, starterMap: true },
    status: 'running-ready',
    connectionAddress: '3.239.26.32:19132',
  },
  {
    id: '2',
    name: 'Mundo creativo',
    difficulty: 'pacifica',
    worldOptions: { showCoordinates: true, bonusChest: true, starterMap: false },
    status: 'stopped',
    connectionAddress: null,
  },
  {
    id: '3',
    name: 'Server de pruebas',
    difficulty: 'facil',
    worldOptions: { showCoordinates: false, bonusChest: false, starterMap: false },
    status: 'stopped',
    connectionAddress: null,
  },
  {
    id: '4',
    name: 'Servidor con error',
    difficulty: 'normal',
    worldOptions: { showCoordinates: false, bonusChest: false, starterMap: false },
    status: 'network-error',
    connectionAddress: null,
  },
];

// Dirección simulada que recibe el servidor al terminar de instalarse.
const MOCK_ADDRESS = '3.239.26.40:19132';

@Injectable({ providedIn: 'root' })
export class ServerApi {
  private readonly servers: IServer[] = INITIAL_SERVERS.map((s) => ({ ...s }));

  listServers(): Observable<IServer[]> {
    return of(this.servers.map((s) => ({ ...s }))).pipe(delay(400));
  }

  createServer(draft: INewServerDraft): Observable<IServer> {
    const name = draft.name.trim();
    const taken = this.servers.some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (taken) {
      return throwError(() => ({ code: 'NAME_IN_USE' })).pipe(delay(400));
    }

    const server: IServer = {
      id: String(Date.now()),
      name,
      difficulty: draft.difficulty,
      worldOptions: { ...draft.worldOptions },
      status: 'pending',
      connectionAddress: null,
    };
    this.servers.push(server);
    return of({ ...server }).pipe(delay(600));
  }

  // Devuelve el estado actual y después avanza la simulación al siguiente paso,
  // así cada consulta de polling ve una transición distinta.
  getServer(id: string): Observable<IServer> {
    const server = this.find(id);
    if (!server) {
      return throwError(() => ({ code: 'NOT_FOUND' })).pipe(delay(300));
    }

    const snapshot = { ...server };
    this.advance(server);
    return of(snapshot).pipe(delay(300));
  }

  sendAction(id: string, action: TServerAction): Observable<IServer> {
    const server = this.find(id);
    if (!server) {
      return throwError(() => ({ code: 'NOT_FOUND' })).pipe(delay(300));
    }

    const allowed =
      (action === 'start' && server.status === 'stopped') ||
      (action === 'stop' && server.status === 'running-ready');
    if (!allowed) {
      return throwError(() => ({ code: 'INVALID_STATE' })).pipe(delay(300));
    }

    server.status = action === 'start' ? 'pending' : 'stopping';
    if (action === 'stop') {
      server.connectionAddress = null;
    }
    return of({ ...server }).pipe(delay(300));
  }

  private find(id: string): IServer | undefined {
    return this.servers.find((s) => s.id === id);
  }

  private advance(server: IServer): void {
    switch (server.status) {
      case 'pending':
        server.status = 'installing';
        break;
      case 'installing':
        server.status = 'running-ready';
        server.connectionAddress = MOCK_ADDRESS;
        break;
      case 'stopping':
        server.status = 'stopped';
        break;
      case 'network-error':
        server.status = 'stopped';
        break;
    }
  }
}
