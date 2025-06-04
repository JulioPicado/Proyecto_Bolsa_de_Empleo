import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterPage implements OnInit {
  tipoUsuario: string = 'postulante';
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  clave: string = ''; // Cambiado de contraseña a clave
  confirmar_clave: string = ''; // Campo nuevo
  // Postulante
  curriculum: File | null = null;
  experiencia: string = '';
  educacion: string = '';
  habilidades: string = '';
  telefono: string = '';
  direccion: string = '';
  // Empresa
  nombreEmpresa: string = '';
  sector: string = '';
  descripcion: string = '';
  sitioWeb: string = '';
  telefonoContacto: string = '';
  direccionEmpresa: string = '';

  constructor(
    private auth: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async mostrarToast(mensaje: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3500,
      color,
    });
    toast.present();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.curriculum = file;
    }
  }

  onSubmit(form: any) {
    if (form.invalid || this.clave !== this.confirmar_clave) {
      if (this.clave !== this.confirmar_clave) {
        this.mostrarToast('Las claves no coinciden.');
      }
      return;
    }

    let obs$: Observable<any> | null = null;

    if (this.tipoUsuario === 'postulante') {
      const formData = new FormData();
      formData.append('nombre', this.nombre);
      formData.append('apellido', this.apellido);
      formData.append('correo', this.correo);
      formData.append('clave', this.clave);
      formData.append('confirmar_clave', this.confirmar_clave);
      formData.append('tipo_usuario', 'postulante');
      if (this.curriculum) {
        formData.append('curriculum', this.curriculum);
      }
      formData.append('experiencia_laboral', this.experiencia);
      formData.append('educacion', this.educacion);
      formData.append('habilidades', this.habilidades);
      formData.append('telefono', this.telefono);
      formData.append('direccion', this.direccion);
      obs$ = this.auth.register(formData);
    } else if (this.tipoUsuario === 'empresa') {
      obs$ = this.auth.register({
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        clave: this.clave, // Cambiado de contraseña a clave
        confirmar_clave: this.confirmar_clave, // Campo nuevo
        tipo_usuario: 'empresa',
        nombre_empresa: this.nombreEmpresa,
        sector: this.sector,
        descripcion: this.descripcion,
        sitio_web: this.sitioWeb,
        telefono_contacto: this.telefonoContacto,
        direccion: this.direccionEmpresa,
      });
    }
    if (obs$) {
      obs$.subscribe({
        next: () =>
          this.mostrarToast('¡Usuario registrado exitosamente!', 'success'),
        error: (err) => {
          if (err.error && err.error.error) {
            this.mostrarToast('Error: ' + err.error.error);
          } else if (err.message) {
            this.mostrarToast('Error: ' + err.message);
          } else {
            this.mostrarToast('Error desconocido al registrar usuario.');
          }
        },
      });
    }
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {}
}
