import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notificacion {
  tipo: string;
  mensaje: string;
  oferta_titulo: string;
  estado: string;
  timestamp: string;
  id?: string;
  leida?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private socket: WebSocket | null = null;
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  private conectadoSubject = new BehaviorSubject<boolean>(false);

  public notificaciones$ = this.notificacionesSubject.asObservable();
  public conectado$ = this.conectadoSubject.asObservable();

  constructor() {}

  conectar(userId: number) {
    if (this.socket) {
      this.desconectar();
    }

    const wsUrl = `ws://localhost:8000/ws/notificaciones/${userId}/`;
    console.log('🔌 Conectando a WebSocket:', wsUrl);
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = (event) => {
      console.log('✅ WebSocket conectado:', event);
      this.conectadoSubject.next(true);
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Notificación recibida:', data);
        
        const notificacion: Notificacion = {
          ...data,
          id: Date.now().toString(),
          leida: false
        };

        // Agregar la nueva notificación al inicio de la lista
        const notificacionesActuales = this.notificacionesSubject.value;
        this.notificacionesSubject.next([notificacion, ...notificacionesActuales]);

        // Mostrar notificación visual
        this.mostrarNotificacionVisual(notificacion);

      } catch (error) {
        console.error('❌ Error al procesar notificación:', error);
      }
    };

    this.socket.onclose = (event) => {
      console.log('❌ WebSocket desconectado:', event);
      this.conectadoSubject.next(false);
    };

    this.socket.onerror = (error) => {
      console.error('❌ Error en WebSocket:', error);
      this.conectadoSubject.next(false);
    };
  }

  desconectar() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.conectadoSubject.next(false);
    }
  }

  private mostrarNotificacionVisual(notificacion: Notificacion) {
    // Crear notificación visual personalizada
    const notifElement = document.createElement('div');
    notifElement.className = 'notificacion-toast';
    notifElement.innerHTML = `
      <div class="notificacion-content">
        <div class="notificacion-icono ${notificacion.estado}">
          ${notificacion.estado === 'aceptada' ? '✅' : notificacion.estado === 'rechazada' ? '❌' : '📋'}
        </div>
        <div class="notificacion-texto">
          <strong>${notificacion.oferta_titulo}</strong>
          <p>${notificacion.mensaje}</p>
        </div>
        <button class="notificacion-cerrar" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Agregar estilos si no existen
    if (!document.getElementById('notificaciones-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notificaciones-styles';
      styles.textContent = `
        .notificacion-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border-left: 4px solid #00AEEF;
          min-width: 350px;
          max-width: 450px;
          z-index: 10000;
          animation: slideInRight 0.3s ease-out;
        }
        .notificacion-content {
          display: flex;
          align-items: flex-start;
          padding: 16px;
          gap: 12px;
        }
        .notificacion-icono {
          font-size: 24px;
          flex-shrink: 0;
        }
        .notificacion-icono.aceptada {
          color: #28a745;
        }
        .notificacion-icono.rechazada {
          color: #dc3545;
        }
        .notificacion-texto {
          flex: 1;
        }
        .notificacion-texto strong {
          color: #00AEEF;
          display: block;
          margin-bottom: 4px;
        }
        .notificacion-texto p {
          margin: 0;
          color: #333;
          font-size: 14px;
        }
        .notificacion-cerrar {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .notificacion-cerrar:hover {
          color: #333;
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notifElement);

    // Auto-remover después de 8 segundos
    setTimeout(() => {
      if (notifElement.parentElement) {
        notifElement.remove();
      }
    }, 8000);
  }

  marcarComoLeida(notificacionId: string) {
    const notificaciones = this.notificacionesSubject.value;
    const index = notificaciones.findIndex(n => n.id === notificacionId);
    if (index !== -1) {
      notificaciones[index].leida = true;
      this.notificacionesSubject.next([...notificaciones]);
    }
  }

  limpiarNotificaciones() {
    this.notificacionesSubject.next([]);
  }
} 