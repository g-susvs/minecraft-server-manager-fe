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

export interface IServer {
  id: string;
  name: string;
  difficulty: TDifficulty;
  worldOptions: IWorldOptions;
  status: TServerStatus;
  connectionAddress: string | null;
}

export interface INewServerDraft {
  name: string;
  difficulty: TDifficulty;
  worldOptions: IWorldOptions;
}

export type TServerAction = 'start' | 'stop';
