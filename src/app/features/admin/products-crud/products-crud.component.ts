import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PRODUCT_REPOSITORY } from '../../../core/services/base.repository';
import { Product } from '../../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-products-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './products-crud.component.html'
})
export class ProductsCrudComponent implements OnInit {
  private productRepo = inject(PRODUCT_REPOSITORY);
  private fb = inject(FormBuilder);

  allProducts = signal<Product[]>([]);
  searchQuery = signal('');
  isModalOpen = signal(false);
  editingProduct = signal<Product | null>(null);
  isUploading = signal(false);

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    brand: ['', [Validators.required]],
    category: ['Cámaras' as Product['category'], [Validators.required]],
    status: ['Disponible' as Product['status'], [Validators.required]],
    image: ['https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80', [Validators.required]],
    features: ['']
  });

  filteredProducts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const prods = this.allProducts();
    if (!query) return prods;
    return prods.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productRepo.getAllProducts().pipe(
      take(1)
    ).subscribe(data => this.allProducts.set(data));
  }

  openModal(product?: Product) {
    if (product) {
      this.editingProduct.set(product);
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
        status: product.status,
        image: product.image,
        features: product.features.join(', ')
      });
    } else {
      this.editingProduct.set(null);
      this.productForm.reset({
        name: '', description: '', price: 0, brand: '',
        category: 'Cámaras', status: 'Disponible',
        image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=600&q=80',
        features: ''
      });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingProduct.set(null);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formVal = this.productForm.value;
      const featuresArr = formVal.features 
        ? formVal.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
        : [];

      const payload: Omit<Product, 'id'> = {
        name: formVal.name || '',
        description: formVal.description || '',
        price: formVal.price || 0,
        brand: formVal.brand || '',
        category: formVal.category || 'Cámaras',
        status: formVal.status || 'Disponible',
        image: formVal.image || '',
        rating: this.editingProduct()?.rating || 4.5,
        features: featuresArr
      };

      if (this.editingProduct()) {
        const id = this.editingProduct()!.id;
        this.productRepo.updateProduct(id, payload).subscribe(() => {
          this.loadProducts();
          this.closeModal();
        });
      } else {
        this.productRepo.addProduct(payload).subscribe(() => {
          this.loadProducts();
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

      // Obtener nombre original sin extensión, pasarlo a minúsculas y sanitizar caracteres especiales
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
          this.productForm.patchValue({ image: data.secure_url });
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

  deleteProduct(id: string) {
    if (confirm('¿Está seguro de eliminar este producto del catálogo?')) {
      this.productRepo.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
