import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class MenuPage implements OnInit {
  // Simulación: en el futuro esto vendrá del login/token
  tipoUsuario: 'postulante' | 'empresa' | 'administrador' = 'postulante';
  nombreUsuario: string = '';
  tipoUsuarioDebug: string = '';
  tipoValido: boolean = true;

  ngOnInit() {
    // Obtener datos del usuario desde localStorage (simulación)
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario && usuario.tipo_usuario) {
      this.tipoUsuarioDebug = usuario.tipo_usuario;
      const tipo = (usuario.tipo_usuario + '').toLowerCase().trim();
      if (tipo === 'administrador' || tipo === 'empresa' || tipo === 'postulante') {
        this.tipoUsuario = tipo as any;
        this.tipoValido = true;
      } else {
        this.tipoValido = false;
      }
      this.nombreUsuario = (usuario.nombre ? usuario.nombre : '') + (usuario.apellido ? ' ' + usuario.apellido : '');
    } else {
      this.tipoValido = false;
    }
    // Debug: mostrar en consola el tipo de usuario leído
    console.log('Tipo usuario leído:', this.tipoUsuarioDebug, '| Detectado:', this.tipoUsuario);
  }

  // Puedes cambiar el valor arriba para ver cómo se adapta el menú
} 