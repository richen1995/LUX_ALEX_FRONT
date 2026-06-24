import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SERVICE_REPOSITORY } from '../../core/services/base.repository';
import { ServiceItem } from '../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html'
})
export class ServicesComponent implements OnInit {
  private serviceRepo = inject(SERVICE_REPOSITORY);
  private router = inject(Router);

  services = signal<ServiceItem[]>([]);

  ngOnInit() {
    this.serviceRepo.getAllServices().pipe(
      take(1)
    ).subscribe(data => this.services.set(data));
  }

  requestQuote(serviceTitle: string) {
    // Navigate to contact and send query param
    this.router.navigate(['/contact'], { queryParams: { service: serviceTitle } });
  }
}
