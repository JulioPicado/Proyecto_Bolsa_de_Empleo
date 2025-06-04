import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Router } from '@angular/router';
import { OfertasService, Oferta } from '../../services/ofertas.service';
import { FormsModule } from '@angular/forms';

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
  
  // Formulario para nueva oferta
  nuevaOferta = {
    titulo: '',
    descripcion: '',
    requisitos: '',
    ubicacion: '',
    tipo_contrato: '',
    estado: 'activa'
  };

  constructor(
    private router: Router,
    private ofertasService: OfertasService
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
} 