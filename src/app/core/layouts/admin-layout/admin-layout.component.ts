import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AUTH_REPOSITORY } from '../../services/base.repository';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  private authService = inject(AUTH_REPOSITORY);
  private router = inject(Router);

  isMobileOpen = signal(false);

  username() {
    return this.authService.getCurrentUser()?.username || 'Admin';
  }

  userRole() {
    return this.authService.getCurrentUser()?.role || 'ADMIN';
  }

  toggleMobileMenu() {
    this.isMobileOpen.update(val => !val);
  }

  closeMobileMenu() {
    this.isMobileOpen.set(false);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
