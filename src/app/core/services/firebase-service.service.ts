import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { ServiceItem } from '../../shared/models/models';
import { IServiceRepository } from './base.repository';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService implements IServiceRepository {
  private firestore = inject(Firestore);
  private servicesCollection = collection(this.firestore, 'services');

  getAllServices(): Observable<ServiceItem[]> {
    return collectionData(this.servicesCollection, { idField: 'id' }) as Observable<ServiceItem[]>;
  }

  getServiceById(id: string): Observable<ServiceItem | undefined> {
    const serviceDoc = doc(this.firestore, `services/${id}`);
    return docData(serviceDoc, { idField: 'id' }) as Observable<ServiceItem | undefined>;
  }

  addService(service: Omit<ServiceItem, 'id'>): Observable<ServiceItem> {
    return from(addDoc(this.servicesCollection, service)).pipe(
      map(docRef => ({ ...service, id: docRef.id } as ServiceItem))
    );
  }

  updateService(id: string, service: Partial<ServiceItem>): Observable<ServiceItem> {
    const serviceDoc = doc(this.firestore, `services/${id}`);
    return from(updateDoc(serviceDoc, service)).pipe(
      map(() => ({ ...service, id } as ServiceItem))
    );
  }

  deleteService(id: string): Observable<boolean> {
    const serviceDoc = doc(this.firestore, `services/${id}`);
    return from(deleteDoc(serviceDoc)).pipe(
      map(() => true)
    );
  }
}
