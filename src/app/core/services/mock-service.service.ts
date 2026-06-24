import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ServiceItem } from '../../shared/models/models';
import { IServiceRepository } from './base.repository';

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-cctv',
    title: 'Instalación de Cámaras de Seguridad (CCTV)',
    description: 'Diseño e instalación de sistemas de circuito cerrado de televisión de alta definición con monitoreo móvil.',
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Monitoreo remoto en tiempo real desde tu smartphone',
      'Resolución Ultra HD 4K y visión nocturna a color',
      'Detección inteligente de movimiento y cruce de línea',
      'Grabación segura local y respaldo automático en la nube'
    ],
    longDescription: 'Ofrecemos soluciones integrales de video seguridad adaptadas a residencias, comercios e industrias. Realizamos un estudio de campo detallado para eliminar puntos ciegos y maximizar el rango de visión. Utilizamos tecnologías líderes mundiales como HikVision y Dahua para garantizar la mayor durabilidad y fidelidad de imagen.',
    priceEstimate: 'Desde $199.00 (Incluye instalación básica y configuración)'
  },
  {
    id: 'srv-alarm',
    title: 'Alarmas Residenciales y Comerciales',
    description: 'Sistemas de intrusión inteligentes con sensores de movimiento, contactos magnéticos y alertas instantáneas.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Sensores inmunes a mascotas de hasta 20 kg',
      'Conectividad triple de respaldo (WiFi, Ethernet y Chip 4G)',
      'Activación y desactivación remota desde la app móvil',
      'Batería con respaldo integrado de más de 24 horas'
    ],
    longDescription: 'Protege tu propiedad con un ecosistema de seguridad proactivo. Nuestros paneles de alarma inalámbricos Ajax y DSC alertan sobre intrusiones antes de que ocurran. Conectados a sirenas potentes de exterior que actúan como elemento disuasivo ante cualquier amenaza de intrusión.',
    priceEstimate: 'Desde $249.00 (Kit de panel + 3 sensores)'
  },
  {
    id: 'srv-fence',
    title: 'Cercas Eléctricas Perimetrales',
    description: 'Barreras físicas energizadas de alto voltaje no letales con sistemas de alarma ante cortes e intentos de sabotaje.',
    image: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Descarga eléctrica de alto voltaje (hasta 15,000V) disuasiva y no letal',
      'Activación de sirena y alerta al celular si se corta o dobla el alambre',
      'Batería interna de respaldo ante cortes de electricidad intencionales',
      'Postes de acero galvanizado y alambres de alta resistencia'
    ],
    longDescription: 'La cerca eléctrica representa el primer anillo de defensa perimetral de cualquier residencia o industria. Aseguramos el perímetro de tu hogar utilizando materiales certificados que resisten la corrosión del exterior y que emiten descargas pulsantes seguras pero altamente efectivas para repeler intrusos.',
    priceEstimate: 'Desde $9.50 por metro lineal instalado'
  },
  {
    id: 'srv-access',
    title: 'Sistemas de Control de Acceso',
    description: 'Restricción y control de paso mediante biometría dactilar, reconocimiento facial, lectores RFID y cerraduras electromagnéticas.',
    image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Reconocimiento facial de alta velocidad e inmune a fotografías',
      'Reportes detallados de ingresos y salidas con horas y nombres',
      'Cerraduras magnéticas de alta retención (de 300 a 1000 lbs)',
      'Integración con software de control de asistencia para empresas'
    ],
    longDescription: 'Administra quién ingresa a tus instalaciones de forma automatizada. Diseñamos sistemas de control de acceso peatonal y vehicular utilizando torniquetes, barreras automáticas, lectores de huellas y tarjetas inteligentes. Todo centralizado bajo un software de gestión fácil de operar.',
    priceEstimate: 'Desde $150.00 por puerta controlada'
  },
  {
    id: 'srv-intercom',
    title: 'Videoporteros Inteligentes',
    description: 'Sistemas de comunicación visual y apertura de puertas a distancia, ideales para condominios y hogares modernos.',
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Atiende a tus visitas desde el celular incluso fuera de casa',
      'Cámara de gran angular FHD integrada en el frente de calle',
      'Apertura de cerradura eléctrica mediante pantalla o aplicación móvil',
      'Pantalla táctil interior LCD de alta resolución'
    ],
    longDescription: 'Mejora la seguridad en el acceso principal de tu domicilio. El videoportero IP te permite ver quién llama a tu puerta, conversar con la visita en audio bidireccional de alta calidad y abrir el cerrojo eléctrico directamente desde tu smartphone, otorgando comodidad y control sin precedentes.',
    priceEstimate: 'Desde $175.00 instalado'
  },
  {
    id: 'srv-monitor',
    title: 'Monitoreo Remoto 24/7 y Soporte',
    description: 'Central de monitoreo dedicada al control perimetral, recepción de señales de pánico y videoverificación.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    benefits: [
      'Vigilancia permanente las 24 horas del día, los 365 días del año',
      'Verificación visual instantánea mediante cámaras tras saltos de alarma',
      'Despacho inmediato de patrullas de apoyo o llamada a emergencias',
      'Informes mensuales del estado de conexión de sus sistemas'
    ],
    longDescription: 'Nuestra estación central de monitoreo analiza permanentemente las señales recibidas de tus sistemas de alarma. En caso de una intrusión real o una señal de pánico, nuestros operadores ejecutan protocolos inmediatos de seguridad, contactando directamente a la policía y enviando una patrulla física de apoyo.',
    priceEstimate: 'Mensualidades desde $29.99'
  }
];

@Injectable({
  providedIn: 'root'
})
export class MockServiceService implements IServiceRepository {
  private services = signal<ServiceItem[]>(INITIAL_SERVICES);

  getAllServices(): Observable<ServiceItem[]> {
    return of(this.services());
  }

  getServiceById(id: string): Observable<ServiceItem | undefined> {
    return of(this.services().find(s => s.id === id));
  }

  addService(service: Omit<ServiceItem, 'id'>): Observable<ServiceItem> {
    const newService: ServiceItem = {
      ...service,
      id: `srv-${Date.now()}`
    };
    this.services.update(srvs => [...srvs, newService]);
    return of(newService);
  }

  updateService(id: string, service: Partial<ServiceItem>): Observable<ServiceItem> {
    let updatedService!: ServiceItem;
    this.services.update(srvs => {
      return srvs.map(s => {
        if (s.id === id) {
          updatedService = { ...s, ...service } as ServiceItem;
          return updatedService;
        }
        return s;
      });
    });
    return of(updatedService);
  }

  deleteService(id: string): Observable<boolean> {
    const originalLength = this.services().length;
    this.services.update(srvs => srvs.filter(s => s.id !== id));
    return of(this.services().length < originalLength);
  }
}
