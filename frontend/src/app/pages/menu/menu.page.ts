import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

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

  ngOnInit() {
    // Obtener datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

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
  }

  // Función para determinar si el usuario tiene un rol específico
  tieneRol(rol: string): boolean {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario && usuario.roles && usuario.roles.includes(rol);
  }
}
