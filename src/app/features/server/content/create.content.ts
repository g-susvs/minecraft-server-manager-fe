import { IWorldOptions, TDifficulty } from '../../../core/models/server.model';

// Etiquetas de dificultad. Se reutilizan en la vista de detalle.
export const DIFFICULTY_LABELS: Record<TDifficulty, string> = {
  pacifica: 'Pacífica',
  facil: 'Fácil',
  normal: 'Normal',
  dificil: 'Difícil',
};

export interface IWorldToggle {
  key: keyof IWorldOptions;
  label: string;
  hint: string;
}

const DIFFICULTY_OPTIONS: { value: TDifficulty; label: string }[] = (
  Object.keys(DIFFICULTY_LABELS) as TDifficulty[]
).map((value) => ({ value, label: DIFFICULTY_LABELS[value] }));

const WORLD_TOGGLES: IWorldToggle[] = [
  { key: 'showCoordinates', label: 'Mostrar coordenadas', hint: 'Muestra tu posición X, Y, Z en el juego' },
  { key: 'bonusChest', label: 'Cofre de regalo', hint: 'Incluye un cofre con objetos al empezar' },
  { key: 'starterMap', label: 'Mapa inicial', hint: 'Te entrega un mapa del mundo al empezar' },
];

const NAME_HELPER = 'Solo letras, números, espacios, guiones y guiones bajos';

// Textos visibles de la página de crear servidor.
export const CREATE_CONTENT = {
  backLabel: 'Volver a la lista',
  title: 'Nuevo servidor',
  nameLabel: 'Nombre del servidor',
  namePlaceholder: 'Ej: Survival con amigos',
  nameHelper: NAME_HELPER,
  nameErrors: {
    required: 'Escribe un nombre para el servidor',
    minLength: 'Mínimo 3 caracteres',
    pattern: NAME_HELPER,
    taken: 'Ya existe un servidor con ese nombre',
  },
  difficultyTitle: 'Dificultad',
  difficulties: DIFFICULTY_OPTIONS,
  worldOptionsTitle: 'Opciones del mundo',
  worldToggles: WORLD_TOGGLES,
  permanentTitle: 'Configuración permanente',
  permanentBody:
    'Ninguna de estas opciones se puede cambiar después de crear el servidor. Cambiar de opinión obliga a crear otro y perder el mundo.',
  creationInfo: 'La creación tarda varios minutos',
  submit: 'Crear servidor',
  submitting: 'Creando…',
  saveFailed: 'No pudimos crear el servidor. Intenta de nuevo.',
};
