export type TServerStatus =
  | 'stopped'
  | 'pending'
  | 'installing'
  | 'starting'
  | 'running-ready'
  | 'stopping'
  | 'network-error';

export type TDifficulty = 'pacifica' | 'facil' | 'normal' | 'dificil';

export interface IWorldOptions {
  showCoordinates: boolean;
  bonusChest: boolean;
  starterMap: boolean;
}

// Modelo de la interfaz. Se construye desde IServerDto con core/mappers/server.mapper.ts.
export interface IServer {
  id: string;
  name: string;
  status: TServerStatus;
  connectionAddress: string | null;
  difficulty: TDifficulty | null; // null cuando el backend todavía no devuelve la dificultad.
}

export interface INewServerDraft {
  name: string;
  difficulty: TDifficulty;
  worldOptions: IWorldOptions;
}

export type TServerAction = 'start' | 'stop';
