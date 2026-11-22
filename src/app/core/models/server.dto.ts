// Contrato HTTP del backend

export type TServerStatusDto =
  | 'pending'
  | 'running'
  | 'stopping'
  | 'stopped'
  | 'shutting-down'
  | 'terminated'
  | 'unknown';

export type TServerDifficultyDto = 'peaceful' | 'easy' | 'normal' | 'hard';

export interface IServerDto {
  instanceId: string;
  name: string;
  status: TServerStatusDto;
  publicIp: string | null;
}

export interface ICreateServerDto {
  name: string;
  difficulty: TServerDifficultyDto;
  showCoordinates: boolean;
  bonusChest: boolean;
  startingMap: boolean;
}

export interface IServerActionDto {
  instanceId: string;
  status: TServerStatusDto;
}

export interface IApiResponse<T> {
  message: string;
  success: true;
  data: T;
}

export interface IApiErrorBody {
  message: string;
  success: false;
  details?: unknown;
}
