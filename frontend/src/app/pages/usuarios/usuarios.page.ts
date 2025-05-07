import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class UsuariosPage {
  usuarios: any[] = [];
  error: string = '';

  constructor(private http: HttpClient) {}

  cargarUsuarios() {
    this.error = '';
    this.http.get<any[]>('http://localhost:3000/api/usuarios')
      .subscribe({
        next: data => this.usuarios = data,
        error: err => {
          this.error = err.error?.error || 'Error al cargar usuarios';
          this.usuarios = [];
        }
      });
  }
} 