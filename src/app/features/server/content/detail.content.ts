import { TServerStatus } from '../../../core/models/server.model';

// Textos de la vista de detalle según el diseño de Pen (no coinciden con el badge de la lista).
const BADGE_LABELS: Record<TServerStatus, string> = {
  stopped: 'Apagado',
  pending: 'Encendiendo…',
  starting: 'Encendiendo…',
  installing: 'Instalando Minecraft…',
  'running-ready': 'Encendido',
  stopping: 'Apagando…',
  'network-error': 'Desconocido',
};

// Texto de la barra de progreso en cada estado transitorio.
const PROGRESS_LABELS: Partial<Record<TServerStatus, string>> = {
  pending: 'Iniciando máquina…',
  starting: 'Iniciando máquina…',
  installing: 'Descargando e instalando…',
  stopping: 'Guardando mundo y apagando…',
};

// Textos visibles de la vista de detalle.
export const DETAIL_CONTENT = {
  backLabel: 'Volver a la lista',
  fallbackTitle: 'Servidor',
  loadingLabel: 'Cargando servidor',
  retryButton: 'Reintentar',
  badgeLabels: BADGE_LABELS,
  progressLabels: PROGRESS_LABELS,
  readyTag: 'Listo para jugar',
  installingTitle: 'Instalando servidor de Minecraft',
  installingBody:
    'Es la primera vez que se enciende. La instalación tarda unos minutos. No intentes conectarte todavía.',
  networkErrorTitle: 'No se pudo conectar',
  networkErrorBody:
    'No pudimos obtener el estado del servidor. Revisa tu conexión a internet e intenta de nuevo.',
  actionStop: 'Apagar servidor',
  actionStart: 'Encender servidor',
  infoTitle: 'Información',
  infoLabels: {
    difficulty: 'Dificultad',
    id: 'ID',
  },
};
