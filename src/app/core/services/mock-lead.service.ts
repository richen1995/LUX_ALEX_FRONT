import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Lead, HistoryLog } from '../../shared/models/models';
import { ILeadRepository } from './base.repository';

const FIRST_NAMES = [
  'Juan', 'Pedro', 'Luis', 'María', 'Ana', 'Laura', 'Carlos', 'José', 'Andrea', 'Sofía',
  'Santiago', 'Mateo', 'Diego', 'Camila', 'Valeria', 'Daniel', 'Alejandro', 'Gabriel', 'Lucía', 'Martina'
];

const LAST_NAMES = [
  'Pérez', 'Gómez', 'Rodríguez', 'Martínez', 'Sánchez', 'González', 'López', 'Díaz', 'Torres', 'Ramírez',
  'Cruz', 'Morales', 'Flores', 'Vargas', 'Ríos', 'Castillo', 'Mendoza', 'Guzmán', 'Salazar', 'Herrera'
];

const SERVICES = [
  'cámaras de seguridad', 'alarma para casa', 'cerco eléctrico perimetral', 'control de acceso biométrico',
  'videoportero IP', 'monitoreo remoto 24/7', 'sensores de movimiento', 'sistema contra incendios'
];

const COMPANIES = [
  'Inmobiliaria Los Pinos', 'Restaurante El Sabor', 'Ferretería El Tornillo', 'Estudio Jurídico Alvear', 'Gimnasio FitLife',
  'MiniMarket Express', 'Farmacia La Salud', 'Clínica Dental Sana', 'Colegio ABC', 'Taller Mecánico Central', ''
];

const STATUS_STATES: Lead['status'][] = ['Nuevo', 'Contactado', 'Cotizado', 'Cerrado'];

// Generate 52 mock leads
const INITIAL_LEADS: Lead[] = Array.from({ length: 52 }).map((_, index) => {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index + 3) % LAST_NAMES.length];
  const name = `${firstName} ${lastName}`;
  const company = COMPANIES[index % COMPANIES.length];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const phone = `+593 9${(index % 3) + 7} ${(index % 9) + 1}23 ${(index * 17) % 10000}`;
  
  const selectedService = SERVICES[index % SERVICES.length];
  const message = company 
    ? `Estimados, requiero una cotización formal para implementar ${selectedService} en las instalaciones de nuestra empresa ${company}.`
    : `Hola, deseo cotizar el costo de instalación de ${selectedService} para mi residencia familiar.`;

  // Status distribution: about 30% Nuevo, 30% Contactado, 20% Cotizado, 20% Cerrado
  let status: Lead['status'] = 'Nuevo';
  if (index % 10 < 3) status = 'Nuevo';
  else if (index % 10 < 6) status = 'Contactado';
  else if (index % 10 < 8) status = 'Cotizado';
  else status = 'Cerrado';

  const dateStr = `2026-06-0${(index % 8) + 1}`;
  
  // Create realistic history notes based on status
  const notes: HistoryLog[] = [
    { date: `${dateStr} 09:30`, author: 'Sistema', message: 'Lead registrado automáticamente desde el formulario de contacto.' }
  ];

  if (status !== 'Nuevo') {
    notes.push({
      date: `${dateStr} 11:15`,
      author: 'Asesor Comercial',
      message: `Contacto inicial realizado vía telefónica. Se solicitan detalles técnicos de la instalación.`
    });
  }

  if (status === 'Cotizado' || status === 'Cerrado') {
    notes.push({
      date: `${dateStr} 15:45`,
      author: 'Ingeniero de Proyectos',
      message: `Propuesta comercial enviada por correo electrónico por un valor estimado de $${(index % 5 + 1) * 250}.00.`
    });
  }

  if (status === 'Cerrado') {
    notes.push({
      date: `${dateStr} 17:00`,
      author: 'Asesor Comercial',
      message: `Cliente acepta cotización y realiza el abono inicial. Proyecto programado para ejecución.`
    });
  }

  return {
    id: `lead-${index + 1}`,
    name,
    email,
    phone,
    message,
    date: dateStr,
    status,
    notes
  };
});

@Injectable({
  providedIn: 'root'
})
export class MockLeadService implements ILeadRepository {
  private leads = signal<Lead[]>(INITIAL_LEADS);

  getAllLeads(): Observable<Lead[]> {
    return of(this.leads());
  }

  addLead(lead: Omit<Lead, 'id' | 'date' | 'status' | 'notes'>): Observable<Lead> {
    const today = new Date().toISOString().split('T')[0];
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      date: today,
      status: 'Nuevo',
      notes: [
        {
          date: new Date().toLocaleTimeString().substring(0, 5),
          author: 'Sistema',
          message: 'Lead registrado desde el formulario público de la web.'
        }
      ]
    };
    this.leads.update(lds => [newLead, ...lds]);
    return of(newLead);
  }

  updateLeadStatus(id: string, status: Lead['status'], notes?: string): Observable<Lead> {
    let updatedLead!: Lead;
    this.leads.update(lds => {
      return lds.map(l => {
        if (l.id === id) {
          const newNotes = [...l.notes];
          if (notes) {
            newNotes.push({
              date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substring(0, 5),
              author: 'Administrador CRM',
              message: notes
            });
          } else {
            newNotes.push({
              date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substring(0, 5),
              author: 'Administrador CRM',
              message: `Estado modificado a: ${status}`
            });
          }
          updatedLead = { ...l, status, notes: newNotes };
          return updatedLead;
        }
        return l;
      });
    });
    return of(updatedLead);
  }

  deleteLead(id: string): Observable<boolean> {
    const originalLength = this.leads().length;
    this.leads.update(lds => lds.filter(l => l.id !== id));
    return of(this.leads().length < originalLength);
  }
}
