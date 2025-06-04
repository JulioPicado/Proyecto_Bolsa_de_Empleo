import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonIcon, IonButton, IonSpinner, IonItem, IonLabel, IonList, IonAlert, IonToast, IonModal, IonTextarea } from '@ionic/angular/standalone';
import { OfertasService, Oferta } from '../../services/ofertas.service';
import { PostulacionesService } from '../../services/postulaciones.service';
import { AuthService } from '../../auth.service';
import { addIcons } from 'ionicons';
import { locationOutline, timeOutline, businessOutline, calendarOutline, arrowBackOutline } from 'ionicons/icons';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonIcon, IonButton, IonSpinner, IonItem, IonLabel, IonList, IonAlert, IonToast, IonModal, IonTextarea, CommonModule, FormsModule]
})
export class OfertasPage implements OnInit {
  ofertas: Oferta[] = [];
  loading: boolean = true;
  error: string = '';
  aplicandoOferta: number | null = null;
  
  // Modal data
  showModal: boolean = false;
  selectedOferta: Oferta | null = null;
  mensajePostulacion: string = '';
  archivoAdjunto: File | null = null;

  constructor(
    private ofertasService: OfertasService,
    private postulacionesService: PostulacionesService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({ locationOutline, timeOutline, businessOutline, calendarOutline, arrowBackOutline });
  }

  ngOnInit() {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.loading = true;
    this.error = '';
    
    // Obtener el ID del postulante si el usuario está logueado y es postulante
    let postulanteId: number | undefined;
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData.perfiles?.postulante?.id) {
        postulanteId = userData.perfiles.postulante.id;
      }
    }
    
    this.ofertasService.getOfertas(postulanteId).subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar ofertas:', err);
        this.error = 'Error al cargar las ofertas. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getColorChip(tipoContrato: string): string {
    switch (tipoContrato) {
      case 'tiempo_completo': return 'success';
      case 'medio_tiempo': return 'warning';
      case 'temporal': return 'medium';
      case 'freelance': return 'tertiary';
      case 'practicas': return 'secondary';
      default: return 'primary';
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.archivoAdjunto = file;
    }
  }

  async aplicarOferta(oferta: Oferta) {
    // Verificar si el usuario está logueado
    const userDataStr = localStorage.getItem('userData');
    if (!userDataStr) {
      await this.mostrarToast('Debes iniciar sesión para aplicar a ofertas', 'warning');
      return;
    }

    const userData = JSON.parse(userDataStr);
    
    // Verificar si el usuario es postulante
    if (!userData.perfiles?.postulante) {
      await this.mostrarToast('Solo los postulantes pueden aplicar a ofertas', 'warning');
      return;
    }

    // Mostrar modal para capturar mensaje
    this.selectedOferta = oferta;
    this.mensajePostulacion = '';
    this.archivoAdjunto = null;
    this.showModal = true;
  }

  async confirmarPostulacion() {
    if (!this.selectedOferta) return;

    const userDataStr = localStorage.getItem('userData');
    const userData = JSON.parse(userDataStr!);
    const postulanteId = userData.perfiles.postulante.id;

    this.aplicandoOferta = this.selectedOferta.id;

    let postulacionData: any;
    
    if (this.archivoAdjunto) {
      // Si hay archivo, usar FormData
      postulacionData = new FormData();
      postulacionData.append('oferta_id', this.selectedOferta.id.toString());
      postulacionData.append('postulante_id', postulanteId.toString());
      postulacionData.append('mensaje', this.mensajePostulacion || '');
      postulacionData.append('estado', 'enviada');
      postulacionData.append('archivo_adjunto', this.archivoAdjunto);
    } else {
      // Si no hay archivo, usar JSON
      postulacionData = {
        oferta_id: this.selectedOferta.id,
        postulante_id: postulanteId,
        mensaje: this.mensajePostulacion || '',
        estado: 'enviada'
      };
    }

    this.postulacionesService.crearPostulacion(postulacionData).subscribe({
      next: async (response) => {
        await this.mostrarToast('¡Postulación enviada exitosamente!', 'success');
        this.aplicandoOferta = null;
        this.cerrarModal();
        this.cargarOfertas();
      },
      error: async (err) => {
        console.error('Error al crear postulación:', err);
        let mensaje = 'Error al enviar la postulación';
        if (err.error?.error) {
          mensaje = err.error.error;
        }
        await this.mostrarToast(mensaje, 'danger');
        this.aplicandoOferta = null;
      }
    });
  }

  cerrarModal() {
    this.showModal = false;
    this.selectedOferta = null;
    this.mensajePostulacion = '';
    this.archivoAdjunto = null;
  }

  volver() {
    this.router.navigate(['/menu']);
  }

  async mostrarToast(mensaje: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  isAplicandoOferta(ofertaId: number): boolean {
    return this.aplicandoOferta === ofertaId;
  }
}
