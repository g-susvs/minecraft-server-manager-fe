import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

import { IApiResponse, IServerDto, TServerStatusDto } from '../models/server.dto';
import { INewServerDraft, IServer, TServerAction } from '../models/server.model';
import { toCreateDto, toServer } from '../mappers/server.mapper';
import { environment } from '../../../environments/environment';
import { toApiError } from './api.error';

// URL base del backend, según el entorno (environment.ts o environment.prod.ts).
const SERVER_PATH = `${environment.apiUrl}/server`;

function fail<T>(error: unknown): Observable<T> {
  return throwError(() => toApiError(error));
}

@Injectable({ providedIn: 'root' })
export class ServerApi {
  private readonly http = inject(HttpClient);

  listServers(): Observable<IServer[]> {
    return this.http.get<IApiResponse<IServerDto[]>>(SERVER_PATH).pipe(
      map((res) => res.data.map(toServer)),
      catchError((error: unknown) => fail<IServer[]>(error)),
    );
  }

  createServer(draft: INewServerDraft): Observable<IServer> {
    return this.http.post<IApiResponse<IServerDto>>(SERVER_PATH, toCreateDto(draft)).pipe(
      map((res) => toServer(res.data)),
      catchError((error: unknown) => fail<IServer>(error)),
    );
  }

  getServer(id: string): Observable<IServer> {
    return this.http.get<IApiResponse<IServerDto>>(`${SERVER_PATH}/${id}`).pipe(
      map((res) => toServer(res.data)),
      catchError((error: unknown) => fail<IServer>(error)),
    );
  }

  // El backend solo confirma la acción; el estado real se consulta después con getServer.
  sendAction(id: string, action: TServerAction): Observable<TServerStatusDto> {
    return this.http
      .post<IApiResponse<{ instanceId: string; status: TServerStatusDto }>>(
        `${SERVER_PATH}/${id}/${action}`,
        {},
      )
      .pipe(
        map((res) => res.data.status),
        catchError((error: unknown) => fail<TServerStatusDto>(error)),
      );
  }
}
