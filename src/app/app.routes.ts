import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './core/layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './core/layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Routes (inside PublicLayoutComponent)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'LUXTRAKING | Seguridad Integral Corporativa Premium'
      },
      {
        path: 'services',
        loadComponent: () => import('./features/services/services.component').then(m => m.ServicesComponent),
        title: 'Servicios Profesionales de Seguridad | LUXTRAKING'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
        title: 'Catálogo de Equipos de Seguridad | LUXTRAKING'
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
        title: 'Proyectos y Casos de Éxito | LUXTRAKING'
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
        title: 'Solicitar Cotización Gratis | LUXTRAKING'
      }
    ]
  },
  
  // Login Route
  {
    path: 'login',
    loadComponent: () => import('./features/authentication/login.component').then(m => m.LoginComponent),
    title: 'Iniciar Sesión Corporativo | LUXTRAKING'
  },

  // Admin Routes (inside AdminLayoutComponent, protected by authGuard)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard de Métricas | LUXTRAKING Admin'
      },
      {
        path: 'crm',
        loadComponent: () => import('./features/crm/crm.component').then(m => m.CrmComponent),
        title: 'Gestión CRM - Leads | LUXTRAKING Admin'
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/products-crud/products-crud.component').then(m => m.ProductsCrudComponent),
        title: 'CRUD Productos de Seguridad | LUXTRAKING Admin'
      },
      {
        path: 'services',
        loadComponent: () => import('./features/admin/services-crud/services-crud.component').then(m => m.ServicesCrudComponent),
        title: 'CRUD Servicios de Seguridad | LUXTRAKING Admin'
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/admin/projects-crud/projects-crud.component').then(m => m.ProjectsCrudComponent),
        title: 'CRUD Galería de Proyectos | LUXTRAKING Admin'
      },
      {
        path: 'testimonials',
        loadComponent: () => import('./features/admin/testimonials-crud/testimonials-crud.component').then(m => m.TestimonialsCrudComponent),
        title: 'CRUD Gestión de Testimonios | LUXTRAKING Admin'
      }
    ]
  },

  // Fallback redirect
  {
    path: '**',
    redirectTo: ''
  }
];
