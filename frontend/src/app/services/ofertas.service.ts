import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Oferta {
  id: number;
  titulo: string;
  descripcion?: string;
  requisitos?: string;
  ubicacion?: string;
  tipo_contrato?: string;
  fecha_publicacion: string;
  estado: string;
  empresa_id: number;
  empresa_nombre?: string;
  num_postulaciones?: number;
  postulaciones?: {
    total: number;
    enviada: number;
    en_revision: number;
    entrevista: number;
    aceptada: number;
    rechazada: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OfertasService {
  private apiUrl = 'https://juzamabackend.ticocr.org';

  constructor(private http: HttpClient) { }

  getOfertas(postulanteId?: number): Observable<Oferta[]> {
    let url = `${this.apiUrl}/ofertas/obtener_ofertas/`;
    if (postulanteId) {
      url += `?postulante_id=${postulanteId}`;
    }
    return this.http.get<Oferta[]>(url);
  }

  getOferta(id: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${this.apiUrl}/ofertas/${id}/`);
  }

  crearOferta(data: any): Observable<Oferta> {
    return this.http.post<Oferta>(`${this.apiUrl}/ofertas/crear_oferta/`, data);
  }

  // Obtener ofertas de una empresa específica
  getOfertasEmpresa(empresaId: number): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${this.apiUrl}/ofertas/obtener_ofertas_empresa/${empresaId}/`);
  }

  // Obtener ofertas de una empresa con filtros avanzados
  getOfertasEmpresaConFiltros(empresaId: number, estado?: string): Observable<Oferta[]> {
    let url = `${this.apiUrl}/ofertas/obtener_ofertas_empresa_filtros/?empresa_id=${empresaId}`;
    if (estado) {
      url += `&estado=${estado}`;
    }
    return this.http.get<Oferta[]>(url);
  }
} 