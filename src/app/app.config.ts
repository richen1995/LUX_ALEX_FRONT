import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { 
  PRODUCT_REPOSITORY, 
  SERVICE_REPOSITORY, 
  PROJECT_REPOSITORY, 
  TESTIMONIAL_REPOSITORY, 
  LEAD_REPOSITORY, 
  AUTH_REPOSITORY 
} from './core/services/base.repository';

import { FirebaseProductService } from './core/services/firebase-product.service';
import { FirebaseProjectService } from './core/services/firebase-project.service';
import { FirebaseServiceService } from './core/services/firebase-service.service';
import { FirebaseTestimonialService } from './core/services/firebase-testimonial.service';
import { FirebaseLeadService } from './core/services/firebase-lead.service';
import { MockAuthService } from './core/services/mock-auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),
    
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    
    // Core Clean Architecture Repositories
    { provide: PRODUCT_REPOSITORY, useClass: FirebaseProductService },
    { provide: SERVICE_REPOSITORY, useClass: FirebaseServiceService },
    { provide: PROJECT_REPOSITORY, useClass: FirebaseProjectService },
    { provide: TESTIMONIAL_REPOSITORY, useClass: FirebaseTestimonialService },
    { provide: LEAD_REPOSITORY, useClass: FirebaseLeadService },
    { provide: AUTH_REPOSITORY, useClass: MockAuthService }
  ]
};
