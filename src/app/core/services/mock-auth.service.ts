import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AuthResponse } from '../../shared/models/models';
import { IAuthRepository } from './base.repository';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService implements IAuthRepository {
  private currentUserSignal = signal<AuthResponse | null>(null);

  constructor() {
    const storedUser = localStorage.getItem('security_user');
    if (storedUser) {
      try {
        this.currentUserSignal.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('security_user');
      }
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    // Basic premium check (admin / admin123 or similar)
    if ((username === 'admin' || username === 'soporte@seguridad.com') && password === 'admin123') {
      const response: AuthResponse = {
        token: `mock-jwt-token-sec-${Date.now()}`,
        username: username === 'admin' ? 'Administrador Principal' : 'Soporte Técnico',
        role: 'ADMIN'
      };
      localStorage.setItem('security_user', JSON.stringify(response));
      this.currentUserSignal.set(response);
      return of(response);
    } else {
      return throwError(() => new Error('Credenciales incorrectas. Pruebe con admin / admin123'));
    }
  }

  logout(): void {
    localStorage.removeItem('security_user');
    this.currentUserSignal.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSignal();
  }
}
