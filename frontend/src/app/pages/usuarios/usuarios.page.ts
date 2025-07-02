import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService, Candidato } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsuariosPage implements OnInit {
  usuarios: any[] = [];
  candidatos: Candidato[] = [];
  error: string = '';
  usuarioEditar: any = null;
  usuarioEliminar: any = null;
  
  // Filtros para búsqueda de candidatos
  filtros = {
    nombre: '',
    habilidades: '',
    experiencia: ''
  };
  
  cargando = false;
  mostrarCandidatos = false;
  tipoUsuario: string = '';
  empresaId: number | null = null;

  // Lista completa de postulantes a las ofertas de la empresa
  postulantesEmpresa: Candidato[] = [];

  constructor(
    private http: HttpClient, 
    private toastCtrl: ToastController, 
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.tipoUsuario = localStorage.getItem('tipoUsuario') || '';
    if (this.tipoUsuario === 'empresa') {
      const empresa = JSON.parse(localStorage.getItem('empresa') || '{}');
      this.empresaId = empresa.id || null;
      if (this.empresaId) {
        this.cargarPostulantesEmpresa();
      }
    } else if (this.tipoUsuario === 'administrador') {
      this.cargarUsuarios();
    }
    // Si es postulante, no mostrar lista de usuarios ni candidatos
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
    this.http.get<any[]>('http://localhost:3000/api/usuarios')
      .subscribe({
        next: data => this.usuarios = data,
        error: err => {
          this.error = err.error?.error || 'Error al cargar usuarios';
          this.usuarios = [];
        }
      });
  }

  cargarPostulantesEmpresa() {
    if (!this.empresaId) return;
    this.cargando = true;
    this.usuariosService.obtenerPostulantesEmpresa(this.empresaId).subscribe({
      next: (response) => {
        this.postulantesEmpresa = response.candidatos;
        this.candidatos = [...this.postulantesEmpresa]; // Mostrar todos por defecto
        this.mostrarCandidatos = true;
        this.cargando = false;
        this.mostrarToast(`Se encontraron ${response.total} postulantes para tus ofertas`);
      },
      error: (err) => {
        this.error = 'Error al cargar postulantes';
        this.candidatos = [];
        this.cargando = false;
        this.mostrarToast('Error al cargar postulantes', 'danger');
      }
    });
  }

  // Métodos para búsqueda de candidatos
  buscarCandidatos() {
    if (this.tipoUsuario === 'empresa') {
      if (this.empresaId) {
        this.cargando = true;
        this.usuariosService.buscarPostulantesEmpresa(this.empresaId, this.filtros).subscribe({
          next: (response) => {
            this.candidatos = response.candidatos;
            this.mostrarCandidatos = true;
            this.cargando = false;
            this.mostrarToast(`Se encontraron ${response.total} postulantes filtrados`);
          },
          error: (err) => {
            this.error = 'Error al buscar postulantes';
            this.candidatos = [];
            this.cargando = false;
            this.mostrarToast('Error al buscar postulantes', 'danger');
          }
        });
      }
      return;
    }
    this.cargando = true;
    this.error = '';
    this.usuariosService.buscarCandidatos(this.filtros).subscribe({
      next: (response) => {
        this.candidatos = response.candidatos;
        this.mostrarCandidatos = true;
        this.cargando = false;
        this.mostrarToast(`Se encontraron ${response.total} candidatos`);
      },
      error: (err) => {
        this.error = 'Error al buscar candidatos';
        this.candidatos = [];
        this.cargando = false;
        this.mostrarToast('Error al buscar candidatos', 'danger');
      }
    });
  }

  limpiarFiltros() {
    this.filtros = {
      nombre: '',
      habilidades: '',
      experiencia: ''
    };
    if (this.tipoUsuario === 'empresa') {
      this.candidatos = [...this.postulantesEmpresa];
      this.mostrarCandidatos = true;
      return;
    }
    this.candidatos = [];
    this.mostrarCandidatos = false;
  }

  verDetalleCandidato(candidato: Candidato) {
    // Aquí podrías abrir un modal con más detalles del candidato
    this.mostrarToast(`Ver detalles de ${candidato.nombre} ${candidato.apellido}`);
  }

  descargarCurriculum(candidato: Candidato) {
    if (candidato.curriculum) {
      window.open(candidato.curriculum, '_blank');
    } else {
      this.mostrarToast('No hay currículum disponible', 'warning');
    }
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
    this.http.put(`http://localhost:3000/api/usuarios/${this.usuarioEditar.id_usuario}`, this.usuarioEditar)
      .subscribe({
        next: () => {
          this.mostrarToast('Usuario actualizado correctamente');
          this.cerrarModal();
          if (this.tipoUsuario !== 'empresa') {
            this.cargarUsuarios();
          }
        },
        error: err => {
          this.mostrarToast('Error al actualizar usuario', 'danger');
        }
      });
  }

  confirmarEliminar() {
    this.http.delete(`http://localhost:3000/api/usuarios/${this.usuarioEliminar.id_usuario}`)
      .subscribe({
        next: () => {
          this.mostrarToast('Usuario eliminado correctamente', 'danger');
          this.cerrarModal();
          if (this.tipoUsuario !== 'empresa') {
            this.cargarUsuarios();
          }
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