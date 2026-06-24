import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { MockLeadService } from './mock-lead.service';
import { MockProductService } from './mock-product.service';
import { MockServiceService } from './mock-service.service';

export interface DashboardMetrics {
  totalLeads: number;
  leadsByStatus: {
    nuevo: number;
    contactado: number;
    cotizado: number;
    cerrado: number;
  };
  totalProducts: number;
  totalServices: number;
  totalVisits: number;
  conversionRate: number;
  monthlyTrends: { month: string; leads: number; sales: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class MockDashboardService {
  private leadService = inject(MockLeadService);
  private productService = inject(MockProductService);
  private serviceService = inject(MockServiceService);

  getMetrics(): Observable<DashboardMetrics> {
    return forkJoin({
      leads: this.leadService.getAllLeads(),
      products: this.productService.getAllProducts(),
      services: this.serviceService.getAllServices()
    }).pipe(
      map(({ leads, products, services }) => {
        const nuevo = leads.filter(l => l.status === 'Nuevo').length;
        const contactado = leads.filter(l => l.status === 'Contactado').length;
        const cotizado = leads.filter(l => l.status === 'Cotizado').length;
        const cerrado = leads.filter(l => l.status === 'Cerrado').length;

        const totalLeads = leads.length;
        const conversionRate = totalLeads > 0 ? Math.round((cerrado / totalLeads) * 100) : 0;

        // Static or simulated visits & trends
        const totalVisits = 4850; 
        
        const monthlyTrends = [
          { month: 'Ene', leads: 30, sales: 8 },
          { month: 'Feb', leads: 40, sales: 12 },
          { month: 'Mar', leads: 35, sales: 15 },
          { month: 'Abr', leads: 50, sales: 18 },
          { month: 'May', leads: 48, sales: 22 },
          { month: 'Jun', leads: totalLeads, sales: cerrado }
        ];

        return {
          totalLeads,
          leadsByStatus: { nuevo, contactado, cotizado, cerrado },
          totalProducts: products.length,
          totalServices: services.length,
          totalVisits,
          conversionRate,
          monthlyTrends
        };
      })
    );
  }
}
