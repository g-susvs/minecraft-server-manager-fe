import {
  INewServerDraft,
  IServer,
  TDifficulty,
  TServerStatus,
} from '../models/server.model';
import {
  ICreateServerDto,
  IServerDto,
  TServerDifficultyDto,
  TServerStatusDto,
} from '../models/server.dto';

// Puerto por defecto de Minecraft Bedrock.
const BEDROCK_PORT = 19132;

// Estados de EC2 traducidos a los estados de la interfaz.
const STATUS_FROM_DTO: Record<TServerStatusDto, TServerStatus> = {
  pending: 'pending',
  running: 'running-ready',
  stopping: 'stopping',
  'shutting-down': 'stopping',
  stopped: 'stopped',
  terminated: 'network-error',
  unknown: 'network-error',
};

const DIFFICULTY_TO_DTO: Record<TDifficulty, TServerDifficultyDto> = {
  pacifica: 'peaceful',
  facil: 'easy',
  normal: 'normal',
  dificil: 'hard',
};

export function toServerStatus(status: TServerStatusDto): TServerStatus {
  return STATUS_FROM_DTO[status];
}

export function toServer(dto: IServerDto): IServer {
  return {
    id: dto.instanceId,
    name: dto.name,
    status: toServerStatus(dto.status),
    connectionAddress: dto.publicIp ? `${dto.publicIp}:${BEDROCK_PORT}` : null,
    difficulty: null,
  };
}

export function toCreateDto(draft: INewServerDraft): ICreateServerDto {
  return {
    name: draft.name.trim(),
    difficulty: DIFFICULTY_TO_DTO[draft.difficulty],
    showCoordinates: draft.worldOptions.showCoordinates,
    bonusChest: draft.worldOptions.bonusChest,
    startingMap: draft.worldOptions.starterMap,
  };
}
