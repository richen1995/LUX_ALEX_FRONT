import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../shared/models/models';
import { IProductRepository } from './base.repository';

const INITIAL_PRODUCTS: Product[] = [
  // CÁMARAS
  {
    id: 'prod-cam-1',
    name: 'Cámara Dome IP Ultra 4K Pro',
    description: 'Cámara domo con resolución 4K, visión nocturna infrarroja hasta 40 metros y detección inteligente de humanos.',
    price: 189.99,
    category: 'Cámaras',
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80',
    brand: 'HikVision Pro',
    status: 'Disponible',
    rating: 4.8,
    features: ['Resolución 4K UHD', 'Visión Nocturna Color-Vu', 'Resistente a la intemperie IP67', 'Audio bidireccional']
  },
  {
    id: 'prod-cam-2',
    name: 'Cámara Bullet Metálica 5MP Varifocal',
    description: 'Cámara exterior bullet con lente varifocal motorizado de 2.8-12mm y zoom óptico 4x para detalles nítidos.',
    price: 145.50,
    category: 'Cámaras',
    image: 'https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&w=600&q=80',
    brand: 'Dahua Corp',
    status: 'Disponible',
    rating: 4.7,
    features: ['Lente Varifocal Motorizado', 'Sensor CMOS de alto rendimiento', 'Reducción de ruido 3D DNR', 'WDR de 120dB']
  },
  {
    id: 'prod-cam-3',
    name: 'Cámara Inalámbrica PTZ Solar 360°',
    description: 'Cámara robótica exterior autónoma, alimentada por panel solar integrado y conexión 4G/LTE para áreas remotas.',
    price: 299.99,
    category: 'Cámaras',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    brand: 'Sentinel Tech',
    status: 'Bajo Pedido',
    rating: 4.9,
    features: ['100% Sin Cables', 'Panel Solar de 8W incluido', 'Movimiento 355° Horizontal / 90° Vertical', 'Ranura MicroSD y Nube']
  },
  {
    id: 'prod-cam-4',
    name: 'Minicámara IP Espía Oculta FHD',
    description: 'Cámara compacta de alta definición ideal para vigilancia discreta en oficinas y recepciones.',
    price: 79.99,
    category: 'Cámaras',
    image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=600&q=80',
    brand: 'SpyTech',
    status: 'Disponible',
    rating: 4.2,
    features: ['Tamaño Ultra-Compacto', 'Resolución 1080p FHD', 'Batería de respaldo', 'Ángulo de visión 110°']
  },
  {
    id: 'prod-cam-5',
    name: 'Cámara Térmica de Seguridad Industrial',
    description: 'Cámara termográfica industrial para detección de calor perimetral e incendios tempranos en bodegas.',
    price: 1450.00,
    category: 'Cámaras',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    brand: 'FLIR Guard',
    status: 'Bajo Pedido',
    rating: 5.0,
    features: ['Detección de calor avanzada', 'Alarma de temperatura', 'Fusión de espectro térmico y óptico', 'Largo alcance']
  },
  // ALARMAS
  {
    id: 'prod-ala-1',
    name: 'Panel de Alarma Smart Híbrido V19',
    description: 'Cerebro central de alarma residencial/comercial con soporte híbrido para 8 zonas cableadas y 64 inalámbricas.',
    price: 320.00,
    category: 'Alarmas',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    brand: 'DSC Power',
    status: 'Disponible',
    rating: 4.9,
    features: ['Conectividad Wi-Fi, Ethernet y 4G LTE', 'Compatible con Alexa y Google Home', 'Respaldo de batería de 24 horas', 'Notificaciones push en app']
  },
  {
    id: 'prod-ala-2',
    name: 'Kit de Alarma Residencial Inalámbrica',
    description: 'Kit de inicio inalámbrico autoinstalable. Incluye panel inteligente, 2 sensores de puerta, 1 sensor de movimiento y control.',
    price: 210.00,
    category: 'Alarmas',
    image: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=600&q=80',
    brand: 'Ajax Systems',
    status: 'Disponible',
    rating: 4.8,
    features: ['Tecnología inalámbrica Jeweller de largo alcance', 'Instalación en 15 minutos', 'Autoprotección anti-sabotaje', 'Soporta hasta 100 sensores']
  },
  {
    id: 'prod-ala-3',
    name: 'Central de Alarma Comercial Contra Incendios',
    description: 'Panel certificado para control de emergencias e incendios con direccionamiento inteligente para locales y edificios.',
    price: 780.00,
    category: 'Alarmas',
    image: 'https://images.unsplash.com/photo-1606206582933-b1dd6fc2c4c5?auto=format&fit=crop&w=600&q=80',
    brand: 'Honeywell Fire',
    status: 'Disponible',
    rating: 4.9,
    features: ['Certificación NFPA-72', '8 zonas direccionables integradas', 'Pantalla LCD de diagnóstico', 'Reporte automático a bomberos']
  },
  {
    id: 'prod-ala-4',
    name: 'Teclado LCD Táctil Premium Alfa',
    description: 'Teclado de control de alarma con pantalla táctil capacitiva a color de 7 pulgadas y visor interactivo de zonas.',
    price: 135.00,
    category: 'Alarmas',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80',
    brand: 'DSC Power',
    status: 'Disponible',
    rating: 4.6,
    features: ['Pantalla táctil de 7"', 'Interfaz gráfica intuitiva', 'Lector de tarjetas de proximidad', 'Modo portafotos']
  },
  {
    id: 'prod-ala-5',
    name: 'Botón de Pánico Inalámbrico Industrial',
    description: 'Dispositivo ultra-resistente de pánico y asalto con batería de 5 años de duración para guardias y cajeros.',
    price: 25.99,
    category: 'Alarmas',
    image: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=600&q=80',
    brand: 'Ajax Systems',
    status: 'Disponible',
    rating: 4.5,
    features: ['Protección contra pulsaciones accidentales', 'Resistente a salpicaduras', 'Alcance de hasta 1300m', 'Confirmación por LED']
  },
  // SIRENAS
  {
    id: 'prod-sir-1',
    name: 'Sirena Exterior Autoalimentada Premium',
    description: 'Sirena exterior de alta potencia (120dB) con luz estroboscópica LED de alta intensidad y carcasa de policarbonato antivandálico.',
    price: 85.00,
    category: 'Sirenas',
    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=600&q=80',
    brand: 'Sentinel Tech',
    status: 'Disponible',
    rating: 4.7,
    features: ['Potencia de 120 dB a 1 metro', 'Luz estroboscópica LED brillante', 'Batería interna recargable', 'Tamper antisabotaje doble']
  },
  {
    id: 'prod-sir-2',
    name: 'Sirena Interior Compacta Inalámbrica',
    description: 'Sirena interior de 95dB inalámbrica, fácil de instalar y con volumen ajustable para alertas internas rápidas.',
    price: 45.00,
    category: 'Sirenas',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    brand: 'Ajax Systems',
    status: 'Disponible',
    rating: 4.4,
    features: ['Presión sonora ajustable (81-105 dB)', 'Batería con 3 años de vida útil', 'Indicador LED de estado armado/desarmado']
  },
  {
    id: 'prod-sir-3',
    name: 'Sirena de Alta Potencia Tipo Corneta',
    description: 'Sirena industrial de doble corneta y 30W para perímetros extensos, haciendas y fábricas.',
    price: 69.50,
    category: 'Sirenas',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    brand: 'DSC Power',
    status: 'Disponible',
    rating: 4.8,
    features: ['Potencia de salida de 30 Watts', 'Construcción en plástico ABS resistente', 'Soporte metálico orientable']
  },
  {
    id: 'prod-sir-4',
    name: 'Sirena Industrial Tipo Banco con Baliza',
    description: 'Baliza estroboscópica industrial de color rojo con sirena de tono alternado para sistemas de alarma masiva.',
    price: 110.00,
    category: 'Sirenas',
    image: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80',
    brand: 'Honeywell Fire',
    status: 'Agotado',
    rating: 4.3,
    features: ['Tono de alta frecuencia', 'Baliza Xenón de alta visibilidad', 'Apta para montaje en techo o pared']
  },
  {
    id: 'prod-sir-5',
    name: 'Sirena de Respaldo Solar Inalámbrica',
    description: 'Sirena perimetral autónoma con panel solar integrado y batería de litio para exterior, sin cablear alimentación.',
    price: 129.99,
    category: 'Sirenas',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    brand: 'Sentinel Tech',
    status: 'Bajo Pedido',
    rating: 4.6,
    features: ['Panel solar integrado', '115 dB de potencia acústica', 'Comunicación cifrada inteligente', 'Batería de larga duración']
  },
  // SENSORES
  {
    id: 'prod-sen-1',
    name: 'Sensor de Movimiento PIR Inmune a Mascotas',
    description: 'Detector infrarrojo pasivo (PIR) inalámbrico con algoritmo inteligente para evitar falsas alarmas por mascotas de hasta 20kg.',
    price: 39.99,
    category: 'Sensores',
    image: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=600&q=80',
    brand: 'Ajax Systems',
    status: 'Disponible',
    rating: 4.8,
    features: ['Inmunidad a mascotas hasta 20kg', 'Alcance de detección de 12 metros', 'Ángulo de detección de 88.5°', 'Duración de batería de 5 años']
  },
  {
    id: 'prod-sen-2',
    name: 'Sensor de Ruptura de Vidrio Acústico',
    description: 'Sensor digital que detecta el patrón acústico específico de la rotura de vidrios templados, laminados u ordinarios.',
    price: 29.50,
    category: 'Sensores',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    brand: 'DSC Power',
    status: 'Disponible',
    rating: 4.6,
    features: ['Rango de cobertura de hasta 9 metros', 'Análisis espectral digital', 'Ajuste de sensibilidad alta/baja']
  },
  {
    id: 'prod-sen-3',
    name: 'Sensor de Movimiento Exterior Doble Tecnología',
    description: 'Sensor exterior con tecnología dual (PIR + Microondas) para máxima fiabilidad ante climas adversos y ráfagas de viento.',
    price: 119.00,
    category: 'Sensores',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    brand: 'Optex Professional',
    status: 'Disponible',
    rating: 4.9,
    features: ['Tecnología Dual (PIR y Microondas)', 'Algoritmo de compensación de temperatura', 'Protección IP55 contra intemperie']
  },
  {
    id: 'prod-sen-4',
    name: 'Contacto Magnético Pesado para Portones',
    description: 'Contacto magnético de aluminio blindado de alta resistencia con cable flexible de acero para portones industriales.',
    price: 18.50,
    category: 'Sensores',
    image: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=600&q=80',
    brand: 'Dahua Corp',
    status: 'Disponible',
    rating: 4.7,
    features: ['Carcasa de aluminio fundido de alta resistencia', 'Separación operativa de hasta 75mm', 'Cable con manguera de acero']
  },
  {
    id: 'prod-sen-5',
    name: 'Sensor de Humo y Monóxido de Carbono WiFi',
    description: 'Detector inteligente que alerta instantáneamente a su celular y activa una alarma local sonora de 85dB al detectar humo.',
    price: 54.99,
    category: 'Sensores',
    image: 'https://images.unsplash.com/photo-1584267326895-d849a7d13f3e?auto=format&fit=crop&w=600&q=80',
    brand: 'Honeywell Fire',
    status: 'Disponible',
    rating: 4.8,
    features: ['Detector de humo fotoeléctrico y CO', 'Sirena integrada de 85dB', 'Notificaciones de batería baja']
  },
  // VIDEOPORTEROS
  {
    id: 'prod-vid-1',
    name: 'Videoportero Smart WiFi FHD',
    description: 'Timbre inteligente con cámara Full HD, detección de movimiento, visión nocturna, audio bidireccional y almacenamiento en la nube.',
    price: 149.99,
    category: 'Videoporteros',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80',
    brand: 'Sentinel Tech',
    status: 'Disponible',
    rating: 4.7,
    features: ['Resolución FHD 1080p', 'Comunicación interactiva móvil', 'Ángulo ultra ancho de 160°', 'Resistente a la lluvia IP65']
  },
  {
    id: 'prod-vid-2',
    name: 'Sistema de Videoportero Multi-Apartamento IP',
    description: 'Frente de calle exterior de aleación de aluminio con lector de tarjetas RFID y pantalla de control táctil para conserjes.',
    price: 499.00,
    category: 'Videoporteros',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    brand: 'HikVision Pro',
    status: 'Bajo Pedido',
    rating: 4.8,
    features: ['Llamada directa por número de departamento', 'Lector de tarjetas de proximidad RFID integrado', 'Cámara de 2MP con reducción de luz']
  },
  {
    id: 'prod-vid-3',
    name: 'Monitor Interno LCD Táctil 7" IP',
    description: 'Pantalla interna de 7 pulgadas para recibir llamadas del videoportero, monitorear cámaras IP y controlar accesos.',
    price: 125.00,
    category: 'Videoporteros',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=600&q=80',
    brand: 'HikVision Pro',
    status: 'Disponible',
    rating: 4.5,
    features: ['Pantalla táctil TFT de 7"', 'Almacenamiento de imágenes de visitas', 'Alimentación PoE estándar']
  },
  {
    id: 'prod-vid-4',
    name: 'Timbre Inalámbrico Visual de Pilas',
    description: 'Timbre digital inteligente portátil y de bajo consumo de energía, funciona con pilas AA e incluye timbre inalámbrico interior.',
    price: 65.00,
    category: 'Videoporteros',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80',
    brand: 'Dahua Corp',
    status: 'Agotado',
    rating: 4.1,
    features: ['Alimentado por pilas de larga duración', 'Conexión RF dedicada', 'Instalación sin perforar paredes']
  },
  {
    id: 'prod-vid-5',
    name: 'Frente de Calle de Lujo Antivándalo IK09',
    description: 'Portero metálico de alta resistencia con cámara de gran angular y botón de llamada táctil retroiluminado.',
    price: 220.00,
    category: 'Videoporteros',
    image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&w=600&q=80',
    brand: 'Dahua Corp',
    status: 'Disponible',
    rating: 4.6,
    features: ['Protección contra impactos IK09', 'Carcasa de acero inoxidable', 'Visión nocturna automática por infrarrojo']
  },
  // ACCESORIOS
  {
    id: 'prod-acc-1',
    name: 'Disco Duro Especial para Video Vigilancia 4TB',
    description: 'Disco duro WD Purple diseñado para sistemas de videovigilancia 24/7 de alta definición con soporte para hasta 64 cámaras.',
    price: 115.00,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    brand: 'WD Purple',
    status: 'Disponible',
    rating: 4.9,
    features: ['Capacidad de 4 Terabytes', 'Optimizado para sistemas DVR y NVR', 'Tecnología AllFrame para evitar pérdidas de video']
  },
  {
    id: 'prod-acc-2',
    name: 'Fuente de Poder Centralizada 12V 10A 9CH',
    description: 'Caja distribuidora de energía para hasta 9 cámaras de seguridad con fusibles individuales PTC auto-recuperables.',
    price: 45.00,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80',
    brand: 'Dahua Corp',
    status: 'Disponible',
    rating: 4.7,
    features: ['Salida de 12V DC, 10 Amperios', 'Gabinete metálico con llave', 'Fusibles independientes auto-resetables']
  },
  {
    id: 'prod-acc-3',
    name: 'Bobina de Cable UTP Categoría 6 Exterior 305m',
    description: 'Bobina de cable UTP categoría 6 para exterior con doble chaqueta de polietileno resistente a rayos UV.',
    price: 135.00,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    brand: 'Nexxt Solutions',
    status: 'Disponible',
    rating: 4.8,
    features: ['Largo de 305 metros', 'Conductor 100% Cobre', 'Chaqueta de doble protección para intemperie']
  },
  {
    id: 'prod-acc-4',
    name: 'Kit de Transceptores Pasivos Balun HD 5MP',
    description: 'Par de baluns para transmisión de señal de video analógico de alta definición a través de cable UTP, con supresor de picos.',
    price: 9.99,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    brand: 'HikVision Pro',
    status: 'Disponible',
    rating: 4.6,
    features: ['Soporta resoluciones hasta 5 Megapíxeles', 'Instalación a presión sin herramientas', 'Protección contra sobretensión']
  },
  {
    id: 'prod-acc-5',
    name: 'Soporte Metálico Extensible para Cámara Bullet',
    description: 'Soporte de montaje universal de pared o poste metálico, longitud ajustable de 30cm a 60cm con rotación universal.',
    price: 19.50,
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    brand: 'Universal Mounts',
    status: 'Disponible',
    rating: 4.4,
    features: ['Extensible de 30 a 60 cm', 'Fabricado en aleación de aluminio inoxidable', 'Gestión interna de cables']
  }
];

@Injectable({
  providedIn: 'root'
})
export class MockProductService implements IProductRepository {
  private products = signal<Product[]>(INITIAL_PRODUCTS);

  getAllProducts(): Observable<Product[]> {
    return of(this.products());
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.products().find(p => p.id === id));
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`
    };
    this.products.update(prods => [newProduct, ...prods]);
    return of(newProduct);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    let updatedProduct!: Product;
    this.products.update(prods => {
      return prods.map(p => {
        if (p.id === id) {
          updatedProduct = { ...p, ...product } as Product;
          return updatedProduct;
        }
        return p;
      });
    });
    return of(updatedProduct);
  }

  deleteProduct(id: string): Observable<boolean> {
    const originalLength = this.products().length;
    this.products.update(prods => prods.filter(p => p.id !== id));
    return of(this.products().length < originalLength);
  }
}
