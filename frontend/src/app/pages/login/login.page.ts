import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class LoginPage implements OnInit {
  correo: string = '';
  contrasena: string = '';
  currentYear: number = new Date().getFullYear();

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
    if (form.invalid) return;
    this.auth.login({ correo: this.correo, clave: this.contrasena }).subscribe({
      next: (res) => {
        this.mostrarToast('¡Bienvenido!', 'success');
        
        // Limpiar datos anteriores antes de guardar nuevos
        localStorage.clear();
        
        // Guardar usuario en localStorage para el menú
        const userData = {
          id: res.id,
          nombre: res.nombre,
          apellido: res.apellido,
          correo: res.correo,
          roles: res.roles,
          perfiles: res.perfiles,
          access: res.access,
          refresh: res.refresh
        };
        
        localStorage.setItem(
          'userData',
          JSON.stringify(userData)
        );
        
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.mostrarToast('Error: ' + err.error.error);
        } else if (err.message) {
          this.mostrarToast('Error: ' + err.message);
        } else {
          this.mostrarToast('Error desconocido al iniciar sesión.');
        }
      },
    });
  }

  ngOnInit() {}
}
