import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ServiceItem, Project, Testimonial, Lead, AuthResponse } from '../../shared/models/models';

export interface IProductRepository {
  getAllProducts(): Observable<Product[]>;
  getProductById(id: string): Observable<Product | undefined>;
  addProduct(product: Omit<Product, 'id'>): Observable<Product>;
  updateProduct(id: string, product: Partial<Product>): Observable<Product>;
  deleteProduct(id: string): Observable<boolean>;
}

export interface IServiceRepository {
  getAllServices(): Observable<ServiceItem[]>;
  getServiceById(id: string): Observable<ServiceItem | undefined>;
  addService(service: Omit<ServiceItem, 'id'>): Observable<ServiceItem>;
  updateService(id: string, service: Partial<ServiceItem>): Observable<ServiceItem>;
  deleteService(id: string): Observable<boolean>;
}

export interface IProjectRepository {
  getAllProjects(): Observable<Project[]>;
  getProjectById(id: string): Observable<Project | undefined>;
  addProject(project: Omit<Project, 'id'>): Observable<Project>;
  updateProject(id: string, project: Partial<Project>): Observable<Project>;
  deleteProject(id: string): Observable<boolean>;
}

export interface ITestimonialRepository {
  getAllTestimonials(): Observable<Testimonial[]>;
  addTestimonial(testimonial: Omit<Testimonial, 'id'>): Observable<Testimonial>;
  updateTestimonial(id: string, testimonial: Partial<Testimonial>): Observable<Testimonial>;
  deleteTestimonial(id: string): Observable<boolean>;
}

export interface ILeadRepository {
  getAllLeads(): Observable<Lead[]>;
  addLead(lead: Omit<Lead, 'id' | 'date' | 'status' | 'notes'>): Observable<Lead>;
  updateLeadStatus(id: string, status: Lead['status'], notes?: string): Observable<Lead>;
  deleteLead(id: string): Observable<boolean>;
}

export interface IAuthRepository {
  login(username: string, password: string): Observable<AuthResponse>;
  logout(): void;
  isAuthenticated(): boolean;
  getCurrentUser(): AuthResponse | null;
}

// Injection Tokens for Clean Architecture
export const PRODUCT_REPOSITORY = new InjectionToken<IProductRepository>('PRODUCT_REPOSITORY');
export const SERVICE_REPOSITORY = new InjectionToken<IServiceRepository>('SERVICE_REPOSITORY');
export const PROJECT_REPOSITORY = new InjectionToken<IProjectRepository>('PROJECT_REPOSITORY');
export const TESTIMONIAL_REPOSITORY = new InjectionToken<ITestimonialRepository>('TESTIMONIAL_REPOSITORY');
export const LEAD_REPOSITORY = new InjectionToken<ILeadRepository>('LEAD_REPOSITORY');
export const AUTH_REPOSITORY = new InjectionToken<IAuthRepository>('AUTH_REPOSITORY');
