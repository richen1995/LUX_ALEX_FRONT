import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PRODUCT_REPOSITORY } from '../../core/services/base.repository';
import { Product } from '../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  private productRepo = inject(PRODUCT_REPOSITORY);
  private router = inject(Router);

  // Constants
  categories = ['Cámaras', 'Alarmas', 'Sirenas', 'Sensores', 'Videoporteros', 'Accesorios'];

  // Signals for state
  allProducts = signal<Product[]>([]);
  isLoading = signal(true);
  selectedProduct = signal<Product | null>(null);

  // Filters State
  searchQuery = signal('');
  selectedCategories = signal<string[]>([]);
  priceRange = signal<string>('all');
  statusFilter = signal<string>('Todos');
  sortBy = signal<string>('priceAsc');
  mobileFiltersOpen = signal(false);

  // Pagination State
  currentPage = signal(1);
  itemsPerPage = 12;

  // Filtered and Sorted products computed automatically
  filteredProducts = computed(() => {
    let result = [...this.allProducts()];

    // Search query check
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Category filter check
    const selectedCats = this.selectedCategories();
    if (selectedCats.length > 0) {
      result = result.filter(p => selectedCats.includes(p.category));
    }

    // Price range filter check
    const range = this.priceRange();
    if (range === 'under50') {
      result = result.filter(p => p.price < 50);
    } else if (range === '50to150') {
      result = result.filter(p => p.price >= 50 && p.price <= 150);
    } else if (range === '150to300') {
      result = result.filter(p => p.price >= 150 && p.price <= 300);
    } else if (range === 'over300') {
      result = result.filter(p => p.price > 300);
    }

    // Status filter check
    const st = this.statusFilter();
    if (st !== 'Todos') {
      result = result.filter(p => p.status === st);
    }

    // Sorting
    const sortVal = this.sortBy();
    if (sortVal === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'nameAsc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortVal === 'ratingDesc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  });

  // Pagination computations
  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage) || 1;
  });

  paginatedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredProducts().slice(startIndex, startIndex + this.itemsPerPage);
  });

  ngOnInit() {
    // Load products with simulated loading skeletons effect
    this.productRepo.getAllProducts().pipe(
      take(1)
    ).subscribe(data => {
      this.allProducts.set(data);
      setTimeout(() => {
        this.isLoading.set(false);
      }, 800); // Simulated delay for visual skeleton appreciation
    });
  }

  toggleCategory(cat: string) {
    this.selectedCategories.update(cats => {
      if (cats.includes(cat)) {
        return cats.filter(c => c !== cat);
      } else {
        return [...cats, cat];
      }
    });
    this.currentPage.set(1); // Reset page on filter change
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategories.set([]);
    this.priceRange.set('all');
    this.statusFilter.set('Todos');
    this.sortBy.set('priceAsc');
    this.currentPage.set(1);
  }

  openDetail(product: Product) {
    this.selectedProduct.set(product);
  }

  closeDetail() {
    this.selectedProduct.set(null);
  }

  contactForProduct(productName: string) {
    this.closeDetail();
    this.router.navigate(['/contact'], { queryParams: { product: productName } });
  }

  encodeURIComponent(text: string): string {
    return encodeURIComponent(text);
  }

  toggleMobileFilters() {
    this.mobileFiltersOpen.update(v => !v);
  }
}
