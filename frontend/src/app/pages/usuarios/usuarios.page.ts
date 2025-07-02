import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostulacionesService } from '../../services/postulaciones.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsuariosPage implements OnInit {
  postulaciones: any[] = [];
  error: string = '';
  
  // Filtros para búsqueda de postulaciones
  filtros = {
    nombre: '',
    habilidades: '',
    experiencia: ''
  };
  
  cargando = false;
  mostrarPostulaciones = false;
  empresaId: number | null = null;

  // Lista completa de postulaciones de la empresa
  postulacionesEmpresa: any[] = [];

  // Variables para el modal
  mostrarModalPostulacion: boolean = false;
  postulacionSeleccionada: any = null;

  constructor(
    private http: HttpClient, 
    private toastCtrl: ToastController, 
    private router: Router,
    private postulacionesService: PostulacionesService
  ) {}

  ngOnInit() {
    const usuario = JSON.parse(localStorage.getItem('userData') || '{}');
    if (usuario.id) {
      this.empresaId = usuario.id; // Usar usuario_id para buscar empresa
      this.cargarPostulacionesEmpresa();
    }
  }

  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color
    });
    toast.present();
  }

  cargarPostulacionesEmpresa() {
    if (!this.empresaId) return;
    this.cargando = true;
    console.log('🔍 Cargando postulaciones para empresa ID:', this.empresaId);
    this.postulacionesService.obtenerPostulantesEmpresa(this.empresaId).subscribe({
      next: (response) => {
        console.log('✅ Respuesta del servidor:', response);
        this.postulacionesEmpresa = response.postulaciones || [];
        this.postulaciones = [...this.postulacionesEmpresa]; // Mostrar todas por defecto
        this.mostrarPostulaciones = true;
        this.cargando = false;
        console.log('📊 Postulaciones cargadas:', this.postulaciones);
        this.mostrarToast(`Se encontraron ${response.total} postulaciones para tus ofertas`);
      },
      error: (err) => {
        console.error('❌ Error al cargar postulaciones:', err);
        this.error = 'Error al cargar postulaciones';
        this.postulaciones = [];
        this.cargando = false;
        this.mostrarToast('Error al cargar postulaciones', 'danger');
      }
    });
  }

  // Filtrar postulaciones localmente
  buscarPostulaciones() {
    if (!this.postulacionesEmpresa.length) return;
    
    let postulacionesFiltradas = [...this.postulacionesEmpresa];
    
    // Filtrar por nombre
    if (this.filtros.nombre.trim()) {
      postulacionesFiltradas = postulacionesFiltradas.filter(p => 
        p.postulante_nombre?.toLowerCase().includes(this.filtros.nombre.toLowerCase())
      );
    }
    
    // Filtrar por habilidades
    if (this.filtros.habilidades.trim()) {
      postulacionesFiltradas = postulacionesFiltradas.filter(p => 
        p.habilidades?.toLowerCase().includes(this.filtros.habilidades.toLowerCase())
      );
    }
    
    // Filtrar por experiencia
    if (this.filtros.experiencia.trim()) {
      postulacionesFiltradas = postulacionesFiltradas.filter(p => 
        p.experiencia_laboral?.toLowerCase().includes(this.filtros.experiencia.toLowerCase())
      );
    }
    
    this.postulaciones = postulacionesFiltradas;
    this.mostrarToast(`Se encontraron ${postulacionesFiltradas.length} postulaciones filtradas`);
  }

  limpiarFiltros() {
    this.filtros = {
      nombre: '',
      habilidades: '',
      experiencia: ''
    };
    this.postulaciones = [...this.postulacionesEmpresa];
    this.mostrarPostulaciones = true;
  }

  verDetallePostulacion(postulacion: any) {
    this.postulacionSeleccionada = postulacion;
    this.mostrarModalPostulacion = true;
  }

  aceptarPostulacion() {
    if (this.postulacionSeleccionada) {
      this.postulacionesService.actualizarEstadoPostulacion(
        this.postulacionSeleccionada.id, 
        'aceptada'
      ).subscribe({
        next: (response) => {
          console.log('Postulación aceptada:', response);
          // Actualizar el estado en ambas listas
          const updateEstado = (lista: any[]) => {
            const index = lista.findIndex(p => p.id === this.postulacionSeleccionada.id);
            if (index !== -1) {
              lista[index].estado = 'aceptada';
            }
          };
          
          updateEstado(this.postulaciones);
          updateEstado(this.postulacionesEmpresa);
          
          this.cerrarModalPostulacion();
          this.mostrarToast('Postulación aceptada correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al aceptar postulación:', error);
          this.mostrarToast('Error al aceptar la postulación', 'danger');
        }
      });
    }
  }

  rechazarPostulacion() {
    if (this.postulacionSeleccionada) {
      this.postulacionesService.actualizarEstadoPostulacion(
        this.postulacionSeleccionada.id, 
        'rechazada'
      ).subscribe({
        next: (response) => {
          console.log('Postulación rechazada:', response);
          // Actualizar el estado en ambas listas
          const updateEstado = (lista: any[]) => {
            const index = lista.findIndex(p => p.id === this.postulacionSeleccionada.id);
            if (index !== -1) {
              lista[index].estado = 'rechazada';
            }
          };
          
          updateEstado(this.postulaciones);
          updateEstado(this.postulacionesEmpresa);
          
          this.cerrarModalPostulacion();
          this.mostrarToast('Postulación rechazada correctamente', 'warning');
        },
        error: (error) => {
          console.error('Error al rechazar postulación:', error);
          this.mostrarToast('Error al rechazar la postulación', 'danger');
        }
      });
    }
  }

  cerrarModalPostulacion() {
    this.mostrarModalPostulacion = false;
    this.postulacionSeleccionada = null;
  }

  descargarCurriculum(postulacion: any) {
    if (postulacion.curriculum) {
      window.open(postulacion.curriculum, '_blank');
    } else {
      this.mostrarToast('No hay currículum disponible', 'warning');
    }
  }

  descargarArchivoAdjunto(postulacion: any) {
    if (postulacion.archivo_adjunto) {
      window.open(postulacion.archivo_adjunto, '_blank');
    } else {
      this.mostrarToast('No hay archivo adjunto disponible', 'warning');
    }
  }

  irAlMenuPrincipal() {
    this.router.navigate(['/menu']);
  }
} 