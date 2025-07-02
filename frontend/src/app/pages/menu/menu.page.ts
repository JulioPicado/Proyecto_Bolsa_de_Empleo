import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class MenuPage implements OnInit {
  tipoUsuario: 'postulante' | 'empresa' | 'administrador' = 'postulante';
  nombreUsuario: string = '';
  tipoUsuarioDebug: string = '';
  tipoValido: boolean = true;
  currentYear: number = new Date().getFullYear();

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificacionesService: NotificacionesService
  ) {}

  ngOnInit() {
    // Obtener datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // DEBUG: Mostrar todos los datos del usuario
    console.log('🔍 DEBUG - Datos completos del usuario en localStorage:', usuario);

    // Verificar si el usuario tiene roles
    if (usuario && usuario.roles && usuario.roles.length > 0) {
      // Tomar el primer rol como el tipo de usuario principal
      const primerRol = usuario.roles[0].toLowerCase();
      this.tipoUsuarioDebug = primerRol;

      if (
        primerRol === 'administrador' ||
        primerRol === 'empresa' ||
        primerRol === 'postulante'
      ) {
        this.tipoUsuario = primerRol as any;
        this.tipoValido = true;
      } else {
        this.tipoValido = false;
      }

      // Si guardamos nombre y apellido también, los usamos
      if (usuario.nombre && usuario.apellido) {
        this.nombreUsuario = `${usuario.nombre} ${usuario.apellido}`;
      } else {
        // Si solo guardamos id y roles, podríamos cargar el nombre desde una API
        this.nombreUsuario = `Usuario #${usuario.id}`;

        // Opcional: cargar más datos del usuario desde la API
        // this.usuarioService.obtenerDetallesUsuario(usuario.id).subscribe(detalles => {
        //   this.nombreUsuario = `${detalles.nombre} ${detalles.apellido}`;
        // });
      }
    } else {
      this.tipoValido = false;
    }

    console.log(
      'Rol usuario leído:',
      this.tipoUsuarioDebug,
      '| Detectado:',
      this.tipoUsuario
    );

    // Inicializar notificaciones para postulantes
    if (this.tipoUsuario === 'postulante') {
      console.log('🔄 Inicializando notificaciones desde menu...');
      console.log('🔍 DEBUG - ID del usuario:', usuario.id);
      
      // Forzar conexión directa para debugging
      if (usuario.id) {
        console.log('🚀 FORZANDO conexión WebSocket con ID:', usuario.id);
        this.notificacionesService.conectar(usuario.id);
      } else {
        console.error('❌ ERROR: No se encontró ID del usuario para WebSocket');
      }
      
      // También llamar al método del AuthService
      this.authService.inicializarNotificaciones();
    }
  }

  cerrarSesion() {
    // Desconectar notificaciones
    this.authService.logout();
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  // Función para determinar si el usuario tiene un rol específico
  tieneRol(rol: string): boolean {
    const usuario = JSON.parse(localStorage.getItem('userData') || '{}');
    return usuario && usuario.roles && usuario.roles.includes(rol);
  }


}
