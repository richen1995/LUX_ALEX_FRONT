import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, provideRoutes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { 
  PRODUCT_REPOSITORY, 
  SERVICE_REPOSITORY, 
  PROJECT_REPOSITORY, 
  TESTIMONIAL_REPOSITORY, 
  LEAD_REPOSITORY, 
  AUTH_REPOSITORY 
} from './core/services/base.repository';

import { MockProductService } from './core/services/mock-product.service';
import { MockServiceService } from './core/services/mock-service.service';
import { MockProjectService } from './core/services/mock-project.service';
import { MockTestimonialService } from './core/services/mock-testimonial.service';
import { MockLeadService } from './core/services/mock-lead.service';
import { MockAuthService } from './core/services/mock-auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    
    // Core Clean Architecture Repositories
    { provide: PRODUCT_REPOSITORY, useClass: MockProductService },
    { provide: SERVICE_REPOSITORY, useClass: MockServiceService },
    { provide: PROJECT_REPOSITORY, useClass: MockProjectService },
    { provide: TESTIMONIAL_REPOSITORY, useClass: MockTestimonialService },
    { provide: LEAD_REPOSITORY, useClass: MockLeadService },
    { provide: AUTH_REPOSITORY, useClass: MockAuthService }
  ]
};
