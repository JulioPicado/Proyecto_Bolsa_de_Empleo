import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificacionesService } from './services/notificaciones.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000'; // Cambia esto si tu backend usa otro puerto o ruta

  constructor(
    private http: HttpClient,
    private notificacionesService: NotificacionesService
  ) {}

  register(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/usuarios/register/`, data)
      .pipe(catchError((err) => throwError(() => err)));
  }

  login(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/usuarios/login/`, data)
      .pipe(
        tap((response: any) => {
          // Si el login es exitoso y tenemos datos del usuario
          if (response && response.user && response.user.id) {
            // Guardar datos del usuario
            localStorage.setItem('userData', JSON.stringify(response.user));
            
            // Conectar a notificaciones WebSocket solo si es postulante
            if (response.user.tipo_usuario === 'postulante') {
              console.log('🔌 Conectando notificaciones para postulante:', response.user.id);
              console.log('📋 Datos completos del usuario:', response.user);
              this.notificacionesService.conectar(response.user.id);
            } else {
              console.log('ℹ️ Usuario no es postulante, no se conectan notificaciones:', response.user.tipo_usuario);
            }
          }
        }),
        catchError((err) => throwError(() => err))
      );
  }

  logout() {
    // Desconectar notificaciones
    this.notificacionesService.desconectar();
    // Limpiar localStorage
    localStorage.removeItem('userData');
  }

  // Método para reconectar notificaciones si el usuario ya está logueado
  inicializarNotificaciones() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.tipo_usuario === 'postulante' && user.id) {
        console.log('🔄 Reconectando notificaciones para postulante:', user.id);
        this.notificacionesService.conectar(user.id);
      }
    }
  }
}
