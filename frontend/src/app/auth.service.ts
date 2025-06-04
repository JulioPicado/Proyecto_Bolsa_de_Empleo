import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://juzamabackend.ticocr.org'; // Cambia esto si tu backend usa otro puerto o ruta

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/usuarios/register/`, data)
      .pipe(catchError((err) => throwError(() => err)));
  }

  login(data: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/usuarios/login/`, data)
      .pipe(catchError((err) => throwError(() => err)));
  }
}
