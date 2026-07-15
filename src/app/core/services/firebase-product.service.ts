import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Product } from '../../shared/models/models';
import { IProductRepository } from './base.repository';

@Injectable({
  providedIn: 'root'
})
export class FirebaseProductService implements IProductRepository {
  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'products');

  getAllProducts(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductById(id: string): Observable<Product | undefined> {
    const productDoc = doc(this.firestore, `products/${id}`);
    return docData(productDoc, { idField: 'id' }) as Observable<Product | undefined>;
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    // addDoc returns a promise, so we use 'from' to convert it to an Observable
    // We add the id assigned by Firestore to the returned product
    return from(addDoc(this.productsCollection, product)).pipe(
      map(docRef => ({ ...product, id: docRef.id } as Product))
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    const productDoc = doc(this.firestore, `products/${id}`);
    return from(updateDoc(productDoc, product)).pipe(
      map(() => ({ ...product, id } as Product))
    );
  }

  deleteProduct(id: string): Observable<boolean> {
    const productDoc = doc(this.firestore, `products/${id}`);
    return from(deleteDoc(productDoc)).pipe(
      map(() => true)
    );
  }
}
