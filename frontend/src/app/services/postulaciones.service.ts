import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Postulacion {
  id: number;
  oferta_id: number;
  oferta_titulo?: string;
  postulante_id: number;
  postulante_nombre?: string;
  fecha_postulacion: string;
  estado: string;
  mensaje?: string;
  archivo_adjunto?: string;
  expandido?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PostulacionesService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  crearPostulacion(data: any): Observable<Postulacion> {
    if (data instanceof FormData) {
      return this.http.post<Postulacion>(`${this.apiUrl}/postulaciones/crear_postulacion/`, data);
    } else {
      return this.http.post<Postulacion>(`${this.apiUrl}/postulaciones/crear_postulacion/`, data);
    }
  }

  obtenerPostulacionesPostulante(postulanteId: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.apiUrl}/postulaciones/obtener_postulaciones_postulante/${postulanteId}/`);
  }

  obtenerPostulacionesOferta(ofertaId: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.apiUrl}/postulaciones/obtener_postulaciones_oferta/${ofertaId}/`);
  }

  obtenerPostulantesEmpresa(empresaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/postulaciones/obtener_postulantes_empresa/${empresaId}/`);
  }

  // Buscar candidatos por habilidades
  buscarCandidatos(habilidades: string, experiencia: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/buscar_candidatos/`, {
      params: { habilidades, experiencia }
    });
  }

  // Actualizar estado de postulación
  actualizarEstadoPostulacion(postulacionId: number, estado: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/postulaciones/actualizar_estado_postulacion/${postulacionId}/`, {
      estado: estado
    });
  }
} 