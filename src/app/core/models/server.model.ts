export type ServerStatus =
  | 'stopped'
  | 'pending'
  | 'installing'
  | 'starting'
  | 'running-ready'
  | 'stopping'
  | 'network-error';

export type Difficulty = 'pacifica' | 'facil' | 'normal' | 'dificil';

export interface WorldOptions {
  showCoordinates: boolean;
  bonusChest: boolean;
  starterMap: boolean;
}

export interface Server {
  id: string;
  name: string;
  difficulty: Difficulty;
  worldOptions: WorldOptions;
  status: ServerStatus;
  connectionAddress: string | null;
}
