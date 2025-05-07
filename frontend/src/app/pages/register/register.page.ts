import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {
  tipoUsuario: string = '';
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  contrasena: string = '';
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

  constructor(private auth: AuthService, private toastCtrl: ToastController, private router: Router) {}

  async mostrarToast(mensaje: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3500,
      color
    });
    toast.present();
  }

  onSubmit(form: any) {
    if (form.invalid) return;
    let obs$;
    if (this.tipoUsuario === 'postulante') {
      obs$ = this.auth.registrarPostulante({
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        contraseña: this.contrasena,
        curriculum: this.curriculum,
        experiencia_laboral: this.experiencia,
        educacion: this.educacion,
        habilidades: this.habilidades,
        telefono: this.telefono,
        direccion: this.direccion
      });
    } else if (this.tipoUsuario === 'empresa') {
      obs$ = this.auth.registrarEmpresa({
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        contraseña: this.contrasena,
        nombre_empresa: this.nombreEmpresa,
        sector: this.sector,
        descripcion: this.descripcion,
        sitio_web: this.sitioWeb,
        telefono_contacto: this.telefonoContacto,
        direccion: this.direccionEmpresa
      });
    }
    if (obs$) {
      obs$.subscribe({
        next: () => this.mostrarToast('¡Usuario registrado exitosamente!', 'success'),
        error: err => {
          if (err.error && err.error.error) {
            this.mostrarToast('Error: ' + err.error.error);
          } else if (err.message) {
            this.mostrarToast('Error: ' + err.message);
          } else {
            this.mostrarToast('Error desconocido al registrar usuario.');
          }
        }
      });
    }
  }

  volverLogin() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {}
} 