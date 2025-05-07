import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Cambia esto si tu backend usa otro puerto o ruta

  constructor(private http: HttpClient) {}

  registrarPostulante(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro-postulante`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }

  registrarEmpresa(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro-empresa`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }

  registrarAdministrador(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro-administrador`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data).pipe(
      catchError(err => throwError(() => err))
    );
  }
} 