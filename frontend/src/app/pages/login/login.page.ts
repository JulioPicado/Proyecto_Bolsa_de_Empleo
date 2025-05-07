import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  correo: string = '';
  contrasena: string = '';

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
    this.auth.login({ correo: this.correo, contraseña: this.contrasena }).subscribe({
      next: () => {
        this.mostrarToast('¡Bienvenido!', 'success');
        this.router.navigate(['/menu']);
      },
      error: err => {
        if (err.error && err.error.error) {
          this.mostrarToast('Error: ' + err.error.error);
        } else if (err.message) {
          this.mostrarToast('Error: ' + err.message);
        } else {
          this.mostrarToast('Error desconocido al iniciar sesión.');
        }
      }
    });
  }
}