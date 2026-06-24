import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AUTH_REPOSITORY } from '../../core/services/base.repository';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authRepository = inject(AUTH_REPOSITORY);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  returnUrl = '/admin/dashboard';

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  ngOnInit() {
    // Read optional returnUrl
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    
    // Redirect if already authenticated
    if (this.authRepository.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const { username, password } = this.loginForm.value;

      setTimeout(() => {
        this.authRepository.login(username || '', password || '').subscribe({
          next: () => {
            this.isLoading.set(false);
            this.router.navigate([this.returnUrl]);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorMessage.set(err.message || 'Error de autenticación.');
          }
        });
      }, 800); // Simulated authentication lag
    }
  }
}
