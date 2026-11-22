import { HttpErrorResponse } from "@angular/common/http";
import { IApiError } from "../models/api-error.model";
import { IApiErrorBody } from "../models/server.dto";

// Traduce cualquier error HTTP a IApiError para que la UI no dependa de HttpClient.
export function toApiError(error: unknown): IApiError {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as Partial<IApiErrorBody> | null;

    if (error.status === 0) {
      return { code: 'NETWORK', status: 0, message: 'No hay conexión con el servidor.' };
    }
    if (error.status === 404) {
      return { code: 'NOT_FOUND', status: 404, message: 'No encontramos este servidor.' };
    }
    if (error.status === 400) {
      return {
        code: 'VALIDATION',
        status: 400,
        message: body?.message ?? 'Revisa los datos e intenta de nuevo.',
      };
    }
    return {
      code: 'SERVER',
      status: error.status,
      message: body?.message ?? 'Ocurrió un error en el servidor.',
    };
  }

  return { code: 'SERVER', status: 500, message: 'Ocurrió un error inesperado.' };
}
