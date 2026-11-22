import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Server } from '../models/server.model';

// Mock temporal: sustituir por HttpClient cuando el backend exponga GET /api/servers.
const MOCK_SERVERS: Server[] = [
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
  listServers(): Observable<Server[]> {
    return of(MOCK_SERVERS).pipe(delay(400));
  }
}
