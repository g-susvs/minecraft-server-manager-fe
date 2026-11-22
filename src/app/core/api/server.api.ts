import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import { INewServerDraft, IServer } from '../models/server.model';

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
];

@Injectable({ providedIn: 'root' })
export class ServerApi {
  private readonly servers: IServer[] = [...INITIAL_SERVERS];

  listServers(): Observable<IServer[]> {
    return of([...this.servers]).pipe(delay(400));
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
    return of(server).pipe(delay(600));
  }
}
