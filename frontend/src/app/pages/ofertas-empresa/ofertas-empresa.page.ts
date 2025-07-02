import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { OfertasService, Oferta } from '../../services/ofertas.service';
import { FormsModule } from '@angular/forms';
import { PostulacionesService, Postulacion } from '../../services/postulaciones.service';

@Component({
  selector: 'app-ofertas-empresa',
  templateUrl: './ofertas-empresa.page.html',
  styleUrls: ['./ofertas-empresa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
})
export class OfertasEmpresaPage implements OnInit {
  // Variables para gestión de ofertas de empresa
  ofertasEmpresa: Oferta[] = [];
  cargandoOfertas: boolean = false;
  mostrarFormularioCrear: boolean = false;
  
  // Para mostrar postulantes por oferta
  postulantesPorOferta: { [ofertaId: number]: Postulacion[] } = {};
  ofertaExpandida: number | null = null;
  cargandoPostulantes: { [ofertaId: number]: boolean } = {};
  
  // Formulario para nueva oferta
  nuevaOferta = {
    titulo: '',
    descripcion: '',
    requisitos: '',
    ubicacion: '',
    tipo_contrato: '',
    estado: 'activa'
  };

  postulanteSeleccionado: any = null;
  mostrarModalPostulante: boolean = false;

  constructor(
    private router: Router,
    private ofertasService: OfertasService,
    private postulacionesService: PostulacionesService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarOfertasEmpresa();
  }

  cargarOfertasEmpresa() {
    const usuario = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!usuario.id) {
      console.error('No se encontró empresa_id en userData');
      return;
    }

    this.cargandoOfertas = true;
    
    // Usar el método simple para obtener ofertas de la empresa
    this.ofertasService.getOfertasEmpresa(usuario.id)
      .subscribe({
        next: (ofertas) => {
          this.ofertasEmpresa = ofertas;
          this.cargandoOfertas = false;
        },
        error: (error) => {
          console.error('Error al cargar ofertas de empresa:', error);
          this.cargandoOfertas = false;
        }
      });
  }

  toggleFormularioCrear() {
    this.mostrarFormularioCrear = !this.mostrarFormularioCrear;
  }

  crearOferta() {
    const usuario = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!usuario.id) {
      console.error('No se encontró empresa_id en userData');
      return;
    }

    const ofertaData = {
      ...this.nuevaOferta,
      empresa_id: usuario.id
    };

    this.ofertasService.crearOferta(ofertaData).subscribe({
      next: (oferta) => {
        console.log('Oferta creada exitosamente:', oferta);
        // Limpiar formulario
        this.nuevaOferta = {
          titulo: '',
          descripcion: '',
          requisitos: '',
          ubicacion: '',
          tipo_contrato: '',
          estado: 'activa'
        };
        this.mostrarFormularioCrear = false;
        // Recargar ofertas
        this.cargarOfertasEmpresa();
      },
      error: (error) => {
        console.error('Error al crear oferta:', error);
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'activa': return 'badge-activa';
      case 'inactiva': return 'badge-inactiva';
      case 'cerrada': return 'badge-cerrada';
      default: return 'badge-default';
    }
  }

  volverAlMenu() {
    this.router.navigate(['/menu']);
  }

  verPostulantesOferta(ofertaId: number) {
    console.log('Click en verPostulantesOferta', ofertaId);
    this.ofertaExpandida = this.ofertaExpandida === ofertaId ? null : ofertaId;
    if (this.ofertaExpandida) {
      this.cargandoPostulantes[ofertaId] = true;
      this.postulacionesService.obtenerPostulacionesOferta(ofertaId).subscribe({
        next: (postulaciones) => {
          this.postulantesPorOferta[ofertaId] = postulaciones.map(p => ({ ...p, expandido: false }));
          this.cargandoPostulantes[ofertaId] = false;
        },
        error: (err) => {
          this.postulantesPorOferta[ofertaId] = [];
          this.cargandoPostulantes[ofertaId] = false;
        }
      });
    }
  }

  verDetallePostulante(postulacion: any) {
    this.postulanteSeleccionado = postulacion;
    this.mostrarModalPostulante = true;
  }

  cerrarModalPostulante() {
    this.mostrarModalPostulante = false;
    this.postulanteSeleccionado = null;
  }

  aceptarPostulacion(postulacion: any) {
    // Aquí irá la lógica para aceptar la postulación
    console.log('Aceptar postulación:', postulacion);
    // Cambiar estado localmente para demo
    postulacion.estado = 'aceptada';
    this.cerrarModalPostulante();
  }

  rechazarPostulacion(postulacion: any) {
    // Aquí irá la lógica para rechazar la postulación
    console.log('Rechazar postulación:', postulacion);
    // Cambiar estado localmente para demo
    postulacion.estado = 'rechazada';
    this.cerrarModalPostulante();
  }
} 