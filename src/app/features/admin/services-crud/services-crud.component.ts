import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SERVICE_REPOSITORY } from '../../../core/services/base.repository';
import { ServiceItem } from '../../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-services-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './services-crud.component.html'
})
export class ServicesCrudComponent implements OnInit {
  private serviceRepo = inject(SERVICE_REPOSITORY);
  private fb = inject(FormBuilder);

  allServices = signal<ServiceItem[]>([]);
  searchQuery = signal('');
  isModalOpen = signal(false);
  editingService = signal<ServiceItem | null>(null);

  isUploading = signal(false);

  serviceForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    longDescription: ['', [Validators.required]],
    priceEstimate: ['', [Validators.required]],
    image: ['https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80', [Validators.required]],
    benefits: ['', [Validators.required]]
  });

  filteredServices = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const srvs = this.allServices();
    if (!query) return srvs;
    return srvs.filter(s => s.title.toLowerCase().includes(query));
  });

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.serviceRepo.getAllServices().pipe(
      take(1)
    ).subscribe(data => this.allServices.set(data));
  }

  openModal(service?: ServiceItem) {
    if (service) {
      this.editingService.set(service);
      this.serviceForm.patchValue({
        title: service.title,
        description: service.description,
        longDescription: service.longDescription,
        priceEstimate: service.priceEstimate,
        image: service.image,
        benefits: service.benefits.join(', ')
      });
    } else {
      this.editingService.set(null);
      this.serviceForm.reset({
        title: '', description: '', longDescription: '', priceEstimate: '',
        image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80',
        benefits: ''
      });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingService.set(null);
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      const formVal = this.serviceForm.value;
      const benefitsArr = formVal.benefits 
        ? formVal.benefits.split(',').map(b => b.trim()).filter(b => b.length > 0)
        : [];

      const payload: Omit<ServiceItem, 'id'> = {
        title: formVal.title || '',
        description: formVal.description || '',
        longDescription: formVal.longDescription || '',
        priceEstimate: formVal.priceEstimate || '',
        image: formVal.image || '',
        benefits: benefitsArr
      };

      if (this.editingService()) {
        const id = this.editingService()!.id;
        this.serviceRepo.updateService(id, payload).subscribe(() => {
          this.loadServices();
          this.closeModal();
        });
      } else {
        this.serviceRepo.addService(payload).subscribe(() => {
          this.loadServices();
          this.closeModal();
        });
      }
    }
  }

  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.isUploading.set(true);

      const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const sanitizedName = originalName
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const uniquePublicId = `${sanitizedName}_${Date.now()}`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'mza76ekg');
      formData.append('cloud_name', 'imgluxflame');
      formData.append('public_id', uniquePublicId);

      fetch('https://api.cloudinary.com/v1_1/imgluxflame/image/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        this.isUploading.set(false);
        if (data.secure_url) {
          this.serviceForm.patchValue({ image: data.secure_url });
        } else {
          alert('Error al subir la imagen. Por favor, verifique el preset o intente de nuevo.');
        }
      })
      .catch(err => {
        this.isUploading.set(false);
        console.error('Error uploading image to Cloudinary:', err);
        alert('Ocurrió un error al subir la imagen.');
      });
    }
  }

  deleteService(id: string) {
    if (confirm('¿Está seguro de eliminar este servicio?')) {
      this.serviceRepo.deleteService(id).subscribe(() => {
        this.loadServices();
      });
    }
  }
}
