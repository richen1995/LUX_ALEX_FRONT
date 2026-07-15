import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { Project } from '../../shared/models/models';
import { IProjectRepository } from './base.repository';

@Injectable({
  providedIn: 'root'
})
export class FirebaseProjectService implements IProjectRepository {
  private firestore = inject(Firestore);
  private projectsCollection = collection(this.firestore, 'projects');

  getAllProjects(): Observable<Project[]> {
    return collectionData(this.projectsCollection, { idField: 'id' }) as Observable<Project[]>;
  }

  getProjectById(id: string): Observable<Project | undefined> {
    const projectDoc = doc(this.firestore, `projects/${id}`);
    return docData(projectDoc, { idField: 'id' }) as Observable<Project | undefined>;
  }

  addProject(project: Omit<Project, 'id'>): Observable<Project> {
    return from(addDoc(this.projectsCollection, project)).pipe(
      map(docRef => ({ ...project, id: docRef.id } as Project))
    );
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    const projectDoc = doc(this.firestore, `projects/${id}`);
    return from(updateDoc(projectDoc, project)).pipe(
      map(() => ({ ...project, id } as Project))
    );
  }

  deleteProject(id: string): Observable<boolean> {
    const projectDoc = doc(this.firestore, `projects/${id}`);
    return from(deleteDoc(projectDoc)).pipe(
      map(() => true)
    );
  }
}
