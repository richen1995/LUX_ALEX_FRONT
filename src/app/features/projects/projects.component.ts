import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PROJECT_REPOSITORY } from '../../core/services/base.repository';
import { Project } from '../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  private projectRepo = inject(PROJECT_REPOSITORY);

  // Before/after slider state
  sliderValue = 50;
  sliderPosition = signal(50);

  // Tabs constants
  tabs = ['Todos', 'Cámaras', 'Alarmas', 'Cercas eléctricas', 'Control de acceso', 'Videoporteros', 'Monitoreo remoto'];
  activeTab = signal('Todos');

  // Dynamic projects list
  allProjects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);

  // Gallery slider state
  activeImageIndex = signal(0);
  galleryImages = signal<string[]>([]);

  filteredProjects = computed(() => {
    const tab = this.activeTab();
    if (tab === 'Todos') {
      return this.allProductsSorted();
    }
    return this.allProductsSorted().filter(p => p.category.toLowerCase() === tab.toLowerCase());
  });

  private allProductsSorted = computed(() => {
    return [...this.allProjects()].sort((a, b) => b.id.localeCompare(a.id));
  });

  ngOnInit() {
    this.projectRepo.getAllProjects().pipe(
      take(1)
    ).subscribe(data => this.allProjects.set(data));
  }

  onSliderInput(event: any) {
    this.sliderPosition.set(event.target.value);
  }

  openLightbox(project: Project) {
    this.selectedProject.set(project);
    this.activeImageIndex.set(0);
    // Combine before, after, and gallery images
    this.galleryImages.set([
      project.imageAfter,
      project.imageBefore,
      ...project.imageGallery
    ]);
  }

  closeLightbox() {
    this.selectedProject.set(null);
  }

  nextImage() {
    const nextIdx = (this.activeImageIndex() + 1) % this.galleryImages().length;
    this.activeImageIndex.set(nextIdx);
  }

  prevImage() {
    const prevIdx = this.activeImageIndex() === 0 ? this.galleryImages().length - 1 : this.activeImageIndex() - 1;
    this.activeImageIndex.set(prevIdx);
  }
}
