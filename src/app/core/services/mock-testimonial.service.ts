import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Testimonial } from '../../shared/models/models';
import { ITestimonialRepository } from './base.repository';

const INITIAL_TESTIMONIALS: Testimonial[] = Array.from({ length: 15 }).map((_, index) => {
  const names = [
    'Carlos Mendoza', 'Sofía Valenzuela', 'Andrés Echeverría', 'María Paula Noboa', 'Santiago Ortega',
    'Gabriela Falconí', 'Javier Jaramillo', 'Lucía Cevallos', 'Roberto Viteri', 'Diana Salazar',
    'Eduardo Balseca', 'Estefanía Andrade', 'Mauricio Rosero', 'Paulina Larrea', 'Alejandro Castro'
  ];

  const companies = [
    'Corporación Nobis', 'Condominio La Suiza', 'Hacienda San José', 'Joyería Real', 'Innova Retail S.A.',
    'Balanza Logística', 'Clínica San Francisco', 'Edificio Torres Azules', 'Constructora Viteri', 'Supermercados Favorito',
    'Banca Seguros', 'Restaurantes Chef Gourmet', 'Importadora Industrial', 'Colegio Mayor', 'Hotel Plaza del Sol'
  ];

  const roles = [
    'Director de Operaciones', 'Presidenta del Comité', 'Administrador General', 'Gerente de Seguridad', 'Jefa de Compras',
    'Gerente de Logística', 'Coordinador de Infraestructura', 'Administradora de Edificio', 'Socio Fundador', 'Jefe de Prevención',
    'Director de IT', 'Gerente de Sucursal', 'Director General', 'Rector', 'Administrador de Sucursal'
  ];

  const comments = [
    'La instalación de cámaras 4K superó nuestras expectativas. Ahora monitoreamos todas las sucursales directamente desde el celular con total fluidez.',
    'El sistema de alarma inalámbrica nos devolvió la tranquilidad en el edificio. El proceso de instalación fue rápido y limpio, excelente atención.',
    'Las cercas eléctricas de alta tensión instaladas en nuestra hacienda han sido altamente eficaces. Su soporte técnico ante emergencias es inigualable.',
    'El control de acceso biométrico facial redujo a cero los ingresos no autorizados y automatizó el control de horarios en nuestras oficinas.',
    'Excelente videoportero IP instalado en nuestro condominio. Atender a los proveedores desde la aplicación móvil es sumamente práctico y seguro.',
    'El servicio de monitoreo 24/7 es impecable. El mes pasado tuvimos una falsa alarma por viento y nos contactaron en menos de 20 segundos para verificar.',
    'Su consultoría perimetral nos permitió ahorrar miles de dólares en vigilantes físicos. Instalamos sensores inteligentes y cámaras de alta velocidad.',
    'Estamos muy contentos con la calidad de los equipos Hikvision instalados. La nitidez de imagen de noche es impresionante.',
    'Un equipo de ingenieros muy profesionales y con altos estándares éticos. Instalación impecable con cables debidamente ordenados y canalizados.',
    'Compramos accesorios de seguridad y cámaras bullet. Todo original y con soporte de garantía inmediato. Recomendados 100%.',
    'La integración del control de acceso con nuestro sistema interno de nómina fue muy fluida gracias a la asesoría técnica brindada.',
    'La alarma contra incendios Honeywell nos da total cumplimiento legal en nuestros locales. Excelente acompañamiento para pruebas y simulacros.',
    'Instalamos cercas eléctricas y CCTV en toda la zona de carga de camiones. No hemos vuelto a reportar ningún inconveniente de seguridad.',
    'El videoportero con pantalla táctil nos permite mantener el registro visual de todas las visitas que entran al colegio. Muy confiable.',
    'Recomendamos su servicio de asistencia inmediata. Sus unidades móviles de respuesta física son veloces y altamente eficaces.'
  ];

  const ratings = [5, 5, 4, 5, 5, 5, 4, 5, 5, 4, 5, 5, 5, 4, 5];

  const avatars = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
  ];

  return {
    id: `test-${index + 1}`,
    name: names[index] || `Cliente ${index + 1}`,
    comment: comments[index] || `Excelente servicio técnico y soporte de calidad profesional.`,
    rating: ratings[index] || 5,
    company: companies[index] || `Empresa S.A.`,
    role: roles[index] || `Gerente`,
    image: avatars[index] || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`
  };
});

@Injectable({
  providedIn: 'root'
})
export class MockTestimonialService implements ITestimonialRepository {
  private testimonials = signal<Testimonial[]>(INITIAL_TESTIMONIALS);

  getAllTestimonials(): Observable<Testimonial[]> {
    return of(this.testimonials());
  }

  addTestimonial(testimonial: Omit<Testimonial, 'id'>): Observable<Testimonial> {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: `test-${Date.now()}`
    };
    this.testimonials.update(testis => [newTestimonial, ...testis]);
    return of(newTestimonial);
  }

  updateTestimonial(id: string, testimonial: Partial<Testimonial>): Observable<Testimonial> {
    let updatedTesti!: Testimonial;
    this.testimonials.update(testis => {
      return testis.map(t => {
        if (t.id === id) {
          updatedTesti = { ...t, ...testimonial } as Testimonial;
          return updatedTesti;
        }
        return t;
      });
    });
    return of(updatedTesti);
  }

  deleteTestimonial(id: string): Observable<boolean> {
    const originalLength = this.testimonials().length;
    this.testimonials.update(testis => testis.filter(t => t.id !== id));
    return of(this.testimonials().length < originalLength);
  }
}
