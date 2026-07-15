import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Testimonial } from '../../shared/models/models';
import { ITestimonialRepository } from './base.repository';

@Injectable({
  providedIn: 'root'
})
export class FirebaseTestimonialService implements ITestimonialRepository {
  private firestore = inject(Firestore);
  private testimonialsCollection = collection(this.firestore, 'testimonials');

  getAllTestimonials(): Observable<Testimonial[]> {
    return collectionData(this.testimonialsCollection, { idField: 'id' }) as Observable<Testimonial[]>;
  }

  getTestimonialById(id: string): Observable<Testimonial | undefined> {
    const testimonialDoc = doc(this.firestore, `testimonials/${id}`);
    return docData(testimonialDoc, { idField: 'id' }) as Observable<Testimonial | undefined>;
  }

  addTestimonial(testimonial: Omit<Testimonial, 'id'>): Observable<Testimonial> {
    return from(addDoc(this.testimonialsCollection, testimonial)).pipe(
      map(docRef => ({ ...testimonial, id: docRef.id } as Testimonial))
    );
  }

  updateTestimonial(id: string, testimonial: Partial<Testimonial>): Observable<Testimonial> {
    const testimonialDoc = doc(this.firestore, `testimonials/${id}`);
    return from(updateDoc(testimonialDoc, testimonial)).pipe(
      map(() => ({ ...testimonial, id } as Testimonial))
    );
  }

  deleteTestimonial(id: string): Observable<boolean> {
    const testimonialDoc = doc(this.firestore, `testimonials/${id}`);
    return from(deleteDoc(testimonialDoc)).pipe(
      map(() => true)
    );
  }
}
