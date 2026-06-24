export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Cámaras' | 'Alarmas' | 'Sirenas' | 'Sensores' | 'Videoporteros' | 'Accesorios';
  image: string;
  brand: string;
  status: 'Disponible' | 'Agotado' | 'Bajo Pedido';
  rating: number;
  features: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  benefits: string[];
  longDescription: string;
  priceEstimate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  imageBefore: string;
  imageAfter: string;
  imageGallery: string[];
  date: string;
  client: string;
  location: string;
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  company: string;
  role: string;
  image: string;
}

export interface HistoryLog {
  date: string;
  author: string;
  message: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  status: 'Nuevo' | 'Contactado' | 'Cotizado' | 'Cerrado';
  notes: HistoryLog[];
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}
