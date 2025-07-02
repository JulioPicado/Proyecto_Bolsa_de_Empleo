import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Candidato {
  id: number;
  usuario_id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  experiencia_laboral?: string;
  educacion?: string;
  habilidades?: string;
  curriculum?: string;
  fecha_registro: string;
}

export interface BusquedaCandidatosResponse {
  candidatos: Candidato[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  buscarCandidatos(filtros?: {
    nombre?: string;
    habilidades?: string;
    experiencia?: string;
  }): Observable<BusquedaCandidatosResponse> {
    let url = `${this.apiUrl}/usuarios/buscar_candidatos/`;
    
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.nombre) params.append('nombre', filtros.nombre);
      if (filtros.habilidades) params.append('habilidades', filtros.habilidades);
      if (filtros.experiencia) params.append('experiencia', filtros.experiencia);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return this.http.get<BusquedaCandidatosResponse>(url);
  }

  obtenerPostulantesEmpresa(empresaId: number): Observable<BusquedaCandidatosResponse> {
    const url = `${this.apiUrl}/postulaciones/obtener_postulantes_empresa/${empresaId}/`;
    return this.http.get<BusquedaCandidatosResponse>(url);
  }

  buscarPostulantesEmpresa(empresaId: number, filtros?: {
    nombre?: string;
    habilidades?: string;
    experiencia?: string;
  }): Observable<BusquedaCandidatosResponse> {
    let url = `${this.apiUrl}/postulaciones/obtener_postulantes_empresa/${empresaId}/`;
    if (filtros) {
      const params = new URLSearchParams();
      if (filtros.nombre) params.append('nombre', filtros.nombre);
      if (filtros.habilidades) params.append('habilidades', filtros.habilidades);
      if (filtros.experiencia) params.append('experiencia', filtros.experiencia);
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    return this.http.get<BusquedaCandidatosResponse>(url);
  }
} 