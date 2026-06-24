import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TESTIMONIAL_REPOSITORY } from '../../../core/services/base.repository';
import { Testimonial } from '../../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-testimonials-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './testimonials-crud.component.html'
})
export class TestimonialsCrudComponent implements OnInit {
  private testimonialRepo = inject(TESTIMONIAL_REPOSITORY);
  private fb = inject(FormBuilder);

  allTestimonials = signal<Testimonial[]>([]);
  searchQuery = signal('');
  isModalOpen = signal(false);
  editingTestimonial = signal<Testimonial | null>(null);

  testimonialForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    comment: ['', [Validators.required]],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    company: ['', [Validators.required]],
    role: ['', [Validators.required]],
    image: ['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', [Validators.required]]
  });

  filteredTestimonials = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const testis = this.allTestimonials();
    if (!query) return testis;
    return testis.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.company.toLowerCase().includes(query) || 
      t.role.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadTestimonials();
  }

  loadTestimonials() {
    this.testimonialRepo.getAllTestimonials().pipe(
      take(1)
    ).subscribe(data => this.allTestimonials.set(data));
  }

  openModal(testimonial?: Testimonial) {
    if (testimonial) {
      this.editingTestimonial.set(testimonial);
      this.testimonialForm.patchValue({
        name: testimonial.name,
        comment: testimonial.comment,
        rating: testimonial.rating,
        company: testimonial.company,
        role: testimonial.role,
        image: testimonial.image
      });
    } else {
      this.editingProductReset();
    }
    this.isModalOpen.set(true);
  }

  private editingProductReset() {
    this.editingTestimonial.set(null);
    this.testimonialForm.reset({
      name: '', comment: '', rating: 5, company: '', role: '',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    });
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingTestimonial.set(null);
  }

  onSubmit() {
    if (this.testimonialForm.valid) {
      const formVal = this.testimonialForm.value;

      const payload: Omit<Testimonial, 'id'> = {
        name: formVal.name || '',
        comment: formVal.comment || '',
        rating: Number(formVal.rating) || 5,
        company: formVal.company || '',
        role: formVal.role || '',
        image: formVal.image || ''
      };

      if (this.editingTestimonial()) {
        const id = this.editingTestimonial()!.id;
        this.testimonialRepo.updateTestimonial(id, payload).subscribe(() => {
          this.loadTestimonials();
          this.closeModal();
        });
      } else {
        this.testimonialRepo.addTestimonial(payload).subscribe(() => {
          this.loadTestimonials();
          this.closeModal();
        });
      }
    }
  }

  deleteTestimonial(id: string) {
    if (confirm('¿Está seguro de eliminar este testimonio?')) {
      this.testimonialRepo.deleteTestimonial(id).subscribe(() => {
        this.loadTestimonials();
      });
    }
  }
}
