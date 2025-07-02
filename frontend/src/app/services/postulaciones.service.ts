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
} 