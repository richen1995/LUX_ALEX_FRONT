import { Component, OnInit, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  PRODUCT_REPOSITORY, 
  SERVICE_REPOSITORY, 
  PROJECT_REPOSITORY, 
  TESTIMONIAL_REPOSITORY 
} from '../../core/services/base.repository';
import { ServiceItem, Project, Testimonial } from '../../shared/models/models';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private serviceRepo = inject(SERVICE_REPOSITORY);
  private projectRepo = inject(PROJECT_REPOSITORY);
  private testimonialRepo = inject(TESTIMONIAL_REPOSITORY);

  // Statistics properties
  clientCount = signal(0);
  cameraCount = signal(0);
  projectCount = signal(0);
  experienceYears = signal(0);

  // Dynamic content collections
  featuredServices = signal<ServiceItem[]>([]);
  featuredProjects = signal<Project[]>([]);
  testimonials = signal<Testimonial[]>([]);
  
  // Slider properties
  activeIndex = signal(0);
  activeTestimonial = signal<Testimonial>({
    id: '', name: '', comment: '', rating: 5, company: '', role: '', image: ''
  });

  ngOnInit() {
    this.animateStats();
    this.loadFeaturedData();
  }

  animateStats() {
    // Basic counter animations
    this.animateValue(0, 1500, 1500, (v) => this.clientCount.set(v));
    this.animateValue(0, 8400, 1800, (v) => this.cameraCount.set(v));
    this.animateValue(0, 1200, 1600, (v) => this.projectCount.set(v));
    this.animateValue(0, 12, 1000, (v) => this.experienceYears.set(v));
  }

  animateValue(start: number, end: number, duration: number, callback: (value: number) => void) {
    const startTime = performance.now();
    
    const run = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(start + easeProgress * (end - start));
      
      callback(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(run);
      }
    };
    
    requestAnimationFrame(run);
  }

  loadFeaturedData() {
    // Load 3 featured services
    this.serviceRepo.getAllServices().pipe(
      map(srvs => srvs.slice(0, 3)),
      take(1)
    ).subscribe(data => this.featuredServices.set(data));

    // Load 3 featured projects
    this.projectRepo.getAllProjects().pipe(
      map(projs => projs.slice(0, 3)),
      take(1)
    ).subscribe(data => this.featuredProjects.set(data));

    // Load testimonials
    this.testimonialRepo.getAllTestimonials().pipe(
      take(1)
    ).subscribe(data => {
      this.testimonials.set(data);
      if (data.length > 0) {
        this.activeTestimonial.set(data[0]);
      }
    });
  }

  nextTestimonial() {
    const nextIdx = (this.activeIndex() + 1) % this.testimonials().length;
    this.activeIndex.set(nextIdx);
    this.activeTestimonial.set(this.testimonials()[nextIdx]);
  }

  prevTestimonial() {
    const prevIdx = this.activeIndex() === 0 ? this.testimonials().length - 1 : this.activeIndex() - 1;
    this.activeIndex.set(prevIdx);
    this.activeTestimonial.set(this.testimonials()[prevIdx]);
  }
}
