import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../../shared/models/models';
import { IProjectRepository } from './base.repository';

const INITIAL_PROJECTS: Project[] = Array.from({ length: 20 }).map((_, index) => {
  const categories = ['Cámaras', 'Alarmas', 'Cercas eléctricas', 'Control de acceso', 'Videoporteros', 'Monitoreo remoto'];
  const category = categories[index % categories.length];
  const id = `proj-${index + 1}`;
  
  // Real names and info
  const projectTitles = [
    'Instalación Integral de CCTV en Condominio Vista Hermosa',
    'Sistema Anti-intrusión en Sucursal Banco Central',
    'Cerco Eléctrico y Seguridad Perimetral Hacienda El Triunfo',
    'Control de Acceso Biométrico en Corporativo Innova Tech',
    'Red de Videoporteros IP en Edificio Titanium (40 Dptos)',
    'Monitoreo Continuo e Infraestructura CCTV en Supermercado Maxi',
    'Circuito Cerrado de Vigilancia en Parque Industrial Logix',
    'Central de Alarmas Integrada en Fábrica Textil TexAmericas',
    'Seguridad Perimetral Inteligente en Residencia San Rafael',
    'Control de Acceso Vehicular LPR en Club Campestre El Sol',
    'Timbre Intercomunicador Inteligente en Residencias Las Palmas',
    'Centro de Control y Monitoreo en Bodega de Distribución Express',
    'Cámaras Térmicas de Detección en Refinería PetroCaribe',
    'Alarma Inalámbrica Inteligente en Cadena de Joyerías Aureus',
    'Cerco Eléctrico de Alta Tensión en Subestación Eléctrica Este',
    'Control de Acceso con Molinetes en Universidad Metropolitana',
    'Citofonía Digital y Videoporteros en Urbanización Jardines',
    'Red de Monitoreo Remoto y Alarma de Pánico en Tiendas de Ropa Style',
    'Cámaras IP 4K de Alta Velocidad en Centro Comercial Portal',
    'Sistema de Detección de Humo Direccionable en Hospital San José'
  ];

  const locations = [
    'Quito, Ecuador', 'Guayaquil, Ecuador', 'Cuenca, Ecuador', 'Ambato, Ecuador', 'Manta, Ecuador',
    'Loja, Ecuador', 'Ibarra, Ecuador', 'Machala, Ecuador', 'Riobamba, Ecuador', 'Santo Domingo, Ecuador'
  ];

  const clients = [
    'Administración Vista Hermosa', 'Banco Central Sucursal Norte', 'Familia Guerrero-Ortiz', 'Innova Tech S.A.', 'Consorcio Titanium',
    'Supermercados Maxi Corp', 'Logix Park S.A.', 'Fábrica TexAmericas', 'Residencial San Rafael S.A.', 'Club Campestre El Sol',
    'Condominio Las Palmas', 'Distribución Express', 'PetroCaribe Industrial', 'Joyería Aureus Group', 'Subestación Eléctrica Este',
    'Universidad Metropolitana', 'Consorcio Jardines del Valle', 'Style Tiendas S.A.', 'Mall Portal del Norte', 'Patronato Hospital San José'
  ];

  const title = projectTitles[index] || `Proyecto de Seguridad ${index + 1}`;
  const location = locations[index % locations.length];
  const client = clients[index] || `Cliente Corporativo ${index + 1}`;

  return {
    id,
    title,
    description: `Diseño, implementación y puesta en marcha del sistema de ${category.toLowerCase()} para resolver necesidades de seguridad física y control operativo. Se instalaron equipos con altos estándares internacionales y se capacitó al personal de administración.`,
    category,
    // Realistic Unsplash images for security context
    imageBefore: `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80`,
    imageAfter: `https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80`,
    imageGallery: [
      `https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&w=600&q=80`,
      `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80`,
      `https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80`
    ],
    date: `2026-0${(index % 5) + 1}-1${(index % 9) + 0}`,
    client,
    location
  };
});

@Injectable({
  providedIn: 'root'
})
export class MockProjectService implements IProjectRepository {
  private projects = signal<Project[]>(INITIAL_PROJECTS);

  getAllProjects(): Observable<Project[]> {
    return of(this.projects());
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return of(this.projects().find(p => p.id === id));
  }

  addProject(project: Omit<Project, 'id'>): Observable<Project> {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`
    };
    this.projects.update(projs => [newProject, ...projs]);
    return of(newProject);
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    let updatedProject!: Project;
    this.projects.update(projs => {
      return projs.map(p => {
        if (p.id === id) {
          updatedProject = { ...p, ...project } as Project;
          return updatedProject;
        }
        return p;
      });
    });
    return of(updatedProject);
  }

  deleteProject(id: string): Observable<boolean> {
    const originalLength = this.projects().length;
    this.projects.update(projs => projs.filter(p => p.id !== id));
    return of(this.projects().length < originalLength);
  }
}
