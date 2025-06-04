import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsuariosPage implements OnInit {
  usuarios: any[] = [];
  error: string = '';
  usuarioEditar: any = null;
  usuarioEliminar: any = null;

  constructor(private http: HttpClient, private toastCtrl: ToastController, private router: Router) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color
    });
    toast.present();
  }

  cargarUsuarios() {
    this.error = '';
    this.http.get<any[]>('https://juzamabackend.ticocr.org/api/usuarios')
      .subscribe({
        next: data => this.usuarios = data,
        error: err => {
          this.error = err.error?.error || 'Error al cargar usuarios';
          this.usuarios = [];
        }
      });
  }

  abrirEditar(usuario: any) {
    // Clonar para no editar directamente la tabla
    this.usuarioEditar = { ...usuario };
  }

  abrirEliminar(usuario: any) {
    this.usuarioEliminar = usuario;
  }

  cerrarModal() {
    this.usuarioEditar = null;
    this.usuarioEliminar = null;
  }

  guardarEdicion() {
    this.http.put(`https://juzamabackend.ticocr.org/api/usuarios/${this.usuarioEditar.id_usuario}`, this.usuarioEditar)
      .subscribe({
        next: () => {
          this.mostrarToast('Usuario actualizado correctamente');
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: err => {
          this.mostrarToast('Error al actualizar usuario', 'danger');
        }
      });
  }

  confirmarEliminar() {
    this.http.delete(`https://juzamabackend.ticocr.orgapi/usuarios/${this.usuarioEliminar.id_usuario}`)
      .subscribe({
        next: () => {
          this.mostrarToast('Usuario eliminado correctamente', 'danger');
          this.cerrarModal();
          this.cargarUsuarios();
        },
        error: err => {
          this.mostrarToast('Error al eliminar usuario', 'danger');
        }
      });
  }

  irAlMenuPrincipal() {
    this.router.navigate(['/menu']);
  }
} 