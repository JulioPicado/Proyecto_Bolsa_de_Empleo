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
  curriculum: string = '';
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

  onSubmit(form: any) {
    if (form.invalid || this.clave !== this.confirmar_clave) {
      if (this.clave !== this.confirmar_clave) {
        this.mostrarToast('Las claves no coinciden.');
      }
      return;
    }

    let obs$: Observable<any> | null = null;

    if (this.tipoUsuario === 'postulante') {
      obs$ = this.auth.register({
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        clave: this.clave, // Cambiado de contraseña a clave
        confirmar_clave: this.confirmar_clave, // Campo nuevo
        tipo_usuario: 'postulante',
        curriculum: this.curriculum,
        experiencia_laboral: this.experiencia,
        educacion: this.educacion,
        habilidades: this.habilidades,
        telefono: this.telefono,
        direccion: this.direccion,
      });
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
