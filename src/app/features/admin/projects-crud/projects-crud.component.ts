import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PROJECT_REPOSITORY } from '../../../core/services/base.repository';
import { Project } from '../../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-projects-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './projects-crud.component.html'
})
export class ProjectsCrudComponent implements OnInit {
  private projectRepo = inject(PROJECT_REPOSITORY);
  private fb = inject(FormBuilder);

  allProjects = signal<Project[]>([]);
  searchQuery = signal('');
  isModalOpen = signal(false);
  editingProject = signal<Project | null>(null);

  projectForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    client: ['', [Validators.required]],
    location: ['', [Validators.required]],
    date: ['', [Validators.required]],
    category: ['', [Validators.required]],
    imageBefore: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', [Validators.required]],
    imageAfter: ['https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80', [Validators.required]]
  });

  filteredProjects = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const projs = this.allProjects();
    if (!query) return projs;
    return projs.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.client.toLowerCase().includes(query) || 
      p.location.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectRepo.getAllProjects().pipe(
      take(1)
    ).subscribe(data => this.allProjects.set(data));
  }

  openModal(project?: Project) {
    if (project) {
      this.editingProject.set(project);
      this.projectForm.patchValue({
        title: project.title,
        description: project.description,
        client: project.client,
        location: project.location,
        date: project.date,
        category: project.category,
        imageBefore: project.imageBefore,
        imageAfter: project.imageAfter
      });
    } else {
      this.editingProject.set(null);
      this.projectForm.reset({
        title: '', description: '', client: '', location: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Cámaras',
        imageBefore: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        imageAfter: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80'
      });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingProject.set(null);
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formVal = this.projectForm.value;

      const payload: Omit<Project, 'id'> = {
        title: formVal.title || '',
        description: formVal.description || '',
        client: formVal.client || '',
        location: formVal.location || '',
        date: formVal.date || '',
        category: formVal.category || 'Cámaras',
        imageBefore: formVal.imageBefore || '',
        imageAfter: formVal.imageAfter || '',
        imageGallery: this.editingProject()?.imageGallery || []
      };

      if (this.editingProject()) {
        const id = this.editingProject()!.id;
        this.projectRepo.updateProject(id, payload).subscribe(() => {
          this.loadProjects();
          this.closeModal();
        });
      } else {
        this.projectRepo.addProject(payload).subscribe(() => {
          this.loadProjects();
          this.closeModal();
        });
      }
    }
  }

  deleteProject(id: string) {
    if (confirm('¿Está seguro de eliminar este proyecto de la galería?')) {
      this.projectRepo.deleteProject(id).subscribe(() => {
        this.loadProjects();
      });
    }
  }
}
