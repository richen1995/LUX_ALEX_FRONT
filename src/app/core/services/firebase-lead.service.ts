import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, arrayUnion } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Lead } from '../../shared/models/models';
import { ILeadRepository } from './base.repository';

@Injectable({
  providedIn: 'root'
})
export class FirebaseLeadService implements ILeadRepository {
  private firestore = inject(Firestore);
  private leadsCollection = collection(this.firestore, 'leads');

  getAllLeads(): Observable<Lead[]> {
    return collectionData(this.leadsCollection, { idField: 'id' }) as Observable<Lead[]>;
  }

  getLeadById(id: string): Observable<Lead | undefined> {
    const leadDoc = doc(this.firestore, `leads/${id}`);
    return docData(leadDoc, { idField: 'id' }) as Observable<Lead | undefined>;
  }

  addLead(lead: Omit<Lead, 'id' | 'date' | 'status' | 'notes'>): Observable<Lead> {
    const today = new Date().toISOString().split('T')[0];
    const newLead: Omit<Lead, 'id'> = {
      ...lead,
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
    
    return from(addDoc(this.leadsCollection, newLead)).pipe(
      map(docRef => ({ ...newLead, id: docRef.id } as Lead))
    );
  }

  updateLeadStatus(id: string, status: Lead['status'], notes?: string): Observable<Lead> {
    const leadDoc = doc(this.firestore, `leads/${id}`);
    
    const message = notes ? notes : `Estado modificado a: ${status}`;
    const newNote = {
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substring(0, 5),
      author: 'Administrador CRM',
      message: message
    };

    const updates = { 
      status, 
      notes: arrayUnion(newNote) 
    };

    return from(updateDoc(leadDoc, updates)).pipe(
      map(() => ({ id, status, notes: [newNote] } as unknown as Lead)) // Returning partial mock to satisfy Observable<Lead>
    );
  }

  deleteLead(id: string): Observable<boolean> {
    const leadDoc = doc(this.firestore, `leads/${id}`);
    return from(deleteDoc(leadDoc)).pipe(
      map(() => true)
    );
  }
}
